'use strict'

angular.module('controllers', [])
//投票列表
.controller('PollListCtrl', function($scope, Poll){
	Poll.all().then(function(data){
		$scope.polls = data;
	});
})
//投票详情
.controller('PollItemCtrl', function($scope, $routeParams, socket, Poll){
	Poll.get($routeParams.pollId).then(function(data){
		$scope.poll = data;
	})
	//监听当前用户
	socket.on('myvote', function(data){
		console.dir(data);
		if(data._id === $routeParams.pollId){
			$scope.poll = data;
		}
	});
	//监听投票后的数据
	socket.on('vote', function(data){
		console.dir(data);
		if(data._id === $routeParams.pollId){
			$scope.poll.choices = data.choices;
			$scope.poll.totalVotes = data.totalVotes;
		}
	});
	//投票
	$scope.vote = function(){
		var pollId = $scope.poll._id,
			choiceId = $scope.poll.userVote;
		if(choiceId){
			var voteObj = {
				poll_id : pollId,
				choice: choiceId
			}
			socket.emit('send:vote', voteObj);
		}else{
			alert('请选择一个选项');
		}
	};
})
//创建新的投票
.controller('PollNewCtrl', function($scope, $location, Poll){
	$scope.poll = {
		question: '',
		choices: [
		{ text: '' },
		{ text: '' },
		{ text: '' }
		]
	};
	//增加选项
	$scope.addChoice = function(){
		$scope.poll.choices.push({ text: '' });
	};
	//创建投票
	$scope.createPoll = function(){
		var poll = $scope.poll;
		if(poll.question.length > 0){
			var choiceCount = 0;
			poll.choices.forEach(function(choice, index) {
				if(choice.text.length > 0){
					choiceCount++;
				}
			});
			if(choiceCount > 1){
				var newPoll = $scope.poll;
				Poll.save(newPoll).then(function(){
					$location.path('polls');
				})
			}else{
				alert('请填写一个以上选项');
			}
		}else{
			alert('请填写详细信息');
		}
	};
});