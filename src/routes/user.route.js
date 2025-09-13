const router = require('express').Router()
const { postReward, userTodayRewards,userHistoryRewards, getStatus, userPortfolioValue } = require('../controllers/user.controller');

router.post('/reward', postReward)
router.get('/today-stocks/:userId', userTodayRewards)
router.get('/historical-inr/:userId', userHistoryRewards)
router.get('/stats/:userId', getStatus )
router.get('/portfolio/:userId', userPortfolioValue)

module.exports = router