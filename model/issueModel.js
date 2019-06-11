/**
 * @description: requiring mongoose ORM
 */

const mongoose = require('mongoose')
const schema = mongoose.Schema;

/**
 * @description: mongodb schema for issues in github 
 */

const issueSchema = new schema({
    issueGitId :{
        type:String,
        required:[true,'Issue Id is mandatory']
    },
    assigneeId : [{
        type : String
    }],
    gitId : {
        type:String,
    }
},
{
    timestamps : true
}
)

module.exports = mongoose.model('issues', issueSchema);