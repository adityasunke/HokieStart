// API layer for auth use cases (UC1–UC4)

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// ─── UC1: Create Account ───────────────────────────────────────
export const registerUser = async (email, name, password) => {
  // PSEUDOCODE:
  // 1. POST ${BASE_URL}/auth/register with { email, name, password }
  // 2. On 201 navigate to "Check your email" screen
  // 3. On 400 show "Must use a @vt.edu email address"
  // 4. On 409 show "An account with this email already exists"
  throw new Error("registerUser not yet implemented");
};

// ─── UC2: Log In ───────────────────────────────────────────────
export const loginUser = async (email, password) => {
  // PSEUDOCODE:
  // 1. POST ${BASE_URL}/auth/login with { email, password }
  // 2. On 200 receive { token }, store in SecureStore
  // 3. On 401 show "Invalid email or password"
  // 4. On 423 show "Account locked. Try again in 15 minutes."
  // Returns: JWT token string
  throw new Error("loginUser not yet implemented");
};

// ─── UC2: Log Out ──────────────────────────────────────────────
export const logoutUser = async (token) => {
  // PSEUDOCODE:
  // 1. POST ${BASE_URL}/auth/logout with Authorization: Bearer <token>
  // 2. On 200 clear token from SecureStore → navigate to login screen
  throw new Error("logoutUser not yet implemented");
};

// ─── UC3: Edit Profile ─────────────────────────────────────────
export const updateProfile = async (token, fields) => {
  // PSEUDOCODE:
  // fields: { displayName, major, graduationYear, profilePhotoUri }
  // 1. If profilePhotoUri provided → validate file size < 5MB client-side
  // 2. PUT ${BASE_URL}/auth/profile with fields + Authorization header
  // 3. On 200 update local state
  // 4. On 413 show "Photo must be under 5MB"
  throw new Error("updateProfile not yet implemented");
};

// ─── UC4: Request Password Reset ───────────────────────────────
export const requestPasswordReset = async (email) => {
  // PSEUDOCODE:
  // 1. POST ${BASE_URL}/auth/password-reset/request with { email }
  // 2. Always show: "If this email is registered, a reset link has been sent"
  //    regardless of response (mirrors backend enumeration protection)
  throw new Error("requestPasswordReset not yet implemented");
};

// ─── UC4: Confirm Password Reset ───────────────────────────────
export const confirmPasswordReset = async (token, newPassword) => {
  // PSEUDOCODE:
  // 1. Client-side validation: length >= 8, contains at least one number
  // 2. POST ${BASE_URL}/auth/password-reset/confirm with { token, newPassword }
  // 3. On 200 navigate to login screen
  // 4. On 410 show "Link expired. Request a new reset email."
  throw new Error("confirmPasswordReset not yet implemented");
};