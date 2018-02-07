var app = angular.module('payCrApp', [ "ngRoute", "ngCookies", "environment" ]);
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
app.controller('AccessController', function($scope, envService, $http, $cookies, $httpParamSerializer) {
    $scope.invalidcreds = false;
    $scope.isError = false;
	$scope.user = {
		email : "",
		password : ""
    };
    $scope.forgotEmail = {
        email : ""
    };
    $scope.contactData = {
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "Website Contact"
    };
    $scope.registerData = {
        email: "",
        mobile: "",
        name: ""
    };

	$scope.login = function() {
		var req = {
			method : 'POST',
			url : envService.read('apiUrl') + "/secure/login",
			headers : {
				"Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
			},
            data: $httpParamSerializer($scope.user)
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
            url: envService.read('apiUrl') + "/merchant/check",
            headers: {
                "Authorization": "Bearer "
                + $cookies.get("access_token")
            }
        }
        $http(req).then(function (data) {
            window.location.href = "/merchant";
        }, function (data) {
            $scope.invalidcreds = true;
        });
    }

    $scope.sendResetPassword = function () {
        var req = {
            method: 'POST',
            url: envService.read('apiUrl') + "/sendResetPassword",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
            },
            data: $httpParamSerializer($scope.forgotEmail)
        }
        $http(req).then(function (data) {
            window.location.href = "/login";
        }, function (data) {
            $scope.isError = true;
            $scope.message = data.data.message;
        });
    }

    $scope.contactUs = function () {
        var req = {
            method: 'POST',
            url: envService.read('apiUrl') + "/contactUs/new",
            headers: {
                "Content-type": "application/json"
            },
            data: $scope.contactData
        }
        $http(req).then(function (data) {
            window.location.href = "/contactus-success";
        }, function (data) {
            window.location.href = "/contactus-success";
        });
    }

    $scope.register = function () {
        var req = {
            method: 'POST',
            url: envService.read('apiUrl') + "/register",
            headers: {
                "Content-type": "application/json"
            },
            data: $scope.registerData
        }
        $http(req).then(function (data) {
            window.location.href = "/register-success";
        }, function (data) {
            $scope.isError = true;
            $scope.errorMessage = data.data.message;
        });
    }
});