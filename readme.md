### Stock Rewards Backend

### How to run this repo
**`clone or install the zip file`**<br>
**`npm install`**<br>
**`setup the env file - DATABASE_URL AND PORT`**<br>
**`I have used supabase if using local machine postgres then find the connection for local on internet`**<br>
**`npm start - for running the code or alter the scripts in package.json`**<br><br>

### API specifications (request/response payloads).
**`Have divide the project into small chunks Model - controller - routes`**<br>
**`where you can just clearly check what each function is meant to be doing`**<br>
**`user sends the response it goes to designated controller or fn checks for parameters if not present return bad request`**<br>
**`else move forward and it goes to model where it executes the database query and return the result which goes back to controller and its sends the json`**<br>

### Database schema with relationships.
**`I have put all the tables and the values on which you can test on`**<br>
**`so every user can have the reward on diff ocassion[signup,achieving milestone, or showing up daily on website or application]`**<br>
**`so when users gets rewarded its get stored in the company_ledger with all the necessary calculation - have not used trigger or procedure`**<br>
**`have restricted for duplicates entry by reward_reason if it exists in the curr_date return bad request`**<br>

### Explanation of how your system handles edge cases and scaling.<br>
**`I have added rate limiter for accesssing the route`**<br>
**`Used cron-jobs lib for updating the stock price`**<br>
**`have not handled adjustments/refunds and Stock splits, mergers, or delisting cause don't know much about mergers or delisting`**<br>
<br>
**`Thank you so much - this assignment just made my backend a little strong and made me realize how much backend is necessary`**<br>

### 1. Design APIs - done
Implement REST endpoints for the following:
- **`POST /reward`** – Record that a user has been rewarded *X* shares of a stock
(e.g., `RELIANCE`) at a given timestamp. 
- **`GET /today-stocks/{userId}`** – Return all stock rewards for the user for today.
- **`GET /historical-inr/{userId}`** – Return the INR value of the user’s stock rewards
for all past days (up to yesterday).

- **`GET /stats/{userId}`** – Return:
 - Total shares rewarded today (grouped by stock symbol).
 - Current INR value of the user’s portfolio.
 
*(Bonus: Add `/portfolio/{userId}` to show holdings per stock symbol with current INR
value.)*



-- CREATE TABLE users (
--     userId SERIAL PRIMARY KEY,
--     name VARCHAR(50),
--     email VARCHAR(50) UNIQUE,
--     created_at TIMESTAMP DEFAULT NOW()
-- );
-- insert into users(name,email) values('donbosco','donbosco@gmail.com');

-- CREATE TABLE stock (
--     stockId SERIAL PRIMARY KEY,
--     stock_symbol VARCHAR(50) UNIQUE NOT NULL,
--     stock_price NUMERIC(18,6) NOT NULL,
--     fetched_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE reward (
--     rewardId SERIAL PRIMARY KEY,
--     userId INT REFERENCES users(userId),
--     stock_symbol VARCHAR(50) REFERENCES stock(stock_symbol) NOT NULL,
--     quantity NUMERIC(18,6) NOT NULL,
--     reward_inr NUMERIC(18,4), 
--     reward_reason TEXT,              
--     credited_at TIMESTAMP DEFAULT NOW(),
--     credited_date DATE GENERATED ALWAYS AS (credited_at::date) STORED, -- only date part
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW(),
--     CONSTRAINT unique_reward_per_day UNIQUE(userId, stock_symbol, reward_reason, credited_date)
-- );

-- CREATE TABLE company_ledger (
--     id SERIAL PRIMARY KEY,
--     stock_symbol VARCHAR(50) REFERENCES stock(stock_symbol) NOT NULL,
--     userId INT REFERENCES users(userId),
--     shares NUMERIC(18,6) NOT NULL,
--     stock_price NUMERIC(18,6) NOT NULL, -- copy at txn time
--     txn_type VARCHAR(20) NOT NULL CHECK (txn_type IN ('REWARD', 'BUY', 'SELL')),
--     total_cost_inr NUMERIC(18,4) NOT NULL,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- Insert sample stocks with same price
-- INSERT INTO stock (stock_symbol, stock_price)
-- VALUES
--   ('RELIANCE', 2500.00),
--   ('TCS',2500.00),
--   ('INFY',2500.00),
--   ('HDFC',2500.00),
--   ('ICICI',2500.00);

-- UPDATE stock
-- SET charges = CASE stock_symbol
--     WHEN 'RELIANCE' THEN 12.50
--     WHEN 'TCS' THEN 8.75
--     WHEN 'INFY' THEN 9.50
--     WHEN 'HDFC' THEN 11.00
--     WHEN 'ICICI' THEN 10.00
-- END
-- WHERE stock_symbol IN ('RELIANCE', 'TCS', 'INFY', 'HDFC', 'ICICI');

-- select * from stock
-- ALTER TABLE stock ADD COLUMN charges NUMERIC(18,4) DEFAULT 0 NOT NULL;

-- ALTER TABLE company_ledger ADD COLUMN charges NUMERIC(18,4) DEFAULT 0 NOT NULL;

-- select * from stock;


select * from reward;
-- select * from company_ledger;
-- ALTER TABLE company_ledger
-- ADD CONSTRAINT fk_charges FOREIGN KEY (charges)
-- REFERENCES stock(charges);


-- drop table reward;
-- drop table users_holding;
-- -- drop table company_ledger;
-- drop table users;



