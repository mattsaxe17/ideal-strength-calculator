const express = require('express'),
      app = express(),
      router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;