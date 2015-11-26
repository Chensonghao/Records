angular.module('records')
    .controller('listCtrl', listCtrl)
    .controller('addOrUpdateRecordCtrl', addOrUpdateRecordCtrl)
    .controller('deleteRecordCtrl', deleteRecordCtrl)
    .controller('viewRecordCtrl', viewRecordCtrl)
    .controller('addCardCtrl', addCardCtrl);

listCtrl.$inject = ['recordFactory', 'statisticsFactory', '$uibModal']

function listCtrl(recordFactory, statisticsFactory, $uibModal) {
    var vm = this;
    vm.headers = ['支出/收入', '金额', '时间', ''];
    vm.addRecord = addRecord;
    vm.deleteRecord = deleteRecord;
    vm.editRecord = editRecord;
    vm.viewRecord = viewRecord;
    vm.typeStyle = typeStyle;
    vm.time = new Date;
    vm.currentPage = 1;
    vm.pageChanged = function() {
        initReacors();
    }
    initReacors();
    recordFactory.getCurrentMonthRecords().then(function(records) {
        var totalIn = statisticsFactory.totalIn(records.data);
        var totalOut = statisticsFactory.totalOut(records.data);
        console.log(totalIn, totalOut);
        vm.chartConfig = {
            options: {
                chart: {
                    type: 'pie'
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            formatter: function() {
                                return this.point.name + ': ' + this.point.y + '元 <br>(' +
                                    this.percentage.toFixed(1) + ' %)';
                            }
                        }
                    }
                },
            },
            series: [{
                type: 'pie',
                name: '比例',
                data: [{
                    name: '收入',
                    y: totalIn,
                    color: '#4cae4c',
                    sliced: true
                }, {
                    name: '支出',
                    y: totalOut,
                    color: '#cc0033'
                }]
            }],
            title: {
                text: '当月收支比例'
            },
            loading: false,
            useHighStocks: false,
            size: {
                width: 400,
                height: 400
            }
        };
    }, function(err) {
        console.log(err);
    });

    function initReacors() {
        recordFactory.getRecords(vm.currentPage - 1).then(function(records) {
            vm.records = records.data.records;
            vm.totalItems = records.data.count;
        }, function(err) {
            console.log(err);
        });
    }

    function addRecord() {
        var modalInstance = $uibModal.open({
            templateUrl: 'addOrUpdateModal',
            controller: 'addOrUpdateRecordCtrl',
            controllerAs: 'arc',
            resolve: {
                record: function() {
                    return null;
                }
            }
        });
    }

    function deleteRecord(record) {
        var id = record._id;
        var modalInstance = $uibModal.open({
            templateUrl: 'deleteRecordModal',
            controller: 'deleteRecordCtrl',
            controllerAs: 'drc',
            resolve: {
                record: function() {
                    return recordFactory.getRecord(id);
                }
            }
        });
    }

    function editRecord(record) {
        var id = record._id;
        var modalInstance = $uibModal.open({
            templateUrl: 'addOrUpdateModal',
            controller: 'addOrUpdateRecordCtrl',
            controllerAs: 'arc',
            resolve: {
                record: function() {
                    return recordFactory.getRecord(id);
                }
            }
        });
    }

    function viewRecord(record) {
        var id = record._id;
        var modalInstance = $uibModal.open({
            templateUrl: 'viewRecordModal',
            controller: 'viewRecordCtrl',
            controllerAs: 'vrc',
            resolve: {
                record: function() {
                    return recordFactory.getRecord(id);
                }
            }
        });
    }

    function typeStyle(type) {
        return type == '收入' ? 'fg-success' : '';
    }

}

addOrUpdateRecordCtrl.$inject = ['recordFactory', 'cardFactory', '$modalInstance', '$window', '$uibModal', 'pubSubService', 'record']
    /*@ngInject*/
function addOrUpdateRecordCtrl(recordFactory, cardFactory, $modalInstance, $window, $uibModal, pubSubService, record) {
    var vm = this;
    vm.types = ['支出', '收入'];
    vm.isAdd = true;
    if (record) {
        vm.isAdd = false;
        vm.record = record.data.record;
        vm.selectedCard = record.data.record.card;
        vm.selectedType = record.data.record.type;
    } else {
        vm.record = {
            time: new Date()
        };
        vm.selectedCard = '现金';
        vm.selectedType = '支出';
    }
    vm.title = vm.isAdd ? '记一笔' : '修改';
    vm.addOrUpdate = addOrUpdate;
    vm.changeCard = changeCard;
    vm.changeType = changeType;
    vm.datePickerOpened = false;
    vm.addCard = function($event) {
        var modalInstance = $uibModal.open({
            templateUrl: 'addCardModal',
            controller: 'addCardCtrl',
            controllerAs: 'acc'
        });
        $event.stopPropagation();
    }
    vm.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
    vm.openDatePicker = function() {
        vm.datePickerOpened = true;
    }
    cardFactory.cards().then(function(cards) {
        vm.cards = cards;
    }, function(err) {
        console.log(err);
    });

    function addOrUpdate() {
        vm.record.type = vm.selectedType;
        vm.record.card = vm.selectedCard;
        if (vm.isAdd) {
            recordFactory.addRecord(vm.record).then(function(data) {
                $modalInstance.close($window.location.reload());
            }, function(err) {
                console.log(err);
            });
        } else {
            recordFactory.updateRecord(vm.record._id, vm.record).then(function() {
                $modalInstance.close($window.location.reload());
            }, function(err) {
                console.log(err);
            });
        }
    }

    function changeType(type) {
        vm.selectedType = type;
    }

    function changeCard(cardName) {
        vm.selectedCard = cardName;
    }
    pubSubService.subscribe(function(event, data) {
        vm.cards.push({
            name: data
        });
        vm.selectedCard = data;
    }, '', 'newCard');
}

viewRecordCtrl.$inject = ['record', '$modalInstance']
    /*@ngInject*/
function viewRecordCtrl(record, $modalInstance) {
    var vm = this,
        data = record.data.record;
    vm.record = data;
    vm.headers = ['金额', '时间', '类型', '账户', '备注']
    vm.cancel = function() {
        $modalInstance.dismiss('close');
    }
}

deleteRecordCtrl.$inject = ['recordFactory', '$modalInstance', 'record', '$window'];
/*@ngInject*/
function deleteRecordCtrl(recordFactory, $modalInstance, record, $window) {
    var vm = this,
        data = record.data.record;
    vm.deleteRecord = deleteRecord;
    vm.time = data.time;
    vm.type = data.type;
    vm.money = data.money;
    vm.cancel = function() {
        $modalInstance.dismiss('cancel');
    };


    function deleteRecord() {
        recordFactory.deleteRecord(data._id).then(function() {
            $modalInstance.close();
            $window.location.reload();
        }, function(err) {
            console.log(err);
        });
    }
}

addCardCtrl.$inject = ['cardFactory', '$modalInstance', 'pubSubService'];
/*@ngInject*/
function addCardCtrl(cardFactory, $modalInstance, pubSubService) {
    var vm = this;
    vm.cardName = '';
    vm.addCard = function() {
        cardFactory.addCard({
            name: vm.cardName
        }).then(function() {
            pubSubService.publish('newCard', vm.cardName);
            $modalInstance.close();
        }, function(err) {
            console.log(err);
        });
    }
    vm.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
}
