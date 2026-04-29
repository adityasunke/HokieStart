// Auth state management

// PSEUDOCODE — wire to Redux Toolkit or Zustand
const initialState = {
  token: null,       // JWT string from login
  userId: null,      // decoded from token payload
  role: null,        // "student" | "admin"
  isVerified: false, // flipped true after email verification
  isOnboarded: false,// flipped true after onboarding checklist complete
};

// Actions (pseudocode):
//
// setToken(token)
//   - decode payload: { userId, role } = jwtDecode(token)
//   - update state: token, userId, role
//   - persist token to SecureStore
//
// clearAuth()
//   - reset all fields to initialState
//   - remove token from SecureStore
//   - navigate to login screen
//
// setOnboarded()
//   - set isOnboarded = true
//   - used by Ishaan's onboarding module after checklist completion

// TODO: implement using chosen state library
module.exports = { initialState };