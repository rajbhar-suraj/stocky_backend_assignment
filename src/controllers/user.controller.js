const { addReward, todaysReward, historyReward, getStats, getUserPortfolio } = require('../models/user.model');

const postReward = async (req, res) => {
    try {
        const { userId, stock_symbol, quantity, reward_reason } = req.body;

        if (!userId || !stock_symbol || !quantity || !reward_reason) {
            return res.status(400).json({ error: "userId, stockSymbol, and quantity are required" });
        }

        const reward = await addReward({ userId, stock_symbol, quantity, reward_reason })


        // Response
        return res.status(201).json({
            message: "Reward recorded successfully",
            reward,
        });
    } catch (error) {
        console.error("Error saving reward:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}


const userTodayRewards = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const result = await todaysReward(userId);

        return res.status(200).json({
            message: "Today's reward",
            result
        })
    } catch (error) {
        console.error("Error saving reward:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const userHistoryRewards = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const result = await historyReward(userId);
        if (result.length === 0) return res.status(201).json({
            message: "no rewards",

        });
        return res.status(200).json({
            message: "All rewards till yesterday",
            result
        })
    } catch (error) {
        console.error("Error saving reward:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}


const getStatus = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const result = await getStats(userId);
        if (result.length === 0) return res.status(201).json({
            message: "no stocks in the pocket right now, start buying one",

        });
        return res.status(200).json({
            message: "Status grouped by order",
            result
        })
    } catch (error) {
        console.error("Error fetching status:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const userPortfolioValue = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const result = await getUserPortfolio(userId);
        if (result.length === 0) return res.status(201).json({
            message: "no stocks in the pocket right now, start buying one",

        });
        return res.status(200).json({
            message: "current value of your account",
            result
        })
    } catch (error) {
        console.error("Error fetching portfolio:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { postReward, userTodayRewards, userHistoryRewards, getStatus, userPortfolioValue };