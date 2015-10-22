angular.module('records').
factory('recordFactory', recordFactory);

recordFactory.$inject = ['$http']
    /*@ngInject*/
function recordFactory($http) {
    return {
        addRecord: function(record) {
        	console.log(record);
            return $http.post('/api/addRecord/', record);
        },
        getRecords: function() {
            return $http.get('/api/records/');
        },
        getRecord: function(id) {
            return $http.get('/api/record/' + id);
        },
        deleteRecord: function(id, record) {
            return $http.delete('/api/deleteRecord/' + id, record);
        },
        updateRecord: function(id) {
            return $http.put('/api/updateRecord/' + id);
        }
    }
}
