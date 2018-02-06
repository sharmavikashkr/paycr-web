app.controller('DashboardController', function($scope, $rootScope, envService, $http, $cookies) {
	$scope.timeRange = 'LAST_WEEK';
	$rootScope.loadDashboard = function() {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/admin/dashboard/" + $scope.timeRange,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(response) {
			$rootScope.statsResponse = response.data;
			$scope.loadCharts();				
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	
	$scope.loadCharts = function() {
		$('#amount-donut').empty();
		$('#count-donut').empty();
		$('#per-day-bar').empty();
		Morris.Donut({
	        element: 'amount-donut',
	        colors : ['#00a65a', '#dd4b39', '#d2d6de', '#faf2cc', '#f39c12'],
	        data: [{
	            label: "Paid",
	            value: $rootScope.statsResponse.saleInvPaySum
	        }, {
	            label: "Refunded",
	            value: $rootScope.statsResponse.refundInvPaySum
	        }, {
	            label: "Expired",
	            value: $rootScope.statsResponse.expiredInvSum
	        }, {
	            label: "Unpaid",
	            value: $rootScope.statsResponse.unpaidInvSum
	        }, {
	            label: "Declined",
	            value: $rootScope.statsResponse.declinedInvSum
	        }],
	        resize: true
	    });
		Morris.Donut({
	        element: 'count-donut',
	        colors : ['#00a65a', '#dd4b39', '#d2d6de', '#faf2cc', '#f39c12'],
	        data: [{
	            label: "Paid",
	            value: $rootScope.statsResponse.saleInvPayCount
	        }, {
	            label: "Refunded",
	            value: $rootScope.statsResponse.refundInvPayCount
	        }, {
	            label: "Expired",
	            value: $rootScope.statsResponse.expiredInvCount
	        }, {
	            label: "Unpaid",
	            value: $rootScope.statsResponse.unpaidInvCount
	        }, {
	            label: "Declined",
	            value: $rootScope.statsResponse.declinedInvCount
	        }],
	        resize: true
	    });
		if($rootScope.statsResponse.dailyInvPayList.length > 0) {
			var areaData = [];
			for(var dailyPay in $rootScope.statsResponse.dailyInvPayList) {
				areaData.push({
					period: $rootScope.statsResponse.dailyInvPayList[dailyPay].created,
					paid: $rootScope.statsResponse.dailyInvPayList[dailyPay].salePaySum,
					refund: $rootScope.statsResponse.dailyInvPayList[dailyPay].refundPaySum
				});
			}
			Morris.Bar({
		        element: 'per-day-bar',
		        data: areaData,
		        xkey: 'period',
		        ykeys: ['paid', 'refund'],
		        labels: ['paid', 'refund'],
		        hideHover: 'auto',
		        resize: true
		    });
		}
		$rootScope.hideSpinner = true;
	}
});