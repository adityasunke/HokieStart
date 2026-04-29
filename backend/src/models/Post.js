// Forum models — POST and COMMENT

/**
 * POST table schema (mirrors schema.sql)
 *
 * postId      STRING   PK
 * studentId   STRING   FK → STUDENT  (post author)
 * title       STRING   5–120 chars
 * body        STRING   10–5000 chars
 * category    STRING   "academics" | "dining" | "housing" | "social" | "other"
 * isFlagged   BOOLEAN  default false — true = pending admin review
 * createdAt   TIMESTAMP
 */

/**
 * COMMENT table schema
 * Threaded replies under a POST
 *
 * commentId  STRING  PK
 * postId     STRING  FK → POST
 * studentId  STRING  FK → STUDENT  (comment author)
 * body       STRING  1–1000 chars
 * createdAt  TIMESTAMP
 */

// PSEUDOCODE: needsModeration(title, body)
//   return profanityFilter.check(title + " " + body)

module.exports = {};