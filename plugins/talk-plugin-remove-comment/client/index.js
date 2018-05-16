import RemoveComment from './containers/RemoveComment';
import DeletedTombstone from './containers/DeletedTombstone';
import translations from './translations.yml';

export default {
  slots: {
    commentActions: [RemoveComment],
    commentTombstone: [DeletedTombstone],
  },
  translations,
};
