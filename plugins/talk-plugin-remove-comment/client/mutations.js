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
        });
      },
    }),
  }
);
