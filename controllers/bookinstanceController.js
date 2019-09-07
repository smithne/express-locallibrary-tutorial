const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");

const { body, validationResult, sanitizeBody } = require("express-validator");

// display list of bookinstances
exports.bookinstance_list = (req, res, next) => {
  BookInstance.find()
    .populate("book")
    .exec((err, list_bookinstances) => {
      if (err) {
        return next(err);
      }
      // success
      res.render("bookinstance_list", {
        title: "Book Instance list",
        bookinstance_list: list_bookinstances
      });
    });
};

// display bookinstance detail page
exports.bookinstance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) {
        return next(err);
      }
      if (bookinstance == null) {
        // no results
        const err = new Error("Book instance not found");
        err.status = 404;
        return next(err);
      }
      // success
      res.render("bookinstance_detail", {
        title: "Copy: " + bookinstance.book.title,
        bookinstance: bookinstance
      });
    });
};

// display create book instance page
exports.bookinstance_create_get = (req, res, next) => {
  Book.find({}, "title").exec((err, books) => {
    if (err) {
      return next(err);
    }
    // success
    res.render("bookinstance_form", {
      title: "Create BookInstance",
      book_list: books
    });
  });
};

// handle bookinstance create POST
exports.bookinstance_create_post = [
  // validate fields
  body("book", "Book must be specified")
    .trim()
    .isLength({ min: 1 }),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 }),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601(),

  // sanitize fields
  sanitizeBody(["book", "imprint"]).escape(),
  sanitizeBody("status")
    .trim()
    .escape(),
  sanitizeBody("due_back").toDate(),

  // process request after validation & sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    // create new bookinstance
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if (!errors.isEmpty()) {
      // re-render form with errors
      Book.find({}, "title").exec((err, books) => {
        if (err) {
          return next(err);
        }
        // render form
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance: bookinstance
        });
      });
      return;
    } else {
      // valid form data
      bookinstance.save(err => {
        if (err) {
          return next(err);
        }
        // success -> redirect to new record
        res.redirect(bookinstance.url);
      });
    }
  }
];

// dsplay delete book instance page GET
exports.bookinstance_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: delete bookinstance GET");
};

// handle bookinstance delete POST
exports.bookinstance_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: delete bookinstance POST");
};

// dipslay update book instance page GET
exports.bookinstance_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: update bookinstance GET");
};

// handle bookinstance update POST
exports.bookinstance_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: update bookinstance POST");
};
