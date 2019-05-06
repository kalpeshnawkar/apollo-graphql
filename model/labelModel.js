/**
 * @description: requiring mongoose ORM
 */

const mongoose = require('mongoose');

/**
 * @description: mongodb schema for labels 
 */

var schema = mongoose.Schema;
var labelSchema = new schema({
    labelName: {
        type: String,
        required: true
    },
    userID: {
        type: schema.Types.ObjectId,
        ref: 'userSchema'
    },
    isArchive: {
        type: Boolean,
        default: false
    },
    isTrash: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('labels', labelSchema); // exporting the model