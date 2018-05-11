const { get } = require('lodash');

module.exports = {
  Comment: {
    // Get the remove_reason, or send null.
    remove_reason: comment => get(comment, 'metadata.remove_reason', null),
  },
};
