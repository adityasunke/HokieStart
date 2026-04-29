// Business logic for UC17–UC20
// Routes are wired in: backend/src/routes/community.js

const db = require("../config/db");

// ─────────────────────────────────────────────
// UC17: Post in Forum
// POST /community/posts  (protected)
// ─────────────────────────────────────────────
const createPost = async (req, res) => {
  // PSEUDOCODE:
  // 1. Get studentId from req.user (set by auth middleware)
  // 2. Destructure { title, body, category } from req.body
  // 3. Validate fields:
  //      - title.length between 5 and 120 → else return 400
  //      - body.length between 10 and 5000 → else return 400
  //      - category in allowed enum (academics, dining, housing, social, other) → else 400
  // 4. Run profanity filter on title + body
  //      if flagged → set isFlagged = true (don't reject, queue for admin review)
  // 5. Generate UUID for postId
  // 6. INSERT into POST: { postId, studentId, title, body, category, isFlagged, createdAt }
  // 7. Return 201 with the created post
  //
  // Performance target: post visible in feed within 1 second of submit
  return res.status(501).json({ message: "createPost not yet implemented" });
};

// ─────────────────────────────────────────────
// UC17: Browse Forum Feed
// GET /community/posts?category=...&page=...
// ─────────────────────────────────────────────
const getPosts = async (req, res) => {
  // PSEUDOCODE:
  // 1. Read query params: { category, page = 1, limit = 20 }
  // 2. Build query: SELECT * FROM POST WHERE isFlagged = false
  //      filter by category if provided
  //      ORDER BY createdAt DESC
  //      LIMIT/OFFSET for pagination
  // 3. Return 200: { posts, page, hasMore }
  return res.status(501).json({ message: "getPosts not yet implemented" });
};

// ─────────────────────────────────────────────
// UC17 (extension): Flag Inappropriate Post
// POST /community/posts/:postId/flag  (protected)
// ─────────────────────────────────────────────
const flagPost = async (req, res) => {
  // PSEUDOCODE:
  // 1. Get postId from req.params, studentId from req.user
  // 2. UPDATE POST set isFlagged = true where postId matches
  // 3. INSERT into flag_log: { postId, reportedBy: studentId, reportedAt }
  // 4. Admin moderation queue runs separately (out of scope here)
  // 5. Return 200: { message: "Post reported. Admins will review within 1 hour." }
  return res.status(501).json({ message: "flagPost not yet implemented" });
};

// ─────────────────────────────────────────────
// UC18: Create Study Group
// POST /community/study-groups  (protected)
// ─────────────────────────────────────────────
const createStudyGroup = async (req, res) => {
  // PSEUDOCODE:
  // 1. Get studentId (creator) from req.user
  // 2. Destructure { name, courseCode, maxMembers } from req.body
  // 3. Validate:
  //      - name length between 3 and 60
  //      - courseCode matches pattern like "CS 1114" or null for general groups
  //      - maxMembers between 2 and 25 (hard cap)
  // 4. Generate UUID for groupId
  // 5. INSERT into STUDY_GROUP: { groupId, courseCode, name, creatorId, maxMembers, createdAt }
  // 6. INSERT creator into GROUP_MEMBER as first member
  // 7. Return 201 with the created group
  return res.status(501).json({ message: "createStudyGroup not yet implemented" });
};

// ─────────────────────────────────────────────
// UC18: Join Study Group
// POST /community/study-groups/:groupId/join  (protected)
// ─────────────────────────────────────────────
const joinStudyGroup = async (req, res) => {
  // PSEUDOCODE:
  // 1. Get groupId from req.params, studentId from req.user
  // 2. SELECT group from STUDY_GROUP — if not found return 404
  // 3. Count current members in GROUP_MEMBER for this groupId
  //      if count >= maxMembers → return 409 "Group is full. Add to waitlist?"
  // 4. Check if student already in group → if yes return 409 "Already a member"
  // 5. INSERT into GROUP_MEMBER: { membershipId, groupId, studentId, joinedAt }
  // 6. Return 200 with group + member list
  //
  // Real-time chat handled separately via WebSocket connection (out of scope here)
  return res.status(501).json({ message: "joinStudyGroup not yet implemented" });
};

// ─────────────────────────────────────────────
// UC19: Search FAQ
// GET /community/faq/search?q=...
// ─────────────────────────────────────────────
const searchFAQ = async (req, res) => {
  // PSEUDOCODE:
  // 1. Read query string: const { q } = req.query
  // 2. If !q or q.length < 2 → return 400 "Search query must be at least 2 characters"
  // 3. Run full-text match against FAQ.question and FAQ.answer columns
  //      SELECT * FROM FAQ WHERE MATCH(question, answer) AGAINST (q)
  //      ORDER BY relevance score DESC
  //      LIMIT 10
  // 4. If no results → return 200 with empty array + suggestion to post in forum
  // 5. Return 200: { results, count }
  //
  // Performance target: respond within 1 second
  return res.status(501).json({ message: "searchFAQ not yet implemented" });
};

// ─────────────────────────────────────────────
// UC20: Submit Feedback
// POST /community/feedback  (protected)
// ─────────────────────────────────────────────
const submitFeedback = async (req, res) => {
  // PSEUDOCODE:
  // 1. Get studentId from req.user
  // 2. Destructure { category, description } from req.body
  // 3. Validate:
  //      - category in ["bug", "feature", "content", "other"] → else 400
  //      - description.trim() not empty AND length <= 2000 → else 400
  // 4. Generate UUID for feedbackId (also used as user-facing ticket ID)
  // 5. INSERT into FEEDBACK: { feedbackId, studentId, category, description, status: "open", createdAt }
  // 6. Send confirmation email to student with feedbackId as tracking number
  // 7. Return 201: { ticketId: feedbackId, message: "Feedback received. Reviewed within 48 hours." }
  return res.status(501).json({ message: "submitFeedback not yet implemented" });
};

module.exports = {
  createPost,
  getPosts,
  flagPost,
  createStudyGroup,
  joinStudyGroup,
  searchFAQ,
  submitFeedback,
};