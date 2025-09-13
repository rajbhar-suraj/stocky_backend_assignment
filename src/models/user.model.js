const pool = require('../config/db')
const cron = require('node-cron');

const updateStockPrices = async () => {
    try {
        // Fetch all stocks
        const { rows: stocks } = await pool.query('SELECT stock_symbol, stock_price FROM stock');

        for (const stock of stocks) {
            // Generate a random price around ±5% of current price
            const fluctuation = (Math.random() * 0.1 - 0.05) * stock.stock_price;
            const newPrice = parseFloat((stock.stock_price + fluctuation).toFixed(2));

            // Update the stock price
            await pool.query(
                'UPDATE stock SET stock_price = $1, fetched_at = NOW() WHERE stock_symbol = $2',
                [newPrice, stock.stock_symbol]
            );
        }

        console.log('Stock prices updated successfully!');
    } catch (error) {
        console.error('Error updating stock prices:', error.message);
    }
};

//updating the stock price every hour
cron.schedule('0 * * * *', async () => {
    console.log('Running hourly stock price update...');
    await updateStockPrices();
});

const addReward = async ({ userId, stock_symbol, quantity, reward_reason }) => {
    const client = await pool.connect();
    try {
        // Duplicate check
        const exists = await client.query(
            'SELECT 1 FROM reward WHERE userId=$1 AND stock_symbol=$2 AND reward_reason=$3 AND credited_date=CURRENT_DATE',
            [userId, stock_symbol, reward_reason]
        );
        if (exists.rowCount > 0) throw new Error('Duplicate reward detected for today');

        await client.query("BEGIN");

        // Insert reward
        const rewardResult = await client.query(`
            INSERT INTO reward(userId, stock_symbol, quantity, reward_reason, reward_inr)
            VALUES ($1,$2,$3,$4,ROUND((SELECT stock_price * $3::numeric FROM stock WHERE stock_symbol = $2::varchar), 4))
            RETURNING *;
        `, [userId, stock_symbol, quantity, reward_reason]);

        const reward = rewardResult.rows[0];
        if (!reward) throw new Error("Stock not found for reward");

        // Insert into ledger
        const ledgerResult = await client.query(`
            INSERT INTO company_ledger (stock_symbol, userId, shares, stock_price, txn_type, total_cost_inr, charges)
            SELECT $1, $2, $3, stock_price, $4, ROUND(stock_price * $3 + COALESCE(charges,0) * $3, 4), COALESCE(charges,0)
            FROM stock
            WHERE stock_symbol=$1::varchar
            RETURNING *;
        `, [stock_symbol, userId, quantity, "REWARD"]);

        const ledger = ledgerResult.rows[0];

        await client.query("COMMIT");
        return { reward, ledger };

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error saving reward:", error.message);
        throw error;
    } finally {
        client.release();
    }
}


const todaysReward = async (userId) => {
    try {
        const query = `
            SELECT *
            FROM reward
            WHERE userId = $1
            AND created_at::date = CURRENT_DATE
            ORDER BY created_at DESC;
        `;
        const values = [userId];
        const result = await pool.query(query, values);
        return result.rows; // returns array of today's rewards
    } catch (error) {
        console.error("Error fetching today's rewards:", error.message);
        throw error;
    }
};

const historyReward = async (userId) => {
    try {
        const query = `
            SELECT *
            FROM reward
            WHERE userId = $1
            AND created_at::date < CURRENT_DATE
            ORDER BY created_at DESC;
        `;
        const values = [userId];
        const result = await pool.query(query, values);

        return result.rows;
    } catch (error) {
        console.error("Error fetching past rewards:", error.message);
        throw error;
    }
};

const getStats = async (userId) => {
    try {
        const query = `
            SELECT stock_symbol, sum(quantity) as total_shares, sum(reward_inr) as total_inr_today
            from reward
            WHERE userId = $1
            AND created_at::date = CURRENT_DATE
            group by stock_symbol
        `;
        const values = [userId];
        const result = await pool.query(query, values);

        return result.rows;
    } catch (error) {
        console.error("Error fetching status:", error.message);
        throw error;
    }
}

const getUserPortfolio = async (userId) => {
    try {
        const query = `
            select r.stock_symbol,
            sum(r.quantity) as total_shares,
            sum(r.quantity) * s.stock_price as current_inr_value
            from reward r
            join
            stock s on r.stock_symbol = s.stock_symbol
            where userId = $1
           GROUP BY r.stock_symbol, s.stock_price;
        `;
        const values = [userId];
        const result = await pool.query(query, values);

        return result.rows;
    } catch (error) {
        console.error("Error fetching status:", error.message);
        throw error;
    }
}
module.exports = { addReward, todaysReward, historyReward, getStats, getUserPortfolio }