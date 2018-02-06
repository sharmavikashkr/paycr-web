var app = angular.module('payCrAppAdmin', ["ngRoute","ngCookies", "environment"]);
app.config(function(envServiceProvider) {
	envServiceProvider.config({domains: {
			development: ['localhost'],
			production: ['paycr.in', '*.paycr.in'],
			alpha: ['alpha.paycr.com']
		},
		vars: {
			development: {
				apiUrl: 'http://localhost:9090'
			},
			alpha: {
				apiUrl: 'http://alphaapi.paycr.in'
			},
			production: {
				apiUrl: 'http://api.paycr.in'
			},
			defaults: {
				apiUrl: 'http://localhost:9090'
			}
		}
	});
	envServiceProvider.check();
});
app.controller('LoginController', function($scope, envService, $http, $cookies, $httpParamSerializer) {
	$scope.invalidcreds = false;
    $scope.data = {
        email : "",
        password : ""
    };
	
    $scope.login = function() {
        var req = {
            method : 'POST',
            url : envService.read('apiUrl') + "/secure/login",
            headers : {
                "Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
            },
            data : $httpParamSerializer($scope.data)
        }
        $http(req).then(function(data) {
            $cookies.put("access_token", data.data.access_token);
            window.location.href = "/admin";
        }, function(data) {
    		$scope.invalidcreds = true;
		});
    }
});