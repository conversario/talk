const { get } = require('lodash');

module.exports = {
  RootMutation: {
    deleteComment: async (_, { id, reason }, { mutators: { Comment } }) => {
      Comment.deleteComment({ id, reason });
    },
  },
  Comment: {
    // Get the remove_reason, or send null.
    remove_reason: comment => get(comment, 'metadata.remove_reason', null),
  },
};
