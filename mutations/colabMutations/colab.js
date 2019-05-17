const colabModel = require('../../model/colabModel');
const noteModel = require('../../model/noteModel');
const userModel = require('../../model/userModel');
const jwt = require('jsonwebtoken')

function colab() {

}

colab.prototype.setColaborator = async (parent, args, context) => {
    try {
        var payload = jwt.verify(context.token, process.env.SECRET)
        var user = await userModel.find({ _id: payload.userID })
        if (!user.length > 0) {
            return { "message": "user not found" }
        }

        var note = await noteModel.find({ _id: args.noteID })
        if (!note.length > 0) {
            return { "message": "note not found" }
        }

        var colab = await colabModel.find({ colabID: args.colabID })
        if (colab.length > 0) {
            return { "message": "already colaborated" }
        }
        else {
            var newColab = new colabModel({
                userID: payload.userID,
                noteID: args.noteID,
                colabID: args.colabID
            })
            let save = newColab.save()
            if (!save) {
                return {
                    "message": err
                }
            }
            return {
                "message": "collabed successfully"
            }
        }
    } catch (err) {
        console.log("error", err)
    }
}


module.exports = new colab