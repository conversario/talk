import React, { Component } from 'react';

import t from 'coral-framework/services/i18n';

import { PopupMenu, Button } from 'coral-ui';
import ClickOutside from 'coral-framework/components/ClickOutside';
import cn from 'classnames';
import styles from './RemoveButton.css';
import popupstyles from './Popup.css';
import PropTypes from 'prop-types';

const name = 'talk-plugin-remove-comment';

export default class RemoveButton extends Component {
  state = {
    showMenu: false,
    reason: '',
    step: 0,
  };

  componentDidUpdate() {
    if (this.popup) {
      // this will be defined when the reporting popup is opened
      this.popup.firstChild.style.top = `${this.RemoveButton.offsetTop -
        this.popup.firstChild.clientHeight -
        15}px`;
    }
  }

  // When the "Remove" button is clicked expand the menu
  onButtonClick = () => {
    if (this.state.showMenu) {
      this.closeMenu();
    } else {
      this.setState({ showMenu: true });
    }
  };

  closeMenu = () => {
    this.setState({
      showMenu: false,
      reason: '',
      step: 0,
    });
  };

  // The form is only submittable if one of the options is selected. If the
  // form/popup does not have any options, then it's submittable right away.
  formIsSubmittable = () =>
    !this.props.getPopupMenu().options || this.state.reason;

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
      if (this.formIsSubmittable()) {
        try {
          await deleteComment({ id, reason });
        } catch (errors) {
          failed = true;
        }
      } else {
        failed = true;
      }
    }

    if (!failed) {
      this.setState({ step: step + 1 });
    }
  };

  handleClickOutside = () => {
    if (this.state.showMenu) {
      this.closeMenu();
    }
  };

  render() {
    const { getPopupMenu } = this.props;

    const popupMenu = getPopupMenu();
    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div className={`${name}-container`}>
          <button
            ref={ref => (this.RemoveButton = ref)}
            onClick={this.onButtonClick}
            className={cn(`${name}-button`, styles.button)}
          >
            <span className={`${name}-button-text`}>{t(name + '.remove')}</span>
            <i
              className={cn(`${name}-icon`, 'material-icons', styles.icon)}
              aria-hidden={true}
            >
              delete
            </i>
          </button>
          {this.state.showMenu && (
            <div className={`${name}-popup`} ref={ref => (this.popup = ref)}>
              <PopupMenu>
                <div className={cn(popupstyles.header)}>{popupMenu.header}</div>
                {popupMenu.text && (
                  <p className={cn(popupstyles.text)}>{popupMenu.text}</p>
                )}
                {popupMenu.options && (
                  <form className={cn(popupstyles.form)}>
                    {popupMenu.options.map(option => (
                      <div key={option.val}>
                        <input
                          className={cn(popupstyles.radio)}
                          type="radio"
                          id={option.val}
                          checked={this.state.reason === option.val}
                          onClick={e =>
                            this.setState({ reason: e.target.value })
                          }
                          value={option.val}
                        />
                        <label
                          htmlFor={option.val}
                          className={cn(popupstyles.radioLabel)}
                        >
                          <i>{option.text}</i>
                        </label>
                        <br />
                      </div>
                    ))}
                  </form>
                )}
                {popupMenu.button && (
                  <Button
                    className={cn(popupstyles.button)}
                    onClick={this.onPopupContinue}
                    disabled={!this.formIsSubmittable()}
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
  getPopupMenu: PropTypes.func,
  notify: PropTypes.func,
};
