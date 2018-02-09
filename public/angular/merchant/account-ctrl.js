app.controller('AccountController', function($scope, $rootScope, envService, $http, $cookies) {
	$scope.updateAccount = function() {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/merchant/account/update",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : $rootScope.merchant
		}
		$http(req).then(function(merchant) {
			$rootScope.merchant = merchant.data;
			$scope.serverMessage(merchant);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.saveAccAddress = function() {
		if (!this.editAddressForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/merchant/address/update",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : $rootScope.merchant.address
		}
		$http(req).then(function(merchant) {
			$rootScope.merchant = merchant.data;
			$scope.serverMessage(merchant);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#editAccAddressModal')).modal('hide');
	}
	$scope.uploadBanner = function(files) {
		if (!confirm('Upload Banner?')) {
			return false;
		}
		var fd = new FormData();
		fd.append("banner", files[0]);
		$http.post($rootScope.appUrl + "/banner/upload", fd, {
			transformRequest : angular.identity,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token"),
				'Content-Type' : undefined
			}
		}).then(function(data) {
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
});