const mongoose = require('mongoose');
var schema = mongoose.Schema;
var labelSchema = new schema({  // defining the mongodb schema
    labelName: {
        type: String,
        required: true
    },
    userID: {
        type: schema.Types.ObjectId,
        ref : 'userSchema'
    },
    isArchive : {
        type :Boolean,
        default : false
    },
    isTrash : {
        type:Boolean,
        default : false
    }
},
    {
        timestamps:true
    });

module.exports = mongoose.model('labels', labelSchema); // exporting the model