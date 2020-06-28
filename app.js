var express = require('express'),
    app = express(),
    PORT = process.env.PORT || 3000;

/*-----
routing
-----*/
var indexRoutes = require('./routes/index.js');

app.use(indexRoutes);

/*-----
setup
-----*/
app.set('view engine', 'ejs');
app.use(express.static('public'));

/*-----
port configuration
-----*/
app.listen(PORT, () => {
    console.log('Server is running.');
});