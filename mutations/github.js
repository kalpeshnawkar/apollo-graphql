const resolverMap = {
    Query: {
      gitHubRepository(root, args, context) {
        return rp({ uri: `https://api.github.com/repos/${args.name}` });
      }
    }
  }

//   import { getRepositoryByName } from './github-connector.js';
// import { log } from 'util';
const {getRepositoryByName } = require('../util/github-connector')

const resolverMap = {
  Query: {
    gitHubRepository(root, args, context) {
      return getRepositoryByName(args.name);
    }
  },
  Submission: {
    repository(root, args, context) {
        console.log(root.repositoryFullName);
        
      return getRepositoryByName(root.repositoryFullName);
    }
  }
}

