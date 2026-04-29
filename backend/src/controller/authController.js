// Business logic for UC1–UC4
// Routes are wired in: backend/src/routes/auth.js

const db = require("../config/db");

// ─────────────────────────────────────────────
// UC1: Create Account
// POST /auth/register
// ─────────────────────────────────────────────
const createAccount = async (req, res) => {
  // PSEUDOCODE:
  // 1. Destructure { email, name, password } from req.body
  // 2. Validate email domain — must end with @vt.edu
  //      if (!email.endsWith("@vt.edu")) return 400
  // 3. Check DB for existing user with same email
  //      if exists then return 409 Conflict
  // 4. Hash password: const hash = await bcrypt.hash(password, 10)
  // 5. Generate UUID for userId
  // 6. INSERT into USER table: { userId, email, hash, isVerified: false, role: "student" }
  // 7. Generate verification token (crypto.randomBytes)
  // 8. INSERT into PASSWORD_RESET_TOKEN or separate verify_tokens table
  // 9. Send verification email via nodemailer/SMTP
  // 10. Return 201: { message: "Check your email to verify your account" }
  //
  // Performance target: complete within 3 seconds of email verification
  return res.status(501).json({ message: "createAccount not yet implemented" });
};

// ─────────────────────────────────────────────
// UC2: Log In
// POST /auth/login
// ─────────────────────────────────────────────
const login = async (req, res) => {
  // PSEUDOCODE:
  // 1. Destructure { email, password } from req.body
  // 2. Query DB for user by email
  //      if not found → return 401 with generic "Invalid email or password"
  // 3. Check isVerified — if false then return 403 "Please verify your email first"
  // 4. Check failed attempt count in DB
  //      if >= 5 AND within 15-minute lockout window then return 423 "Account locked"
  // 5. Compare password: const match = await bcrypt.compare(password, user.passwordHash)
  //      if no match then increment failed attempts in DB so return 401
  // 6. Reset failed attempt counter on success
  // 7. Sign JWT: jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "24h" })
  // 8. INSERT into SESSION table: { sessionId, userId, token, expiresAt }
  // 9. Return 200: { token }
  //
  // Performance target: respond within 2 seconds
  // Also supports: Virginia Tech SSO / Hokie PASSPort (OAuth flow — TODO)
  return res.status(501).json({ message: "login not yet implemented" });
};

// ─────────────────────────────────────────────
// UC2: Log Out
// POST /auth/logout  (protected)
// ─────────────────────────────────────────────
const logout = async (req, res) => {
  // PSEUDOCODE:
  // 1. Extract userId from req.user (set by auth middleware)
  // 2. DELETE SESSION record matching userId + token from DB
  // 3. Return 200: { message: "Logged out successfully" }
  return res.status(501).json({ message: "logout not yet implemented" });
};

// ─────────────────────────────────────────────
// UC3: Edit Profile
// PUT /auth/profile  (protected)
// ─────────────────────────────────────────────
const editProfile = async (req, res) => {
  // PSEUDOCODE:
  // 1. Get userId from req.user (injected by auth middleware)
  // 2. Destructure allowed fields: { displayName, major, graduationYear, profilePhotoUrl }
  // 3. Validate no required field is blank
  // 4. If profilePhoto included:
  //      - Check file size <= 5MB then reject 413 if over limit
  //      - Upload to Firebase Storage then get download URL
  // 5. UPDATE STUDENT record in DB for matching userId
  // 6. Return 200 with updated student record
  //
  // Storage: photos into Firebase Storage, text fields into relational DB (schema.sql)
  return res.status(501).json({ message: "editProfile not yet implemented" });
};

// ─────────────────────────────────────────────
// UC4: Request Password Reset — Step 1
// POST /auth/password-reset/request
// ─────────────────────────────────────────────
const requestPasswordReset = async (req, res) => {
  // PSEUDOCODE:
  // 1. Destructure { email } from req.body
  // 2. ALWAYS return the same generic response regardless of outcome:
  //      { message: "If this email is registered, a reset link has been sent" }
  //      (prevents account enumeration attacks)
  // 3. Lookup user by email in DB — if not found, stop here (generic response already sent)
  // 4. Generate secure random token: crypto.randomBytes(32).toString("hex")
  // 5. Set expiresAt = now + 30 minutes
  // 6. INSERT into PASSWORD_RESET_TOKEN table
  // 7. Send reset email with link: /reset-password?token=<token>
  return res.status(501).json({ message: "requestPasswordReset not yet implemented" });
};

// ─────────────────────────────────────────────
// UC4: Confirm New Password — Step 2
// POST /auth/password-reset/confirm
// ─────────────────────────────────────────────
const resetPassword = async (req, res) => {
  // PSEUDOCODE:
  // 1. Destructure { token, newPassword } from req.body
  // 2. Lookup token in PASSWORD_RESET_TOKEN table
  //      if not found then return 410 "Invalid or expired reset link"
  // 3. Check expiry: if new Date() > expiresAt then return 410 + prompt to request new link
  // 4. Validate newPassword:
  //      - length >= 8 characters
  //      - contains at least one number
  //      - if fails then return 400 with specific requirement message
  // 5. Hash new password: bcrypt.hash(newPassword, 10)
  // 6. UPDATE USER.passwordHash in DB
  // 7. DELETE used token from PASSWORD_RESET_TOKEN table (one-time use)
  // 8. Return 200: { message: "Password updated. Please log in." }
  return res.status(501).json({ message: "resetPassword not yet implemented" });
};

module.exports = {
  createAccount,
  login,
  logout,
  editProfile,
  requestPasswordReset,
  resetPassword,
};