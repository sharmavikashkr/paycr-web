app.controller('InvoiceSettingController', function($scope, $rootScope, envService, $http, $cookies) {
	$scope.savePaymentSetting = function(paymentSetting) {
		var req = {
			method : 'POST',
			url : envService.read('apiUrl') + "/merchant/paymentsetting/update",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : paymentSetting
		}
		$http(req).then(function(paymentsetting) {
			$rootScope.merchant.paymentSetting = paymentsetting.data;
			$scope.serverMessage(paymentsetting);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.saveInvoiceSetting = function(invoiceSetting) {
		var req = {
			method : 'POST',
			url : envService.read('apiUrl') + "/merchant/invoicesetting/update",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : invoiceSetting
		}
		$http(req).then(function(invoicesetting) {
			$rootScope.merchant.invoiceSetting = invoicesetting.data;
			$scope.refreshSetting(invoicesetting.data);
			$scope.serverMessage(invoicesetting);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.addParam = function() {
		if (!this.addCustomParamForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : envService.read('apiUrl') + "/merchant/customParam/new/",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : this.newparam
		}
		$http(req).then(function(invoicesetting) {
			$rootScope.merchant.invoiceSetting = invoicesetting.data;
			$scope.refreshSetting(invoicesetting.data);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#createParamModal')).modal(
				'hide');
	}
	$scope.deleteParam = function(paramId, paramName) {
		if (!confirm('Delete ' + paramName + ' ?')) {
			return false;
		}
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/merchant/customParam/delete/" + paramId,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(invoicesetting) {
			$rootScope.merchant.invoiceSetting = invoicesetting.data;
			$scope.refreshSetting(invoicesetting.data);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
});