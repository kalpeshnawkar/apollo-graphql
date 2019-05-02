/* 
    requiring the necessary files
*/

const labelModel = require('../../model/labelModel');
const jwt = require('jsonwebtoken');

/* 
    mutation for a creating labels
*/

exports.createLabel =  async (parent,args,context)=>{
        try {
            var payload = await jwt.verify(context.token, process.env.SECRET);
            var newLabel = new labelModel({
                labelName: args.labelName,
                userID: payload.userID
            })
            var user = await labelModel.find({ "labelName": args.labelName,"userID": payload.userID });
            if (user.length>0) {
                return {
                    "message": "label already exists"
                }
            }
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

exports.removeLabel = async ()=>{

    try {
        var payload = await jwt.verify(context.token, "secret");
        // console.log(payload.userID)
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

exports.updateLabel = async ()=>{
    try {
        var payload = await jwt.verify(context.token, "secret");
        console.log(payload.userID)
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



