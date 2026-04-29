// Student and Admin profile models

/**
 * STUDENT table schema (mirrors schema.sql)
 * Extends USER via userId FK (is-a relationship)
 *
 * studentId            STRING   PK
 * userId               STRING   FK → USER
 * name                 STRING
 * major                STRING
 * graduationYear       INTEGER
 * displayName          STRING
 * profilePhotoUrl      STRING   Firebase Storage URL
 * notificationEnabled  BOOLEAN  default true
 * isOnboarded          BOOLEAN  default false
 */

/**
 * ADMIN table schema
 * Extends USER via userId FK (is-a relationship)
 *
 * adminId   STRING  PK
 * userId    STRING  FK → USER
 * name      STRING
 * role      STRING  e.g. "staff", "org"
 */

module.exports = {};