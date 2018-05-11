import React from 'react';
import RemoveButton from './RemoveButton';

import t from 'coral-framework/services/i18n';
import { comment } from 'coral-framework/graphql/removeReasons';

const RemoveComment = props => (
  <RemoveButton {...props} getPopupMenu={getPopupMenu} />
);

const getPopupMenu = [
  () => {
    // TODO: offer these options only for moderators
    // Normals users get no options; implicit reason will be "USER_REMOVED"
    const options = [
      { val: comment.legal, text: t('remove_reason_legal') },
      { val: comment.user, text: t('remove_reason_user') },
      { val: comment.other, text: t('other') },
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
      text: t('thank_you'),
      button: t('done'),
    };
  },
];

export default RemoveComment;
