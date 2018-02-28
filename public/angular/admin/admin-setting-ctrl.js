app.controller('AdminSettingController', function($scope, $rootScope, envService, $http,
		$cookies) {
	$scope.createTax = function(tax) {
		if (!this.newTaxForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/admin/setting/tax/new",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : tax
		}
		$http(req).then(function(data) {
			$rootScope.fetchTaxes();
			$scope.serverMessage(setting);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#addTaxModal')).modal('hide');
	}
});