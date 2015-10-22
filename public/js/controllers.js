angular.module('records')
    .controller('listCtrl', listCtrl)
    .controller('addRecordCtrl', addRecordCtrl)
    .controller('editRecordCtrl', editRecordCtrl)
    .controller('deleteRecordCtrl', deleteRecordCtrl)
    .controller('viewRecordCtrl', viewRecordCtrl);

listCtrl.$inject = ['recordFactory', '$uibModal']

function listCtrl(recordFactory, $uibModal) {
    var vm = this;
    vm.headers = ['支出/收入', '金额', '时间', ''];
    vm.addRecord = addRecord;
    vm.deleteRecord = deleteRecord;
    vm.editRecord = editRecord;
    vm.viewRecord = viewRecord;
    vm.typeStyle = typeStyle;

    recordFactory.getRecords().then(function(records) {
        vm.records = records.data;
    }, function(err) {
        console.log(err);
    });

    function addRecord() {
        var modalInstance = $uibModal.open({
            templateUrl: 'addRecordModal',
            controller: 'addRecordCtrl',
            controllerAs: 'arc'
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
            templateUrl: 'editRecordModal',
            controller: 'editRecordCtrl',
            controllerAs: 'erc',
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

addRecordCtrl.$inject = ['recordFactory', '$modalInstance', '$window']
    /*@ngInject*/
function addRecordCtrl(recordFactory, $modalInstance, $window) {
    var vm = this;
    vm.record = {
        type: '支出'
    };
    vm.types = ['支出', '收入'];
    vm.categories = ['早餐', '午餐'];
    vm.cards = ['现金', '支付宝', '微信', '工行卡', '招行卡', '交行卡'];
    vm.selectedCard = '现金';
    vm.types=['支出','收入'];
    vm.selectType='支出';
    vm.addRecord = addRecord;
    vm.changeCard = changeCard;
    vm.changeType = changeType;
    vm.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

    function addRecord() {
        vm.record.card = vm.selectedCard;
        recordFactory.addRecord(vm.record).then(function(data) {
            $modalInstance.close($window.location.reload());
        }, function(err) {
            console.log(err);
        });
    }

    function changeType(type) {
        vm.selectType = type;
    }

    function changeCard(card) {
        vm.selectedCard = card;
    }
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
editRecordCtrl.$inject = ['recordFactory', '$modalInstance', 'record']
    /*@ngInject*/
function editRecordCtrl(recordFactory, $modalInstance, record) {
    var vm = this,
        data = record.data.record;
    vm.record = data;
    vm.saveEdit = saveEdit;
    vm.cancel = function() {
        $modalInstance.dismiss('close');
    }

    function saveEdit() {
        recordFactory.updateRecord(data._id, vm.record).then();
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
