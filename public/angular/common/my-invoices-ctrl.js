app.controller('MyInvoicesController', function($scope, $rootScope, envService, $http, $cookies) {
	$scope.fetchMyInvoices = function() {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/user/invoices/",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(myInvoices) {
			$rootScope.myinvoices = myInvoices.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
});