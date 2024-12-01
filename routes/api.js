/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI);

const book = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: [
    {
      type: String
    }
  ]
});

const Book = mongoose.model('Book', book);

module.exports = (app) => {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = (await Book.find()).map(item => {
        let book = item.toObject();
        book.commentcount = book.comments.length;
        return book;
      });
      res.json(books);
    })
    
    .post(async (req, res) => {
      //response will contain new book object including atleast _id and title
      if (!req.body.title) {
        return res.send('missing required field title');
      }
      const book = new Book(req.body);
      await book.save();
      res.json(book);
    })
    
    .delete(async(req, res) => {
      //if successful response will be 'complete delete successful'
      await Book.deleteMany();
      res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let book = await Book.findById(req.params.id);
      if (book) {
        res.json(book);
      } else {
        res.send('no book exists');
      }
    })
    
    .post(async(req, res) => {
      //json res format same as .get
      if (!req.body.comment) {
        return res.send('missing required field comment');
      }
      let book = await Book.findById(req.params.id);
      if (!book) {
        return res.send('no book exists');
      }
      book.comments.push(req.body.comment);
      await book.save();
      res.json(book);
    })
    
    .delete(async(req, res) => {
      //if successful response will be 'delete successful'
      let result = await Book.deleteOne({ _id: req.params.id });
      if (result.deletedCount) {
        res.send('delete successful');
      } else {
        res.send('no book exists');
      }
    });
  
};
