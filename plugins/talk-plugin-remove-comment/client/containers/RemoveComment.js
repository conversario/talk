import React from 'react';
import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect } from 'plugin-api/beta/client/hocs';
import RemoveComment from '../components/RemoveComment';
import { withDeleteComment } from '../mutations';

class RemoveCommentContainer extends React.Component {
  render() {
    const { comment: { id } } = this.props;
    return <RemoveComment {...this.props}>Remove</RemoveComment>;
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

const enhance = compose(connect(null, mapDispatchToProps), withDeleteComment);

export default enhance(RemoveCommentContainer);
