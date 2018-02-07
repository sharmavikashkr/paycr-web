var app = angular.module('payCrAdminApp', [ "ngRoute", "ngCookies", "ngMaterial", "environment" ]);
app.config(function($mdDateLocaleProvider, envServiceProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
       return date ? moment(date).format('YYYY-MM-DD') : '';
    };
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
app.controller('AdminController',
function($scope, $rootScope, envService, $http, $cookies, $timeout) {
	$rootScope.hideSpinner = false;
	$scope.server = {
		"hideMessage" : true,
		"respStatus" : "WELCOME!",
		"respMsg" : ":)",
		"isSuccess" : true
	}
	$scope.patterns = {
		"paramNamePattern" : "[0-9a-zA-Z_\\-]{1,20}",
		"namePattern" : "[0-9a-zA-Z_\\- ]{1,50}",
		"emailPattern" : "([a-zA-Z0-9_.]{1,})((@[a-zA-Z]{2,})[\\\.]([a-zA-Z]{2}|[a-zA-Z]{3}))",
		"mobilePattern" : "\\d{10}",
		"amountPattern" : "\\d{1,7}",
		"numberPattern" : "\\d{1,5}",
		"taxValuePattern" : "\\d{1,2}(\.\\d{0,2})?",
		"passPattern" : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/
	}
	$scope.dismissServerAlert = function() {
		$scope.server.hideMessage = true;
	}
	$scope.serverMessage = function(data) {
		$scope.server.hideMessage = false;
		$scope.server.respMsg = "";
		if(data.status==200) {
			$scope.server.isSuccess = true;
			$scope.server.respStatus = "SUCCESS!";
			$scope.server.respMsg = "operation successful";
		} else {
			$scope.server.isSuccess = false;
			$scope.server.respStatus = "FAILURE!";
			$scope.server.respMsg = data.data.message;
			if(data.status==401 || data.status==403) {
				$scope.logout();
			}
		}
	}
	$scope.templateUrl = function(folder, page) {
		return '/html/' + folder + '/' + page +'.html';
	}
    $scope.prepare = function () {
        $scope.check();
		$scope.fetchUser();
		$scope.fetchNotifications();
		$scope.fetchEnums();
		$rootScope.fetchTaxes();
	}
	$scope.fetchEnums = function() {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/enum/paymodes",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(payModes) {
			$rootScope.payModes = payModes.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
		
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/enum/usertypes",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(usertypes) {
			$rootScope.userTypes = usertypes.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
		
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/enum/timeranges",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(timeranges) {
			$rootScope.timeRanges = timeranges.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
		
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/enum/reporttypes",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(reporttypes) {
			$rootScope.reportTypes = reporttypes.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
    }
    $scope.check = function () {
        var req = {
            method: 'GET',
            url: envService.read('apiUrl') + "/admin/check",
            headers: {
                "Authorization": "Bearer "
                + $cookies.get("access_token")
            }
        }
        $http(req).then(function (data) {
        }, function (data) {
            $scope.serverMessage(data);
        });
    }
	$scope.fetchUser = function() {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/user",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(user) {
			$rootScope.user = user.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$rootScope.fetchTaxes = function() {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/common/taxes",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(taxes) {
			$rootScope.taxList = taxes.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.fetchNotifications = function() {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/common/notifications",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(notifications) {
			$rootScope.notices = notifications.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.logout = function() {
		$cookies.put("access_token", "");
		window.location.href="/adminlogin?logout";
	}
});