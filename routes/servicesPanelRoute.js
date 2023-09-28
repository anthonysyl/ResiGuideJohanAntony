const express = require('express');
const adminController = require('../controllers/adminController')
const router = express.Router();

router.get('/services-panel', adminController.getServicesPanel);
router.get('/services-panel', (req, res) => {
  res.render('services_panel');
});

module.exports = router;
