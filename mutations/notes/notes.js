/*****************************************************************************************************
 *                                        CREATE NOTES
 * ***************************************************************************************************/

/* 
    requiring the necessary files
*/



const noteModel = require('../../model/noteModel');
const jwt = require('jsonwebtoken');

/* 
    mutation for a creating notes
*/

function allNotes() {
}

allNotes.prototype.createNote = async (parent, args, context) => {
    try {
        if (args.title.length < 3) {
            return {
                "message": "title should be minimum of 3 characters"
            }
        }

        if (args.description.length < 5) {
            return {
                "message": "description should be minimum of 5 characters"
            }
        }

        var payload = await jwt.verify(context.token, process.env.SECRET);
        console.log(payload.userID)
        note = await noteModel.find({ "title": args.title });
        if (note.length > 0) {
            return {
                "message": "title already exists"
            }
        }
        var newNote = new noteModel({
            labelID: args.labelID,
            userID: payload.userID,
            title: args.title,
            description: args.description,

        })
        noteSave = newNote.save();
        if (noteSave) {
            return {
                "message": "note added"
            }
        }
        else {
            return {
                "message": "error while saving note"
            }
        }
    } catch (err) {
        console.log("ERROR: " + err);
        return {
            "message": err
        }
    }
}

/*****************************************************************************************************
 *                                        UPDATE NOTES
 * ***************************************************************************************************/

// mutation for a updating notes

allNotes.prototype.updateNote = async (parent, args, context) => {
    try {
        var valid = await noteModel.find({ "title": args.newTitle })
        if (valid) {
            return {
                "message": "title already exists"
            }
        }
        var payload = await jwt.verify(context.token, process.env.SECRET);
        var note = await noteModel.findOneAndUpdate({ "_id": args.noteID },
            { $set: { title: args.newTitle, description: args.newDescription } })
        if (note) {
            return {
                "message": "note updated successfully"
            }
        }
        else {
            return {
                "message": "error while updating the note name"
            }
        }

    }
    catch (err) {
        console.log("ERROR: " + err);
        return {
            "message": err
        }
    }
}

/*****************************************************************************************************
 *                                        DELETE NOTES
 * ***************************************************************************************************/

/*
     mutation for deleting notes 
*/

allNotes.prototype.removeNote = async (parent, args, context) => {
    try {
        // console.log(payload.userID)
        note = await noteModel.findByIdAndRemove({ "_id": args.noteID, "title": args.title });
        if (!note) {
            return {
                "message": "enter a valid title name"
            }
        }
        else {
            return {
                "message": "note removed successfully"
            }
        }
    }
    catch (err) {
        console.log("ERROR: " + err);
        return {
            "message": err
        }
    }
}

/*****************************************************************************************************
 *                                        ADDING LABELS TO NOTES
 * ***************************************************************************************************/


allNotes.prototype.addLabelNote = async (parent, args, context) => {
    try {
        var valid = await noteModel.find({ "labelID": args.labelID })
        if (valid.length > 0) {
            return {
                "message": "id already exists"
            }
        }
        var note = await noteModel.findOneAndUpdate({ "_id": args.noteID },
            { $push: { "labelID": args.labelID } })
        if (note) {
            return {
                "message": "note updated successfully"
            }
        }
        else {
            return {
                "message": "error while updating the note name"
            }
        }

    }
    catch (err) {
        console.log("ERROR: " + err);
        return {
            "message": err
        }
    }
}

/*****************************************************************************************************
 *                                        DELETING LABELS FROM  NOTES
 * ***************************************************************************************************/

allNotes.prototype.removeLabelNote = async (parent, args, context) => {
    try {
        var valid = await noteModel.find({ "labelID": args.labelID })
        if (!valid.length > 0) {
            return {
                "message": "id does not exist"
            }
        }
        var note = await noteModel.findOneAndUpdate({ "_id": args.noteID },
            { $pull: { "labelID": args.labelID } })
        if (note) {
            return {
                "message": " label successfully removed  "
            }
        }
        else {
            return {
                "message": "error while removing the label"
            }
        }
    }
    catch (err) {
        console.log("ERROR: " + err);
        return {
            "message": err
        }
    }
}

allNotes.prototype.isArchive = async (parent, args, context) => {
    if (args.noteID) {
        console.log(args.noteID);
        
        var note = await noteModel.findOneAndUpdate({ "_id": args.noteID }, { $set: { isArchive: true } })
        console.log(note);
        
        if (!note) {
            return {
                "message": "note not found"
            }
        }
        return {
            "message": "Archived :)"
        }
    }

}

allNotes.prototype.isTrash = async (parent, args, context) => {
    if (args.noteID) {
        var note = await noteModel.findOneAndUpdate({ "_id": args.noteID }, { $set: { "isTrash" : true } })
        if (!note) {
            return {
                "message": "note not found"
            }
        }
        return {
            "message": "Note in Trash :("
        }
    }

}
module.exports = new allNotes;
