const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.sendMessage);
router.get('/:userId', chatController.getChatHistory);

module.exports = router;