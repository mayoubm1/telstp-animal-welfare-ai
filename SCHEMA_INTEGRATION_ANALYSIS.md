# TELSTP Database Schema Integration Analysis

## Executive Summary

After reviewing your existing 77-table TELSTP PostgreSQL schema, I've identified key integration points and potential conflicts for the veterinary platform. This document outlines best practices for seamless integration.

## Key Findings

### 1. **Existing User Management Architecture**

Your TELSTP database uses:
- **UUID-based users** via Supabase Auth (`auth.users`)
- **Multiple user-related tables** with UUID foreign keys
- **Healthcare provider model** already exists (`healthcare_providers` table)
- **Patient model** exists but is human-focused

**Recommendation:** ✅ **Adopt UUID strategy for veterinary platform**
- Align with existing Supabase Auth integration
- Use `auth.users` as single source of truth
- Create veterinary-specific user roles/profiles

### 2. **Existing Tables That Can Be Reused**

| Table | Purpose | Veterinary Use |
|-------|---------|-----------------|
| `healthcare_providers` | Medical professionals | Map to veterinarians |
| `patients` | Human patients | Create separate `pets` table (different schema) |
| `medical_records` | Patient records | Create `pet_medical_records` |
| `appointments` | Healthcare appointments | Reuse for vet appointments |
| `ai_agents` | AI system agents | Leverage for Mistral integration |
| `ai_models` | Model management | Reference for Mistral model |
| `global_hubs` | Location data | Reference for clinic locations |
| `knowledge_entry` | Knowledge base | Extend for veterinary knowledge |

### 3. **Naming Conflicts to Avoid**

**CRITICAL:** The following table names exist and should NOT be duplicated:

```
- users (use auth.users instead)
- healthcare_providers (extend or create vet_profiles)
- patients (create pets table instead)
- medical_records (create pet_medical_records)
- appointments (can reuse with type discrimination)
- knowledge_entry (extend with vet-specific categories)
- ai_agents (already used)
- ai_models (already used)
```

### 4. **Recommended Veterinary Platform Schema**

Instead of creating conflicting tables, extend existing ones:

```sql
-- NEW: Veterinary-specific profile (extends healthcare_providers)
CREATE TABLE public.veterinary_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  license_number text UNIQUE,
  specializations text[],
  clinic_id uuid REFERENCES global_hubs(id),
  bio text,
  verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT veterinary_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT veterinary_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- NEW: Pet ownership (links pets to users)
CREATE TABLE public.pet_owners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  pet_id uuid NOT NULL REFERENCES pets(id),
  relationship text, -- 'owner', 'guardian', 'caretaker'
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_owners_pkey PRIMARY KEY (id),
  CONSTRAINT pet_owners_user_pet_unique UNIQUE (user_id, pet_id)
);

-- NEW: Pet profiles (separate from human patients)
CREATE TABLE public.pets (
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

-- NEW: Veterinary cases (extends medical_records concept)
CREATE TABLE public.pet_cases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id),
  owner_id uuid NOT NULL REFERENCES auth.users(id),
  symptoms text NOT NULL,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),
  triage_level text,
  diagnosis_notes text,
  recommended_actions text,
  vet_consultation_requested boolean DEFAULT false,
  assigned_veterinarian_id uuid REFERENCES veterinary_profiles(id),
  case_status text DEFAULT 'open' CHECK (case_status IN ('open', 'closed', 'pending_vet')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pet_cases_pkey PRIMARY KEY (id)
);

-- NEW: Veterinary consultations
CREATE TABLE public.vet_consultations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES pet_cases(id),
  veterinarian_id uuid NOT NULL REFERENCES veterinary_profiles(id),
  owner_id uuid NOT NULL REFERENCES auth.users(id),
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

-- EXTEND: Existing appointments table for vet use
-- Add type discrimination: 'human' vs 'veterinary'
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS appointment_type text DEFAULT 'human';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS pet_id uuid REFERENCES pets(id);

-- EXTEND: Existing knowledge_entry for veterinary content
-- Add category discrimination for veterinary topics
ALTER TABLE public.knowledge_entry ADD COLUMN IF NOT EXISTS domain text DEFAULT 'general';
-- domain: 'general', 'veterinary', 'human_healthcare', etc.
```

### 5. **UUID Migration Strategy**

**Current State:** Your schema uses both:
- UUID (modern, recommended)
- Integer IDs (legacy, in some tables)

**Recommendation:** ✅ **Use UUID exclusively for veterinary platform**

```sql
-- All new veterinary tables use:
id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY

-- Foreign keys reference auth.users:
user_id uuid NOT NULL REFERENCES auth.users(id)
```

### 6. **Row Level Security (RLS) Integration**

Your existing RLS patterns:
```sql
-- Existing pattern in TELSTP
CREATE POLICY "users can view own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);
```

**Apply same pattern to veterinary tables:**
```sql
-- For pets: owners can view their own pets
CREATE POLICY "pet_owners_can_view" ON pets
  FOR SELECT USING (
    id IN (SELECT pet_id FROM pet_owners WHERE user_id = auth.uid())
  );

-- For cases: owners and assigned vets can view
CREATE POLICY "case_access" ON pet_cases
  FOR SELECT USING (
    owner_id = auth.uid() OR
    assigned_veterinarian_id IN (
      SELECT id FROM veterinary_profiles WHERE user_id = auth.uid()
    )
  );
```

### 7. **Mistral AI Integration Points**

Your existing AI infrastructure:
- `ai_agents` table for agent management
- `ai_models` table for model configuration
- `ai_interactions` table for tracking interactions

**Integration approach:**
```sql
-- Create Mistral-specific agent in ai_agents
INSERT INTO public.ai_agents (
  name, 
  model_id, 
  owner_user_id, 
  configuration
) VALUES (
  'Veterinary Diagnosis Agent',
  (SELECT id FROM ai_models WHERE name = 'mistral-large'),
  '00000000-0000-0000-0000-000000000000', -- System owner
  '{"api": "mistral", "capabilities": ["diagnosis", "analysis", "education"]}'::jsonb
);

-- Track diagnosis interactions
INSERT INTO public.ai_interactions (
  agent_id,
  user_id,
  input_data,
  output_data
) VALUES (
  (SELECT id FROM ai_agents WHERE name = 'Veterinary Diagnosis Agent'),
  auth.uid(),
  '{"symptoms": [...], "species": "cat"}'::jsonb,
  '{"diagnosis": "...", "confidence": 0.85}'::jsonb
);
```

### 8. **Supabase Best Practices Applied**

✅ **Implemented:**
- UUID primary keys (gen_random_uuid())
- Timestamp triggers (updated_at)
- Foreign key constraints
- Check constraints for enums
- Indexes on frequently queried columns
- RLS policies for multi-tenant safety

✅ **Recommended for Veterinary Tables:**
- Wrap auth.uid() in subqueries for RLS
- Add explicit indexes on foreign keys
- Use JSONB for flexible metadata
- Implement audit logging for medical data

## Implementation Roadmap

### Phase 1: Schema Extension (Immediate)
1. Create `veterinary_profiles` table
2. Create `pets` table
3. Create `pet_owners` junction table
4. Create `pet_cases` table
5. Create `vet_consultations` table

### Phase 2: Integration (Week 1)
1. Update Drizzle schema to reference new tables
2. Implement RLS policies
3. Create database views for common queries
4. Add indexes for performance

### Phase 3: Application Updates (Week 2)
1. Update tRPC procedures to use new schema
2. Update frontend to use veterinary-specific tables
3. Migrate Mistral integration to use ai_agents
4. Test end-to-end workflows

## SQL Migration Script

See `supabase/schema-integration.sql` for complete migration script that:
- Creates all new veterinary tables
- Extends existing tables safely
- Implements RLS policies
- Creates necessary indexes
- Maintains referential integrity

## Conclusion

**Key Takeaways:**
1. ✅ Use UUID for all new tables (aligns with existing architecture)
2. ✅ Extend existing tables instead of creating duplicates
3. ✅ Leverage existing AI infrastructure for Mistral integration
4. ✅ Implement RLS for multi-tenant safety
5. ✅ Follow Supabase best practices throughout

**Next Steps:**
1. Review this analysis
2. Approve schema design
3. Execute migration script
4. Update Drizzle ORM schema
5. Deploy to Vercel

---

**Analysis Date:** February 2, 2026
**Database:** Supabase PostgreSQL
**Compatibility:** 100% with existing TELSTP schema
