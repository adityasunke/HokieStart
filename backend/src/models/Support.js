// FAQ and Feedback models

/**
 * FAQ table schema
 * Curated by admins — read-only for students
 *
 * faqId      STRING  PK
 * question   STRING  full-text indexed
 * answer     STRING  full-text indexed
 * category   STRING  "academics" | "campus" | "housing" | "tech" | "other"
 * adminId    STRING  FK → ADMIN  (last editor)
 * updatedAt  TIMESTAMP
 */

/**
 * FEEDBACK table schema
 * User-submitted bug reports and suggestions
 *
 * feedbackId   STRING  PK  (also serves as user-facing ticket ID)
 * studentId    STRING  FK → STUDENT
 * category     STRING  "bug" | "feature" | "content" | "other"
 * description  STRING  1–2000 chars
 * status       STRING  "open" | "in_progress" | "resolved"  default "open"
 * createdAt    TIMESTAMP
 */

module.exports = {};