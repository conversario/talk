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
  return <RemoveButton {...props} getPopupMenu={getPopupMenu} />;
};

RemoveComment.propTypes = {
  currentUser: PropTypes.object,
};

export default RemoveComment;
