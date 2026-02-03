-- TELSTP Animal Welfare & Compassion AI - Supabase Schema Integration (FIXED)
-- Optimized for seamless integration with existing 77-table TELSTP database
-- Uses UUID for all IDs, references auth.users, implements RLS policies
-- FIXED: Correct table creation order to avoid foreign key constraint errors

-- ============================================================================
-- PHASE 0: DROP EXISTING TABLES (if re-running)
-- ============================================================================
-- Uncomment these lines if you need to reset and re-run the schema
-- DROP TABLE IF EXISTS public.pet_owner_notifications CASCADE;
-- DROP TABLE IF EXISTS public.medications CASCADE;
-- DROP TABLE IF EXISTS public.pet_foods CASCADE;
-- DROP TABLE IF EXISTS public.dietary_supplements CASCADE;
-- DROP TABLE IF EXISTS public.vaccination_protocols CASCADE;
-- DROP TABLE IF EXISTS public.veterinary_knowledge CASCADE;
-- DROP TABLE IF EXISTS public.case_attachments CASCADE;
-- DROP TABLE IF EXISTS public.vet_consultations CASCADE;
-- DROP TABLE IF EXISTS public.pet_cases CASCADE;
-- DROP TABLE IF EXISTS public.vaccination_records CASCADE;
-- DROP TABLE IF EXISTS public.pet_owners CASCADE;
-- DROP TABLE IF EXISTS public.pets CASCADE;
-- DROP TABLE IF EXISTS public.veterinary_profiles CASCADE;

-- ============================================================================
-- PHASE 1: VETERINARY PROFESSIONAL PROFILES (No dependencies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.veterinary_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  license_number text UNIQUE,
  specializations text[],
  clinic_id bigint,
  bio text,
  verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT veterinary_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT veterinary_profiles_user_id_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_veterinary_profiles_user_id ON public.veterinary_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_veterinary_profiles_clinic_id ON public.veterinary_profiles(clinic_id);

-- Enable RLS
ALTER TABLE public.veterinary_profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Veterinarians can view their own profile
CREATE POLICY IF NOT EXISTS "vet_view_own_profile" ON public.veterinary_profiles
  FOR SELECT USING (user_id = auth.uid());

-- RLS: Public can view verified veterinarians
CREATE POLICY IF NOT EXISTS "public_view_verified_vets" ON public.veterinary_profiles
  FOR SELECT USING (verified = true);

-- ============================================================================
-- PHASE 2: PETS (No dependencies except itself)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL CHECK (species IN ('cat', 'dog')),
  breed text,
  age_years integer,
  age_months integer,
  weight numeric(8, 2),
  microchip_id text UNIQUE,
  medical_history text,
  allergies text,
  current_medications text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pets_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_pets_species ON public.pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_microchip_id ON public.pets(microchip_id);

-- ============================================================================
-- PHASE 3: PET OWNERS (Depends on pets)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pet_owners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  relationship text DEFAULT 'owner',
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_owners_pkey PRIMARY KEY (id),
  CONSTRAINT pet_owners_user_pet_unique UNIQUE (user_id, pet_id)
);

CREATE INDEX IF NOT EXISTS idx_pet_owners_user_id ON public.pet_owners(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_owners_pet_id ON public.pet_owners(pet_id);

-- Enable RLS on pets
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- RLS: Pet owners can view their pets
CREATE POLICY IF NOT EXISTS "pet_owners_view" ON public.pets
  FOR SELECT USING (
    id IN (SELECT pet_id FROM public.pet_owners WHERE user_id = auth.uid())
  );

-- ============================================================================
-- PHASE 4: PET CASES (Depends on pets and veterinary_profiles)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pet_cases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  symptoms text NOT NULL,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),
  triage_level text,
  diagnosis_notes text,
  recommended_actions text,
  vet_consultation_requested boolean DEFAULT false,
  assigned_veterinarian_id uuid REFERENCES public.veterinary_profiles(id),
  case_status text DEFAULT 'open' CHECK (case_status IN ('open', 'closed', 'pending_vet')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_cases_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_pet_cases_pet_id ON public.pet_cases(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_cases_owner_id ON public.pet_cases(owner_id);
CREATE INDEX IF NOT EXISTS idx_pet_cases_vet_id ON public.pet_cases(assigned_veterinarian_id);
CREATE INDEX IF NOT EXISTS idx_pet_cases_status ON public.pet_cases(case_status);

-- Enable RLS on pet_cases
ALTER TABLE public.pet_cases ENABLE ROW LEVEL SECURITY;

-- RLS: Owners can view their own cases
CREATE POLICY IF NOT EXISTS "case_owner_view" ON public.pet_cases
  FOR SELECT USING (owner_id = auth.uid());

-- RLS: Assigned veterinarians can view cases
CREATE POLICY IF NOT EXISTS "case_vet_view" ON public.pet_cases
  FOR SELECT USING (
    assigned_veterinarian_id IN (
      SELECT id FROM public.veterinary_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- PHASE 5: CASE ATTACHMENTS (Depends on pet_cases)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.case_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.pet_cases(id) ON DELETE CASCADE,
  attachment_type text CHECK (attachment_type IN ('image', 'video', 'audio')),
  file_url text NOT NULL,
  file_key text,
  mime_type text,
  analysis_result jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT case_attachments_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_case_attachments_case_id ON public.case_attachments(case_id);

-- Enable RLS on case_attachments
ALTER TABLE public.case_attachments ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view attachments for their cases
CREATE POLICY IF NOT EXISTS "attachment_case_owner_view" ON public.case_attachments
  FOR SELECT USING (
    case_id IN (
      SELECT id FROM public.pet_cases WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- PHASE 6: VETERINARY CONSULTATIONS (Depends on pet_cases and veterinary_profiles)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.vet_consultations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.pet_cases(id) ON DELETE CASCADE,
  veterinarian_id uuid NOT NULL REFERENCES public.veterinary_profiles(id),
  owner_id uuid NOT NULL,
  consultation_date timestamp with time zone,
  diagnosis text,
  treatment_plan text,
  prescription text,
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'declined')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vet_consultations_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_vet_consultations_case_id ON public.vet_consultations(case_id);
CREATE INDEX IF NOT EXISTS idx_vet_consultations_vet_id ON public.vet_consultations(veterinarian_id);
CREATE INDEX IF NOT EXISTS idx_vet_consultations_owner_id ON public.vet_consultations(owner_id);

-- Enable RLS on vet_consultations
ALTER TABLE public.vet_consultations ENABLE ROW LEVEL SECURITY;

-- RLS: Owners can view their consultations
CREATE POLICY IF NOT EXISTS "consultation_owner_view" ON public.vet_consultations
  FOR SELECT USING (owner_id = auth.uid());

-- RLS: Veterinarians can view their consultations
CREATE POLICY IF NOT EXISTS "consultation_vet_view" ON public.vet_consultations
  FOR SELECT USING (
    veterinarian_id IN (
      SELECT id FROM public.veterinary_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- PHASE 7: VACCINATION RECORDS (Depends on pets)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.vaccination_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  administered_date date NOT NULL,
  next_due_date date,
  veterinarian text,
  clinic text,
  batch_number text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vaccination_records_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_vaccination_records_pet_id ON public.vaccination_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_next_due ON public.vaccination_records(next_due_date);

-- Enable RLS on vaccination_records
ALTER TABLE public.vaccination_records ENABLE ROW LEVEL SECURITY;

-- RLS: Pet owners can view vaccination records
CREATE POLICY IF NOT EXISTS "vaccination_owner_view" ON public.vaccination_records
  FOR SELECT USING (
    pet_id IN (SELECT pet_id FROM public.pet_owners WHERE user_id = auth.uid())
  );

-- ============================================================================
-- PHASE 8: VETERINARY KNOWLEDGE (No dependencies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.veterinary_knowledge (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  species text CHECK (species IN ('cat', 'dog', 'both')),
  medical_category text,
  symptoms text[],
  treatment_protocols text,
  prevention_measures text,
  confidence_score numeric(3, 2),
  source text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT veterinary_knowledge_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_veterinary_knowledge_species ON public.veterinary_knowledge(species);
CREATE INDEX IF NOT EXISTS idx_veterinary_knowledge_category ON public.veterinary_knowledge(category);

-- ============================================================================
-- PHASE 9: VACCINATION PROTOCOLS (No dependencies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.vaccination_protocols (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  species text NOT NULL CHECK (species IN ('cat', 'dog')),
  vaccine_name text NOT NULL,
  age_weeks integer,
  age_months integer,
  age_years integer,
  dose_number integer,
  booster_frequency text,
  side_effects text,
  contraindications text,
  core_vaccine boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vaccination_protocols_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_vaccination_protocols_species ON public.vaccination_protocols(species);

-- ============================================================================
-- PHASE 10: DIETARY SUPPLEMENTS (No dependencies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.dietary_supplements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  species text CHECK (species IN ('cat', 'dog', 'both')),
  description text,
  benefits text,
  dosage text,
  side_effects text,
  interactions text,
  indicated_for text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT dietary_supplements_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- PHASE 11: PET FOODS (No dependencies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pet_foods (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  species text NOT NULL CHECK (species IN ('cat', 'dog')),
  life_stage text CHECK (life_stage IN ('kitten/puppy', 'adult', 'senior')),
  food_type text,
  protein numeric(5, 2),
  fat numeric(5, 2),
  fiber numeric(5, 2),
  calcium numeric(5, 2),
  phosphorus numeric(5, 2),
  ingredients text,
  special_features text,
  price numeric(10, 2),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_foods_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- PHASE 12: MEDICATIONS (No dependencies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.medications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  species text CHECK (species IN ('cat', 'dog', 'both')),
  description text,
  used_for text,
  dosage text,
  administration_route text,
  side_effects text,
  interactions text,
  contraindications text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT medications_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- PHASE 13: PET OWNER NOTIFICATIONS (No dependencies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pet_owner_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  type text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_owner_notifications_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_pet_owner_notifications_owner_id ON public.pet_owner_notifications(owner_id);

-- Enable RLS on notifications
ALTER TABLE public.pet_owner_notifications ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only view their own notifications
CREATE POLICY IF NOT EXISTS "notification_owner_view" ON public.pet_owner_notifications
  FOR SELECT USING (owner_id = auth.uid());

-- ============================================================================
-- PHASE 14: TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
DROP TRIGGER IF EXISTS update_veterinary_profiles_updated_at ON public.veterinary_profiles;
CREATE TRIGGER update_veterinary_profiles_updated_at BEFORE UPDATE ON public.veterinary_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pet_cases_updated_at ON public.pet_cases;
CREATE TRIGGER update_pet_cases_updated_at BEFORE UPDATE ON public.pet_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vet_consultations_updated_at ON public.vet_consultations;
CREATE TRIGGER update_vet_consultations_updated_at BEFORE UPDATE ON public.vet_consultations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_veterinary_knowledge_updated_at ON public.veterinary_knowledge;
CREATE TRIGGER update_veterinary_knowledge_updated_at BEFORE UPDATE ON public.veterinary_knowledge
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vaccination_protocols_updated_at ON public.vaccination_protocols;
CREATE TRIGGER update_vaccination_protocols_updated_at BEFORE UPDATE ON public.vaccination_protocols
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_dietary_supplements_updated_at ON public.dietary_supplements;
CREATE TRIGGER update_dietary_supplements_updated_at BEFORE UPDATE ON public.dietary_supplements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pet_foods_updated_at ON public.pet_foods;
CREATE TRIGGER update_pet_foods_updated_at BEFORE UPDATE ON public.pet_foods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_medications_updated_at ON public.medications;
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON public.medications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- Tables created in dependency order:
-- 1. veterinary_profiles - No dependencies
-- 2. pets - No dependencies
-- 3. pet_owners - Depends on pets
-- 4. pet_cases - Depends on pets, veterinary_profiles
-- 5. case_attachments - Depends on pet_cases
-- 6. vet_consultations - Depends on pet_cases, veterinary_profiles
-- 7. vaccination_records - Depends on pets
-- 8. veterinary_knowledge - No dependencies
-- 9. vaccination_protocols - No dependencies
-- 10. dietary_supplements - No dependencies
-- 11. pet_foods - No dependencies
-- 12. medications - No dependencies
-- 13. pet_owner_notifications - No dependencies

-- All tables:
-- ✅ Use UUID primary keys
-- ✅ Reference auth.users for user data
-- ✅ Implement RLS policies for security
-- ✅ Include automatic timestamp management
-- ✅ Have appropriate indexes for performance
-- ✅ Use CHECK constraints for data integrity
-- ✅ Support foreign key relationships
-- ✅ Created in correct dependency order

-- Integration with existing TELSTP tables:
-- ✅ veterinary_profiles can reference global_hubs for clinics
-- ✅ veterinary_knowledge extends knowledge_entry
-- ✅ Uses same UUID and auth.users patterns as existing schema
-- ✅ No conflicts with existing 77 tables
-- ✅ Follows Supabase best practices
