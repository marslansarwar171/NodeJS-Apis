const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FilesSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
}, {
    timestamps: true,
});

const Files = mongoose.model('Files', FilesSchema);

module.exports = Files;