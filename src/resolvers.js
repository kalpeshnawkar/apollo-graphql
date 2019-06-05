/**
* @description: requiring the neccessary files
*/
const redis = require('async-redis');
const client = redis.createClient();
const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel');
const labelModel = require('../model/labelModel');
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
const getRepo = require('../mutations/gitMutations/getRepo').getRepo
const setReminder = require('../mutations/notes/notes').setReminder
const deleteReminder = require('../mutations/notes/notes').deleteReminder
const imageUpload = require('../mutations/imageUpload').imageUpload
const createBranch = require('../mutations/gitMutations/branch').createBranch;
const deleteBranch = require('../mutations/gitMutations/branch').deleteBranch;
const addStar = require('../mutations/gitMutations/star').addStar
const removeStar = require('../mutations/gitMutations/star').removeStar
const watchRepository = require('../mutations/gitMutations/watch').watchRepository
const unwatchRepository = require('../mutations/gitMutations/watch').unwatchRepository
const setColaborator = require('../mutations/colabMutations/colab').setColaborator
const deleteColaborator = require('../mutations/colabMutations/colab').deleteColaborator
const getAllUsers = require('../mutations/gitMutations/getAllUsers').getAllUsers

/**
* @description: A map of functions which return data for the schema.
*/

exports.resolvers = {

    /**
     * @description : query for finding all the users registered 
     */

    Query: {
        users: async (parent, args) => {
            try {
                var user = await userModel.find({ "_id": args.userID })
                // console.log(user.length);
                if (user.length > 0) {
                    return user;
                }
                else {
                    return { "message": "no user found" }
                }
            }
            catch (err) {
                console.log("ERROR", err);
                return { "message": "something went wrong" }
            }
        },

        
        /**
         * @description : query for searching the notes based on title 
         */

        searchNotesByTitle: async (parent, args, context) => {
            try {
                if (!context.token) {
                    return { "message": "token not provided" }
                }
                var payload = await jwt.verify(context.token, process.env.SECRET);
                var searchNote = new RegExp(args.title);
                console.log(searchNote);
                var notes = await noteModel.find({ title: searchNote, userID: payload.userID })
                if (!notes.length > 0) {
                    return { "message": `no notes with ${args.title}` }
                }
                return notes;
            }
            catch (err) {
                console.log(err);
                return {
                    "message": `something went wrong`,
                    "success": false
                }
            }
        },

        

        /**
         * @description : query for searching the notes based on description 
         */

        searchNotesByDescription: async (parent, args, context) => {
            try {
                if (!context.token) {
                    return { "message": "token not provided" }
                }
                var payload = await jwt.verify(context.token, process.env.SECRET);
                var searchNote = new RegExp(args.description)
                var notes = await noteModel.find({ description: searchNote, userID: payload.userID })
                if (notes.length > 0) {
                    return notes
                }
                else {
                    return { "message": `no notes with ${args.description}` }
                }
            }
            catch (err) {
                console.log(err);
                return {
                    "message": `something went wrong`,
                    "success": false
                }
            }
        }


    },
    /**
        * @description : query for finding the details about a particular user by the userID and  
        *                also the labels and notes related to that particular user.
        */

       User: {
        labels: async (parent) => {
            try {
                console.log(parent.id);
                var labels = await client.get("labels" + parent.id)
                if (labels) {
                    return JSON.parse(labels);
                }
                else {
                    let label = await labelModel.find({ userID: parent.id })
                    client.set("labels" + parent.id, JSON.stringify(label));
                    return label;
                }
            }
            catch (err) {
                console.log("ERROR", err);
                return {
                    "message": `something went wrong`,
                    "success": false
                }

            }
        },
        notes: async (parent) => {
            try {
                var note = await noteModel.find({ userID: parent.id }).exec()
                if (!note) {
                    return {
                        "message": "NO notes fouund"
                    }
                }
                return note;
            }
            catch (err) {
                console.log("ERROR", err);
                return {
                    "message": `something went wrong`,
                    "success": false
                }

            }
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
        verifyOauth,
        getRepo,
        setReminder,
        deleteReminder,
        imageUpload,
        createBranch,
        deleteBranch,
        addStar,
        removeStar,
        watchRepository,
        unwatchRepository,
        setColaborator,
        deleteColaborator,
        getAllUsers
    }
}

