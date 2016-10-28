'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//投票IP
var voteSchema = new Schema({
	ip: String
});
//选项
var choiceSchema = new Schema({
	text: String,
	votes: [voteSchema]
});
//投票详细信息
var pollSchema = new Schema({
	question: {
		type: String,
        required: true
	},
	choices: [choiceSchema],
	createdAt: {
		type : Date, 
		default: new Date()
	},
	updatedAt: {
		type: Date,
		default: new Date()
	}
});

pollSchema.pre('save', function(next){
	next();
})

pollSchema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});

module.exports = pollSchema;