var express = require("express");
var exphbs = require("express-handlebars");
var db = require("./models");
var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require('body-parser');
require('dotenv').config();
//var env = require('dotenv').load();

var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Static directory
app.use(express.static("public"));

// For Passport
 
app.use(session({ 
  secret: process.env.SALT,
  resave: false, 
  saveUninitialized:true, 
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Add handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// =============================================================
require("./controllers/library_controller.js")(app);
require("./controllers/users_controller.js")(app);
require("./controllers/needhelp_controller.js")(app);
require("./controllers/messages_controller.js")(app);
require("./controllers/petitions_controller.js")(app);
require("./controllers/signatures_controller.js")(app);
require("./routes/htmlRoutes.js")(app);
require("./routes/apiRoutes.js")(app);


//load passport strategies
require('./config/passport.js')(passport, db.Users);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
