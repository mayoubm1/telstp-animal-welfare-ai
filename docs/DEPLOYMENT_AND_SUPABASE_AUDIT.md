# TELSTP Deployment and Supabase Audit

## Scope

This audit records the verified state of TELSTP’s workspace, GitHub repository, Vercel project, and Supabase connection before any external deployment or repository synchronization.

## Current Project State

| Area | Verified state | Implication |
|---|---|---|
| Managed project checkpoint | `6da30e75` is the latest completed TELSTP checkpoint at the time of audit. | The managed Manus project is the current canonical working copy. |
| Local project remote | The active `origin` is the managed project’s S3-backed shared remote. | A raw `git push origin main` is not a GitHub push. |
| Selected GitHub repository | `mayoubm1/telstp-animal-welfare-ai`, public, branch `main`. | Treat publication as externally visible; complete a secret and deployment preflight before synchronization. |
| GitHub `main` | Points to commit `8c70b18dc5bef92408331a5c77e000bffc0aeaf4`. | GitHub is behind the current managed project checkpoint and must be synchronized deliberately rather than assumed current. |

## Vercel Audit

The `tawasolnow` Vercel team already contains a project named `telstp-animal-welfare-ai` (`prj_CEHONu78yjoRiTCIU5Ptdh9NuHIB`). Its public web domain returns the Vite application shell successfully. However, the checked tRPC endpoint, `/api/trpc/auth.me`, returned `404 NOT_FOUND` during the audit. The current `vercel.json` publishes `dist/public` as a static Vite output, while the project’s application server is an Express process that hosts tRPC under `/api/trpc`.

> **Deployment decision:** Do not promote the existing Vercel configuration as a full TELSTP production deployment until a Vercel Function entry point (or separate API hosting target) serves the Express/tRPC layer and the required server environment variables are configured.

The required server-side environment contract is defined in `server/_core/env.ts`. It includes authentication, database, Supabase, Mistral, Shopify, and Manus integration variables. Secret values must be entered through the target platform’s protected environment-variable settings and must never be committed.

## Supabase Audit

The enabled Supabase connector currently exposes one active, healthy project:

| Property | Verified value |
|---|---|
| Organization | `3M2-ExtendedOrg` (`nhpbzaonybnocezcsdjl`) |
| Project | `TELsTP-OmniCog-Deploy-3` |
| Project reference | `vrfyjirddfdnwuffzqhb` |
| API endpoint | `https://vrfyjirddfdnwuffzqhb.supabase.co` |
| Application fallback URL | Matches `server/_core/supabase.ts` |

The project contains several overlapping historical table families, including singular/plural and package-prefixed variants. Within the veterinary set, `public.vet_clinics` is populated with 50 rows; the audited `veterinary_profiles`, `pets`, `pet_owners`, `pet_cases`, `vet_consultations`, `veterinary_knowledge`, and `vaccination_records` tables were empty at the time of inspection. This indicates that `vet_clinics` is the only actively populated veterinary directory table in the connected Supabase project.

## Recommended Next Actions

1. Choose an explicit authoritative data model: retain `public.vet_clinics` for the current directory, then map or migrate the rest of the veterinary workflow into a single coherent table set.
2. Preserve all duplicate tables until a formal migration inventory and rollback plan have been approved; do not delete historical tables during the audit phase.
3. Build and test a Vercel Function adapter for `/api/trpc/*` before publishing a new GitHub-driven Vercel deployment.
4. After the serverless API is proven, synchronize the managed checkpoint into GitHub through a reviewable branch or pull request rather than overwriting `main` directly.
