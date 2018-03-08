app.controller('Gstr1Controller', function($scope, $rootScope, envService, $http, $cookies) {
	$rootScope.updateFilingPeriod = function() {
		if($rootScope.merchant.gstSetting.filingPeriod == 'QUARTERLY') {
            $scope.gstr1 = {
                "period" : "01-03-2018"
            }
		} else {
            $scope.gstr1 = {
                "period": "03-2018"
            }
		}
	}
	$scope.loadGstr1Report = function(period) {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/gst/gstr1/" + period,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(gstr1) {
			$rootScope.gstr1Report = gstr1.data;
			$rootScope.gstr1ReportResp = {};
			$scope.loadB2CSmallPage();
			$scope.loadB2CLargePage();
			$scope.loadB2BPage();
			$scope.loadB2BNotePage();
            $scope.loadB2CNotePage();
            $scope.loadNilPage();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.loadB2CSmallPage = function(page) {
		var pageSize = 10;
		$rootScope.gstr1ReportResp.b2cSmall = {};
		$rootScope.gstr1ReportResp.b2cSmall = angular.copy($rootScope.gstr1Report.b2cSmall);
		$rootScope.gstr1ReportResp.b2cSmall.splice(pageSize * page, $rootScope.gstr1Report.b2cSmall.length - pageSize);
		$rootScope.gstr1ReportResp.b2cSmall.splice(0, pageSize * (page - 1));
		$rootScope.gstr1ReportResp.b2cSmall.page = page;
		$rootScope.gstr1ReportResp.b2cSmall.allPages = [];
		var noOfPages = $rootScope.gstr1Report.b2cSmall.length / pageSize;
		if ($rootScope.gstr1Report.b2cSmall.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.gstr1ReportResp.b2cSmall.allPages.push(i);
		}
	}
	$scope.loadB2CLargePage = function(page) {
		var pageSize = 10;
		$rootScope.gstr1ReportResp.b2cLarge = {};
		$rootScope.gstr1ReportResp.b2cLarge = angular.copy($rootScope.gstr1Report.b2cLarge);
		$rootScope.gstr1ReportResp.b2cLarge.splice(pageSize * page, $rootScope.gstr1Report.b2cLarge.length - pageSize);
		$rootScope.gstr1ReportResp.b2cLarge.splice(0, pageSize * (page - 1));
		$rootScope.gstr1ReportResp.b2cLarge.page = page;
		$rootScope.gstr1ReportResp.b2cLarge.allPages = [];
		var noOfPages = $rootScope.gstr1Report.b2cLarge.length / pageSize;
		if ($rootScope.gstr1Report.b2cLarge.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.gstr1ReportResp.b2cLarge.allPages.push(i);
		}
	}
	$scope.loadB2BPage = function(page) {
		var pageSize = 10;
		$rootScope.gstr1ReportResp.b2b = {};
		$rootScope.gstr1ReportResp.b2b = angular.copy($rootScope.gstr1Report.b2b);
		$rootScope.gstr1ReportResp.b2b.splice(pageSize * page, $rootScope.gstr1Report.b2b.length - pageSize);
		$rootScope.gstr1ReportResp.b2b.splice(0, pageSize * (page - 1));
		$rootScope.gstr1ReportResp.b2b.page = page;
		$rootScope.gstr1ReportResp.b2b.allPages = [];
		var noOfPages = $rootScope.gstr1Report.b2b.length / pageSize;
		if ($rootScope.gstr1Report.b2b.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.gstr1ReportResp.b2b.allPages.push(i);
		}
	}
	$scope.loadB2BNotePage = function(page) {
		var pageSize = 10;
		$rootScope.gstr1ReportResp.b2bNote = {};
		$rootScope.gstr1ReportResp.b2bNote = angular.copy($rootScope.gstr1Report.b2bNote);
		$rootScope.gstr1ReportResp.b2bNote.splice(pageSize * page, $rootScope.gstr1Report.b2bNote.length - pageSize);
		$rootScope.gstr1ReportResp.b2bNote.splice(0, pageSize * (page - 1));
		$rootScope.gstr1ReportResp.b2bNote.page = page;
		$rootScope.gstr1ReportResp.b2bNote.allPages = [];
		var noOfPages = $rootScope.gstr1Report.b2bNote.length / pageSize;
		if ($rootScope.gstr1Report.b2bNote.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.gstr1ReportResp.b2bNote.allPages.push(i);
		}
	}
	$scope.loadB2CNotePage = function(page) {
		var pageSize = 10;
		$rootScope.gstr1ReportResp.b2cNote = {};
		$rootScope.gstr1ReportResp.b2cNote = angular.copy($rootScope.gstr1Report.b2cNote);
		$rootScope.gstr1ReportResp.b2cNote.splice(pageSize * page, $rootScope.gstr1Report.b2cNote.length - pageSize);
		$rootScope.gstr1ReportResp.b2cNote.splice(0, pageSize * (page - 1));
		$rootScope.gstr1ReportResp.b2cNote.page = page;
		$rootScope.gstr1ReportResp.b2cNote.allPages = [];
		var noOfPages = $rootScope.gstr1Report.b2cNote.length / pageSize;
		if ($rootScope.gstr1Report.b2cNote.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.gstr1ReportResp.b2cNote.allPages.push(i);
		}
    }
    $scope.loadNilPage = function (page) {
        var pageSize = 10;
        $rootScope.gstr1ReportResp.nil = {};
        $rootScope.gstr1ReportResp.nil = angular.copy($rootScope.gstr1Report.nil);
        $rootScope.gstr1ReportResp.nil.splice(pageSize * page, $rootScope.gstr1Report.nil.length - pageSize);
        $rootScope.gstr1ReportResp.nil.splice(0, pageSize * (page - 1));
        $rootScope.gstr1ReportResp.nil.page = page;
        $rootScope.gstr1ReportResp.nil.allPages = [];
        var noOfPages = $rootScope.gstr1Report.nil.length / pageSize;
        if ($rootScope.gstr1Report.nil.length % pageSize != 0) {
            noOfPages = noOfPages + 1;
        }
        for (var i = 1; i <= noOfPages; i++) {
            $rootScope.gstr1ReportResp.nil.allPages.push(i);
        }
    }
	$scope.downloadGstr1Report = function(period) {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/gst/gstr1/download/" + period,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			responseType: 'arraybuffer'
		}
		$http(req).then(function(content) {
			var hiddenElement = document.createElement('a');
			var blob = new Blob([content.data], {'type':"application/octet-stream"});
			hiddenElement.href = URL.createObjectURL(blob);
			hiddenElement.download = "GSTR1 Report - " + period + ".zip";
			hiddenElement.click();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.mailGstr1Report = function(period) {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/gst/gstr1/mail/" + period,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
});