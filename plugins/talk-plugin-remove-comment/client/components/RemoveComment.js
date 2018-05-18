import PropTypes from 'prop-types';
import React from 'react';
import t from 'coral-framework/services/i18n';
import { can } from 'plugin-api/beta/client/services';
import RemoveButton from './RemoveButton';
import { removeReason } from '../removeReasons';

const name = 'talk-plugin-remove-comment';

const makePopupMenuGetter = (text, options) => () => {
  return {
    header: t(name + '.header'),
    text,
    options,
    button: t(name + '.yes_remove'),
  };
};

const RemoveComment = props => {
  let text = t(name + '.are_you_sure');
  let options = null;
  if (can(props.user, 'MODERATE_COMMENTS')) {
    options = [
      { val: removeReason.LEGAL, text: t(name + '.reason_LEGAL') },
      { val: removeReason.USER, text: t(name + '.reason_USER') },
    ];
    text = text + ' ' + t(name + '.choose_reason');
  }
  return (
    <RemoveButton
      {...props}
      getPopupMenu={makePopupMenuGetter(text, options)}
    />
  );
};

RemoveComment.propTypes = {
  user: PropTypes.object,
};

export default RemoveComment;
