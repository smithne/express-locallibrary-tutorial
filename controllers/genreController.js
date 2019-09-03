const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

// display list of genres
exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec((err, list_genres) => {
      if (err) {
        return next(err);
      }
      // success
      res.render("genre_list", {
        title: "Genre List",
        genre_list: list_genres
      });
    });
};

// display genre detail page
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre: callback => {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books: callback => {
        Book.find({ genre: req.params.id }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // no results
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // success
      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books
      });
    }
  );
};

// display create book instance page
exports.genre_create_get = (req, res) => {
  res.render("genre_form", { title: "Create Genre" });
};

// handle genre create POST
exports.genre_create_post = [
  // name field cannot be empty

  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Genre name is required"),
  sanitizeBody("name").escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    var genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // re-render form with errors shown
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array()
      });
      return;
    } else {
      // valid form
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // genre already exists, redirect to existing genre
          res.redirect(found_genre.url);
        } else {
          genre.save(err => {
            if (err) {
              return next(err);
            }
            // success: genre saved, redirect to new genre
            res.redirect(genre.url);
          });
        }
      });
    }
  }
];

// dsplay delete book instance page GET
exports.genre_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: delete genre GET");
};

// handle genre delete POST
exports.genre_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: delete genre POST");
};

// dipslay update book instance page GET
exports.genre_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: update genre GET");
};

// handle genre update POST
exports.genre_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: update genre POST");
};
