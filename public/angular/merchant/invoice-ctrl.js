app.controller('InvoiceController', function($scope, $rootScope, envService, $http, $cookies, $httpParamSerializer) {
	var dateNow = moment().toDate();
	var dateStart = moment().subtract(30, 'day').toDate();
	$rootScope.searchInvoiceReq = {
		"createdFrom" : dateStart,
		"createdTo" : dateNow
	}
	$rootScope.markpaid = {
		"paidDate" : dateNow
	}
	$rootScope.searchInvoice = function() {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/search/invoice",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : $scope.searchInvoiceReq
		}
		$http(req).then(function(invoices) {
			$rootScope.invoiceList = invoices.data;
			$scope.loadInvoicePage(1);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.setConsumer = function(newcon, from) {
		if(from == "EMAIL") {
			var email = newcon.email;
			for(var index in $rootScope.consumerList) {
				var consumer = $rootScope.consumerList[index];
				if(consumer.email == email){
					newcon.email = consumer.email;
					newcon.mobile = consumer.mobile;
					newcon.name = consumer.name;
					break;
				}
			}
		} else if(from == "MOBILE") {
			var mobile = newcon.mobile;
			for(var index in $rootScope.consumerList) {
				var consumer = $rootScope.consumerList[index];
				if(consumer.mobile == mobile){
					newcon.email = consumer.email;
					newcon.mobile = consumer.mobile;
					newcon.name = consumer.name;
					break;
				}
			}
		} else if(from == "NAME") {
			var name = newcon.name;
			for(var index in $rootScope.consumerList) {
				var consumer = $rootScope.consumerList[index];
				if(consumer.name == name){
					newcon.email = consumer.email;
					newcon.mobile = consumer.mobile;
					newcon.name = consumer.name;
					break;
				}
			}
		}
	}
	$scope.setInventory = function(item, from) {
		if(from == "CODE") {
			for(var index in $rootScope.inventoryList) {
				var invn = $rootScope.inventoryList[index];
				if(invn.code == item.inventory.code){
					item.inventory.name = invn.name;
					item.inventory.rate = invn.rate;
					for(var tax in $rootScope.taxList) {
						if(invn.tax.id == $rootScope.taxList[tax].id) {
							item.tax = $rootScope.taxList[tax];
							break;
						}
					}
					break;
				}
			}
		} else {
			for(var index in $rootScope.inventoryList) {
				var invn = $rootScope.inventoryList[index];
				if(invn.name == item.inventory.name){
					item.inventory.code = invn.code;
					item.inventory.rate = invn.rate;
					for(var tax in $rootScope.taxList) {
						if(invn.tax.id == $rootScope.taxList[tax].id) {
							item.tax = $rootScope.taxList[tax];
							break;
						}
					}
					break;
				}
			}
		}
		$rootScope.calculateTotal();
		$rootScope.calculateNoteTotal();
	}
	$scope.loadInvoicePage = function(page) {
		var pageSize = 15;
		$rootScope.invoiceResp = {};
		$rootScope.invoiceResp.invoiceList = angular
				.copy($rootScope.invoiceList);
		$rootScope.invoiceResp.invoiceList.splice(pageSize * page,
				$rootScope.invoiceList.length - pageSize);
		$rootScope.invoiceResp.invoiceList.splice(0, pageSize * (page - 1));
		$rootScope.invoiceResp.page = page;
		$rootScope.invoiceResp.allPages = [];
		var noOfPages = $rootScope.invoiceList.length / pageSize;
		if ($rootScope.invoiceList.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.invoiceResp.allPages.push(i);
		}
	}
	$scope.updateInvoiceInfo = function(invoice) {
		$rootScope.invoiceInfo = angular.copy(invoice);
	}
	$scope.updateInvoiceNote = function(invoice) {
        $rootScope.newInvoioceNote = {
            "invoiceCode": "",
            "noteDate": dateNow,
			"items" : [],
			"total" : 0.00,
			"payAmount" : 0,
			"currency" : "INR",
			"refundCreditNote" : $rootScope.merchant.invoiceSetting.refundCreditNote
		}
        $rootScope.newInvoioceNote.invoiceCode = invoice.invoiceCode;
	}
	$rootScope.updateSaveInvoice = function(invoice) {
		$rootScope.saveinvoice = angular.copy(invoice);
		if(invoice.id != null) {
			$rootScope.saveinvoice.update = true;
		} else {
			$rootScope.saveinvoice.update = false;
		}
		$rootScope.setTaxForInvoice();
		$rootScope.calculateTotal();
	}
	$rootScope.updateCloneInvoice = function(invoice) {
		$rootScope.saveinvoice = angular.copy(invoice);
		$rootScope.saveinvoice.id = null;
		$rootScope.saveinvoice.invoiceCode = null;
		$rootScope.saveinvoice.update = false;
		$rootScope.setTaxForInvoice();
		$rootScope.calculateTotal();
	}
	$rootScope.updateMakeRecurringInvoice = function(invoice) {
		$rootScope.saveinvoice = angular.copy(invoice);
		$rootScope.saveinvoice.id = null;
		$rootScope.saveinvoice.invoiceCode = null;
		$rootScope.saveinvoice.update = false;
		$rootScope.saveinvoice.invoiceType = "RECURRING";
		$rootScope.setTaxForInvoice();
		$rootScope.calculateTotal();
	}
	$rootScope.setTaxForInvoice = function() {
		for(var index in $rootScope.saveinvoice.items) {
			for(var tax in $rootScope.taxList) {
				if($rootScope.saveinvoice.items[index].tax.id == $rootScope.taxList[tax].id) {
					$rootScope.saveinvoice.items[index].tax = $rootScope.taxList[tax];
					break;
				}
			}
		}
	}
	$scope.addItem = function() {
		if ($scope.saveinvoice.items.length < 5) {
			var inventory = {
				"name" : "",
				"rate" : 0
			}
			$scope.saveinvoice.items.push({
				"inventory" : inventory,
				"quantity" : 1,
				"price" : 0
			});
		}
	}
	$scope.addNoteItem = function() {
		if ($rootScope.newInvoioceNote.items.length < 5) {
			var inventory = {
				"name" : "",
				"rate" : 0
			}
            $rootScope.newInvoioceNote.items.push({
				"inventory" : inventory,
				"quantity" : 1,
				"price" : 0
			});
		}
	}
	$scope.addItemXs = function(item) {
		if ($scope.saveinvoice.items.length < 5) {
			var inventory = {
				"code" : item.inventory.code,
				"name" : item.inventory.name,
				"rate" : item.inventory.rate
			}
			$scope.saveinvoice.items.push({
				"inventory" : inventory,
				"quantity" : item.quantity,
				"tax" : item.tax,
				"price" : 0
			});
		}
		angular.element(document.querySelector('#addInvoiceItemXsModal')).modal('hide');
		angular.element(document.querySelector('#createInvoiceXsModal')).modal('show');
		$scope.calculateTotal();
	}
	$scope.deleteItem = function(pos) {
		$scope.saveinvoice.items.splice(pos, 1);
		$scope.calculateTotal();
	}
	$scope.deleteNoteItem = function(pos) {
        $rootScope.newInvoioceNote.items.splice(pos, 1);
		$rootScope.calculateNoteTotal();
	}
	$rootScope.calculateTotal = function() {
		var totalPrice = 0;
		var totalRate = 0;
		if($scope.saveinvoice.addItems) {
			for ( var item in $scope.saveinvoice.items) {
				var itemTax = 0;
				if ($scope.saveinvoice.items[item].inventory.rate == null) {
					$scope.saveinvoice.items[item].inventory.rate = 0;
				}
				if ($scope.saveinvoice.items[item].quantity == null) {
					$scope.saveinvoice.items[item].quantity = 0;
				}
				if ($scope.saveinvoice.items[item].tax != null) {
					itemTax = parseFloat($scope.saveinvoice.items[item].tax.value).toFixed(2);
				}
				var itemTotal = parseFloat((parseFloat($scope.saveinvoice.items[item].inventory.rate)
						* parseFloat($scope.saveinvoice.items[item].quantity)).toFixed(2));
				$scope.saveinvoice.items[item].price = parseFloat((itemTotal + parseFloat((itemTotal * itemTax) / 100)).toFixed(2));
				totalRate = totalRate + itemTotal;
				totalPrice = totalPrice + parseFloat($scope.saveinvoice.items[item].price);
			}
			$scope.saveinvoice.total = parseFloat(totalRate.toFixed(2));
			$scope.saveinvoice.totalPrice = parseFloat(totalPrice.toFixed(2));
		} else {
			totalPrice = $scope.saveinvoice.total;
			$scope.saveinvoice.totalPrice = parseFloat(totalPrice.toFixed(2));
		}
		if ($scope.saveinvoice.shipping == null) {
			$scope.saveinvoice.shipping = 0;
		}
		if ($scope.saveinvoice.discount == null) {
			$scope.saveinvoice.discount = 0;
		}
		$scope.saveinvoice.payAmount = parseFloat((totalPrice
				+ parseFloat($scope.saveinvoice.shipping)
				- parseFloat($scope.saveinvoice.discount)).toFixed(2));
	}
	$rootScope.calculateNoteTotal = function() {
		var totalPrice = 0;
		var totalRate = 0;
		for ( var item in $rootScope.newInvoioceNote.items) {
			var itemTax = 0;
			if ($rootScope.newInvoioceNote.items[item].inventory.rate == null) {
				$rootScope.newInvoioceNote.items[item].inventory.rate = 0;
			}
			if ($rootScope.newInvoioceNote.items[item].quantity == null) {
				$rootScope.newInvoioceNote.items[item].quantity = 0;
			}
			if ($rootScope.newInvoioceNote.items[item].tax != null) {
				itemTax = parseFloat($rootScope.newInvoioceNote.items[item].tax.value).toFixed(2);
			}
			var itemTotal = parseFloat((parseFloat($rootScope.newInvoioceNote.items[item].inventory.rate)
					* parseFloat($rootScope.newInvoioceNote.items[item].quantity)).toFixed(2));
			$rootScope.newInvoioceNote.items[item].price = parseFloat((itemTotal + parseFloat((itemTotal * itemTax) / 100)).toFixed(2));
			totalRate = totalRate + itemTotal;
			totalPrice = totalPrice + parseFloat($rootScope.newInvoioceNote.items[item].price);
		}
		if ($rootScope.newInvoioceNote.adjustment == null) {
			$rootScope.newInvoioceNote.adjustment = 0;
		}
		$rootScope.newInvoioceNote.total = parseFloat(totalRate.toFixed(2));
		$rootScope.newInvoioceNote.totalPrice = parseFloat(totalPrice.toFixed(2));
		$rootScope.newInvoioceNote.payAmount = parseFloat((totalPrice + parseFloat($rootScope.newInvoioceNote.adjustment)).toFixed(2));
	}
	$scope.createInvoice = function() {
		if(!this.createInvoiceForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/new",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : this.saveinvoice
		}
		$http(req).then(function(invoice) {
			$rootScope.searchInvoice();
			$scope.serverMessage(invoice);
			if(invoice.data.invoiceType == 'SINGLE') {
				$rootScope.invoiceInfo = angular.copy(invoice.data);
				angular.element(document.querySelector('#invoiceNotifyModal')).modal('show');
			} else if(invoice.data.invoiceType == 'RECURRING') {
				$scope.updateRecurrInvoiceInfo(invoice.data);
				angular.element(document.querySelector('#recurrInvoiceModal')).modal('show');
			}
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#createInvoiceModal')).modal('hide');
		angular.element(document.querySelector('#createInvoiceXsModal')).modal('hide');
	}
	$scope.createNote = function() {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/note/new",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : $rootScope.newInvoioceNote
		}
		$http(req).then(function(data) {
			$rootScope.searchInvoice();
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#createInvoiceNoteModal')).modal('hide');
	}
	$scope.updateInvoicePayInfo = function(invoice) {
		$rootScope.invoicePayInfo = angular.copy(invoice);
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/invoice/payments/" + invoice.invoiceCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(allPayments) {
			$rootScope.invoicePayInfo.allPayments = allPayments.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.enquireInvoice = function(invoiceCode) {
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/invoice/enquire/" + invoiceCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(data) {
			$rootScope.searchInvoice();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.notifyInvoice = function(invoiceCode) {
		if(!this.invoiceNotifyForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/notify/" + invoiceCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : $scope.invoiceNotify
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#invoiceNotifyModal')).modal('hide');
	}
	$scope.expireInvoice = function(invoiceCode) {
		if (!confirm('Expire ' + invoiceCode + ' ?')) {
			return false;
		}
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/invoice/expire/" + invoiceCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(data) {
			$rootScope.searchInvoice();
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.refundInvoice = function(invoiceCode, refundAmount) {
		if(refundAmount == undefined) {
			return false;
		}
		if (!confirm('Refund ' + invoiceCode + ' with amount ' + refundAmount + ' ?')) {
			return false;
		}
		var refundRequest = {};
		refundRequest.amount = refundAmount;
		refundRequest.invoiceCode = invoiceCode;
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/refund",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token"),
		        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
			},
			data : $httpParamSerializer(refundRequest)
		}
		$http(req).then(function(data) {
			$rootScope.searchInvoice();
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#invoiceRefundModal')).modal('hide');
	}
	$scope.markPaidInvoice = function(invoiceCode) {
		if(!this.markPaidForm.$valid) {
			return false;
		}
		this.markpaid.invoiceCode = invoiceCode;
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/markpaid",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : this.markpaid
		}
		$http(req).then(function(data) {
			$rootScope.searchInvoice();
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#markInvoicePaidModal')).modal('hide');
	}
	$scope.uploadAttachment = function(files) {
		if (!confirm('Upload Attachment?')) {
			return false;
		}
		var invoiceCode = this.invoiceInfo.invoiceCode;
		var fd = new FormData();
		fd.append("attach", files[0]);
		$http.post($rootScope.appUrl + "/invoice/"+invoiceCode+"/attachment/new", fd, {
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
		angular.element(document.querySelector('#invoiceAttachmentModal')).modal('hide');
		$rootScope.searchInvoice();
	}
	$scope.createChildInvoice = function(invoiceCode) {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/bulk/child/"+invoiceCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : this.childInvoiceReq
		}
		$http(req).then(function(invoice) {
			$rootScope.searchInvoice();
			$scope.serverMessage(invoice);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#childInvoiceModal')).modal('hide');
	}
	$scope.createFlagInvoice = function(invoiceCode) {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/bulk/flag/"+invoiceCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : this.childInvoiceReq
		}
		$http(req).then(function(invoice) {
			$rootScope.searchInvoice();
			$scope.serverMessage(invoice);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#childInvoiceModal')).modal('hide');
	}
	$scope.uploadConsumers = function(files) {
		if (!confirm('Upload Consumers?')) {
			return false;
		}
		var invoiceCode = this.bulkInvoiceInfo.invoiceCode;
		var fd = new FormData();
		fd.append("consumers", files[0]);
		$http.post($rootScope.appUrl + "/invoice/bulk/upload/"+invoiceCode, fd, {
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
		angular.element(document.querySelector('#bulkInvoiceUploadModal')).modal('hide');
	}
	$rootScope.clearInvoiceSearch = function() {
		$rootScope.searchInvoiceReq.parentInvoiceCode = '';
		$rootScope.searchInvoiceReq.invoiceType = null;
		$rootScope.searchInvoiceReq.email = '';
		$rootScope.searchInvoiceReq.mobile = '';
		$rootScope.searchInvoiceReq.invoiceCode = '';
		$rootScope.searchInvoiceReq.invoiceStatus = null;
		$rootScope.searchInvoiceReq.itemCode = '';
	}
	$scope.searchChildInvoices = function(invoiceCode) {
		$rootScope.clearInvoiceSearch();
		$rootScope.searchInvoiceReq.parentInvoiceCode = invoiceCode;
		$rootScope.searchInvoice();
	}
	$rootScope.searchConsumerInvoices = function(consumer) {
		$rootScope.clearInvoiceSearch();
		$rootScope.searchInvoiceReq.email = consumer.email;
		$rootScope.searchInvoiceReq.mobile = consumer.mobile;
		$rootScope.searchInvoice();
	}
	$scope.updateRecurrInvoiceInfo = function(invoice) {
		$rootScope.recurrInvoiceInfo = angular.copy(invoice);
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/invoice/recurr/all/"+invoice.invoiceCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(recurrInvoices) {
			$rootScope.recurrInvoices = recurrInvoices.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
		$rootScope.recurringInvoice = {
			"startDate" : dateNow,
			"recurr" : 'MONTHLY',
			"total" : 12
		}
	}
	$scope.updateBulkInvoiceInfo = function(invoice) {
		$rootScope.bulkInvoiceInfo = angular.copy(invoice);
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/invoice/bulk/uploads/all/"+invoice.invoiceCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(bulkUploads) {
			$rootScope.bulkUploads = bulkUploads.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
		
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/invoice/bulk/flags/"+invoice.invoiceCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(bulkflags) {
            $rootScope.bulkFlags = bulkflags.data;
			$rootScope.fetchFlags();
		}, function(data) {
			$scope.serverMessage(data);
		});

		$rootScope.childInvoiceReq = {
			"flagList" : [],
			"invoiceType" : "SINGLE",
			"recInv" : {
				"startDate" : dateNow,
				"recurr" : 'MONTHLY',
				"total" : 12
			}
		}
	}
	$scope.fetchFlagConsumer = function() {
		$rootScope.searchConsumerReq = {
			"email" : "",
			"mobile" : "",
			"flagList" : $rootScope.childInvoiceReq.flagList
		}
		$rootScope.searchConsumer();
	}
	$scope.recurrInvoice = function(invoiceCode) {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/invoice/recurr/new/"+invoiceCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : this.recurringInvoice
		}
		$http(req).then(function(data) {
			$rootScope.searchInvoice();
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#recurrInvoiceModal')).modal('hide');
	}
	$scope.fetchTimelines = function(invoice) {
		$rootScope.timelineInvoice = invoice;
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/common/timeline/INVOICE/"+invoice.id,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(timelines) {
			$rootScope.timelineList = timelines.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.addCommentInvoice = function(objectId) {
		var timeline = {};
		timeline.objectId = objectId;
		timeline.message = this.newInvComment;
		timeline.objectType = 'INVOICE';
		var req = {
			method : 'PUT',
			url : $rootScope.appUrl + "/common/timeline/new",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : timeline
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#invoiceTimelineModal')).modal('hide');
		this.newInvComment = "";
	}
	$scope.addFilter = function(newFilter) {
		if(newFilter.name == null || newFilter.name == "") {
			return;
		}
		$rootScope.childInvoiceReq.flagList.push(angular.copy(newFilter));
		this.newFilter = {"name":""};
	}
	$scope.deleteFilter = function(pos) {
		$rootScope.childInvoiceReq.flagList.splice(pos, 1);
	}
});