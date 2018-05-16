import React, { Component } from 'react';

import t from 'coral-framework/services/i18n';
import { can } from 'coral-framework/services/perms';

import { PopupMenu, Button } from 'coral-ui';
import ClickOutside from 'coral-framework/components/ClickOutside';
import cn from 'classnames';
import styles from './RemoveButton.css';
import PropTypes from 'prop-types';

import { getErrorMessages, forEachError } from 'coral-framework/utils';

const name = 'talk-plugin-remove-comment';

export default class RemoveButton extends Component {
  state = {
    showMenu: false,
    itemType: '',
    reason: '',
    step: 0,
    localPost: null,
  };

  componentDidUpdate() {
    if (this.popup) {
      // this will be defined when the reporting popup is opened
      this.popup.firstChild.style.top = `${this.RemoveButton.offsetTop -
        this.popup.firstChild.clientHeight -
        15}px`;
    }
  }

  // When the "remove" button is clicked expand the menu
  onReportClick = () => {
    if (this.state.showMenu) {
      this.closeMenu();
    } else {
      this.setState({ showMenu: true });
    }
  };

  closeMenu = () => {
    this.setState({
      showMenu: false,
      itemType: '',
      reason: '',
      step: 0,
    });
  };

  onPopupContinue = async () => {
    const { comment: { id }, deleteComment } = this.props;
    const { reason, step } = this.state;
    let failed = false;

    switch (step) {
      case 0:
        break;
      case 1: // *after* the last step
        return this.closeMenu();
      default:
        throw new Error(`Unexpected step ${step}`);
    }

    if (step === 0) {
      try {
        const result = await this.props.deleteComment({ id, reason });
      } catch (errors) {
        failed = true;
      }
    }

    if (!failed) {
      this.setState({ step: step + 1 });
    }
  };

  onPopupOptionClick = sets => e => {
    // If flagging a user, indicate that this is referencing the username rather than the bio
    if (sets === 'itemType' && e.target.value === 'users') {
      this.setState({ field: 'username' });
    }

    // Set itemType and field if they are defined in the popupMenu
    const currentMenu = this.props.getPopupMenu[this.state.step]();
    if (currentMenu.itemType) {
      this.setState({ itemType: currentMenu.itemType });
    }
    if (currentMenu.field) {
      this.setState({ field: currentMenu.field });
    }

    this.setState({ [sets]: e.target.value });
  };

  handleClickOutside = () => {
    if (this.state.showMenu) {
      this.closeMenu();
    }
  };

  render() {
    const { getPopupMenu, flaggedByCurrentUser } = this.props;
    const { localPost } = this.state;
    const flagged = flaggedByCurrentUser || localPost;
    const popupMenu = getPopupMenu[this.state.step](this.state.itemType);

    const { user } = this.props;

    console.log('RemoveButton.render() props', this.props);
    console.log('RemoveButton.render() user', user);

    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div className={`${name}-container`}>
          <button
            disabled={flagged}
            ref={ref => (this.RemoveButton = ref)}
            onClick={
              !this.props.banned && !flaggedByCurrentUser && !localPost
                ? this.onReportClick
                : null
            }
            className={cn(
              `${name}-button`,
              {
                [`${name}-button-flagged`]: flagged,
                [styles.flaggedButton]: flagged,
              },
              styles.button
            )}
          >
            {flagged ? (
              <span className={`${name}-button-text`}>{t('reported')}</span>
            ) : (
              <span className={`${name}-button-text`}>{t('remove')}</span>
            )}
            <i
              className={cn(`${name}-icon`, 'material-icons', styles.icon, {
                flaggedIcon: flagged,
                [styles.flaggedIcon]: flagged,
              })}
              aria-hidden={true}
            >
              delete
            </i>
          </button>
          {this.state.showMenu && (
            <div className={`${name}-popup`} ref={ref => (this.popup = ref)}>
              <PopupMenu>
                <div className={`${name}-popup-header`}>{popupMenu.header}</div>
                {popupMenu.text && (
                  <div className={`${name}-popup-text`}>{popupMenu.text}</div>
                )}
                {popupMenu.options && (
                  <form className={`${name}-popup-form`}>
                    {popupMenu.options.map(option => (
                      <div key={option.val}>
                        <input
                          className={`${name}-popup-radio`}
                          type="radio"
                          id={option.val}
                          checked={this.state[popupMenu.sets] === option.val}
                          onClick={this.onPopupOptionClick(popupMenu.sets)}
                          value={option.val}
                        />
                        <label
                          htmlFor={option.val}
                          className={`${name}-popup-radio-label`}
                        >
                          {option.text}
                        </label>
                        <br />
                      </div>
                    ))}
                  </form>
                )}
                <div className={`${name}-popup-counter`}>
                  {this.state.step + 1} of {getPopupMenu.length}
                </div>
                {popupMenu.button && (
                  <Button
                    className={`${name}-popup-button`}
                    onClick={this.onPopupContinue}
                  >
                    {popupMenu.button}
                  </Button>
                )}
              </PopupMenu>
            </div>
          )}
        </div>
      </ClickOutside>
    );
  }
}

RemoveButton.propTypes = {
  currentUser: PropTypes.object,
  getPopupMenu: PropTypes.array,
  notify: PropTypes.func,
  showSignInDialog: PropTypes.func,
};
