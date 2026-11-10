/**
 * Production-ready Supabase PostgreSQL Schema & Migration for Genius Zone Model School (GZMS)
 * Ready to copy & paste into the Supabase SQL Editor.
 */

export const SUPABASE_SQL_SCHEMA = `-- ====================================================================
-- GENIUS ZONE MODEL SCHOOL (GZMS) - COMPLETE POSTGRESQL / SUPABASE SCHEMA
-- Address: Balachowra, Badarganj, Rangpur, Bangladesh
-- Email: info.sbf21@gmail.com | Phone: 01308177171
-- ====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS & ROLES
CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'TEACHER', 'STAFF', 'STUDENT', 'GUARDIAN');

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'STUDENT',
    name_bangla VARCHAR(200),
    name_english VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCHOOL SETTINGS
CREATE TABLE IF NOT EXISTS public.school_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_name_bangla VARCHAR(255) DEFAULT 'জিনিয়াস জোন মডেল স্কুল',
    school_name_english VARCHAR(255) DEFAULT 'Genius Zone Model School',
    school_short_name VARCHAR(50) DEFAULT 'GZMS',
    tagline_english VARCHAR(255) DEFAULT 'Where Dreams Come True',
    tagline_bangla VARCHAR(255) DEFAULT 'যেখানে স্বপ্ন সত্যি হয়।',
    address_bangla TEXT DEFAULT 'বালাচৌড়া, বদরগঞ্জ, রংপুর, বাংলাদেশ',
    address_english TEXT DEFAULT 'Balachowra, Badarganj, Rangpur, Bangladesh',
    email VARCHAR(255) DEFAULT 'info.sbf21@gmail.com',
    phone VARCHAR(50) DEFAULT '01308177171',
    logo_url TEXT,
    director_name VARCHAR(200) DEFAULT 'মোঃ দেলোয়ার হোসেন',
    director_speech TEXT,
    director_photo_url TEXT,
    director_signature_url TEXT,
    president_name VARCHAR(200) DEFAULT 'অধ্যক্ষ মোস্তাফিজুর রহমান',
    president_speech TEXT,
    president_photo_url TEXT,
    president_signature_url TEXT,
    attendance_cutoff_time TIME DEFAULT '09:20:00',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLASSES, SECTIONS & SUBJECTS
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'Class 5', 'Play', 'Nursery'
    numeric_order INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    name VARCHAR(20) NOT NULL, -- e.g. 'A', 'Padma', 'Meghna'
    UNIQUE(class_id, name)
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_code VARCHAR(20),
    name_bangla VARCHAR(100) NOT NULL,
    name_english VARCHAR(100) NOT NULL,
    full_marks INT DEFAULT 100,
    pass_marks INT DEFAULT 33
);

-- 4. REGISTRATION SEQUENCE GENERATOR (GZMS0001 format)
CREATE SEQUENCE IF NOT EXISTS gzms_reg_seq START 1;

CREATE OR REPLACE FUNCTION generate_gzms_reg_number()
RETURNS TEXT AS $$
DECLARE
    next_val INT;
BEGIN
    SELECT nextval('gzms_reg_seq') INTO next_val;
    RETURN 'GZMS' || LPAD(next_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 5. STUDENT PROFILES
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reg_number VARCHAR(20) UNIQUE NOT NULL DEFAULT generate_gzms_reg_number(),
    roll_number VARCHAR(20) NOT NULL,
    current_class_id UUID REFERENCES public.classes(id),
    current_section_id UUID REFERENCES public.sections(id),
    academic_session VARCHAR(10) NOT NULL DEFAULT '2026',
    name_bangla VARCHAR(200),
    name_english VARCHAR(200) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(10),
    photo_url TEXT,
    village VARCHAR(100),
    post_office VARCHAR(100),
    upazila VARCHAR(100) DEFAULT 'Badarganj',
    district VARCHAR(100) DEFAULT 'Rangpur',
    country VARCHAR(100) DEFAULT 'Bangladesh',
    father_name_english VARCHAR(200) NOT NULL,
    mother_name_english VARCHAR(200) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    alt_phone VARCHAR(20),
    present_address TEXT NOT NULL,
    permanent_address TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    admission_date DATE DEFAULT CURRENT_DATE,
    scholarship_pct INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(academic_session, current_class_id, roll_number)
);

-- 6. TEACHER PROFILES
CREATE TABLE IF NOT EXISTS public.teacher_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name_bangla VARCHAR(200),
    name_english VARCHAR(200) NOT NULL,
    designation_bangla VARCHAR(100),
    designation_english VARCHAR(100) NOT NULL,
    subject_specialization VARCHAR(100),
    qualification VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    photo_url TEXT,
    short_bio TEXT,
    joining_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADMISSION APPLICATIONS
CREATE TABLE IF NOT EXISTS public.admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) UNIQUE NOT NULL,
    reg_number VARCHAR(20) UNIQUE NOT NULL,
    applied_class_id UUID REFERENCES public.classes(id),
    academic_session VARCHAR(10) NOT NULL DEFAULT '2026',
    student_name_bangla VARCHAR(200),
    student_name_english VARCHAR(200) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    photo_url TEXT,
    previous_school TEXT,
    previous_result_gpa VARCHAR(10),
    father_name_english VARCHAR(200) NOT NULL,
    mother_name_english VARCHAR(200) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    present_address TEXT NOT NULL,
    permanent_address TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    assigned_roll VARCHAR(20),
    scholarship_pct INT DEFAULT 0,
    admin_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ATTENDANCE TABLE (QR & Manual)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    attendance_time TIME NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'PRESENT', -- PRESENT, ABSENT, LATE
    method VARCHAR(20) DEFAULT 'QR_SCAN', -- QR_SCAN, MANUAL
    sms_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, attendance_date)
);

-- 9. EXAMINATIONS & RESULTS
CREATE TABLE IF NOT EXISTS public.examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name VARCHAR(150) NOT NULL,
    academic_session VARCHAR(10) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    admit_card_distribution_date DATE,
    rules_bangla JSONB,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.examinations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id),
    subject_marks JSONB NOT NULL, -- Array of {subject_name, marks, gpa, letter_grade}
    total_marks INT NOT NULL,
    average_marks NUMERIC(5,2),
    overall_gpa NUMERIC(3,2) NOT NULL,
    final_grade VARCHAR(5) NOT NULL,
    position_in_class INT,
    remarks TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

-- 10. FEES & BKASH PAYMENTS
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    academic_session VARCHAR(10) NOT NULL,
    admission_fee NUMERIC(10,2) DEFAULT 0,
    monthly_tuition_fee NUMERIC(10,2) DEFAULT 0,
    exam_fee NUMERIC(10,2) DEFAULT 0,
    session_fee NUMERIC(10,2) DEFAULT 0,
    other_charges NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challan_number VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    payment_category VARCHAR(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'bKash',
    bkash_sender_phone VARCHAR(20),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    admin_notes TEXT,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTICES & PROMOTIONAL POPUPS
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    target_audience VARCHAR(50) DEFAULT 'ALL',
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    content TEXT NOT NULL,
    is_featured_homepage BOOLEAN DEFAULT FALSE,
    pdf_attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.popup_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_enabled BOOLEAN DEFAULT TRUE,
    title VARCHAR(255),
    banner_image_url TEXT NOT NULL,
    external_link TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    display_frequency VARCHAR(50) DEFAULT 'ONCE_PER_SESSION',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to school settings and public notices
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read school settings" ON public.school_settings FOR SELECT USING (true);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active notices" ON public.notices FOR SELECT USING (publish_date <= CURRENT_DATE);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_student_reg ON public.student_profiles(reg_number);
CREATE INDEX IF NOT EXISTS idx_student_roll_class ON public.student_profiles(academic_session, current_class_id, roll_number);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_payment_txid ON public.fee_payments(transaction_id);
`;
