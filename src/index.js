const express = require('express');
require('dotenv').config()
const pool = require("./config/db");
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes/user.route')
const app = express();
app.use(express.json())


const rewardLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100,              
  message: "Too many reward requests from this user, please try again later",
  standardHeaders: true, 
  legacyHeaders: false,
});

//testing
app.get("/ping", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Database connection error");
  }
});
app.use('/api',rewardLimiter,apiRoutes)

const PORT = process.env.PORT
app.listen(PORT,()=>console.log(`Stocky is running on ${PORT}`))