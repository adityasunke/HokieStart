// API layer for community use cases (UC17–UC20)

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// ─── UC17: Create Forum Post ────────────────────────────────────
export const createPost = async (token, { title, body, category }) => {
  // PSEUDOCODE:
  // 1. POST ${BASE_URL}/community/posts with body + Authorization header
  // 2. On 201 prepend new post to local feed cache
  // 3. On 400 surface validation error (which field failed)
  throw new Error("createPost not yet implemented");
};

// ─── UC17: Fetch Forum Feed ─────────────────────────────────────
export const getPosts = async (token, { category, page = 1 } = {}) => {
  // PSEUDOCODE:
  // 1. GET ${BASE_URL}/community/posts?category=${category}&page=${page}
  // 2. Return { posts, hasMore } for infinite scroll
  // 3. Cache results by category for offline view
  throw new Error("getPosts not yet implemented");
};

// ─── UC17: Flag a Post ──────────────────────────────────────────
export const flagPost = async (token, postId) => {
  // PSEUDOCODE:
  // 1. POST ${BASE_URL}/community/posts/${postId}/flag with Authorization header
  // 2. On 200 show toast: "Reported. Admins will review within 1 hour."
  throw new Error("flagPost not yet implemented");
};

// ─── UC18: Create Study Group ───────────────────────────────────
export const createStudyGroup = async (token, { name, courseCode, maxMembers }) => {
  // PSEUDOCODE:
  // 1. POST ${BASE_URL}/community/study-groups with body + Authorization header
  // 2. On 201 navigate to the new group's chat screen
  throw new Error("createStudyGroup not yet implemented");
};

// ─── UC18: Join Study Group ─────────────────────────────────────
export const joinStudyGroup = async (token, groupId) => {
  // PSEUDOCODE:
  // 1. POST ${BASE_URL}/community/study-groups/${groupId}/join with Authorization
  // 2. On 200 navigate to group chat
  // 3. On 409 "Group is full" → prompt user to join waitlist
  throw new Error("joinStudyGroup not yet implemented");
};

// ─── UC19: Search FAQ ───────────────────────────────────────────
export const searchFAQ = async (query) => {
  // PSEUDOCODE:
  // 1. GET ${BASE_URL}/community/faq/search?q=${encodeURIComponent(query)}
  // 2. Debounce caller-side by 300ms to limit rapid-fire requests
  // 3. On 200 return ranked list of { question, answer, category }
  // 4. On empty results show "No matches — try the forum or contact support"
  throw new Error("searchFAQ not yet implemented");
};

// ─── UC20: Submit Feedback ──────────────────────────────────────
export const submitFeedback = async (token, { category, description }) => {
  // PSEUDOCODE:
  // 1. Client-side validation: category set, description not empty, length <= 2000
  // 2. POST ${BASE_URL}/community/feedback with body + Authorization
  // 3. On 201 show confirmation modal with returned ticketId
  // 4. On 400 highlight the offending form field
  throw new Error("submitFeedback not yet implemented");
};