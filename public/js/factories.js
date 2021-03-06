angular.module('records')
    .factory('recordFactory', recordFactory)
    .factory('cardFactory', cardFactory)
    .factory('statisticsFactory', statisticsFactory)
    .factory('pubSubService', pubSubService);

recordFactory.$inject = ['$http']
    /*@ngInject*/
function recordFactory($http) {
    return {
        addRecord: function(record) {
            return $http.post('/api/addRecord/', record);
        },
        getRecords: function(index) {
            return $http.get('/api/records/' + (index || 0));
        },
        getRecord: function(id) {
            return $http.get('/api/record/' + id);
        },
        deleteRecord: function(id) {
            return $http.delete('/api/deleteRecord/' + id);
        },
        updateRecord: function(id, record) {
            return $http.put('/api/updateRecord/' + id, record);
        },
        getCurrentMonthRecords: function() {
            return $http.get('/api/getCurrentMonthRecords/');
        }
    }
}

function statisticsFactory() {
    return {
        totalIn: function(records) {
            if (records) {
                var inRecords = records.filter(function(record) {
                    return record.type === '收入';
                });
                if (inRecords && inRecords.length > 0) {
                    return inRecords.reduce(function(a, b) {
                        if (typeof(a) === 'object') {
                            return a.money + b.money;
                        } else {
                            return a + b.money;
                        }
                    },{money:0});
                }
            }
            return 0;
        },
        totalOut: function(records) {
            if (records) {
                var outRecords = records.filter(function(record) {
                    return record.type === '支出';
                });
                if (outRecords) {
                    return outRecords.reduce(function(a, b) {
                        if (typeof(a) === 'object') {
                            return a.money + b.money;
                        } else {
                            return a + b.money;
                        }
                    },{money:0});
                }
            }
            return 0;
        }
    }
}
cardFactory.$inject = ['$http', '$q']
    /*@ngInject*/
function cardFactory($http, $q) {
    return {
        cards: function() {
            var deferred = $q.defer();
            $http.get('/api/cards/').then(function(result) {
                var cards = result.data;
                if (cards) {
                    [].unshift.call(cards, {
                        name: '现金'
                    });
                } else {
                    cards = [{
                        name: '现金'
                    }];
                }
                deferred.resolve(cards);
            }, function(err) {
                deferred.reject(err)
            });
            return deferred.promise;
        },
        addCard: function(card) {
            return $http.post('/api/addCard/', card);
        },
        deleteCard: function(id) {
            return $http.delete('/api/deleteCard/' + id);
        }
    }
}

pubSubService.$inject = ['$rootScope']
    /*@ngInject*/
function pubSubService($rootScope) {
    var _DATA_UPDATED_ = '_DATA_UPDATED_';
    /*
     * @name: publish
     * @description: 消息发布者，只用$emit冒泡进行消息发布的低能耗无污染方法
     * @param: {string=}: msg, 要发布的消息关键字，默认为'_DATA_UPDATED_'指数据更新
     * @param: {object=}: data，随消息一起传送的数据，默认为空
     * @example:
     *         pubSubService.publish('config.itemAdded', {'id': getID()});
     */
    var publish = function(msg, data) {
        msg = msg || _DATA_UPDATED_;
        data = data || {};
        $rootScope.$emit(msg, data);
    };
    /*
     * @name: subscribe
     * @description: 消息订阅者
     * @param: {function}: 回调函数，在订阅消息到来时执行
     * @param: {object=}: 控制器作用域，用以解绑定,默认为空
     * @param: {string=}: 消息关键字，默认为'_DATA_UPDATED_'指数据更新
     * @example:
     *         pubSubService.subscribe(function(event, data) {
     *        $scope.power = data.power;
     *            $scope.mass = data.mass;
     *        },  $scope, 'data_change');
     */
    var subscribe = function(func, scope, msg) {
        if (!angular.isFunction(func)) {
            console.log("pubSubService.subscribe need a callback function");
            return;
        }
        msg = msg || _DATA_UPDATED_;
        var unbind = $rootScope.$on(msg, func);
        //可控的事件反绑定机制
        if (scope) {
            scope.$on('$destroy', unbind);
        }
    };

    return {
        publish: publish,
        subscribe: subscribe
    };
}
