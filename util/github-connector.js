const rp =require('request-promise');

// This gives you a place to put GitHub API keys, for example
const { clientID,clientSecret  } = process.env;
const qs = { clientID, clientSecret };
console.log(qs);


function getRepositoryByName(name) {
  return rp({
    uri: `https://api.github.com/repos${name}`,
    qs,
  });
}

module.exports = {
    getRepositoryByName
}