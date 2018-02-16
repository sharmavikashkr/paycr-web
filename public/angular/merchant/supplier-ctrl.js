app.controller('SupplierController', function($scope, $rootScope, envService, $http, $cookies, $httpParamSerializer) {
    $rootScope.searchSupplierReq = {
        "name": "",
		"email" : "",
		"mobile" : ""
	}
	$scope.newsupplier = {
		"email" : "",
		"mobile" : "",
		"name" : ""
	}
	$rootScope.searchSupplier = function() {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/expense/search/supplier",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : $rootScope.searchSupplierReq
		}
		$http(req).then(function(suppliers) {
			$rootScope.supplierList = suppliers.data;
			$scope.loadSupplierPage(1);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.loadSupplierPage = function(page) {
		var pageSize = 15;
		$rootScope.supplierResp = {};
		$rootScope.supplierResp.supplierList = angular
				.copy($rootScope.supplierList);
		$rootScope.supplierResp.supplierList.splice(pageSize * page,
				$rootScope.supplierList.length - pageSize);
		$rootScope.supplierResp.supplierList.splice(0, pageSize * (page - 1));
		$rootScope.supplierResp.page = page;
		$rootScope.supplierResp.allPages = [];
		var noOfPages = $rootScope.supplierList.length / pageSize;
		if ($rootScope.supplierList.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.supplierResp.allPages.push(i);
		}
	}
	$scope.updateSupplier = function(supplier) {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/supplier/update/" + supplier.id,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : supplier
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.searchSupplier();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.createSupplier = function() {
		if (!this.addSupplierForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/supplier/new",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : $scope.newsupplier
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.searchSupplier();
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#createSupplierModal')).modal(
				'hide');
	}
	$scope.updateBulkSupplierUploads = function() {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/supplier/bulk/uploads/all",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(bulkSupplierUploads) {
			$rootScope.bulkSupplierUploads = bulkSupplierUploads.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.uploadSuppliers = function(files) {
		if (!confirm('Upload Suppliers?')) {
			return false;
		}
		var fd = new FormData();
		fd.append("suppliers", files[0]);
		$http.post($rootScope.appUrl + "/supplier/bulk/upload", fd, {
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
		angular.element(document.querySelector('#bulkSupplierUploadModal')).modal('hide');
	}
	$scope.updateEditAddress = function() {
		if($rootScope.editAddress == null) {
			$rootScope.editAddress = {};
		}
		$rootScope.editAddress.supplierId = this.supplier.id;
	}
	$scope.saveAddress = function(editAddress) {
		if (!this.editAddressForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/supplier/address/update/" + editAddress.supplierId,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : editAddress
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.searchSupplier();
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#editSupAddressModal')).modal('hide');
	}
	$scope.updateExpenseSupplier = function(supplier) {
		$rootScope.saveexpense = angular.copy($rootScope.newexpense);
		$rootScope.saveexpense.supplier = angular.copy(supplier);
	}
	$scope.seachSupExpense = function(supplier) {
		$rootScope.searchSupplierExpenses(supplier);
	}
	$scope.clearSupplierSearch = function() {
        $rootScope.searchSupplierReq = {
            "name": "",
			"email" : "",
			"mobile" : ""
		}
	}
});