app.controller('Gstr2Controller', function($scope, $rootScope, envService, $http, $cookies) {
    $scope.gstr2 = {
        "period" : "03-2018"
    }
	$scope.loadGstr2Report = function(period) {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/gst/gstr2/" + period,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(gstr2) {
			$rootScope.gstr2Report = gstr2.data;
			$rootScope.gstr2ReportResp = {};
			$scope.loadB2BUrPage();
			$scope.loadB2BRPage();
			$scope.loadB2BRNotePage();
            $scope.loadB2BUrNotePage();
            $scope.loadNilPage();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.loadB2BUrPage = function(page) {
		var pageSize = 10;
		$rootScope.gstr2ReportResp.b2bUr = {};
		$rootScope.gstr2ReportResp.b2bUr = angular.copy($rootScope.gstr2Report.b2bUr);
		$rootScope.gstr2ReportResp.b2bUr.splice(pageSize * page, $rootScope.gstr2Report.b2bUr.length - pageSize);
		$rootScope.gstr2ReportResp.b2bUr.splice(0, pageSize * (page - 1));
		$rootScope.gstr2ReportResp.b2bUr.page = page;
		$rootScope.gstr2ReportResp.b2bUr.allPages = [];
		var noOfPages = $rootScope.gstr2Report.b2bUr.length / pageSize;
		if ($rootScope.gstr2Report.b2bUr.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.gstr2ReportResp.b2bUr.allPages.push(i);
		}
	}
	$scope.loadB2BRPage = function(page) {
		var pageSize = 10;
		$rootScope.gstr2ReportResp.b2bR = {};
        $rootScope.gstr2ReportResp.b2bR = angular.copy($rootScope.gstr2Report.b2bR);
        $rootScope.gstr2ReportResp.b2bR.splice(pageSize * page, $rootScope.gstr2Report.b2bR.length - pageSize);
        $rootScope.gstr2ReportResp.b2bR.splice(0, pageSize * (page - 1));
        $rootScope.gstr2ReportResp.b2bR.page = page;
        $rootScope.gstr2ReportResp.b2bR.allPages = [];
        var noOfPages = $rootScope.gstr2Report.b2bR.length / pageSize;
        if ($rootScope.gstr2Report.b2bR.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
            $rootScope.gstr2ReportResp.b2bR.allPages.push(i);
		}
	}
	$scope.loadB2BRNotePage = function(page) {
		var pageSize = 10;
		$rootScope.gstr2ReportResp.b2bRNote = {};
        $rootScope.gstr2ReportResp.b2bRNote = angular.copy($rootScope.gstr2Report.b2bRNote);
        $rootScope.gstr2ReportResp.b2bRNote.splice(pageSize * page, $rootScope.gstr2Report.b2bRNote.length - pageSize);
        $rootScope.gstr2ReportResp.b2bRNote.splice(0, pageSize * (page - 1));
        $rootScope.gstr2ReportResp.b2bRNote.page = page;
        $rootScope.gstr2ReportResp.b2bRNote.allPages = [];
        var noOfPages = $rootScope.gstr2Report.b2bRNote.length / pageSize;
        if ($rootScope.gstr2Report.b2bRNote.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
            $rootScope.gstr2ReportResp.b2bRNote.allPages.push(i);
		}
	}
	$scope.loadB2BUrNotePage = function(page) {
		var pageSize = 10;
		$rootScope.gstr2ReportResp.b2bUrNote = {};
        $rootScope.gstr2ReportResp.b2bUrNote = angular.copy($rootScope.gstr2Report.b2bUrNote);
        $rootScope.gstr2ReportResp.b2bUrNote.splice(pageSize * page, $rootScope.gstr2Report.b2bUrNote.length - pageSize);
        $rootScope.gstr2ReportResp.b2bUrNote.splice(0, pageSize * (page - 1));
        $rootScope.gstr2ReportResp.b2bUrNote.page = page;
        $rootScope.gstr2ReportResp.b2bUrNote.allPages = [];
        var noOfPages = $rootScope.gstr2Report.b2bUrNote.length / pageSize;
        if ($rootScope.gstr2Report.b2bUrNote.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
            $rootScope.gstr2ReportResp.b2bUrNote.allPages.push(i);
		}
    }
    $scope.loadNilPage = function (page) {
        var pageSize = 10;
        $rootScope.gstr2ReportResp.nil = {};
        $rootScope.gstr2ReportResp.nil = angular.copy($rootScope.gstr2Report.nil);
        $rootScope.gstr2ReportResp.nil.splice(pageSize * page, $rootScope.gstr2Report.nil.length - pageSize);
        $rootScope.gstr2ReportResp.nil.splice(0, pageSize * (page - 1));
        $rootScope.gstr2ReportResp.nil.page = page;
        $rootScope.gstr2ReportResp.nil.allPages = [];
        var noOfPages = $rootScope.gstr2Report.nil.length / pageSize;
        if ($rootScope.gstr2Report.nil.length % pageSize != 0) {
            noOfPages = noOfPages + 1;
        }
        for (var i = 1; i <= noOfPages; i++) {
            $rootScope.gstr2ReportResp.nil.allPages.push(i);
        }
    }
	$scope.downloadGstr2Report = function(period) {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/gst/gstr2/download/" + period,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			responseType: 'arraybuffer'
		}
		$http(req).then(function(content) {
			var hiddenElement = document.createElement('a');
			var blob = new Blob([content.data], {'type':"application/octet-stream"});
			hiddenElement.href = URL.createObjectURL(blob);
			hiddenElement.download = "GSTR2 Report - " + period + ".zip";
			hiddenElement.click();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.mailGstr2Report = function(period) {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/gst/gstr2/mail/" + period,
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