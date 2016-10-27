var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
	ip: String
});

var choiceSchema = new Schema({
	text: String,
	votes: [voteSchema]
});

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