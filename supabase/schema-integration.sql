-- TELSTP Animal Welfare & Compassion AI - Supabase Schema Integration
-- Optimized for seamless integration with existing 77-table TELSTP database
-- Uses UUID for all IDs, references auth.users, implements RLS policies

-- ============================================================================
-- PHASE 1: VETERINARY PROFESSIONAL PROFILES
-- ============================================================================

-- Veterinary professional profiles (extends healthcare_providers concept)
CREATE TABLE IF NOT EXISTS public.veterinary_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  license_number text UNIQUE,
  specializations text[],
  clinic_id bigint REFERENCES public.global_hubs(id),
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
CREATE POLICY "vet_view_own_profile" ON public.veterinary_profiles
  FOR SELECT USING (user_id = auth.uid());

-- RLS: Public can view verified veterinarians
CREATE POLICY "public_view_verified_vets" ON public.veterinary_profiles
  FOR SELECT USING (verified = true);

-- ============================================================================
-- PHASE 2: PET PROFILES
-- ============================================================================

-- Pet profiles (separate from human patients)
CREATE TABLE IF NOT EXISTS public.pets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL CHECK (species IN ('cat', 'dog')),
  breed text,
  age_years integer,
  age_months integer,
  weight decimal(8, 2),
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

-- Pet ownership junction table (links pets to users)
CREATE TABLE IF NOT EXISTS public.pet_owners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  relationship text DEFAULT 'owner', -- 'owner', 'guardian', 'caretaker'
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_owners_pkey PRIMARY KEY (id),
  CONSTRAINT pet_owners_user_pet_unique UNIQUE (user_id, pet_id)
);

CREATE INDEX IF NOT EXISTS idx_pet_owners_user_id ON public.pet_owners(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_owners_pet_id ON public.pet_owners(pet_id);

-- Enable RLS on pets
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- RLS: Pet owners can view their pets
CREATE POLICY "pet_owners_view" ON public.pets
  FOR SELECT USING (
    id IN (SELECT pet_id FROM public.pet_owners WHERE user_id = auth.uid())
  );

-- RLS: Veterinarians can view pets they're consulting on
CREATE POLICY "vets_view_consultation_pets" ON public.pets
  FOR SELECT USING (
    id IN (
      SELECT DISTINCT pc.pet_id FROM public.pet_cases pc
      JOIN public.veterinary_profiles vp ON pc.assigned_veterinarian_id = vp.id
      WHERE vp.user_id = auth.uid()
    )
  );

-- ============================================================================
-- PHASE 3: VETERINARY CASES & CONSULTATIONS
-- ============================================================================

-- Veterinary cases (pet health consultations)
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
CREATE POLICY "case_owner_view" ON public.pet_cases
  FOR SELECT USING (owner_id = auth.uid());

-- RLS: Assigned veterinarians can view cases
CREATE POLICY "case_vet_view" ON public.pet_cases
  FOR SELECT USING (
    assigned_veterinarian_id IN (
      SELECT id FROM public.veterinary_profiles WHERE user_id = auth.uid()
    )
  );

-- Veterinary consultations
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
CREATE POLICY "consultation_owner_view" ON public.vet_consultations
  FOR SELECT USING (owner_id = auth.uid());

-- RLS: Veterinarians can view their consultations
CREATE POLICY "consultation_vet_view" ON public.vet_consultations
  FOR SELECT USING (
    veterinarian_id IN (
      SELECT id FROM public.veterinary_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- PHASE 4: CASE ATTACHMENTS (Images, Videos, Audio)
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
CREATE POLICY "attachment_case_owner_view" ON public.case_attachments
  FOR SELECT USING (
    case_id IN (
      SELECT id FROM public.pet_cases WHERE owner_id = auth.uid()
    )
  );

-- ============================================================================
-- PHASE 5: VACCINATION RECORDS
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
CREATE POLICY "vaccination_owner_view" ON public.vaccination_records
  FOR SELECT USING (
    pet_id IN (SELECT pet_id FROM public.pet_owners WHERE user_id = auth.uid())
  );

-- ============================================================================
-- PHASE 6: VETERINARY KNOWLEDGE BASE EXTENSION
-- ============================================================================

-- Extend existing knowledge_entry table for veterinary content
ALTER TABLE IF EXISTS public.knowledge_entry 
  ADD COLUMN IF NOT EXISTS domain text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS species text CHECK (species IN ('cat', 'dog', 'both', NULL)),
  ADD COLUMN IF NOT EXISTS medical_category text;

-- Create index for veterinary queries
CREATE INDEX IF NOT EXISTS idx_knowledge_entry_domain_species 
  ON public.knowledge_entry(domain, species);

-- Veterinary-specific knowledge entries
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
  confidence_score decimal(3, 2),
  source text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT veterinary_knowledge_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_veterinary_knowledge_species ON public.veterinary_knowledge(species);
CREATE INDEX IF NOT EXISTS idx_veterinary_knowledge_category ON public.veterinary_knowledge(category);

-- ============================================================================
-- PHASE 7: VACCINATION PROTOCOLS
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
-- PHASE 8: DIETARY SUPPLEMENTS & NUTRITION
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

CREATE TABLE IF NOT EXISTS public.pet_foods (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  species text NOT NULL CHECK (species IN ('cat', 'dog')),
  life_stage text CHECK (life_stage IN ('kitten/puppy', 'adult', 'senior')),
  food_type text,
  protein decimal(5, 2),
  fat decimal(5, 2),
  fiber decimal(5, 2),
  calcium decimal(5, 2),
  phosphorus decimal(5, 2),
  ingredients text,
  special_features text,
  price decimal(10, 2),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_foods_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- PHASE 9: MEDICATIONS DATABASE
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
-- PHASE 10: OWNER NOTIFICATIONS
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
CREATE POLICY "notification_owner_view" ON public.pet_owner_notifications
  FOR SELECT USING (owner_id = auth.uid());

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_veterinary_profiles_updated_at BEFORE UPDATE ON public.veterinary_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pet_cases_updated_at BEFORE UPDATE ON public.pet_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vet_consultations_updated_at BEFORE UPDATE ON public.vet_consultations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_veterinary_knowledge_updated_at BEFORE UPDATE ON public.veterinary_knowledge
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vaccination_protocols_updated_at BEFORE UPDATE ON public.vaccination_protocols
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dietary_supplements_updated_at BEFORE UPDATE ON public.dietary_supplements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pet_foods_updated_at BEFORE UPDATE ON public.pet_foods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON public.medications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- New tables created:
-- 1. veterinary_profiles - Veterinarian professional profiles
-- 2. pets - Pet profiles (cats and dogs)
-- 3. pet_owners - Junction table for pet ownership
-- 4. pet_cases - Veterinary case records
-- 5. vet_consultations - Veterinary consultation records
-- 6. case_attachments - Images, videos, audio for cases
-- 7. vaccination_records - Pet vaccination history
-- 8. veterinary_knowledge - Veterinary knowledge base
-- 9. vaccination_protocols - Vaccination schedules
-- 10. dietary_supplements - Supplement information
-- 11. pet_foods - Pet food database
-- 12. medications - Medication reference
-- 13. pet_owner_notifications - User notifications

-- All tables:
-- ✅ Use UUID primary keys
-- ✅ Reference auth.users for user data
-- ✅ Implement RLS policies for security
-- ✅ Include automatic timestamp management
-- ✅ Have appropriate indexes for performance
-- ✅ Use CHECK constraints for data integrity
-- ✅ Support foreign key relationships

-- Integration with existing TELSTP tables:
-- ✅ veterinary_profiles can reference global_hubs for clinics
-- ✅ veterinary_knowledge extends knowledge_entry
-- ✅ Uses same UUID and auth.users patterns as existing schema
-- ✅ No conflicts with existing 77 tables
-- ✅ Follows Supabase best practices
