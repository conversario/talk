const { readFileSync } = require('fs');
const path = require('path');
const resolvers = require('./server/resolvers');

module.exports = {
  typeDefs: readFileSync(
    path.join(__dirname, 'server/typeDefs.graphql'),
    'utf8'
  ),
  resolvers,
};
