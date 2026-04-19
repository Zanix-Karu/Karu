# Vendor Onboarding — Implementation Tasks

## Phase 1: Database Schema

- [ ] Create `vendor_profiles` table with all columns, constraints, and check values
  _Requirements: data requirements_

- [ ] Create `vehicles` table with foreign key to vendor_profiles
  _Requirements: data requirements_

- [ ] Add `onboarding_step` column to vendor_profiles for progress tracking
  _Requirements: 1.1_

- [ ] Enable RLS on both tables
  _Requirements: security.md_

- [ ] Create `vendor_own_profile` RLS policy for vendor access
  _Requirements: security.md_

- [ ] Create `admin_read_all` RLS policy for admin access
  _Requirements: security.md_

- [ ] Create `vendor-documents` private storage bucket in Supabase
  _Requirements: 1.2_

## Phase 2: Document Upload

- [ ] Implement `validateFileMagicBytes()` utility — check actual file signature not MIME
  _Requirements: 1.2, security.md_

- [ ] Implement `uploadVendorDocument()` with type check, size limit, UUID naming
  _Requirements: 1.2, security.md_

- [ ] Build `DocumentUploader` component with drag-drop + file picker
  _Requirements: 1.2_

- [ ] Add upload progress indicator per file
  _Requirements: UX_

- [ ] Add file preview after upload (PDF thumbnail or image preview)
  _Requirements: UX_

- [ ] Implement signed URL generation for admin document review
  _Requirements: 1.5_

## Phase 3: Onboarding Stepper

- [ ] Build stepper container with 6 steps and progress indicator
  _Requirements: onboarding steps_

- [ ] Implement progress save after each step via `saveOnboardingProgress()`
  _Requirements: 1.1_

- [ ] Build Step 1: Business Details form (name, phone, city, address, RCCM number)
  _Requirements: 1.1_

- [ ] Build Step 2: Identity Verification with document upload
  _Requirements: document requirements_

- [ ] Build Step 3: Add Vehicle form with all required fields
  _Requirements: 1.6_

- [ ] Build photo upload in Step 3 — min 3, max 10 images
  _Requirements: 1.6_

- [ ] Build Step 4: Pricing (daily rate in XAF, deposit amount)
  _Requirements: onboarding steps_

- [ ] Build Step 5: Availability calendar for blocking dates
  _Requirements: 1.9_

- [ ] Build Step 6: Review and Submit with document checklist
  _Requirements: 1.3_

- [ ] Block submission if any required documents are missing
  _Requirements: 1.7_

## Phase 4: Submission & Review

- [ ] Create Edge Function `vendor-submit` to handle submission
  _Requirements: 1.3_

- [ ] Update vendor status to `pending_review` on submission
  _Requirements: 1.3_

- [ ] Send admin notification email on new submission
  _Requirements: 1.3_

- [ ] Send WhatsApp confirmation to vendor (bilingual) on submission
  _Requirements: 1.3_

- [ ] Build admin review UI — view documents, approve, reject with reason
  _Requirements: 1.4, 1.5_

- [ ] Implement `approveVendor()` — update status, activate vehicles, notify vendor
  _Requirements: 1.4_

- [ ] Implement `rejectVendor()` — update status, store reason, notify vendor
  _Requirements: 1.5_

- [ ] Send approval WhatsApp message and email to vendor
  _Requirements: 1.4_

- [ ] Allow resubmission after rejection (clear rejection_reason on new submission)
  _Requirements: 1.5_

## Phase 5: Listing Visibility

- [ ] Filter customer search queries to show only `status: 'active'` vehicles
  _Requirements: 1.8_

- [ ] Filter vendor search to show only `vendor status: 'verified'` profiles
  _Requirements: 1.8_

## Phase 6: Testing & QA

- [ ] Test happy path: all 6 steps → submit → admin approves → vendor goes live
  _Requirements: 1.1–1.4_

- [ ] Test progress save: close app mid-step, reopen, verify data persists
  _Requirements: 1.1_

- [ ] Test file upload: valid PDF, valid image, oversized file, wrong type
  _Requirements: 1.2, security.md_

- [ ] Test admin rejection with reason → vendor notified → resubmission works
  _Requirements: 1.5_

- [ ] Test vehicle without valid insurance is blocked from listing
  _Requirements: 1.7_

- [ ] Test RLS: vendor cannot read another vendor's documents
  _Requirements: security.md_

- [ ] Test admin can access all vendor profiles and documents
  _Requirements: security.md_
