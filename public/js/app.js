/**
*  Module
*
* Description
*/
angular.module('pollsApp', ['ngRoute', 'controllers', 'pollServices'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/polls', {
			templateUrl: 'js/views/partials/list.html',
			controller: 'PollListCtrl'
		})
		.when('/poll/:pollId', {
			templateUrl: 'js/views/partials/item.html',
			controller: 'PollItemCtrl'
		})
		.when('/new', {
			templateUrl: 'js/views/partials/new.html',
			controller: 'PollNewCtrl'
		})
		.otherwise({
			redirectTo: '/polls'
		});
}]);