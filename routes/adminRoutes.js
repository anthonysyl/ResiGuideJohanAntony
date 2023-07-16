const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/adminController'); // Importa el controlador

router.get('/admin.html', function(req, res) {
    res.sendFile(path.join(__dirname, '../Admin/admin.html'));
});

router.post('/login', adminController.login); // Agrega esta línea

module.exports = router;
