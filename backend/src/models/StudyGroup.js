// Study group models

/**
 * STUDY_GROUP table schema
 *
 * groupId      STRING   PK
 * courseCode   STRING   e.g., "CS 1114" — nullable for general-interest groups
 * name         STRING   3–60 chars
 * creatorId    STRING   FK → STUDENT
 * maxMembers   INTEGER  2–25 (hard cap)
 * createdAt    TIMESTAMP
 */

/**
 * GROUP_MEMBER junction table (M:N STUDENT ↔ STUDY_GROUP)
 *
 * membershipId  STRING  PK
 * groupId       STRING  FK → STUDY_GROUP
 * studentId     STRING  FK → STUDENT
 * joinedAt      TIMESTAMP
 */

// PSEUDOCODE: isFull(groupId)
//   const count = SELECT COUNT(*) FROM GROUP_MEMBER WHERE groupId = ?
//   const group = SELECT maxMembers FROM STUDY_GROUP WHERE groupId = ?
//   return count >= group.maxMembers

module.exports = {};