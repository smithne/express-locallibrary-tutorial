const Author = require("../models/author");
const Book = require("../models/book");

const async = require("async");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
// display authors
exports.author_list = (req, res, next) => {
  Author.find()
    .sort([["family_name", "ascending"]])
    .exec((err, list_authors) => {
      if (err) {
        return next(err);
      }
      // success
      res.render("author_list", {
        title: "Author List",
        author_list: list_authors
      });
    });
};

// display author detail page (GET)
exports.author_detail = (req, res, next) => {
  async.parallel(
    {
      author: callback => {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: callback => {
        Book.find({ author: req.params.id }, "title summary").exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      res.render("author_detail", {
        title: "Author Detail",
        author: results.author,
        author_books: results.authors_books
      });
    }
  );
};

// display author create page (GET)
exports.author_create_get = (req, res) => {
  res.render("author_form", { title: "Create Author" });
};

// handle author creation (POST)
exports.author_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters"),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Family name must be specified")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters"),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601(),
  sanitizeBody(["first_name", "family_name"]).escape(),
  sanitizeBody(["date_of_birth", "date_of_death"]).toDate(),

  // process request after validation & sanitization
  (req, res, next) => {
    // get any validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // render form with sanitized values & error messages
      res.render("author_form", {
        title: "Create Author",
        author: req.body,
        errors: errors.array()
      });
    } else {
      // valid form data

      // create author with sanitized form data
      const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });

      author.save(err => {
        if (err) {
          return next(err);
        }

        // saved successfully
        res.redirect(author.url);
      });
    }
  }
];

// display author delete page (GET)
exports.author_delete_get = (req, res, next) => {
  async.parallel(
    {
      author: callback => {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: callback => {
        Book.find({ author: req.params.id }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        // no results
        res.redirect("/catalog/authors");
      }
      // found author
      res.render("author_delete", {
        title: "Delete Author",
        author: results.author,
        author_books: results.authors_books
      });
    }
  );
};

// handle author deletion (POST)
exports.author_delete_post = (req, res, next) => {
  async.parallel(
    {
      author: callback => {
        Author.findById(req.body.authorid).exec(callback);
      },
      authors_books: callback => {
        Book.find({ author: req.body.authorid }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // success
      if (results.authors_books.length > 0) {
        // author still has books, can't delete
        res.render("author_delete_get", {
          title: "Delete Author",
          author: results.author,
          author_books: results.author_books
        });
        return;
      } else {
        // no books - safe to delete author
        Author.findByIdAndRemove(req.body.authorid, err => {
          if (err) {
            return next(err);
          }
          // success, redirect to author list
          res.redirect("/catalog/authors");
        });
      }
    }
  );
};

// display author update page (GET)
exports.author_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update page");
};

// handle author update (POST)
exports.author_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
