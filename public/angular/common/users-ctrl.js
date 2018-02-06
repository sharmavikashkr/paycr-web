app.controller('UsersController', function($scope, $rootScope, envService, $http, $cookies) {
	$rootScope.fetchMyUsers = function() {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/user/getAll",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(myusers) {
			$rootScope.myusers = myusers.data;
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
	$scope.createUser = function() {
		if (!this.addUserForm.$valid) {
			return false;
		}
		var req = {
			method : 'POST',
			url : envService.read('apiUrl') + "/user/new",
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			},
			data : this.newuser
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.fetchMyUsers();
		}, function(data) {
			$scope.serverMessage(data);
		});
		angular.element(document.querySelector('#createUserModal'))
				.modal('hide');
	}
	$scope.toggleUser = function(userId) {
		var req = {
			method : 'GET',
			url : envService.read('apiUrl') + "/user/toggle/" + userId,
			headers : {
				"Authorization" : "Bearer "
						+ $cookies.get("access_token")
			}
		}
		$http(req).then(function(data) {
			$scope.serverMessage(data);
			$scope.fetchMyUsers();
		}, function(data) {
			$scope.serverMessage(data);
		});
	}
});