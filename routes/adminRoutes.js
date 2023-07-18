const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/adminController');
const Admin = require('../models/Admin');
const Conjunto = require('../models/Conjunto');

router.get('/admin', (req, res) => {
    res.render('admin');
});

router.post('/login', adminController.login);
router.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/Admin/admin.html');
      }
    });
  });
  

module.exports = router;
