/*****************************************************************************************************
 *                                      Note Mutations
 * ***************************************************************************************************/

/**
* @description: requiring the neccessary files
*/

const noteModel = require('../../model/noteModel');
const jwt = require('jsonwebtoken');


function allNotes() {
}

/**
 * @description: Mutation to create a note
 * @purpose : to create a note for the specified user
 */

allNotes.prototype.createNote = async (parent, args, context) => {
    try {
        //validations for the title and description
        if (args.title.length < 3) {
            return {
                "message": "title should be minimum of 3 characters",
                "success" : false
            }
        }
        if (args.description.length < 3) {
            return {
                "message": "description should be minimum of 3 characters",
                "success" : false
            }
        }
        //verifying the token and to get the user ID 
        var payload = await jwt.verify(context.token, process.env.SECRET);
        console.log(payload.userID)
        //checking if the title already exists in the database
        note = await noteModel.find({ "title": args.title });
        if (note.length > 0) {
            return {
                "message": "title already exists",
                "success" : "false"
            }
        }
        //save the note if not present
        var newNote = new noteModel({
            labelID: args.labelID,
            userID: payload.userID,
            title: args.title,
            description: args.description,

        })
        noteSave = newNote.save();
        if (noteSave) {
            return {
                "message": "note added",
                "success" : true
            }
        }
        else {
            return {
                "message": "error while saving note",
                "success" : false
            }
        }
    } catch (err) {
        console.log("ERROR: " + err);
        return {
            "message": err
        }
    }
}

/**
 * @description: Mutation to update a note
 * @purpose : to update a note for the specified user
 */

allNotes.prototype.updateNote = async (parent, args, context) => {
    try {
        //checking if the title is present in th database
        var valid = await noteModel.find({ "title": args.newTitle })
        if (valid) {
            return {
                "message": "title already exists",
                "success" : false
            }
        }
        var payload = await jwt.verify(context.token, process.env.SECRET);
        //finding the note by note id and updating the title and description fields
        var note = await noteModel.findOneAndUpdate({ "_id": args.noteID },
            { $set: { title: args.newTitle, description: args.newDescription } })
        if (note) {
            return {
                "message": "note updated successfully",
                "success" : true
            }
        }
        else {
            return {
                "message": "error while updating the note name",
                "success" : false
            }
        }
    }
    catch (err) {
        console.log("ERROR: " + err);
        return {
            "message": err,
            "success" : false
        }
    }
}

/**
 * @description: Mutation to remove a note
 * @purpose : to remove a note for the specified user
 */

allNotes.prototype.removeNote = async (parent, args, context) => {
    try {
        // console.log(payload.userID)
        //finding the note by note id and deleting the note
        note = await noteModel.findByIdAndRemove({ "_id": args.noteID, "title": args.title });
        if (!note) {
            return {
                "message": "enter a valid title name",
                "success" : false
            }
        }
        else {
            return {
                "message": "note removed successfully",
                "success" : true
            }
        }
    }
    catch (err) {
        console.log("ERROR: " + err);
        return {
            "message": err,
            "success" : false
        }
    }
}

/**
 * @description: Mutation for assigning a label to a note
 * @purpose : for assiging a specific label to a particular note
 */

allNotes.prototype.addLabelNote = async (parent, args, context) => {
    try {
        //checking whether the label is already linked to a particular note
        var valid = await noteModel.find({ "labelID": args.labelID })
        if (valid.length > 0) {
            return {
                "message": "id already exists",
                "success" : false
            }
        }
        //updating the note model with the new label id
        var note = await noteModel.findOneAndUpdate({ "_id": args.noteID },
            { $push: { "labelID": args.labelID } })
        if (note) {
            return {
                "message": "note updated successfully",
                "success" : true
            }
        }
        else {
            return {
                "message": "error while updating the note name",
                "success" : false
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

/**
 * @description: Mutation for removing a label from a note
 * @purpose : for removing a specific label from a particular note
 */

allNotes.prototype.removeLabelNote = async (parent, args, context) => {
    try {
        //checking whether the label is already linked to a particular note to delete it
        var valid = await noteModel.find({ "labelID": args.labelID })
        if (!valid.length > 0) {
            return {
                "message": "id does not exist",
                "success" : false
            }
        }
        //deleting the label linked to the particular note 
        var note = await noteModel.findOneAndUpdate({ "_id": args.noteID },
            { $pull: { "labelID": args.labelID } })
        if (note) {
            return {
                "message": " label successfully removed  ",
                "success" : true
            }
        }
        else {
            return {
                "message": "error while removing the label",
                "success" : false
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

/**
 * @description: Mutation for making a note archive
 * @purpose : for making a note archive
 */

allNotes.prototype.isArchive = async (parent, args, context) => {
    try {
        if (args.noteID) {
            console.log(args.noteID);
            //setting the isArchive field to true for the given note id 
            var note = await noteModel.findOneAndUpdate({ "_id": args.noteID }, { $set: { isArchive: true } })
            console.log(note);
            if (!note) {
                return {
                    "message": "note not found",
                    "success" : false
                }
            }
            return {
                "message": "Archived :)",
                "success" : true
            }
        }
    }
    catch (err) {
        console.log("ERROR", err);
    }
}

/**
 * @description: Mutation for moving a note to trash
 * @purpose : for moving a note to trash once it is deleted 
 */

allNotes.prototype.isTrash = async (parent, args, context) => {
    try {
        if (args.noteID) {
            //setting the isTrash field to true for the given note id 
            var note = await noteModel.findOneAndUpdate({ "_id": args.noteID }, { $set: { "isTrash": true } })
            if (!note) {
                return {
                    "message": "note not found",
                    "success" : false
                }
            }
            return {
                "message": "Note in Trash :(",
                "success" : true
            }
        }
    }
    catch (err) {
        console.log("ERROR", err);
    }
}

/**
 * @description: Mutation to set a reminder for a note 
 */ 

allNotes.prototype.setReminder = async (parent, args, context) => {
    try {
        if (args.date) {
            var date = new Date(args.date);
            console.log(date);
            //find the note by note id and updating the reminder field
            var reminder = await noteModel.findOneAndUpdate({ _id: args.noteID }, { $set: { reminder: date } })
            if (!reminder) {
                return { "message": "error while setting the reminder","success" : false }
                
            }
            return { "message": "reminder set @ " + args.date ,"success" : true}
        }
    }
    catch (err) {
        console.log("ERROR", err);
    }
}

/**
 * @description: Mutation to delete a reminder for a note 
 */ 

allNotes.prototype.deleteReminder = async (parent, args, context) => {
    try {
        //find the note by note id and removing the reminder field
        var reminder = await noteModel.findOneAndRemove({ _id: args.noteID }, { reminder })
        if (!reminder) {
            return { "message": "error while deleting the reminder","success" : false }
        }
        return { "message": "reminder deleted ","success" : true }
    }
    catch (err) {
        console.log("ERROR", err);
    }
}
module.exports = new allNotes;
