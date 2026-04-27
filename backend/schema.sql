-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ════════════════════════════════════════
-- AUTH TABLES (Aryan's module)
-- ════════════════════════════════════════

CREATE TABLE "USER" (
  user_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_verified   BOOLEAN DEFAULT FALSE,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "SESSION" (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES "USER"(user_id) ON DELETE CASCADE,
  token      TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE TABLE "PASSWORD_RESET_TOKEN" (
  token_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES "USER"(user_id) ON DELETE CASCADE,
  token      VARCHAR(512) NOT NULL,
  expires_at TIMESTAMP NOT NULL
);

CREATE TABLE "STUDENT" (
  student_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID UNIQUE NOT NULL REFERENCES "USER"(user_id) ON DELETE CASCADE,
  name                 VARCHAR(255),
  major                VARCHAR(255),
  graduation_year      INT,
  display_name         VARCHAR(255),
  profile_photo_url    TEXT,
  notification_enabled BOOLEAN DEFAULT TRUE,
  is_onboarded         BOOLEAN DEFAULT FALSE
);

CREATE TABLE "ADMIN" (
  admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  UUID UNIQUE NOT NULL REFERENCES "USER"(user_id) ON DELETE CASCADE,
  name     VARCHAR(255),
  role     VARCHAR(100)
);

-- ════════════════════════════════════════
-- RESOURCE TABLES (Sankalp's module)
-- ════════════════════════════════════════

CREATE TABLE "RESOURCE" (
  resource_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES "ADMIN"(admin_id) ON DELETE SET NULL,
  title       VARCHAR(255) NOT NULL,
  url         TEXT,
  description TEXT,
  category    VARCHAR(100),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "BOOKMARK" (
  bookmark_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES "STUDENT"(student_id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES "RESOURCE"(resource_id) ON DELETE CASCADE,
  saved_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, resource_id)
);

CREATE TABLE "NOTIFICATION" (
  notif_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES "STUDENT"(student_id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  type       VARCHAR(100) DEFAULT 'announcement',
  category   VARCHAR(100) DEFAULT 'general',
  is_read    BOOLEAN DEFAULT FALSE,
  sent_at    TIMESTAMP DEFAULT NOW()
);

-- ════════════════════════════════════════
-- TASK TABLES (Ishaan's module)
-- ════════════════════════════════════════

CREATE TABLE "TASK" (
  task_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES "STUDENT"(student_id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  due_date    DATE,
  description TEXT,
  is_complete BOOLEAN DEFAULT FALSE
);

CREATE TABLE "REMINDER" (
  reminder_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id         UUID NOT NULL REFERENCES "TASK"(task_id) ON DELETE CASCADE,
  scheduled_time  TIMESTAMP NOT NULL,
  delivery_method VARCHAR(50) DEFAULT 'push'
);

CREATE TABLE "ONBOARDING_CHECKLIST" (
  checklist_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID UNIQUE NOT NULL REFERENCES "STUDENT"(student_id) ON DELETE CASCADE,
  completion_status INT DEFAULT 0,
  last_updated      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "CHECKLIST_ITEM" (
  item_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID NOT NULL REFERENCES "ONBOARDING_CHECKLIST"(checklist_id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE
);

-- ════════════════════════════════════════
-- NAVIGATION TABLES (Aditya's module)
-- ════════════════════════════════════════

CREATE TABLE "LOCATION" (
  location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  latitude    FLOAT NOT NULL,
  longitude   FLOAT NOT NULL,
  category    VARCHAR(100)
);

CREATE TABLE "SAVED_LOCATION" (
  saved_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES "STUDENT"(student_id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES "LOCATION"(location_id) ON DELETE CASCADE,
  date_saved  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "ROUTE" (
  route_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_location_id UUID REFERENCES "LOCATION"(location_id),
  dest_location_id   UUID REFERENCES "LOCATION"(location_id),
  distance           FLOAT,
  duration           FLOAT,
  route_type         VARCHAR(50) DEFAULT 'walking'
);

-- ════════════════════════════════════════
-- COMMUNITY TABLES (Varun's module)
-- ════════════════════════════════════════

CREATE TABLE "FORUM_POST" (
  post_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES "STUDENT"(student_id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  body       TEXT NOT NULL,
  category   VARCHAR(100),
  tags       TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "STUDY_GROUP" (
  group_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  course      VARCHAR(100),
  max_members INT DEFAULT 10
);

CREATE TABLE "STUDENT_STUDY_GROUP" (
  student_id UUID NOT NULL REFERENCES "STUDENT"(student_id) ON DELETE CASCADE,
  group_id   UUID NOT NULL REFERENCES "STUDY_GROUP"(group_id) ON DELETE CASCADE,
  role       VARCHAR(50) DEFAULT 'member',
  joined_at  TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (student_id, group_id)
);

CREATE TABLE "FAQ_ENTRY" (
  faq_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id  UUID REFERENCES "ADMIN"(admin_id) ON DELETE SET NULL,
  question  TEXT NOT NULL,
  answer    TEXT NOT NULL,
  category  VARCHAR(100)
);

CREATE TABLE "FEEDBACK_REPORT" (
  report_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       UUID NOT NULL REFERENCES "STUDENT"(student_id) ON DELETE CASCADE,
  category         VARCHAR(100),
  subject          VARCHAR(255),
  description      TEXT,
  reference_number VARCHAR(100),
  attachment_url   TEXT,
  submitted_at     TIMESTAMP DEFAULT NOW()
);
