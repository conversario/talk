import PropTypes from 'prop-types';
import React from 'react';

import { comment } from '../reasons';
import t from 'coral-framework/services/i18n';

import RemoveButton from './RemoveButton';
// import RemoveButton from '../containers/RemoveButton';

const getPopupMenu = [
  () => {
    // TODO: offer these options only for moderators
    // Normals users get no options; implicit reason will be "USER_REMOVED"
    const options = [
      { val: comment.legal, text: t('remove_reason_legal') },
      { val: comment.user, text: t('remove_reason_user') },
    ];
    return {
      header: t('remove_comment.header'),
      text: t('remove_comment.are_you_sure'),
      options,
      button: t('remove_comment.yes_remove'),
      sets: 'reason',
    };
  },
  () => {
    return {
      header: t('remove_comment.done_header'),
      text: t('remove_comment.done_message'),
      button: t('done'),
    };
  },
];

const RemoveComment = props => {
  console.log('RemoveComment', props);
  const { currentUser } = props;
  console.log('RemoveComment', currentUser);
  // Only show the remove button if
  // - user is admin/moderator or
  // - user is author
  if (!props.root.me || props.root.me.id != props.comment.user.id) {
    return null;
  }
  return <RemoveButton {...props} getPopupMenu={getPopupMenu} />;
};

RemoveComment.propTypes = {
  currentUser: PropTypes.object,
};

export default RemoveComment;
