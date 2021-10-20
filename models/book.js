const {Schema, model} = require('mongoose');

const bookSchema = new Schema({
    title:{
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100
    },
    author:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    field:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    }
});

const Book = model('Book', bookSchema);

module.exports = Book;