-- Test Admin User (password: Admin1234!)
INSERT INTO "USER" (user_id, email, password_hash, is_verified, role)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'admin@vt.edu',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/o4r9KuFXi',
  TRUE,
  'admin'
);

INSERT INTO "ADMIN" (user_id, name, role)
VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'HokieStart Admin', 'System Admin');

-- Test Student User (password: Student1234!)
INSERT INTO "USER" (user_id, email, password_hash, is_verified, role)
VALUES (
  'bbbbbbbb-0000-0000-0000-000000000001',
  'student@vt.edu',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uSN5/g6IkK',
  TRUE,
  'student'
);

INSERT INTO "STUDENT" (user_id, name, major, graduation_year, display_name, notification_enabled, is_onboarded)
VALUES (
  'bbbbbbbb-0000-0000-0000-000000000001',
  'Test Student',
  'Computer Science',
  2028,
  'HokieStudent',
  TRUE,
  FALSE
);

-- Academic Resources
INSERT INTO "RESOURCE" (title, url, description, category) VALUES
  ('Canvas',              'https://canvas.vt.edu',          'Course materials, assignments, and grades.',              'academic'),
  ('HokieSpa',           'https://hokiespa.vt.edu',         'Registration, financial aid, and transcripts.',           'academic'),
  ('Cengage',            'https://www.cengage.com',         'Digital textbooks and online homework sets.',             'academic'),
  ('ALEKS',              'https://www.aleks.com',           'Math placement and knowledge assessments.',               'academic'),
  ('Scholar',            'https://scholar.lib.vt.edu',      'Virginia Tech library and research databases.',           'academic'),
  ('Duo Security',       'https://duo.vt.edu',              'Two-factor authentication for VT systems.',               'academic'),
  ('Hokie Passport',     'https://hokiepassport.vt.edu',    'Campus ID, dining flex dollars, and building access.',    'financial'),
  ('Bursar Account',     'https://bursar.vt.edu',           'Tuition payments and student account management.',        'financial'),
  ('Financial Aid',      'https://finaid.vt.edu',           'Scholarships, loans, and aid status.',                    'financial'),
  ('VT Career Center',   'https://career.vt.edu',           'Internships, jobs, and career resources.',                'career'),
  ('Cook Counseling',    'https://ucc.vt.edu',              'Mental health and counseling services.',                  'health'),
  ('Schiffert Health',   'https://healthcenter.vt.edu',     'On-campus medical and health services.',                  'health'),
  ('VT Housing',         'https://housing.vt.edu',          'Dorm assignments, housing contracts, and facilities.',    'housing'),
  ('Dining Services',    'https://dining.vt.edu',           'Dining halls, hours, and meal plan info.',                'housing'),
  ('Recreational Sports','https://recsports.vt.edu',        'Gym, intramurals, fitness classes, and sports clubs.',    'health');

-- Sample notifications for test student
INSERT INTO "NOTIFICATION" (student_id, message, type, category)
SELECT student_id, 'Welcome to HokieStart! Get started by completing your onboarding checklist.', 'announcement', 'general'
FROM "STUDENT" WHERE user_id = 'bbbbbbbb-0000-0000-0000-000000000001';

INSERT INTO "NOTIFICATION" (student_id, message, type, category)
SELECT student_id, 'URGENT: Campus Move-in Updates — Traffic alerts for Drillfield area starting tomorrow morning.', 'alert', 'general'
FROM "STUDENT" WHERE user_id = 'bbbbbbbb-0000-0000-0000-000000000001';
