const Genre = require("../models/genre");

// display list of genres
exports.genre_list = (req, res) => {
  res.send("NOT IMPLEMENTED: genre list");
};

// display genre detail page
exports.genre_detail = (req, res) => {
  res.send("NOT IMPLEMENTED: genre detail: " + req.params.id);
};

// display create book instance page
exports.genre_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: create genre GET");
};

// handle genre create POST
exports.genre_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: create genre POST");
};

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
