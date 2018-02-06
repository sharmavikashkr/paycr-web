var app = angular.module('payCrMerchantApp', [ "ngRoute", "ngCookies", "ngMaterial", "environment" ]);
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
app.controller('MerchantController', function($scope, $rootScope, envService, $http, $cookies, $timeout) {
	$rootScope.hideSpinner = false;
	var dateNow = moment().toDate();
	var dateStart = moment().subtract(30, 'day').toDate();
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
		"numberPattern" : "\\d{1,4}",
		"passPattern" : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/
	}
	$rootScope.newinvoice = {
		"invoiceCode" : "",
		"invoiceType" : "SINGLE",
		"invoiceDate" : dateNow,
		"consumer" : {
			"email" : "",
			"mobile" : "",
			"name" : ""
		},
		"items" : [],
		"addItems" : false,
		"total" : 0.00,
		"discount" : 0,
		"payAmount" : 0,
		"currency" : "INR",
		"expiresIn" : "",
		"customParams" : [ {
			"paramName" : "",
			"paramValue" : "",
			"provider" : ""
		} ]
	}
	$rootScope.saveinvoice = $rootScope.newinvoice;
	$rootScope.newexpense = {
		"expenseCode" : "",
		"invoiceCode" : "",
		"invoiceDate" : dateNow,
		"supplier" : {
			"email" : "",
			"mobile" : "",
			"name" : ""
		},
		"items" : [],
		"addItems" : true,
		"total" : 0.00,
		"discount" : 0,
		"payAmount" : 0,
		"currency" : "INR"
	}
	$rootScope.saveexpense = $rootScope.newexpense;
	$rootScope.invoiceNotify = {}
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
	$scope.newTab = function(newref) {
		var win = window.open(envService.read('apiUrl') + newref, '_blank');
		if (win) {
			win.focus();
		} else {
			alert('Please allow popups for this website');
		}
	}
	$scope.prepare = function() {
		$scope.fetchMerchant();
		$scope.fetchUser();
		$scope.fetchNotifications();
		$scope.fetchEnums();
		$scope.fetchTaxes();
		$rootScope.access_token = $cookies.get("access_token");
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
	$scope.fetchMerchant = function() {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/merchant/get",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(merchant) {
			$rootScope.merchant = merchant.data;
			$scope.refreshSetting(merchant.data.invoiceSetting);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.fetchTaxes = function() {
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
	$scope.refreshSetting = function(invoicesetting) {
		$rootScope.newInvSetting = invoicesetting;
		$rootScope.newinvoice.addItems = angular.copy(invoicesetting.addItems);
		$rootScope.newinvoice.expiresIn = angular.copy(invoicesetting.expiryDays);
		$rootScope.newinvoice.customParams = [];
		for (var param in invoicesetting.customParams) {
			var copyParam = angular.copy(invoicesetting.customParams[param]);
			copyParam.id = null;
			copyParam.include = true;
			$rootScope.newinvoice.customParams.push(copyParam);
		}
		$rootScope.invoiceNotify.sendEmail = angular.copy(invoicesetting.sendEmail);
		$rootScope.invoiceNotify.sendMobile = angular.copy(invoicesetting.sendMobile);
		$rootScope.invoiceNotify.emailPdf = angular.copy(invoicesetting.emailPdf);
		$rootScope.invoiceNotify.ccMe = angular.copy(invoicesetting.ccMe);
		$rootScope.invoiceNotify.emailSubject = angular.copy(invoicesetting.emailSubject);
		$rootScope.invoiceNotify.emailNote = angular.copy(invoicesetting.emailNote);
	}
	$scope.logout = function() {
		$cookies.put("access_token", "");
		$timeout(function(){
			window.location.href="/login?logout";
		}, 1000);
	}
});