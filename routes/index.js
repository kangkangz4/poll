var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/demo2');

var pollSchema = require('../models/polls');
var Poll = mongoose.model('Poll', pollSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '投票' });
});

//投票列表
router.get('/polls', function(req, res, next){
	Poll.find({}, 'question', function(error, polls){
		res.json(polls);
	})
});

//取得单一投票信息
router.get('/poll/:id', function(req, res, next){
	var pollId = req.params.id;

	Poll.findById(pollId, '', {lean: true}, function(error, poll){
		//查询单条投票信息
		if(poll){
			var userVoted = false,
				userChoice,
				totalVotes = 0;
			poll.choices.forEach(function(choice, index) {
				choice.votes.forEach(function(vote, index) {
					totalVotes++;
					if(vote.ip === (req.header('x-forwarded-for') || req.ip)){
						userVoted = true;
						userChoice = { _id: choice.id, text: choice.text };
					}
				});
			});
			poll.userVoted = userVoted;
			poll.userChoice = userChoice;
			poll.totalVotes = totalVotes;
			res.json(poll);
		}else{
			res.json({error: true});
		}
	});

});

//创建投票
router.post('/pollAdd', function(req, res, next){
	var reqBody = req.body;
	var choices = reqBody.choices.filter(function(v){
		return v.text != "";
	});
	var pollObj = {
		question: reqBody.question,
		choices: choices
	}
	var poll = new Poll(pollObj);
	poll.save(function(error, doc){
		if(error || !doc){
			res.send(error);
		}else{
			res.json(doc);
		}
	})
});

router.vote = function(socket){
	socket.on('send:vote', function(data){
		var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
		//查找当前投票
		Poll.findById(data.poll_id, function(error, poll){
			var choice = poll.choices.id(data.choice);
			choice.votes.push({ip: ip});
			poll.save(function(error, doc){
				var theDoc = {
					question: doc.question, 
					_id: doc._id, 
					choices: doc.choices,
					userVoted: false, 
					totalVotes: 0
				};
				//查询当前IP是否已经投过票
				poll.choices.forEach(function(choice, index) {
					choice.votes.forEach(function(vote, index) {
						theDoc.totalVotes++;
						theDoc.ip = ip;
						if(vote.ip === ip){
							theDoc.userVoted = true;
							theDoc.userChoice = { _id: choice._id, text: choice.text };
						}
					});
				});

				socket.emit('myvote', theDoc);
				socket.broadcast.emit('vote', theDoc);
			});
		});
	});
};

module.exports = router;
