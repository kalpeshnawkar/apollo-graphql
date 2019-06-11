/**
* @description: requiring the neccessary files
*/

const { createApolloFetch } = require('apollo-fetch');
const issueModel = require('../../model/issueModel')
const userModel = require("../../model/userModel")

/**
 * @description : to create an issue for a particular repository
 * @purpose : to create issues and to assign users for a particular issue and save it in the database
 */

exports.createIssue = async (parent, params, context) => {
    try {
        var args = params.input
        var user = await userModel.find({ _id: "5cd541090c42ec2332701aa7" })
        var gitToken = user[0].gitToken;
        const fetch = createApolloFetch({
            uri: `https://api.github.com/graphql?access_token=${gitToken}`
        })
        // to fetch the query for creating an issue by providing the details such as repositoryId, Title and the assignees ID 
        const res = await fetch({
            query: `mutation {createIssue(input: { repositoryId: "${args.repositoryId}", title: "${args.title}", assigneeIds: [${args.assigneesIds}]} ) {issue {id createdAt assignees(first: 10) {totalCount edges{node{id login}}}}}}`
        })
        var assigneeArray = [];
        var data = res.data.createIssue.issue.assignees.edges;
        data.forEach(element => {
            assigneeArray.push(element.node.id)
        })
        console.log(assigneeArray);
        var issue = new issueModel({
            issueGitId: res.data.createIssue.issue.id,
            assigneeId: assigneeArray
        })
        var save = await issue.save();
        if (save) {
            return { message: "issue created successfully" }
        }
        else {
            return { message: "error while creating issue" }
        }
    }
    catch (err) {
        console.log(err);
        return {
            message: "something went wrong while creating issue"
        }
    }
}
