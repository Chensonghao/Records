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

var cardSchema = new schema({
    name: {
        type: String,
        required: true
    }
});
var payModel = mongoose.model('records', paySchema); //数据库表名records
var cardModel = mongoose.model('cards', cardSchema);
mongoose.connect('mongodb://localhost/record'); //数据库名record

exports.cards = function(req, res) {
    return cardModel.find(function(err, cards) {
        if (err) {
            console.log(err);
        } else {
            res.json(cards);
        }
    });
}

exports.addCard = function(req, res) {
    var data = req.body;
    var card = new cardModel({
        name: data.name
    });
    card.save(function(err) {
        if (err) {
            console.log(err);
            res.json(false);
        } else {
            res.json(true);
        }
    });
}
exports.deleteCard = function(req, res) {
    var id = req.params.id;
    if (id) {
        cardModel.findById(id, function(err, card) {
            if (err) {
                console.log(err);
                res.json(false);
            } else {
                card.remove(function(err) {
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
}

exports.records = function(req, res) {
    var index = req.params.index;
    return payModel.count(function(err, count) {
        if (err) {
            console.log(err);
        }
        payModel.find(function(err, records) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    "records": records,
                    "count": count
                });
            }
        }).sort({
            time: -1
        }).skip(10 * index).limit(10);
    });
}

exports.getCurrentMonthRecords = function(req, res) {
    return payModel.find({
        "$where": function() {
            var now = new Date(),
                year = now.getFullYear(),
                month = now.getMonth();
            return this.time.getFullYear() === year && this.time.getMonth() === month;
        }
    }, function(err, records) {
        if (err) {
            console.log(err);
        } else {
            res.json(records);
        }
    });
}

exports.record = function(req, res) {
    var id = req.params.id;
    if (id) {
        payModel.findById(id, function(err, record) {
            if (err) {
                console.log(err);
            } else {
                if (record) {
                    res.json({
                        record: record,
                        status: true
                    });
                } else {
                    res.json({
                        status: false
                    });
                }
            }
        });
    }
}

exports.addRecord = function(req, res) {
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
}

exports.updateRecord = function(req, res) {
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
}

exports.deleteRecord = function(req, res) {
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
}
