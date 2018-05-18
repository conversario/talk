const { check } = require('perms/utils');
const { ErrNotAuthorized } = require('errors');

// Delete a single comment
const deleteComment = async (ctx, id, reason) => {
  const { connectors: { models: { Comment } } } = ctx;

  // For each comment that the user has authored, purge the comment data from it
  // and unset their id from those comments.
  console.log('deleteComment with id', id);
  await Comment.updateOne(
    { id: id },
    {
      $set: {
        id,
        body: null,
        body_history: [],
        author_id: null,
        status_history: [],
        action_counts: {},
        tags: [],
        metadata: {
          remove_reason: reason,
        },
        deleted_at: new Date(),
      },
    }
  );
};

module.exports = ctx => {
  const mutators = {
    Comment: {
      deleteComment: () => Promise.reject(new ErrNotAuthorized()),
    },
  };

  if (ctx.user) {
    mutators.Comment.deleteComment = ({ id, reason }) => {
      // Only admins/mods can choose a reason; for other we always set 'USER'
      reason = check(ctx.user, ['ADMIN', 'MODERATOR']) ? reason : 'USER';
      deleteComment(ctx, id, reason);
    };
  }

  return mutators;
};
