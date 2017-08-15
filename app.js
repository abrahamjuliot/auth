const
  express = require('express'),
  bodyParser = require('body-parser'),
  routes = require('./routes/index'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  app = express();

// mongodb connection
mongoose.connect(`mongodb://${process.env.IP}:27017/bookworm`);
const db = mongoose.connection;

// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

app
  // use sessions for tracking logins
  .use(session({
    secret: 'treehouse loves you',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  }))
  
  // make user ID available in templates
  .use((req, res, next) => {
    res.locals.currentUser = req.session.userId;
    next();
  })
  // parse incoming requests
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))

  // serve static files from /public
  .use(express.static(__dirname + '/public'))

  // view engine setup
  .set('view engine', 'pug')
  .set('views', __dirname + '/views')

  // include routes
  .use('/', routes)
  
  // catch 404 and forward to error handler
  .use((req, res, next) => {
    const err = new Error('File Not Found');
    err.status = 404;
    next(err);
  })
  
  // error handler
  // define as the last app.use callback
  .use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  })
  
  // listen on port 3000
  .listen((process.env.PORT||3000), () => {
    console.log(
      `Express app listening on port ${(process.env.PORT||3000)}`
    );
  });
