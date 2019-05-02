const userModel = require('../model/userModel');
const labelModel =  require('../model/labelModel');
const noteModel = require('../model/noteModel'); 
const signUp = require('../mutations/users/user').signUp;
const login = require('../mutations/users/user').login;
const isEmailVerify = require('../mutations/users/user').isEmailVerify
const forgotPassword = require('../mutations/users/user').forgotPassword
const resetPassword = require('../mutations/users/user').resetPassword
const createLabel = require('../mutations/labels/labels').createLabel
const removeLabel = require('../mutations/labels/labels').removeLabel
const updateLabel = require('../mutations/labels/labels').updateLabel
const createNote = require('../mutations/notes/notes').createNote;
const updateNote = require('../mutations/notes/notes').updateNote;
const removeNote = require('../mutations/notes/notes').removeNote;
const addLabelNote = require('../mutations/notes/notes').addLabelNote;
const removeLabelNote = require('../mutations/notes/notes').removeLabelNote;
const isArchive = require('../mutations/notes/notes').isArchive;
const isTrash = require('../mutations/notes/notes').isTrash;
const oAuth = require('../mutations/oauth/oAuth').oAuth;
const verifyOauth = require('../mutations/oauth/verify').verifyOauth

exports.resolvers = {
    Query: {
        users: async (parent, args) => {
            var user = await userModel.find({_id: args.userID}).exec()
            console.log(user);
            return user
        }
    },
    User : {
        labels : async (parent) => {
            var label =  await labelModel.find({userID : parent.id}).exec()
            if(!label)
            {
                return {
                    "message" : "NO labels fouund"
                }
            }
            return label;
        },
        notes : async (parent) => {
            var note =  await noteModel.find({userID : parent.id}).exec()
            if(!note)
            {
                return {
                    "message" : "NO notes fouund"
                }
            }
            return note;

        }
    },

    Mutation: {
        signUp,
        login,
        isEmailVerify,
        forgotPassword,
        resetPassword,
        createLabel,
        removeLabel,
        updateLabel,
        createNote,
        updateNote,
        removeNote,
        addLabelNote,
        removeLabelNote,
        isArchive,
        isTrash,
        oAuth,
        verifyOauth
    }
}

