# Payment Flow — Requirements

## User Story
As a customer with a confirmed booking approval,
I want to pay securely using MTN Mobile Money or Orange Money,
so that my car rental is locked in without needing a bank card.

## Acceptance Criteria

WHEN a customer initiates payment on an approved booking,
THE SYSTEM SHALL present MTN Mobile Money and Orange Money as payment options.

WHEN a customer selects MTN Mobile Money and enters their phone number,
THE SYSTEM SHALL initiate a payment request via NotchPay and display a pending state.

WHEN NotchPay confirms the payment via webhook,
THE SYSTEM SHALL update the booking status to `confirmed`, block the dates, and notify both parties.

WHEN a payment request times out after 90 seconds with no response,
THE SYSTEM SHALL display a timeout message and offer the customer a retry option.

WHEN a customer's mobile money account has insufficient funds,
THE SYSTEM SHALL display an insufficient funds message and allow retry with a different payment method.

WHEN a customer retries a failed payment,
THE SYSTEM SHALL use a new idempotency key to prevent double charges.

WHEN an identical idempotency key is received by the server,
THE SYSTEM SHALL return the cached result from the first request without processing again.

WHEN a payment is confirmed but the booking update fails,
THE SYSTEM SHALL log the incident and reconcile within 5 minutes via payment status polling.

WHEN a vendor payout is triggered after trip completion,
THE SYSTEM SHALL send funds to the vendor's registered MTN MoMo or Orange Money number.

WHEN a payout fails,
THE SYSTEM SHALL retry up to 3 times with exponential backoff and alert the admin team.

## Payment Amounts (XAF — integers only)

```
customer pays:  subtotal + customer_fee (8%)
platform keeps: 15% of subtotal
vendor receives: 85% of subtotal
```

## Security Requirements

- All payment calls over HTTPS
- Idempotency keys on every payment initiation
- Webhook signatures verified before processing
- Payment status always verified server-to-server
- NEVER process payment client-side
- NEVER store mobile money PINs
- Transaction velocity limits enforced

## Data Requirements

```sql
payments (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id      uuid REFERENCES bookings(id) UNIQUE,
  reference       text UNIQUE NOT NULL,   -- NotchPay reference
  amount          integer NOT NULL,        -- XAF, total_amount
  currency        text DEFAULT 'XAF',
  channel         text,                   -- 'cm.mtn' or 'cm.orange'
  status          text CHECK (status IN ('pending','complete','failed','refunded')),
  provider        text DEFAULT 'notchpay',
  idempotency_key text UNIQUE,
  webhook_received_at timestamptz,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)

payouts (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id      uuid REFERENCES bookings(id),
  vendor_id       uuid REFERENCES users(id),
  amount          integer NOT NULL,        -- vendor_payout amount
  channel         text NOT NULL,           -- vendor's preferred payout method
  phone           text NOT NULL,           -- vendor's payout phone
  status          text CHECK (status IN ('pending','complete','failed')),
  reference       text,                   -- NotchPay payout reference
  attempts        integer DEFAULT 0,
  created_at      timestamptz DEFAULT now()
)
```
