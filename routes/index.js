// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

exports.index=function(req,res){
	res.render('index.html');
}
exports.p=function(req,res){
	var name=req.params.name;
	res.render('p/' + name + '.html');
}