'use strict'

angular.module('pollServices', [])
.factory('Poll', function($http, $q){
	return {
		all: function(){
			var delay = $q.defer();
			$http.get('/polls').success(function(response){
				delay.resolve(response);
			}).error(function(){
				delay.reject("Can't get polls data.");
			})
			return delay.promise;
		},
		get: function(pollId){
			var delay = $q.defer();
			$http.get('/poll/' + pollId).success(function(response){
				delay.resolve(response);
			}).error(function(){
				delay.reject("Can't get pollId " + pollId + " data.");
			})
			return delay.promise;
		},
		save: function(poll){
			var delay = $q.defer();
			$http.post('/pollAdd', poll).success(function(){
				delay.resolve();
			}).error(function(){
				delay.reject("Can't save the data.");
			})
			return delay.promise;
		}
	}
})
//webSocket定义
.factory('socket', function($rootScope){
	var socket = io.connect();
	return {
		on: function(eventName, callback){
			socket.on(eventName, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback){
			socket.emit(eventName, data, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					if(callback){
						callback.apply(socket, args);
					}
				});
			});
		}
	}
});