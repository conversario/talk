import React from 'react';
import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect, excludeIf } from 'plugin-api/beta/client/hocs';
import { can } from 'plugin-api/beta/client/services';
import RemoveComment from '../components/RemoveComment';
import { withDeleteComment } from '../mutations';

class RemoveCommentContainer extends React.Component {
  render() {
    const { comment: { id } } = this.props;
    return <RemoveComment {...this.props}>Remove</RemoveComment>;
  }
}

const mapStateToProps = ({ auth, talkPluginRemoveComment: state }) => ({
  user: auth.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDeleteComment,
  excludeIf(props => !(
    can(props.user, 'MODERATE_COMMENTS') ||
    props.user.id == props.comment.user.id
  ))
);

export default enhance(RemoveCommentContainer);
