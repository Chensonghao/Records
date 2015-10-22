angular.module('records',['ngRoute', 'ui.bootstrap'])
.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
	$routeProvider.
	when('/',{
		templateUrl:'/p/list',
		controller:'listCtrl',
		controllerAs:'lc'
	}).
	otherwise({ redirectTo: '/' });
	$locationProvider.html5Mode(true);
}])