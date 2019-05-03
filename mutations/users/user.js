/*******************************************************************************************************
 *                                      User Mutations                
 *******************************************************************************************************/

/**
* @description: requiring the neccessary files
*/

const userModel = require('../../model/userModel');
const bcrypt = require('bcrypt');
const sendMail = require('../../util/mail').sendEmailFunction;
const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = redis.createClient();

/**
 * @description: Mutation for sign up
 * @purpose :  for registering a user
 */

exports.signUp =
    async (parent, args) => {
        try {
            var email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ //regEX for validating email
            if (!(email.test(args.email))) {
                return { "message": "Email ID is not valid" }
            }
            if (args.password.length < 8) {  // validating the password
                return { "message": "password should be min 8 characters" }
            }

            let encryptedPassword = bcrypt.hashSync(args.password, 10); // encrypting the password

            user = await userModel.find({ 'email': args.email })  //checking the database for existing user with the same email 
            //console.log(user);
            if (!user.length > 0) {

                let user = new userModel({    // creating an object and saving the details of the user in the database
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    password: encryptedPassword,
                    isEmailverify: false
                });

                user.save();
                /*
                generating the token and sending it to the email provided to check the authenticity of the user
                */
                var token = await jwt.sign({ "email": args.email }, process.env.SECRET);
                client.set("registerToken" + args._id, token); // saving the token in redis cache
                client.get("registerToken" + args._id, function (error, result) {
                    if (error) {
                        console.log(error);
                    }
                    console.log('Register token-> ' + result);
                });
                var url = `http://localhost:4000/token=${token}`;
                sendMail(url, args.email);
                return {
                    "message": "registration successful",
                    "token": token
                }
            }
            else {
                return {
                    "message": "registration unsuccessful , email already exists"
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
* @description: Mutation for login
* @purpose : for a user to login 
*/

exports.login =
    async (parent, args) => {
        try {
            var email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ //regEX for validating email
            if (!(email.test(args.email))) {
                return { "message": "Email ID is not valid" }
            }
            if (args.password.length < 8)    // // validating the password
            {
                return { "message": "Password should contain minimum 8 characters" }
            }

            user = await userModel.find({ 'email': args.email })  // checking if the email already exists in the database 
            if (user.length > 0) {
                console.log(user[0].verification);           //email id verification(can not login unless the email is verified)
                if (user[0].verification === false) {
                    return {
                        "message": "Email not verified"
                    }
                }

                let valid = await bcrypt.compare(args.password, user[0].password); //encrypting the password
                if (valid) {
                    let token = await jwt.sign({ 'email': args.email, "userID": user[0]._id, "password": user[0].password }, process.env.SECRET, { expiresIn: '1d' }) //token generation
                    client.set("loginToken" + user[0]._id, token)

                    return {
                        "message": "login successful ",
                        "token": token
                    }
                }
                else {
                    return {
                        "message": "Incorrect password, Try Again!"
                    }
                }
            }
            else {
                return {
                    "message": "Email ID is not registered"
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
 * @description: Mutation for verfying the email
 * @purpose : to verify the email of the registered user so that the user can login 
 */

exports.isEmailVerify =
    async (parent, args, context) => {
        try {
            console.log("token in verify email===> ", context.token);

            var payload = await jwt.verify(context.token, process.env.SECRET); //token verification
            if (!payload) {
                return {
                    "message": "verification unsuccessful"
                }
            }
            userUpdate = await userModel.updateOne({ "email": payload.email }, { $set: { "isEmailverify": true } })  // finding the user for the email provided and updating the verification field in the database  
            if (userUpdate) {
                return {
                    "message": "verification successful"
                }
            }
            else {
                return {
                    "message": "verification unsuccessful"
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
 * @description: Mutation for forgot password
 * @purpose :  when a user forgets the password and to recover back the account
 */

exports.forgotPassword =
    async (parent, args) => {
        try {
            user = await userModel.find({ 'email': args.email });  //checking if the email already exists in the database 
            console.log(user)
            if (user) {
                token = jwt.sign({ email: args.email }, process.env.SECRET)   //generates the token and sends to the email provided for the further process 
                url = `http://localhost:4000?token=${token}`;
                sendMail(url, args.email)
                return {
                    "message": "A link to reset your password has been sent to your email",
                    "token": token
                }
            }
            return {
                "message": "Invalid user"
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
 * @description: Mutation to reset the password 
 * @purpose :  to reset the password and get back the access to the account
 */

exports.resetPassword = async (parent, args, context) => {
    try {
        if (args.password != args.confirmPassword) {  // checking whether both the passwords entered match
            return {
                "message": "passwords don't match"
            }
        }
        else {
            var encryptedPassword = bcrypt.hashSync(args.password, 10)
            var payload = await jwt.verify(context.token, process.env.SECRET);  // token verification
            userUpdate = await userModel.updateOne({ "email": payload.email }, { $set: { "password": encryptedPassword } })  // finding the user for the email provided and updating the password in the database  
            if (userUpdate) {
                return {
                    "message": "password reset successful"
                }
            }
            else {
                return {
                    "message": "password reset unsuccessful"
                }
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