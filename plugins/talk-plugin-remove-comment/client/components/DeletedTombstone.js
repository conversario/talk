import React from 'react';
import PropTypes from 'prop-types';
import CommentTombstone from 'coral-embed-stream/src/tabs/stream/components/CommentTombstone';
import styles from 'coral-embed-stream/src/tabs/stream/components/CommentTombstone.css';
import t from 'coral-framework/services/i18n';

import { removeReason } from '../removeReasons';

const name = 'talk-plugin-remove-comment';

// Render in place of a Comment when the author of the comment is <action>
class DeletedTombstone extends React.Component {
  getCopy(remove_reason) {
    if (remove_reason in removeReason) {
      return t(name + '.reason_' + remove_reason);
    } else {
      return t('framework.comment_is_hidden');
    }
  }

  render() {
    const { comment } = this.props;

    // If the comment does not contain any of our plugin specific metadata, render
    // the normal CommentTombstone.
    if (!comment.remove_reason) {
      return <CommentTombstone {...this.props} />;
    }

    // Otherwise use this plugin's tombstone
    return (
      <div className="talk-comment-tombstone">
        <p className={styles.commentTombstone}>
          {this.getCopy(comment.remove_reason)}
        </p>
      </div>
    );
  }
}

DeletedTombstone.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default DeletedTombstone;
