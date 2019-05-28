/**
 * @description: requiring mongoose ORM
 */

const mongoose = require('mongoose')
/**
 * @description: mongodb schema for collaborators 
 */
const schema = mongoose.Schema;

var colabSchema = new schema({
    userID:
    {
        type: schema.Types.ObjectId,
        ref: "userSchema",
        required : [true,'userID is mandatory']
    },

    noteID: {
        type: schema.Types.ObjectId,
        ref: "noteSchema",
        required : [true,'noteID is mandatory']
    },

    colabID: {
        type: schema.Types.ObjectId,
        ref: "userSchema",
        required : [true,'colabID is mandatory']
    }

},
    {
        timestamps: true
    })

module.exports = mongoose.model('colab', colabSchema);