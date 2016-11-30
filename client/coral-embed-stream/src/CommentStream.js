import React, {Component, PropTypes} from 'react';
import Pym from 'pym.js';
import {connect} from 'react-redux';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
const lang = new I18n(translations);

import {
  itemActions,
  Notification,
  notificationActions,
  authActions,
} from '../../coral-framework';

import CommentBox from '../../coral-plugin-commentbox/CommentBox';
import InfoBox from '../../coral-plugin-infobox/InfoBox';
import Content from '../../coral-plugin-commentcontent/CommentContent';
import PubDate from '../../coral-plugin-pubdate/PubDate';
import Count from '../../coral-plugin-comment-count/CommentCount';
import AuthorName from '../../coral-plugin-author-name/AuthorName';
import {ReplyBox, ReplyButton} from '../../coral-plugin-replies';
import FlagButton from '../../coral-plugin-flags/FlagButton';
import LikeButton from '../../coral-plugin-likes/LikeButton';
import PermalinkButton from '../../coral-plugin-permalinks/PermalinkButton';
import SignInContainer from '../../coral-sign-in/containers/SignInContainer';
import UserBox from '../../coral-sign-in/components/UserBox';
import {TabBar, Tab, TabContent, Spinner} from '../../coral-ui';
import SettingsContainer from '../../coral-settings/containers/SettingsContainer';
import RestrictedContent from '../../coral-framework/components/RestrictedContent';

const {addItem, updateItem, postItem, getStream, postAction, deleteAction, appendItemArray} = itemActions;
const {addNotification, clearNotification} = notificationActions;
const {logout} = authActions;

const mapStateToProps = state => ({
  config: state.config.toJS(),
  items: state.items.toJS(),
  notification: state.notification.toJS(),
  auth: state.auth.toJS()
});

const mapDispatchToProps = (dispatch) => ({
  addItem: (item, itemType) => dispatch(addItem(item, itemType)),
  updateItem: (id, property, value, itemType) => dispatch(updateItem(id, property, value, itemType)),
  postItem: (data, type, id) => dispatch(postItem(data, type, id)),
  getStream: (rootId) => dispatch(getStream(rootId)),
  addNotification: (type, text) => dispatch(addNotification(type, text)),
  clearNotification: () => dispatch(clearNotification()),
  postAction: (item, action, user, itemType) => dispatch(postAction(item, action, user, itemType)),
  deleteAction: (item, action, user, itemType) => dispatch(deleteAction(item, action, user, itemType)),
  appendItemArray: (item, property, value, addToFront, itemType) => dispatch(appendItemArray(item, property, value, addToFront, itemType)),
  logout: () => dispatch(logout())
});

class CommentStream extends Component {

  constructor (props) {
    super(props);

    this.state = {
      activeTab: 0
    };

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab (tab) {
    this.setState({
      activeTab: tab
    });
  }

  static propTypes = {
    items: PropTypes.object.isRequired,
    addItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired
  }

  componentDidMount () {
    // Set up messaging between embedded Iframe an parent component
    // Using recommended Pym init code which violates .eslint standards
    const pym = new Pym.Child({polling: 100});

    if (/https?\:\/\/([^?]+)/.test(pym.parentUrl)) {
      this.props.getStream(pym.parentUrl);
    } else {
      this.props.getStream(window.location);
    }
  }

  render () {
    if (Object.keys(this.props.items).length === 0) {
        // Loading mock asset
      this.props.postItem({
        comments: [],
        url: 'http://coralproject.net'
      }, 'asset', 'assetTest');
    }

    // TODO: Replace teststream id with id from params

    const rootItemId = this.props.items.assets && Object.keys(this.props.items.assets)[0];
    const rootItem = this.props.items.assets && this.props.items.assets[rootItemId];
    const {actions, users, comments} = this.props.items;
    const {loggedIn, user, showSignInDialog} = this.props.auth;
    const {activeTab} = this.state;
    return <div className={showSignInDialog ? 'expandForSignin' : ''}>
      {
        rootItem
        ? <div>
          <TabBar onChange={this.changeTab} activeTab={activeTab}>
            <Tab><Count id={rootItemId} items={this.props.items}/></Tab>
            <Tab>Settings</Tab>
          </TabBar>
          {loggedIn && <UserBox user={user} logout={this.props.logout} />}
          {/* Add to the restricted param a boolean if the user is suspended*/}
          <RestrictedContent restricted={false} message={lang.t('suspendedAccountMsg')}>
            <TabContent show={activeTab === 0}>
              <div id="commentBox">
                <InfoBox
                  content={this.props.config.infoBoxContent}
                  enable={this.props.config.infoBoxEnable}
                />
                <CommentBox
                  addNotification={this.props.addNotification}
                  postItem={this.props.postItem}
                  appendItemArray={this.props.appendItemArray}
                  updateItem={this.props.updateItem}
                  id={rootItemId}
                  premod={this.props.config.moderation}
                  reply={false}
                  author={user}
                />
                {!loggedIn && <SignInContainer />}
              </div>
              {
                rootItem.comments && rootItem.comments.map(commentId => {
                  const comment = comments[commentId];
                  // This should be a return Comment Component
                  return <div className="comment" key={commentId}>
                    <hr aria-hidden={true}/>
                    <AuthorName author={users[comment.author_id]}/>
                    <PubDate created_at={comment.created_at}/>
                    <Content body={comment.body}/>
                    <div className="commentActionsLeft">
                      <ReplyButton
                        updateItem={this.props.updateItem}
                        id={commentId}
                        showReply={comment.showReply}/>
                      <LikeButton
                        addNotification={this.props.addNotification}
                        id={commentId}
                        like={actions[comment.like]}
                        postAction={this.props.postAction}
                        deleteAction={this.props.deleteAction}
                        addItem={this.props.addItem}
                        updateItem={this.props.updateItem}
                        currentUser={this.props.auth.user}/>
                    </div>
                    <div className="commentActionsRight">
                      <FlagButton
                        addNotification={this.props.addNotification}
                        id={commentId}
                        flag={actions[comment.flag]}
                        postAction={this.props.postAction}
                        deleteAction={this.props.deleteAction}
                        addItem={this.props.addItem}
                        updateItem={this.props.updateItem}
                        currentUser={this.props.auth.user}/>
                        <PermalinkButton
                          comment_id={commentId}
                          asset_id={comment.asset_id}/>
                    </div>
                      <ReplyBox
                        addNotification={this.props.addNotification}
                        postItem={this.props.postItem}
                        appendItemArray={this.props.appendItemArray}
                        updateItem={this.props.updateItem}
                        id={rootItemId}
                        author={user}
                        parent_id={commentId}
                        premod={this.props.config.moderation}
                        showReply={comment.showReply}/>
                      {
                        comment.children &&
                        comment.children.map((replyId) => {
                          let reply = this.props.items.comments[replyId];
                          // This should be a Reply Component
                          return <div className="reply" key={replyId}>
                            <hr aria-hidden={true}/>
                            <AuthorName author={users[reply.author_id]}/>
                            <PubDate created_at={reply.created_at}/>
                            <Content body={reply.body}/>
                            <div className="replyActionsLeft">
                                <ReplyButton
                                  updateItem={this.props.updateItem}
                                  id={replyId}
                                  showReply={reply.showReply}/>
                                <LikeButton
                                  addNotification={this.props.addNotification}
                                  id={replyId}
                                  like={this.props.items.actions[reply.like]}
                                  postAction={this.props.postAction}
                                  deleteAction={this.props.deleteAction}
                                  addItem={this.props.addItem}
                                  updateItem={this.props.updateItem}
                                  currentUser={this.props.auth.user}/>
                              </div>
                              <div className="replyActionsRight">
                                <FlagButton
                                  addNotification={this.props.addNotification}
                                  id={replyId}
                                  flag={this.props.items.actions[reply.flag]}
                                  postAction={this.props.postAction}
                                  deleteAction={this.props.deleteAction}
                                  addItem={this.props.addItem}
                                  updateItem={this.props.updateItem}
                                  currentUser={this.props.auth.user}/>
                                  <PermalinkButton
                                    comment_id={reply.parent_id}
                                    asset_id={rootItemId}
                                    />
                              </div>
                              <ReplyBox
                                addNotification={this.props.addNotification}
                                postItem={this.props.postItem}
                                appendItemArray={this.props.appendItemArray}
                                updateItem={this.props.updateItem}
                                id={rootItemId}
                                author={user}
                                parent_id={commentId}
                                child_id={replyId}
                                premod={this.props.config.moderation}
                                showReply={reply.showReply}/>
                          </div>;
                        })
                    }
                  </div>;
                })
              }
              <Notification
                notifLength={4500}
                clearNotification={this.props.clearNotification}
                notification={this.props.notification}
              />
            </TabContent>
            <TabContent show={activeTab === 1}>
                <SettingsContainer loggedIn={loggedIn} user={user} />
            </TabContent>
          </RestrictedContent>
        </div>
        :
        <Spinner/>
      }
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentStream);
