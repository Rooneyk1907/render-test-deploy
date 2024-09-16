const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

const phoneValidator = (number) => {
	console.log('number[2]', number[2])
	console.log('number[3]', number[3])
	console.log('number.split(-).length', number.split('-').length)
	if (
		number.length > 8 &&
		(number[2] === '-' || number[3] === '-') &&
		number.split('-').length === 2
	) {
		return (message = 'success')
	} else {
		throw new Error(
			'Phone number improperly formatted. Phone number should be 8 digits and include "-"'
		)
	}
}

console.log('connecting to', url)

mongoose
	.connect(url)
	.then((result) => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB: ', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		validate: phoneValidator,
		required: true,
	},
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Person', personSchema)
