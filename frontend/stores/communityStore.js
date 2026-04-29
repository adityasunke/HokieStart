// Community module state

// PSEUDOCODE — wire to Redux Toolkit or Zustand (matching authStore choice)
const initialState = {
  // Forum
  posts: [],            // current feed cache
  feedCategory: "all",  // active category filter
  feedPage: 1,
  hasMorePosts: true,

  // Study Groups
  myGroups: [],         // groups the user is a member of
  activeGroupId: null,  // currently open chat

  // FAQ
  lastSearchQuery: "",
  faqResults: [],

  // Feedback
  lastTicketId: null,   // shown in submission confirmation modal
};

// Actions (pseudocode):
//
// appendPosts(newPosts)
//   - merge newPosts into state.posts (dedupe by postId)
//   - increment feedPage
//   - update hasMorePosts based on returned batch size
//
// removePost(postId)
//   - filter local feed (used after a flag is confirmed for the current user's view)
//
// addMyGroup(group)
//   - push onto myGroups after successful create or join
//
// setFAQResults(query, results)
//   - cache last query + results so toggling tabs doesn't re-fetch
//
// recordTicket(ticketId)
//   - used by feedback confirmation modal

// TODO: implement using chosen state library
module.exports = { initialState };