const BookInstance = require("../models/bookinstance");

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
exports.bookinstance_detail = (req, res) => {
  res.send("NOT IMPLEMENTED: bookinstance detail: " + req.params.id);
};

// display create book instance page
exports.bookinstance_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: create book instance GET");
};

// handle bookinstance create POST
exports.bookinstance_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: create bookinstance POST");
};

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
