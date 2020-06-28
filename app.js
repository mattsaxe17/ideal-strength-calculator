var express = require('express'),
    app = express();

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
app.listen(3000, () => {
    console.log('Server is running.');
});