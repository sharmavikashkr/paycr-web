app.controller('ExpenseController', function($scope, $rootScope, envService, $http, $cookies, $httpParamSerializer) {
	var dateNow = moment().toDate();
	var dateStart = moment().subtract(30, 'day').toDate();
	$rootScope.searchExpenseReq = {
		"createdFrom" : dateStart,
		"createdTo" : dateNow
	}
	$rootScope.markpaid = {
		"paidDate" : dateNow
	}
	$rootScope.searchExpense = function() {
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/expense/search/expense",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token")
			},
			data : $scope.searchExpenseReq
		}
		$http(req).then(function(expenses) {
			$rootScope.expenseList = expenses.data;
			$scope.loadExpensePage(1);
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.setSupplier = function(newsup, from) {
		if(from == "EMAIL") {
			var email = newsup.email;
			for(var index in $rootScope.supplierList) {
				var supplier = $rootScope.supplierList[index];
				if(supplier.email == email){
					newsup.email = supplier.email;
					newsup.mobile = supplier.mobile;
					newsup.name = supplier.name;
					break;
				}
			}
		} else if(from == "MOBILE") {
			var mobile = newsup.mobile;
			for(var index in $rootScope.supplierList) {
				var supplier = $rootScope.supplierList[index];
				if(supplier.mobile == mobile){
					newsup.email = supplier.email;
					newsup.mobile = supplier.mobile;
					newsup.name = supplier.name;
					break;
				}
			}
		} else if(from == "NAME") {
			var name = newsup.name;
			for(var index in $rootScope.supplierList) {
				var supplier = $rootScope.supplierList[index];
				if(supplier.name == name){
					newsup.email = supplier.email;
					newsup.mobile = supplier.mobile;
					newsup.name = supplier.name;
					break;
				}
			}
		}
	}
	$scope.setAsset = function(item, from) {
		if(from == "CODE") {
			for(var index in $rootScope.assetList) {
				var ast = $rootScope.assetList[index];
				if(ast.code == item.asset.code){
					item.asset.name = ast.name;
					item.asset.rate = ast.rate;
					for(var tax in $rootScope.taxList) {
						if(ast.tax.id == $rootScope.taxList[tax].id) {
							item.tax = $rootScope.taxList[tax];
							break;
						}
					}
					break;
				}
			}
		} else {
			for(var index in $rootScope.assetList) {
				var ast = $rootScope.assetList[index];
				if(ast.name == item.asset.name){
					item.asset.code = ast.code;
					item.asset.rate = ast.rate;
					for(var tax in $rootScope.taxList) {
						if(ast.tax.id == $rootScope.taxList[tax].id) {
							item.tax = $rootScope.taxList[tax];
							break;
						}
					}
					break;
				}
			}
        }
        $rootScope.calculateExpTotal();
        $rootScope.calculateExpNoteTotal();
	}
	$scope.loadExpensePage = function(page) {
		var pageSize = 15;
		$rootScope.expenseResp = {};
		$rootScope.expenseResp.expenseList = angular
				.copy($rootScope.expenseList);
		$rootScope.expenseResp.expenseList.splice(pageSize * page,
				$rootScope.expenseList.length - pageSize);
		$rootScope.expenseResp.expenseList.splice(0, pageSize * (page - 1));
		$rootScope.expenseResp.page = page;
		$rootScope.expenseResp.allPages = [];
		var noOfPages = $rootScope.expenseList.length / pageSize;
		if ($rootScope.expenseList.length % pageSize != 0) {
			noOfPages = noOfPages + 1;
		}
		for (var i = 1; i <= noOfPages; i++) {
			$rootScope.expenseResp.allPages.push(i);
		}
	}
	$scope.updateExpenseInfo = function(expense) {
		$rootScope.expenseInfo = angular.copy(expense);
    }
    $scope.updateExpenseNote = function (expense) {
        $rootScope.newExpenseNote = {
            "expenseCode": "",
            "noteDate": dateNow,
            "items": [],
            "total": 0.00,
            "payAmount": 0,
            "currency": "INR"
        }
        $rootScope.newExpenseNote.expenseCode = expense.expenseCode;
    }
	$rootScope.updateSaveExpense = function(expense) {
		$rootScope.saveexpense = angular.copy(expense);
		if(expense.id != null) {
			$rootScope.saveexpense.update = true;
		} else {
			$rootScope.saveexpense.update = false;
		}
		$rootScope.setTaxForExpense();
		$rootScope.calculateExpTotal();
    }
    $rootScope.updateCloneExpense = function (expense) {
        $rootScope.saveexpense = angular.copy(expense);
        $rootScope.saveexpense.id = null;
        $rootScope.saveexpense.invoiceCode = null;
        $rootScope.saveexpense.update = false;
        $rootScope.setTaxForExpense();
        $rootScope.calculateExpTotal();
    }
	$rootScope.setTaxForExpense = function() {
		for(var index in $rootScope.saveexpense.items) {
			for(var tax in $rootScope.taxList) {
				if($rootScope.saveexpense.items[index].tax.id == $rootScope.taxList[tax].id) {
					$rootScope.saveexpense.items[index].tax = $rootScope.taxList[tax];
					break;
				}
			}
		}
	}
	$scope.addItem = function() {
		if ($scope.saveexpense.items.length < 5) {
			var asset = {
				"name" : "",
				"rate" : 0
			}
			$scope.saveexpense.items.push({
				"asset" : asset,
				"quantity" : 1,
				"price" : 0
			});
		}
    }
    $scope.addExpNoteItem = function () {
        if ($rootScope.newExpenseNote.items.length < 5) {
            var asset = {
                "name": "",
                "rate": 0
            }
            $rootScope.newExpenseNote.items.push({
                "asset": asset,
                "quantity": 1,
                "price": 0
            });
        }
    }
	$scope.addItemXs = function(item) {
		if ($scope.saveexpense.items.length < 5) {
			var asset = {
				"code" : item.asset.code,
				"name" : item.asset.name,
				"rate" : item.asset.rate
			}
			$scope.saveexpense.items.push({
				"asset" : asset,
				"quantity" : item.quantity,
				"tax" : item.tax,
				"price" : 0
			});
		}
		angular.element(document.querySelector('#addExpenseItemXsModal')).modal('hide');
		angular.element(document.querySelector('#createExpenseXsModal')).modal('show');
		$scope.calculateExpTotal();
	}
	$scope.deleteItem = function(pos) {
		$scope.saveexpense.items.splice(pos, 1);
		$scope.calculateExpTotal();
    }
    $scope.deleteExpNoteItem = function (pos) {
        $rootScope.newExpenseNote.items.splice(pos, 1);
        $rootScope.calculateExpNoteTotal();
    }
	$rootScope.calculateExpTotal = function() {
		var totalPrice = 0;
		var totalRate = 0;
		if($scope.saveexpense.addItems) {
			for ( var item in $scope.saveexpense.items) {
				var itemTax = 0;
				if ($scope.saveexpense.items[item].asset.rate == null) {
					$scope.saveexpense.items[item].asset.rate = 0;
				}
				if ($scope.saveexpense.items[item].quantity == null) {
					$scope.saveexpense.items[item].quantity = 0;
				}
				if ($scope.saveexpense.items[item].tax != null) {
					itemTax = parseFloat($scope.saveexpense.items[item].tax.value).toFixed(2);
				}
				var itemTotal = parseFloat((parseFloat($scope.saveexpense.items[item].asset.rate)
						* parseFloat($scope.saveexpense.items[item].quantity)).toFixed(2));
				$scope.saveexpense.items[item].price = parseFloat((itemTotal + parseFloat((itemTotal * itemTax) / 100)).toFixed(2));
				totalRate = totalRate + itemTotal;
				totalPrice = totalPrice + parseFloat($scope.saveexpense.items[item].price);
			}
			$scope.saveexpense.total = parseFloat(totalRate.toFixed(2));
			$scope.saveexpense.totalPrice = parseFloat(totalPrice.toFixed(2));
		} else {
			totalPrice = $scope.saveexpense.total;
			$scope.saveexpense.totalPrice = parseFloat(totalPrice.toFixed(2));
		}
		if ($scope.saveexpense.shipping == null) {
			$scope.saveexpense.shipping = 0;
		}
		if ($scope.saveexpense.discount == null) {
			$scope.saveexpense.discount = 0;
		}
		$scope.saveexpense.payAmount = parseFloat((totalPrice
				+ parseFloat($scope.saveexpense.shipping)
				- parseFloat($scope.saveexpense.discount)).toFixed(2));
    }
    $rootScope.calculateExpNoteTotal = function () {
        var totalPrice = 0;
        var totalRate = 0;
        for (var item in $rootScope.newExpenseNote.items) {
            var itemTax = 0;
            if ($rootScope.newExpenseNote.items[item].asset.rate == null) {
                $rootScope.newExpenseNote.items[item].asset.rate = 0;
            }
            if ($rootScope.newExpenseNote.items[item].quantity == null) {
                $rootScope.newExpenseNote.items[item].quantity = 0;
            }
            if ($rootScope.newExpenseNote.items[item].tax != null) {
                itemTax = parseFloat($rootScope.newExpenseNote.items[item].tax.value).toFixed(2);
            }
            var itemTotal = parseFloat((parseFloat($rootScope.newExpenseNote.items[item].asset.rate)
                * parseFloat($rootScope.newExpenseNote.items[item].quantity)).toFixed(2));
            $rootScope.newExpenseNote.items[item].price = parseFloat((itemTotal + parseFloat((itemTotal * itemTax) / 100)).toFixed(2));
            totalRate = totalRate + itemTotal;
            totalPrice = totalPrice + parseFloat($rootScope.newExpenseNote.items[item].price);
        }
        if ($rootScope.newExpenseNote.adjustment == null) {
            $rootScope.newExpenseNote.adjustment = 0;
        }
        $rootScope.newExpenseNote.total = parseFloat(totalRate.toFixed(2));
        $rootScope.newExpenseNote.totalPrice = parseFloat(totalPrice.toFixed(2));
        $rootScope.newExpenseNote.payAmount = parseFloat((totalPrice + parseFloat($rootScope.newExpenseNote.adjustment)).toFixed(2));
    }
	$scope.createExpense = function() {
		if(!this.createExpenseForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/expense/new",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : this.saveexpense
		}
		$http(req).then(function(expense) {
			$rootScope.searchExpense();
			$scope.serverMessage(expense);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#createExpenseModal')).modal('hide');
		angular.element(document.querySelector('#createExpenseXsModal')).modal('hide');
    }
    $scope.deleteExpense = function (expenseCode) {
        if (!confirm('Delete ' + expenseCode + ' ?')) {
            return false;
        }
        var req = {
            method: 'GET',
            url: $rootScope.appUrl + "/expense/delete/" + expenseCode,
            headers: {
                "Authorization": "Bearer "
                + $cookies.get("access_token")
            }
        }
        $http(req).then(function (data) {
            $rootScope.searchExpense();
            $scope.serverMessage(data);
        }, function (data) {
            $scope.serverMessage(data);
        });
    }
    $scope.createExpNote = function () {
        var req = {
            method: 'POST',
            url: $rootScope.appUrl + "/expense/note/new",
            headers: {
                "Authorization": "Bearer "
                + $cookies.get("access_token")
            },
            data: $rootScope.newExpenseNote
        }
        $http(req).then(function (data) {
            $rootScope.searchExpense();
            $scope.serverMessage(data);
        }, function (data) {
            $scope.serverMessage(data);
        });
        angular.element(document.querySelector('#createExpenseNoteModal')).modal('hide');
    }
	$scope.updateExpensePayInfo = function(expense) {
		$rootScope.expensePayInfo = angular.copy(expense);
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/expense/payments/" + expense.expenseCode,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(allPayments) {
			$rootScope.expensePayInfo.allPayments = allPayments.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.refundExpense = function(expenseCode, refundAmount) {
		if(refundAmount == undefined) {
			return false;
		}
		if (!confirm('Refund ' + expenseCode + ' with amount ' + refundAmount + ' ?')) {
			return false;
		}
		var refundRequest = {};
		refundRequest.amount = refundAmount;
		refundRequest.expenseCode = expenseCode;
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/expense/refund",
			headers : {
				"Authorization" : "Bearer " + $cookies.get("access_token"),
		        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
			},
			data : $httpParamSerializer(refundRequest)
		}
		$http(req).then(function(data) {
			$rootScope.searchExpense();
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#expenseRefundModal')).modal('hide');
	}
	$scope.markPaidExpense = function(expenseCode) {
		if(!this.markPaidForm.$valid) {
			return false;
		}
		this.markpaid.expenseCode = expenseCode;
		var req = {
			method : 'POST',
			url : $rootScope.appUrl + "/expense/markpaid",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : this.markpaid
		}
		$http(req).then(function(data) {
			$rootScope.searchExpense();
			$scope.serverMessage(data);
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#markExpensePaidModal')).modal('hide');
	}
	$scope.uploadAttachment = function(files) {
		if (!confirm('Upload Attachment?')) {
			return false;
		}
		var expenseCode = this.expenseInfo.expenseCode;
		var fd = new FormData();
		fd.append("attach", files[0]);
		$http.post($rootScope.appUrl + "/expense/"+expenseCode+"/attachment/new", fd, {
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
		angular.element(document.querySelector('#expenseAttachmentModal')).modal('hide');
		$rootScope.searchExpense();
	}
	$rootScope.clearExpenseSearch = function() {
		$rootScope.searchExpenseReq.email = '';
		$rootScope.searchExpenseReq.mobile = '';
		$rootScope.searchExpenseReq.expenseCode = '';
		$rootScope.searchExpenseReq.expenseStatus = null;
		$rootScope.searchExpenseReq.itemCode = '';
	}
	$rootScope.searchSupplierExpenses = function(supplier) {
		$rootScope.clearExpenseSearch();
		$rootScope.searchExpenseReq.email = supplier.email;
		$rootScope.searchExpenseReq.mobile = supplier.mobile;
		$rootScope.searchExpense();
	}
	$scope.fetchTimelines = function(expense) {
		$rootScope.timelineExpense = expense;
		var req = {
			method : 'GET',
			url : $rootScope.appUrl + "/common/timeline/EXPENSE/"+expense.id,
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
	$scope.addCommentExpense = function(objectId) {
		var timeline = {};
		timeline.objectId = objectId;
		timeline.message = this.newInvComment;
		timeline.objectType = 'EXPENSE';
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
		angular.element(document.querySelector('#expenseTimelineModal')).modal('hide');
		this.newInvComment = "";
	}
});