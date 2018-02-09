app.controller('GstSettingController', function($scope, $rootScope, envService, $http, $cookies) {
	$scope.saveGstSetting = function(gstSetting) {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/merchant/gstsetting/update",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : gstSetting
		}
		$http(req).then(function(gstsetting) {
			$rootScope.merchant.gstSetting = gstsetting.data;
			$scope.serverMessage(gstsetting);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
});