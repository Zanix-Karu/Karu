# Vendor Onboarding — Requirements

## User Story
As a car rental operator in Douala or Yaoundé,
I want to register my business and vehicles on Karu,
so that I can receive pre-arrival bookings from verified customers.

## Acceptance Criteria

WHEN a vendor completes step 1 (business details),
THE SYSTEM SHALL save progress and allow them to continue later without losing data.

WHEN a vendor uploads their RCCM certificate,
THE SYSTEM SHALL validate the file type (PDF, JPG, PNG only) and size (max 10MB) before upload.

WHEN a vendor submits all required documents,
THE SYSTEM SHALL create a vendor profile with status 'pending_review' and notify the admin team.

WHEN a vendor's application is approved by an admin,
THE SYSTEM SHALL update vendor status to 'verified', send approval notification via WhatsApp and email, and make their listings visible on the platform.

WHEN a vendor's application is rejected,
THE SYSTEM SHALL notify the vendor with a specific reason and allow resubmission of corrected documents.

WHEN a vendor adds a vehicle to their profile,
THE SYSTEM SHALL require: vehicle make, model, year, registration plate, carte grise document, CIMA insurance certificate, visite technique certificate, and at least 3 photos.

WHEN a vendor attempts to list a vehicle without valid insurance,
THE SYSTEM SHALL block the listing and display which documents are missing.

WHEN a vendor has at least one verified vehicle listed,
THE SYSTEM SHALL make their profile discoverable in customer search results.

WHEN a vendor sets their availability,
THE SYSTEM SHALL block those dates from customer search results for that vehicle.

## Required Documents

### Business Documents
- RCCM certificate (Registre du Commerce et du Crédit Mobilier)
- National ID or Passport of business owner

### Per Vehicle Documents
- Carte grise (vehicle registration document)
- CIMA-compliant motor insurance certificate (valid, not expired)
- Visite technique certificate (roadworthiness, valid)
- Driver's licence (if offering driver add-on)
- Minimum 3 photos: exterior front, exterior rear, interior

## Onboarding Steps

```
Step 1: Business details (name, phone, city, address, RCCM)
Step 2: Identity verification (national ID or passport)
Step 3: Add first vehicle (make, model, year, plate, documents, photos)
Step 4: Set pricing (daily rate in XAF, deposit amount)
Step 5: Set availability (calendar block-out dates)
Step 6: Review and submit → admin review
```

## Data Requirements

```sql
vendor_profiles (
  id              uuid PRIMARY KEY REFERENCES users(id),
  business_name   text NOT NULL,
  city            text CHECK (city IN ('Douala', 'Yaoundé')),
  address         text,
  phone           text NOT NULL,
  rccm_number     text,
  rccm_doc_url    text,   -- Supabase Storage signed URL
  id_doc_url      text,
  status          text CHECK (status IN ('draft','pending_review','verified','rejected','suspended')),
  rejection_reason text,
  commission_rate numeric DEFAULT 0.15,
  payout_method   text CHECK (payout_method IN ('mtn','orange')),
  payout_phone    text,
  verified_at     timestamptz,
  created_at      timestamptz DEFAULT now()
)

vehicles (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id       uuid REFERENCES vendor_profiles(id),
  make            text NOT NULL,
  model           text NOT NULL,
  year            integer NOT NULL,
  plate           text NOT NULL,
  seats           integer,
  transmission    text CHECK (transmission IN ('manual','automatic')),
  fuel_type       text,
  features        text[],  -- ['AC', 'GPS', 'Child seat']
  carte_grise_url text,
  insurance_url   text,
  insurance_expiry date,
  visite_tech_url  text,
  visite_tech_expiry date,
  photos          text[],  -- array of Supabase Storage URLs
  status          text CHECK (status IN ('draft','active','inactive','suspended')),
  created_at      timestamptz DEFAULT now()
)
```
