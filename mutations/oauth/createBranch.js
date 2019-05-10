const axios = require('axios');

exports.createBranch = async (parent, args, context) => {
    if (context.token) {
        const accessToken = context.token
        axios({
            method: "get",
            url: `https://api.github.com/repos/akshaykc27/apollo-graphql/git/refs?access_token=${accessToken}`,
            headers: {
                accept: 'application/json'
            }
        }).then(response => {
            console.log("Response => ", response.data[0].object.sha);
            createBranch(response.data[0].object.sha, args.name)
        })

        function createBranch(sha, name) {
            console.log("name", name)
            console.log("sha", sha)
            // const payload = [
            //     {
            //         ref: "refs/heads/debug",
            //         sha: "3b498e75478846b4237651125e8c9e8fac8f0e9d"
            //     }
            // ]
            // const url = "https://api.github.com/repos/akshaykc27/apollo-graphql/git/refs";
            // axios.post(url,
            axios({
                method: "post",
                url: `https://api.github.com/repos/akshaykc27/apollo-graphql/git/refs?access_token=${accessToken}`,
                headers: {
                    accept: 'application/json'
                },
                data: {
                    "ref": `refs/heads/${args.name}`,
                    "sha": sha
                }
            }).then(res => {
                console.log("create branch res", res);
            }).catch(err => {
                console.log(err);
                
            })
        }
    }
    else {
        return { "message": "token not provided" }
    }
}
