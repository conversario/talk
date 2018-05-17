import { gql } from 'react-apollo';
import { withFragments } from 'plugin-api/beta/client/hocs';
import DeletedTombstone from '../components/DeletedTombstone';

export default withFragments({
  comment: gql`
    fragment TalkPluginRemoveComment_DeletedTombstone_comment on Comment {
      body
      remove_reason
      deleted_at
    }
  `,
})(DeletedTombstone);
