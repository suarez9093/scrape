let mongoose = require("mongoose");

// Save a reference to the Schema
let Schema = mongoose.Schema;

// Using Schema constructor, creating a NoteSchema object

let NoteSchema = new Schema({
    title: String,
    body: String
});

let Note = mongoose.model("Note", NoteSchema);

module.exports = Note;