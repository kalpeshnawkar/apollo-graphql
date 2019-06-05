const {createApolloFetch} = require('apollo-fetch');
const userModel = require('../../model/userModel')


exports.getAllUsers = async (parent,args,context) => {
    var user = await userModel.find({ _id: "5cd541090c42ec2332701aa7" })
        //var accessToken = user[0].gitToken;
        var gitToken = user[0].gitToken;
    //try {
    const queryString = "is:public stars:>0 archived:false created:<2019-06-15 pushed:<2019-06-05"
    const fetch = createApolloFetch({
        uri :`https://api.github.com/graphql?access_token=${gitToken}`
    })

    const res = await fetch({
        query : 'query {search(query:"is:public stars:>0 archived:false created:<2019-06-15 pushed:<2019-06-05", type:REPOSITORY, first:20){repositoryCount edges{node{ ... on Repository{id name createdAt  description  isPrivate url owner{ login id url}defaultBranchRef{target{... on Commit{ history(first:10){totalCount edges{node{... on Commit{committedDate}}}}}}}}}}}}'
    })
    console.log("response =>", res);
    return {
        message : JSON.stringify(res),
    }
}
// catch(err) {
//     return {
//         "message":err
//     }
// }
    
