import { gql } from 'react-apollo';
import { withMutation } from 'plugin-api/beta/client/hocs';

export const withDeleteComment = withMutation(
  gql`
    mutation DeleteComment($id: ID!, $reason: String!) {
      deleteComment(id: $id, reason: $reason) {
        ...DeleteActionResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      deleteComment: ({ id, reason }) => {
        return mutate({
          variables: {
            id,
            reason,
          },
          optimisticResponse: {
            deleteComment: {
              __typename: 'DeleteActionResponse',
              errors: null,
            },
          },
          update: proxy => {
            const fragmentId = `Comment_${id}`;

            const fragment = gql`
              fragment Talk_RemovedComments_deleteComment on Comment {
                body
                remove_reason
                deleted_at
              }
            `;
            const data = proxy.readFragment({ fragment, id: fragmentId });
            data.body = '';
            data.deleted_at = new Date();
            data.remove_reason = reason;

            proxy.writeFragment({ fragment, id: fragmentId, data });
          },
        });
      },
    }),
  }
);
