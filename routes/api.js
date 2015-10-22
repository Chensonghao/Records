var mongoose = require('mongoose'),
    schema = mongoose.Schema;

var paySchema = new schema({
    type: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    card: {
        type: String,
        required: true
    },
    memo: {
        type: String,
        required: false
    },
});
var payModel = mongoose.model('records', paySchema); //数据库表名records
mongoose.connect('mongodb://localhost/record'); //数据库名record

exports.records = function(req, res) {
    return payModel.find(function(err, records) {
        if (err) {
            console.log(err);
        } else {
            res.json(records);
        }
    });
};

exports.record = function(req, res) {
    var id = req.params.id;
    if (id) {
        payModel.findById(id, function(err, record) {
            if (err) {
                console.log(err);
            } else {
                if (record) {
                    res.json({record:record,status:true});
                }else{
                    res.json({ status: false });
                }
            }
        });
    }
};

exports.add = function(req, res) {
    var form = req.body;
    var record = new payModel({
        type: form.type,
        money: form.money,
        time: form.time,
        memo: form.memo,
        category: form.category,
        card: form.card
    });
    record.save(function(err) {
        if (err) {
            console.log(err);
            res.json(false);
        } else {
            res.json(true);
        }
    });
};

exports.edit = function(req, res) {
    var id = req.params.id;
    if (id) {
        payModel.findById(id, function(err, record) {
            if (err) {
                console.log(err);
            } else {
                var body = req.body;
                record.type = body.type;
                record.money = body.money;
                record.time = body.time;
                record.memo = body.memo;
                record.category = body.category;
                record.card = body.card;
                record.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.json(false);
                    } else {
                        res.json(true);
                    }
                });
            }
        });
    }
};

exports.delete = function(req, res) {
    var id = req.params.id;
    if (id) {
        payModel.findById(id, function(err, record) {
            if (err) {
                console.log(err);
                res.json(false);
            } else {
                record.remove(function(err) {
                    if (err) {
                        console.log(err);
                        res.json(false);
                    } else {
                        res.json(true);
                    }
                });
            }
        });
    }
};
