app.controller('MyInvoicesController', function ($scope, $rootScope, $rootScope, envService, $http, $cookies) {
	$scope.fetchMyInvoices = function() {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/user/invoices/",
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