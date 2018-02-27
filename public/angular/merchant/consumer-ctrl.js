app.controller('ConsumerController', function($scope, $rootScope, envService, $http, $cookies, $httpParamSerializer) {
	$rootScope.searchConsumerReq = {
		"email" : "",
		"mobile" : "",
		"flagList" : []
	}
	$rootScope.updateConsumerReq = {
		"flagList" : [],
		"emailOnPay" : true,
        "emailOnRefund": true,
        "emailNote": true,
		"active" : true
	}
	$scope.newconsumer = {
		"flags" : [],
		"email" : "",
		"mobile" : "",
		"name" : ""
	}
	$rootScope.searchConsumer = function() {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/search/consumer",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : $rootScope.searchConsumerReq
		}
		$http(req).then(function(consumers) {
			$rootScope.consumerList = consumers.data;
			$scope.loadConsumerPage(1);
			$scope.fetchFlags();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.loadConsumerPage = function(page) {
		var pageSize = 15;
		$rootScope.consumerResp = {};
		$rootScope.consumerResp.consumerList = angular
				.copy($rootScope.consumerList);
		$rootScope.consumerResp.consumerList.splice(pageSize * page,
				$rootScope.consumerList.length - pageSize);
		$rootScope.consumerResp.consumerList.splice(0, pageSize * (page - 1));
		$rootScope.consumerResp.page = page;
		$rootScope.consumerResp.allPages = [];
		var noOfPages = $rootScope.consumerList.length / pageSize;
		if ($rootScope.consumerList.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.consumerResp.allPages.push(i);
		}
	}
	$scope.updateConsumer = function(consumer) {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/consumer/update/" + consumer.id,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : consumer
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.searchConsumer();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.updateConsumerFlag = function() {
		if (!confirm('Update for search criteria?')) {
			return false;
		}
		this.updateConsumerReq.searchReq = $rootScope.searchConsumerReq;
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/consumer/update/flag",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : this.updateConsumerReq
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.searchConsumer();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.createConsumer = function() {
		if (!this.addConsumerForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/consumer/new",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : $scope.newconsumer
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.searchConsumer();
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#createConsumerModal')).modal(
				'hide');
	}
	$scope.updateBulkConsumerUploads = function() {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/consumer/bulk/uploads/all",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(bulkConsumerUploads) {
			$rootScope.bulkConsumerUploads = bulkConsumerUploads.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.uploadConsumers = function(files) {
		if (!confirm('Upload Consumers?')) {
			return false;
		}
		var fd = new FormData();
		fd.append("consumers", files[0]);
		$http.post($rootScope.appUrl + "/consumer/bulk/upload", fd, {
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
		angular.element(document.querySelector('#bulkConsumerUploadModal')).modal('hide');
	}
	$rootScope.fetchFlags = function() {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/consumer/flags",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(flags) {
            $rootScope.flags = flags.data;
            $rootScope.updateFlags = flags.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.addFlag = function(consumerId, newFlag) {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/consumer/flag/new/" + consumerId,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
            data: newFlag
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.searchConsumer();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
    $scope.deleteFlag = function(consumerId, flagId) {
		if (!confirm('Delete flag?')) {
			return false;
		}
		var req = {
			method : 'GET',
            url: $rootScope.appUrl + "/consumer/flag/delete/" + consumerId + "/" + flagId,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			}
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.searchConsumer();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.updateEditAddress = function(addressType) {
		if(addressType == 'BILLING') {
			$rootScope.editAddress = angular.copy(this.consumer.billingAddress);
		} else {
			$rootScope.editAddress = angular.copy(this.consumer.shippingAddress);
		}
		if($rootScope.editAddress == null) {
			$rootScope.editAddress = {};
		}
		$rootScope.editAddress.type = addressType;
		$rootScope.editAddress.consumerId = this.consumer.id;
	}
	$scope.copyBillingAddress = function() {
		if (!confirm('Copy billing address to shipping?')) {
			return false;
		}
		$rootScope.editAddress = angular.copy(this.consumer.billingAddress);
		if($rootScope.editAddress == null) {
			return;
		}
		$rootScope.editAddress.id = null;
		$rootScope.editAddress.type = 'SHIPPING';
		$rootScope.editAddress.consumerId = this.consumer.id;
		$scope.saveAddress($rootScope.editAddress, true);
	}
	$scope.saveAddress = function(editAddress, isCopy) {
		if (!isCopy && !this.editAddressForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/consumer/address/update/" + editAddress.consumerId,
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : editAddress
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.searchConsumer();
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#editConAddressModal')).modal('hide');
	}
	$scope.updateInvoiceConsumer = function(consumer) {
		$rootScope.saveinvoice = angular.copy($rootScope.newinvoice);
		$rootScope.saveinvoice.consumer = angular.copy(consumer);
	}
	$scope.seachConInvoice = function(consumer) {
		$rootScope.searchConsumerInvoices(consumer);
	}
	$scope.addFilter = function(newFilter) {
		if(newFilter.name == null || newFilter.name == "") {
			return;
		}
		$rootScope.searchConsumerReq.flagList.push(angular.copy(newFilter));
		this.newFilter = {"name":""};
	}
	$scope.deleteFilter = function(pos) {
		$rootScope.searchConsumerReq.flagList.splice(pos, 1);
	}
	$scope.addUpdateFilter = function(updateFilter) {
		if(updateFilter.name == null || updateFilter.name == "") {
			return;
		}
		$rootScope.updateConsumerReq.flagList.push(angular.copy(updateFilter));
		this.updateFilter = {"name":""};
	}
	$scope.deleteUpdateFilter = function(pos) {
		$rootScope.updateConsumerReq.flagList.splice(pos, 1);
	}
	$scope.addNewFlag = function(newFlag) {
        if (newFlag.name == null || newFlag.name == "") {
			return;
		}
        $scope.newconsumer.flags.push(angular.copy(newFlag));
	}
	$scope.removeNewFlag = function(pos) {
		$scope.newconsumer.flags.splice(pos, 1);
	}
	$scope.clearConsumerSearch = function() {
        $rootScope.searchConsumerReq = {
            "name" : "",
			"email" : "",
			"mobile" : "",
			"flagList" : []
		}
    }
});