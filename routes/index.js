// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

var api = require('./api')

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index.html');
    });
    app.get('/p/:name', function(req, res) {
        var name = req.params.name;
        res.render('p/' + name + '.html');
    });
    app.post('/api/addRecord/', api.addRecord);
    app.get('/api/records/:index', api.records);
    app.get('/api/record/:id', api.record);
    app.put('/api/updateRecord/:id', api.updateRecord);
    app.delete('/api/deleteRecord/:id', api.deleteRecord);
    app.get('/api/cards/', api.cards);
    app.post('/api/addCard/', api.addCard);
    app.delete('/api/deleteCard/:id', api.deleteCard);
    app.get('/api/getCurrentMonthRecords/', api.getCurrentMonthRecords);
}
