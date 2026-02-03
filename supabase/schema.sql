-- TELSTP Animal Welfare & Compassion AI - Supabase PostgreSQL Schema
-- This schema is compatible with Drizzle ORM and supports all veterinary platform features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (core authentication)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "lastSignedIn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(50) NOT NULL CHECK (species IN ('cat', 'dog')),
  breed VARCHAR(255),
  age_years INT,
  age_months INT,
  weight DECIMAL(8, 2),
  "microchipId" VARCHAR(255),
  "medicalHistory" TEXT,
  "allergies" TEXT,
  "currentMedications" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Case history table
CREATE TABLE IF NOT EXISTS cases (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "petId" INT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  symptoms TEXT NOT NULL,
  severity VARCHAR(50) CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),
  "triageLevel" VARCHAR(50),
  "diagnosisNotes" TEXT,
  "recommendedActions" TEXT,
  "vetConsultationRequested" BOOLEAN DEFAULT FALSE,
  "consultationNotes" TEXT,
  "caseStatus" VARCHAR(50) DEFAULT 'open' CHECK ("caseStatus" IN ('open', 'closed', 'pending_vet')),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Case attachments (images, videos, audio)
CREATE TABLE IF NOT EXISTS case_attachments (
  id SERIAL PRIMARY KEY,
  "caseId" INT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  "attachmentType" VARCHAR(50) CHECK ("attachmentType" IN ('image', 'video', 'audio')),
  "fileUrl" TEXT NOT NULL,
  "fileKey" TEXT,
  "mimeType" VARCHAR(100),
  "analysisResult" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disease database
CREATE TABLE IF NOT EXISTS diseases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(50) NOT NULL CHECK (species IN ('cat', 'dog')),
  category VARCHAR(100),
  description TEXT,
  symptoms TEXT,
  "causativeAgent" VARCHAR(255),
  "transmissionMethod" VARCHAR(255),
  "incubationPeriod" VARCHAR(255),
  "treatmentProtocol" TEXT,
  "preventiveMeasures" TEXT,
  "zoonoticRisk" BOOLEAN DEFAULT FALSE,
  "zoonoticNotes" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaccination protocols
CREATE TABLE IF NOT EXISTS vaccination_protocols (
  id SERIAL PRIMARY KEY,
  species VARCHAR(50) NOT NULL CHECK (species IN ('cat', 'dog')),
  "vaccineName" VARCHAR(255) NOT NULL,
  "ageWeeks" INT,
  "ageMonths" INT,
  "ageYears" INT,
  "doseNumber" INT,
  "boosterFrequency" VARCHAR(255),
  "sideEffects" TEXT,
  "contraindications" TEXT,
  "coreVaccine" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaccination records
CREATE TABLE IF NOT EXISTS vaccination_records (
  id SERIAL PRIMARY KEY,
  "petId" INT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  "vaccineName" VARCHAR(255) NOT NULL,
  "administeredDate" DATE NOT NULL,
  "nextDueDate" DATE,
  "veterinarian" VARCHAR(255),
  "clinic" VARCHAR(255),
  "batchNumber" VARCHAR(255),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dietary supplements
CREATE TABLE IF NOT EXISTS dietary_supplements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  species VARCHAR(50) CHECK (species IN ('cat', 'dog', 'both')),
  description TEXT,
  benefits TEXT,
  dosage TEXT,
  "sideEffects" TEXT,
  "interactions" TEXT,
  "indicatedFor" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pet food database
CREATE TABLE IF NOT EXISTS pet_foods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  species VARCHAR(50) NOT NULL CHECK (species IN ('cat', 'dog')),
  "lifeStage" VARCHAR(100) CHECK ("lifeStage" IN ('kitten/puppy', 'adult', 'senior')),
  "foodType" VARCHAR(100),
  "protein" DECIMAL(5, 2),
  "fat" DECIMAL(5, 2),
  "fiber" DECIMAL(5, 2),
  "calcium" DECIMAL(5, 2),
  "phosphorus" DECIMAL(5, 2),
  ingredients TEXT,
  "specialFeatures" TEXT,
  price DECIMAL(10, 2),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications database
CREATE TABLE IF NOT EXISTS medications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  species VARCHAR(50) CHECK (species IN ('cat', 'dog', 'both')),
  description TEXT,
  "usedFor" TEXT,
  dosage TEXT,
  "administrationRoute" VARCHAR(100),
  "sideEffects" TEXT,
  "interactions" TEXT,
  contraindications TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Veterinarian profiles
CREATE TABLE IF NOT EXISTS veterinarians (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320),
  phone VARCHAR(20),
  license_number VARCHAR(255),
  specializations TEXT,
  clinic_name VARCHAR(255),
  clinic_address TEXT,
  clinic_phone VARCHAR(20),
  clinic_website VARCHAR(255),
  "isVerified" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultation requests
CREATE TABLE IF NOT EXISTS consultation_requests (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "caseId" INT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  "veterinarianId" INT REFERENCES veterinarians(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'declined')),
  "requestedDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "consultationDate" TIMESTAMP,
  "consultationNotes" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Veterinary clinics
CREATE TABLE IF NOT EXISTS veterinary_clinics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(20),
  email VARCHAR(320),
  website VARCHAR(255),
  "isEmergency" BOOLEAN DEFAULT FALSE,
  "operatingHours" TEXT,
  services TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Owner notifications
CREATE TABLE IF NOT EXISTS owner_notifications (
  id SERIAL PRIMARY KEY,
  "ownerId" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50),
  "isRead" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Educational content
CREATE TABLE IF NOT EXISTS educational_content (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  "contentType" VARCHAR(50) CHECK ("contentType" IN ('article', 'video', 'image', 'guide')),
  species VARCHAR(50) CHECK (species IN ('cat', 'dog', 'both')),
  category VARCHAR(100),
  "authorName" VARCHAR(255),
  "sourceUrl" VARCHAR(255),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_openid ON users("openId");
CREATE INDEX idx_pets_userid ON pets("userId");
CREATE INDEX idx_cases_userid ON cases("userId");
CREATE INDEX idx_cases_petid ON cases("petId");
CREATE INDEX idx_case_attachments_caseid ON case_attachments("caseId");
CREATE INDEX idx_diseases_species ON diseases(species);
CREATE INDEX idx_vaccination_records_petid ON vaccination_records("petId");
CREATE INDEX idx_consultation_requests_userid ON consultation_requests("userId");
CREATE INDEX idx_consultation_requests_caseid ON consultation_requests("caseId");
CREATE INDEX idx_owner_notifications_ownerid ON owner_notifications("ownerId");
CREATE INDEX idx_educational_content_species ON educational_content(species);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diseases_updated_at BEFORE UPDATE ON diseases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaccination_protocols_updated_at BEFORE UPDATE ON vaccination_protocols
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dietary_supplements_updated_at BEFORE UPDATE ON dietary_supplements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pet_foods_updated_at BEFORE UPDATE ON pet_foods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_veterinarians_updated_at BEFORE UPDATE ON veterinarians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultation_requests_updated_at BEFORE UPDATE ON consultation_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_veterinary_clinics_updated_at BEFORE UPDATE ON veterinary_clinics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_educational_content_updated_at BEFORE UPDATE ON educational_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS) for multi-tenant safety
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (id = auth.uid()::int);

CREATE POLICY "Users can view their own pets" ON pets
  FOR SELECT USING ("userId" = auth.uid()::int);

CREATE POLICY "Users can view their own cases" ON cases
  FOR SELECT USING ("userId" = auth.uid()::int);

CREATE POLICY "Users can view their own case attachments" ON case_attachments
  FOR SELECT USING ("caseId" IN (SELECT id FROM cases WHERE "userId" = auth.uid()::int));

CREATE POLICY "Users can view their own vaccination records" ON vaccination_records
  FOR SELECT USING ("petId" IN (SELECT id FROM pets WHERE "userId" = auth.uid()::int));

CREATE POLICY "Users can view their own consultation requests" ON consultation_requests
  FOR SELECT USING ("userId" = auth.uid()::int);

CREATE POLICY "Users can view their own notifications" ON owner_notifications
  FOR SELECT USING ("ownerId" = auth.uid()::int);
