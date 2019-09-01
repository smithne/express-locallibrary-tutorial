const Author = require("../models/author");

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
exports.author_detail = (req, res) => {
  res.send("NOT IMPLEMENTED: Author detail page: " + req.params.id);
};

// display author create page (GET)
exports.author_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author creation page");
};

// handle author creation (POST)
exports.author_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create POST");
};

// display author delete page (GET)
exports.author_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author deletion page");
};

// handle author deletion (POST)
exports.author_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// display author update page (GET)
exports.author_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update page");
};

// handle author update (POST)
exports.author_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
