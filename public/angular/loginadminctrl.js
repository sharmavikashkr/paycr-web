var app = angular.module('payCrAppAdmin', ["ngRoute","ngCookies", "environment"]);
app.config(function(envServiceProvider) {
    envServiceProvider.config({
        domains: {
            development: ['localhost'],
            alpha: ['alpha.paycr.in'],
            production: ['paycr.in', '*.paycr.in']
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
app.controller('LoginController', function ($scope, envService, $http, $cookies, $httpParamSerializer) {
    $rootScope.appUrl = envService.read('apiUrl');
	$scope.invalidcreds = false;
    $scope.data = {
        email : "",
        password : ""
    };
	
    $scope.login = function() {
        var req = {
            method : 'POST',
            url: $rootScope.appUrl + "/secure/login",
            headers : {
                "Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
            },
            data : $httpParamSerializer($scope.data)
        }
        $http(req).then(function(data) {
            $cookies.put("access_token", data.data.access_token);
            $scope.check();
        }, function(data) {
    		$scope.invalidcreds = true;
		});
    }
    $scope.check = function () {
        var req = {
            method: 'GET',
            url: $rootScope.appUrl + "/admin/check",
            headers: {
                "Authorization": "Bearer "
                + $cookies.get("access_token")
            }
        }
        $http(req).then(function (data) {
            window.location.href = "/admin";
        }, function (data) {
            $scope.invalidcreds = true;
        });
    }
});