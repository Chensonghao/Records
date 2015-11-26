var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    users = require('./routes/users'),
    app = express(),
    api = require('./routes/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.locals.pretty = true;
app.engine('html', require('ejs').renderFile);
app.use('/components', express.static(__dirname + '/components'));
app.get('/', routes.index);
app.get('/p/:name', routes.p);

app.post('/api/addRecord/', api.addRecord);
app.get('/api/records/:index', api.records);
app.get('/api/record/:id', api.record);
app.put('/api/updateRecord/:id', api.updateRecord);
app.delete('/api/deleteRecord/:id', api.deleteRecord);

app.get('/api/cards/', api.cards);
app.post('/api/addCard/', api.addCard);
app.delete('/api/deleteCard/:id', api.deleteCard);

app.get('/api/getCurrentMonthRecords/', api.getCurrentMonthRecords);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//module.exports = app;

var server = require('http').createServer(app);
var port = app.get('port');
server.listen(port, '127.0.0.1', function() {
    console.log("server listening on port " + port);
});
