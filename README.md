# HokieStart

Freshman onboarding app concept for Virginia Tech. This repo contains use case documentation, pseudocode, conceptual diagrams, and presentation materials. There is no production code.

**CS 3704 · Software Engineering · Virginia Tech**

---

## Team

| Member | Module |
|---|---|
| Aryan Shiva | Account Setup & User Management |
| Sankalp Dasari | Academic Resource Hub |
| Aditya Sunke | Campus Navigation |
| Ishaan Jain | Onboarding & Task Management |
| Varun Singh | Community & Support |

---

## Modules

**Account Setup & User Management (UC1-UC4)**
VT email verification, JWT session tokens, profile editing, and password reset.

**Academic Resource Hub (UC5-UC8)**
Sub-1-second keyword search across Canvas, HokieSpa, ALEKS, and Cengage. Admin-managed resource library with bookmark persistence.

**Campus Navigation (UC9-UC12)**
Interactive campus map, location search, saved places, and walking/driving route generation.

**Onboarding & Task Management (UC13-UC16)**
First-login checklist, personal task creation, completion tracking, and push notification reminders.

**Community & Support (UC17-UC20)**
Discussion forum, course-based study groups, searchable FAQ, and a categorized feedback/bug report system.

---

## Key Non-Functional Requirements

| Requirement | Target |
|---|---|
| Resource search | < 1 second |
| Map load time | < 2 seconds |
| Route calculation | < 3 seconds |
| Login response | < 2 seconds |
| Task reminder delay | at most 1 minute |
| Concurrent users | 500+ |
| Session token expiry | 24 hours |
| Password reset link expiry | 30 minutes |
| Registration | @vt.edu addresses only |
| Password storage | Hashed, never plaintext |
| Data privacy | FERPA-compliant |
