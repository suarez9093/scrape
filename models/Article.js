const mongoose = require("mongoose");

// Reference to the Schema Constructor
let Schema = mongoose.Schema;

// Using Schema Constructor creating a new UserSchema Object
let ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        required: true
    },

    // Object that stores a Note ID
    // ref links the ObjectID to the Note Model (allows to populate the Artilce with an associate Note)
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

let Artilce = mongoose.model("Article", ArticleSchema);

module.exports = Artilce;


