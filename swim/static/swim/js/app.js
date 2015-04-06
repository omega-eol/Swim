// Initialize the Swim App
var swimApp = angular.module('swimApp', ['ngRoute', 'ui.sortable', 'ngResource', 'ngCookies'])
.provider('myCSRF',[function(){
	var headerName = 'X-CSRFToken';
	var cookieName = 'csrftoken';
	var allowedMethods = ['GET'];

	this.setHeaderName = function(n) {
		headerName = n;
	}
	this.setCookieName = function(n) {
		cookieName = n;
	}
	this.setAllowedMethods = function(n) {
	    allowedMethods = n;
	}
	this.$get = ['$cookies', function($cookies){
		return {
			'request': function(config) {
			if(allowedMethods.indexOf(config.method) === -1) {
	          // do something on success
				config.headers[headerName] = $cookies[cookieName];
	        }
	        return config;
	      }
	    }
	  }];
}]).config(function($httpProvider) {
	$httpProvider.interceptors.push('myCSRF');
});

/* Routing */
swimApp.config(['$routeProvider',
    function($routeProvider) {
		$routeProvider.when('/workout/:id', {
			templateUrl: '/static/swim/workout.html',
		}).when('/exercises', {
			templateUrl: '/static/swim/exercises.html',
		}).when('/', {
			templateUrl: '/static/swim/index.html',
		}).otherwise({redirectTo:'/'});
}]);

// Global variables
var debug = true;
