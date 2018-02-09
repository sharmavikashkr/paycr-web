app.controller('InvoicePaymentController', function($scope, $rootScope, envService, $http, $cookies, $httpParamSerializer) {
	var dateNow = moment().toDate();
	var dateStart = moment().subtract(30, 'day').toDate();
	$rootScope.searchPaymentReq = {
		"createdFrom" : dateStart,
		"createdTo" : dateNow
	}
	$rootScope.searchInvoicePayment = function() {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/search/payment",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : $scope.searchPaymentReq
		}
		$http(req).then(function(payments) {
			$rootScope.invPaymentList = payments.data;
			$scope.loadPaymentPage(1);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.loadPaymentPage = function(page) {
		var pageSize = 15;
		$rootScope.invPaymentResp = {};
		$rootScope.invPaymentResp.paymentList = angular
				.copy($rootScope.invPaymentList);
		$rootScope.invPaymentResp.paymentList.splice(pageSize * page,
				$rootScope.invPaymentList.length - pageSize);
		$rootScope.invPaymentResp.paymentList.splice(0, pageSize * (page - 1));
		$rootScope.invPaymentResp.page = page;
		$rootScope.invPaymentResp.allPages = [];
		var noOfPages = $rootScope.invPaymentList.length / pageSize;
		if ($rootScope.invPaymentList.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.invPaymentResp.allPages.push(i);
		}
	}
	$scope.downloadCsv = function() {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/search/payment/download",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token"),
				"Accept" : "text/csv"
			},
			data : $scope.searchPaymentReq
		}
		$http(req).then(function(content) {
			var hiddenElement = document.createElement('a');
			hiddenElement.href = 'data:attachment/csv,'
					+ encodeURI(content.data);
			hiddenElement.target = '_blank';
			hiddenElement.download = 'invoice-payments.csv';
			hiddenElement.click();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.mailCsv = function() {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/search/payment/mail",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : $scope.searchPaymentReq
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.seachPayInvoice = function(invoiceCode) {
		$rootScope.clearInvoiceSearch();
		$rootScope.searchInvoiceReq.invoiceCode = invoiceCode;
		$rootScope.searchInvoice();
	}
	$scope.clearPaymentSearch = function() {
		$rootScope.searchPaymentReq.invoiceCode = '';
		$rootScope.searchPaymentReq.paymentRefNo = '';
		$rootScope.searchPaymentReq.payType = null;
	}
});