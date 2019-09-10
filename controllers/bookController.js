const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

const async = require("async");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

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
      res.render("book_list", { title: "Book List", book_list: list_books });
    });
};

// display book detail page
exports.book_detail = (req, res, next) => {
  async.parallel(
    {
      book: callback => {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },

      book_instance: callback => {
        BookInstance.find({ book: req.params.id }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // no results
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      // success
      res.render("book_detail", {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance
      });
    }
  );
};

// display create book instance page
exports.book_create_get = (req, res, next) => {
  async.parallel(
    {
      authors: callback => {
        Author.find(callback);
      },
      genres: callback => {
        Genre.find(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("book_form", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres
      });
    }
  );
};

// handle book create POST
exports.book_create_post = [
  // validate fields
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 }),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 }),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 }),
  body("isbn", "ISBN must not be empty.")
    .trim()
    .isLength({ min: 1 }),

  // sanitize fields
  sanitizeBody(["title", "author", "summary", "isbn"]).escape(),
  sanitizeBody("genre.*").escape(),

  // process request after validation and sanitization
  (req, res, next) => {
    // get any validation errors
    const errors = validationResult(req);

    // convert genre to array
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }

    // create Book object
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre
    });

    if (!errors.isEmpty()) {
      // re-render form with errors

      // get authors & genres to populate form
      async.parallel(
        {
          authors: callback => {
            Author.find(callback);
          },
          genres: callback => {
            Genre.find(callback);
          }
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // mark genres selected previously as checked
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }

          res.render("book_form", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array()
          });
        }
      );
      return;
    } else {
      // valid form data
      book.save(err => {
        if (err) {
          return next(err);
        }
        // save successful
        res.redirect(book.url);
      });
    }
  }
];

// dsplay delete book instance page GET
exports.book_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: delete book GET");
};

// handle book delete POST
exports.book_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: delete book POST");
};

// dipslay update book instance page GET
exports.book_update_get = (req, res, next) => {
  // get book, authors, genres
  async.parallel(
    {
      book: callback => {
        Book.findById(req.params.id).exec(callback);
      },
      authors: callback => {
        Author.find(callback);
      },
      genres: callback => {
        Genre.find(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // no book found
        err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      // success
      // mark Book's genres as checked
      for (let i = 0; i < results.genres.length; i++) {
        if (results.book.genre.includes(results.genres[i]._id)) {
          results.genres[i].checked = true;
        }
      }

      res.render("book_form", {
        title: "Update Book",
        authors: results.authors,
        genres: results.genres,
        book: results.book
      });
    }
  );
};

// handle book update POST
exports.book_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: update book POST");
};
