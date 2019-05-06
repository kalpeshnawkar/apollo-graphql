/*******************************************************************************************************
 *                                      Label Mutations                
 *******************************************************************************************************/

/**
* @description: requiring the neccessary files
*/

const labelModel = require('../../model/labelModel');
const jwt = require('jsonwebtoken');

/**
 * @description: Mutation to create a label
 * @purpose : to create a label for the specified user
 */

exports.createLabel =
    async (parent, args, context) => {
        try {
            //verifying the token and to get the user ID 
            var payload = await jwt.verify(context.token, process.env.SECRET); 
            //checking whether the label name is already saved
            var user = await labelModel.find({ "labelName": args.labelName, "userID": payload.userID });
            if (user.length > 0) {
                return {
                    "message": "label already exists"
                }
            }
            //save the label if not present in the database 
            var newLabel = new labelModel({
                labelName: args.labelName,
                userID: payload.userID
            })
            labelSave = await newLabel.save();
            if (labelSave) {
                return {
                    "message": "label added"
                }
            }
            else {
                return {
                    "message": "error while saving label"
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
 * @description: Mutation to remove a label
 * @purpose : to remove a label for the specified user
 */

exports.removeLabel =
    async (parent, args, context) => {
        try {
            //verifying the token and to get the user ID 
            var payload = await jwt.verify(context.token, process.env.SECRET);
            // console.log(payload.userID)
            //find the label by id and deleting it
            user = labelModel.findByIdAndRemove({ "_id": args.labelID });
            if (!user) {
                return {
                    "message": "enter a valid label name"
                }
            }
            else {
                return {
                    "message": "label removed successfully"
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
 * @description: Mutation to update a label
 * @purpose : to update a label for the specified user 
 */

exports.updateLabel =
    async (parent, args, context) => {
        try {
            //verifying the token and to get the user ID 
            var payload = await jwt.verify(context.token, process.env.SECRET);
            console.log(payload.userID)
            //finding the label by id and setting the new label name
            var label = await labelModel.findOneAndUpdate({ "userID": payload.userID, "_id": args.labelID }, { $set: { labelName: args.newLabelName } })
            console.log(label)
            if (label) {
                return {
                    "message": "label name updated successfully"
                }
            }
            else {
                return {
                    "message": "error while updating the label name"
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



