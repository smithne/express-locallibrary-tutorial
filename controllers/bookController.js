const Book = require("../models/book");

// display list of books
exports.book_list = (req, res) => {
  res.send("NOT IMPLEMENTED: book list");
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
