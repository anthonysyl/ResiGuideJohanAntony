const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/solicitar-chat', chatController.solicitarChat);
router.get('/solicitar-chat', (req, res) => {
    res.send('Esta es una respuesta para solicitudes GET a /solicitar-chat.');
});

module.exports = router;
