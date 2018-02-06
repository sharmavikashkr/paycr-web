app.controller('PricingController', function($scope, $rootScope, envService, $http, $cookies, $httpParamSerializer) {
	$scope.fetchPricings = function() {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/common/pricings",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(pricings) {
			$rootScope.pricings = pricings.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.createPricing = function() {
		if (!this.createPricingForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : envService.read('apiUrl') + "/admin/pricing/new",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : this.newpricing
		}
		$http(req).then(function(data) {
			$scope.fetchPricings();
			$scope.serverMessage(data);
			this.newpricing = {};
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#createPricingModal')).modal('hide');
	}
	$scope.togglePricing = function(pricingId) {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/admin/pricing/toggle/" + pricingId,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(data) {
			$scope.fetchPricings();
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.updatePricingMerchant = function(pricing) {
		$rootScope.customPricing = angular.copy(pricing);
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/admin/pricing/merchants/" + pricing.id,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(merchantList) {
			$rootScope.pricingMerchantList = merchantList.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.addPricingMerchant = function(pricing, merchantId) {
		var addReq = {
			"pricingId" : pricing.id,
			"merchantId" : merchantId
		}
		var req = {
			method : 'POST',
			url : envService.read('apiUrl') + "/admin/pricing/merchant/add",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token"),
				"Content-type": "application/x-www-form-urlencoded; charset=utf-8"
			},
			data : $httpParamSerializer(addReq)
		}
		$http(req).then(function(data) {
			$scope.updatePricingMerchant(pricing);
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.removePricingMerchant = function(pricing, merchantId) {
		var removeReq = {
			"pricingId" : pricing.id,
			"merchantId" : merchantId
		}
		var req = {
			method : 'POST',
			url : envService.read('apiUrl') + "/admin/pricing/merchant/remove",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token"),
				"Content-type": "application/x-www-form-urlencoded; charset=utf-8"
			},
			data : $httpParamSerializer(removeReq)
		}
		$http(req).then(function(data) {
			$scope.updatePricingMerchant(pricing);
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
});