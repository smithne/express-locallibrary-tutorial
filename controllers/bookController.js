const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

const async = require("async");

// catalog home page
exports.index = (req, res) => {
  async.parallel(
    {
      book_count: callback => {
        Book.countDocuments({}, callback);
      },
      book_instance_count: callback => {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count: callback => {
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count: callback => {
        Author.countDocuments({}, callback);
      },
      genre_count: callback => {
        Genre.countDocuments({}, callback);
      }
    },
    (err, results) => {
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results
      });
    }
  );
};

// display list of books
exports.book_list = (req, res, next) => {
  Book.find({}, "title author")
    .populate("author")
    .exec((err, list_books) => {
      if (err) {
        return next(err);
      }
      // success
      console.log(list_books);
      res.render("book_list", { title: "Book List", book_list: list_books });
    });
};

// display book detail page
exports.book_detail = (req, res) => {
  res.send("NOT IMPLEMENTED: book detail: " + req.params.id);
};

// display create book instance page
exports.book_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: create book GET");
};

// handle book create POST
exports.book_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: create book POST");
};

// dsplay delete book instance page GET
exports.book_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: delete book GET");
};

// handle book delete POST
exports.book_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: delete book POST");
};

// dipslay update book instance page GET
exports.book_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: update book GET");
};

// handle book update POST
exports.book_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: update book POST");
};
