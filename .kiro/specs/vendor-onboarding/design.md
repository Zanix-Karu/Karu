# Vendor Onboarding — Technical Design

## Component Architecture

```
VendorOnboarding (stepper container)
├── Step1_BusinessDetails
├── Step2_IdentityVerification
├── Step3_AddVehicle
│   ├── VehicleDetailsForm
│   ├── DocumentUploader (carte grise, insurance, visite tech)
│   └── PhotoUploader (min 3, max 10)
├── Step4_Pricing
├── Step5_Availability (calendar)
└── Step6_ReviewAndSubmit
```

## Progress Persistence

Save progress to Supabase after each step — vendor can resume later.

```typescript
// lib/vendorOnboarding.ts
export async function saveOnboardingProgress(
  vendorId: string,
  step: number,
  data: Record<string, unknown>
) {
  await supabase
    .from('vendor_profiles')
    .upsert({
      id: vendorId,
      ...data,
      onboarding_step: step,
      updated_at: new Date().toISOString()
    })
}
```

## Document Upload Flow

```typescript
// lib/documentUpload.ts
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export async function uploadVendorDocument(
  file: File,
  vendorId: string,
  docType: 'rccm' | 'id' | 'carte_grise' | 'insurance' | 'visite_tech'
) {
  // 1. Validate magic bytes (not just MIME type)
  await validateFileMagicBytes(file)

  // 2. Check file size
  if (file.size > MAX_SIZE_BYTES) throw new Error('File too large (max 10MB)')

  // 3. Generate UUID filename (never use original filename)
  const ext = file.name.split('.').pop()
  const filename = `${vendorId}/${docType}/${crypto.randomUUID()}.${ext}`

  // 4. Upload to Supabase Storage (private bucket)
  const { data, error } = await supabase.storage
    .from('vendor-documents')       // private bucket
    .upload(filename, file, {
      contentType: file.type,
      upsert: false
    })

  if (error) throw error

  // 5. Return path (NOT a signed URL — generate signed URL only when needed)
  return data.path
}
```

## Admin Notification on Submission

```typescript
// supabase/functions/vendor-submit/index.ts
// Called when vendor completes Step 6

async function notifyAdminNewVendor(vendor: VendorProfile) {
  // 1. Update status to pending_review
  await supabase
    .from('vendor_profiles')
    .update({ status: 'pending_review' })
    .eq('id', vendor.id)

  // 2. Send email to admin team
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.EMAIL_ADMIN!, // admin@getkaru.io
    subject: `New vendor application: ${vendor.business_name}`,
    html: adminVendorNotificationTemplate(vendor)
  })

  // 3. Send WhatsApp confirmation to vendor
  await africasTalking.SMS.send({
    to: [vendor.phone],
    message: `Merci ${vendor.business_name}! Votre demande Karu a été reçue. Nous vous contacterons sous 48h. / Your Karu application has been received. We will contact you within 48h.`
  })
}
```

## Approval / Rejection Flow

```typescript
// Admin action — only callable by ADMIN or SUPER_ADMIN role
export async function approveVendor(vendorId: string) {
  await supabase
    .from('vendor_profiles')
    .update({ status: 'verified', verified_at: new Date().toISOString() })
    .eq('id', vendorId)

  // Activate all draft vehicles for this vendor
  await supabase
    .from('vehicles')
    .update({ status: 'active' })
    .eq('vendor_id', vendorId)
    .eq('status', 'draft')

  await notifyVendorApproved(vendorId)
}

export async function rejectVendor(vendorId: string, reason: string) {
  await supabase
    .from('vendor_profiles')
    .update({ status: 'rejected', rejection_reason: reason })
    .eq('id', vendorId)

  await notifyVendorRejected(vendorId, reason)
}
```

## RLS Policies

```sql
-- Vendor can only read/update their own profile
CREATE POLICY "vendor_own_profile" ON vendor_profiles
  FOR ALL TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can read all vendor profiles
CREATE POLICY "admin_read_all" ON vendor_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Same pattern for vehicles table (vendor_id = auth.uid())
```

## Storage Bucket Policy

```sql
-- vendor-documents bucket: private
-- Only vendor owner and admin can access their documents
-- Generate signed URLs (valid 1 hour) for admin review
```
