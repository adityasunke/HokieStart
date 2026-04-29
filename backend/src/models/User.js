//Core identity model for HokieStart

/**
 * USER table schema (mirrors schema.sql)
 *
 * userId       STRING  PK
 * email        STRING  unique, must be @vt.edu
 * passwordHash STRING  bcrypt hashed — never plain text
 * isVerified   BOOLEAN default false
 * role         STRING  "student" | "admin"
 * createdAt    TIMESTAMP
 */

/**
 * SESSION table schema
 *
 * sessionId  STRING  PK
 * userId     STRING  FK → USER
 * token      STRING  JWT
 * createdAt  TIMESTAMP
 * expiresAt  TIMESTAMP  24 hours from creation
 */

/**
 * PASSWORD_RESET_TOKEN table schema
 *
 * tokenId    STRING  PK
 * userId     STRING  FK → USER
 * token      STRING  random secure token
 * expiresAt  TIMESTAMP  30 minutes from creation
 */

// PSEUDOCODE: isExpired(expiresAt)
//   return new Date() > new Date(expiresAt)

module.exports = {};