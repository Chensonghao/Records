angular.module('records')
    .controller('listCtrl', listCtrl)
    .controller('addRecordCtrl', addRecordCtrl)
    .controller('editRecordCtrl', editRecordCtrl)
    .controller('deleteRecordCtrl', deleteRecordCtrl)
    .controller('viewRecordCtrl', viewRecordCtrl)
    .controller('addCardCtrl', addCardCtrl);

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

addRecordCtrl.$inject = ['recordFactory','cardFactory','$modalInstance', '$window', '$uibModal','pubSubService']
    /*@ngInject*/
function addRecordCtrl(recordFactory, cardFactory, $modalInstance, $window, $uibModal,pubSubService) {
    var vm = this;
    vm.record = {};
    vm.types = ['支出', '收入'];
    vm.categories = ['早餐', '午餐'];
    //vm.cards = ['现金', '支付宝', '微信', '工行卡', '招行卡', '交行卡'];
    vm.selectedCard = '现金';
    vm.types = ['支出', '收入'];
    vm.selectedType = '支出';
    vm.addRecord = addRecord;
    vm.changeCard = changeCard;
    vm.changeType = changeType;
    vm.addCard=function($event){
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
    cardFactory.cards().then(function(cards){
        vm.cards=cards.data;
    },function(err){
        console.log(err);
    });
    function addRecord() {
        vm.record.type = vm.selectedType;
        vm.record.card = vm.selectedCard;
        recordFactory.addRecord(vm.record).then(function(data) {
            $modalInstance.close($window.location.reload());
        }, function(err) {
            console.log(err);
        });
    }

    function changeType(type) {
        vm.selectedType = type;
    }

    function changeCard(cardName) {
        vm.selectedCard = cardName;
    }
    pubSubService.subscribe(function(event,data){
        vm.cards.push({name:data});
        vm.selectedCard=data;
    },'','newCard');
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
editRecordCtrl.$inject = ['recordFactory', '$window', '$modalInstance', 'record']
    /*@ngInject*/
function editRecordCtrl(recordFactory, $window, $modalInstance, record) {
    var vm = this,
        data = record.data.record;
    vm.record = data;
    vm.saveEdit = saveEdit;
    vm.cancel = function() {
        $modalInstance.dismiss('close');
    }

    function saveEdit() {
        recordFactory.updateRecord(data._id, vm.record).then(function() {
            $modalInstance.close($window.location.reload());
        }, function(err) {
            console.log(err);
        });
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

addCardCtrl.$inject = ['cardFactory', '$modalInstance','pubSubService'];
/*@ngInject*/
function addCardCtrl(cardFactory,$modalInstance,pubSubService){
    var vm=this;
    vm.cardName='';
    vm.addCard=function(){
        cardFactory.addCard({name:vm.cardName}).then(function(){
            pubSubService.publish('newCard',vm.cardName);
            $modalInstance.close();
        },function(err){
            console.log(err);
        });
    }
    vm.cancel=function(){
        $modalInstance.dismiss('cancel');
    }
}