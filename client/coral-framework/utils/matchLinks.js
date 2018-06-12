import LinkifyIt from 'linkify-it';
import tlds from 'tlds';
const linkify = new LinkifyIt();
linkify.tlds(tlds);

linkify.set({
  fuzzyEmail: false,
  fuzzyLink: false,
});

export default function matchLinks(text) {
  return linkify.match(text);
}
