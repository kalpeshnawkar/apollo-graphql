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
        required: [true,'labelName is mandatory']
    },
    userID: {
        type: schema.Types.ObjectId,
        ref: 'userSchema'
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('labels', labelSchema); // exporting the model