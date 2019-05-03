/**
* @description: requiring the neccessary files
*/

// Import the axios library, to make HTTP request
const axios = require('axios');
const userModel = require('../../model/userModel');
const jwt = require('jsonwebtoken');
var util = require('../../util/mail');
const clientID = process.env.clientID
const clientSecret = process.env.clientSecret

/**
 * @description: Mutation for social login through github
 * @purpose : for logging in using a github account through oAUth 
 */

exports.oAuth = async (parent, args, context) => {
    console.log("code", context.code);
    axios({
        // make a POST request
        method: 'post',
        // to the Github authentication API, with the client ID, client secret
        // and request token
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${context.code}`,
        // Set the content type header, so that we get the response in JSON
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {

        // Once we get the response, extract the access token from
        // the response body
        const accessToken = response.data.access_token
        // redirect the user to the welcome page, along with the access token
        console.log(accessToken)
        getToken(accessToken);
    })

    /**
    * @description: to pass the git token and make another http request 
    */
    function getToken(accessToken) {
        axios({
            // make a GET request
            method: 'get',
            // to get the code
            url: `https://api.github.com/user?access_token=${accessToken}`,
            // Set the content type header, so that we get the response in JSOn
            headers: {
                accept: 'application/json'
            }
        }).then(async (response) => {
            console.log(response.data)

            //saving the git user details in the database 
            gitUser = new userModel({
                gitUsername: response.data.login,
                gitID: response.data.id,
                firstName: "guest",
                lastName: "",
                email: "",
                gitToken: accessToken
            })
            let user = await gitUser.save();

            console.log("user", user);

            console.log("before token");
            //generating token by taking the userID,gitID and git username in the payload 
            var token = await jwt.sign({ userID: user.id, gitUsername: response.data.login, gitID: response.data.id }, process.env.SECRET);
            console.log("after token");
            console.log('token =>', token)
            console.log('email =>', response.data.email)
            var url = `http://localhost:4000?token=${token}`
            //sending the email to the user email for logging in 
            util.sendEmailFunction(url, response.data.email)
        })
    }
    return { "message": "git authentication successful" }

}




