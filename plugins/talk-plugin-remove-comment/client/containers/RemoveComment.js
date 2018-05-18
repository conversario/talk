import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect, excludeIf } from 'plugin-api/beta/client/hocs';
import { can } from 'plugin-api/beta/client/services';
import RemoveComment from '../components/RemoveComment';
import { withDeleteComment } from '../mutations';

class RemoveCommentContainer extends React.Component {
  render() {
    return <RemoveComment {...this.props}>Remove</RemoveComment>;
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDeleteComment,
  excludeIf(props => {
    return !(
      props.user &&
      (can(props.user, 'MODERATE_COMMENTS') ||
        props.user.id == props.comment.user.id)
    );
  })
);

RemoveCommentContainer.propTypes = {
  comment: PropTypes.object,
};

export default enhance(RemoveCommentContainer);
