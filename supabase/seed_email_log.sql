-- Sample data for admin_email_log
-- Run AFTER migrations/007_email_log_extended.sql

INSERT INTO admin_email_log
  (id, subject, recipient_count, segment, resend_id, sent_at, email_type, recipient_email, metadata, html_encrypted, html_iv)
VALUES

-- ── Broadcasts ───────────────────────────────────────────────────────────────
(
  gen_random_uuid(),
  'Karu is coming to Douala. Be the first to know.',
  142,
  '{"type":"all","city":"all","locale":"all"}',
  'email_0a1b2c3d4e5f',
  now() - interval '45 days',
  'broadcast', NULL, NULL, NULL, NULL
),
(
  gen_random_uuid(),
  'Vendor early access. Secure your spot before launch.',
  37,
  '{"type":"vendor","city":"all","locale":"all"}',
  'email_1b2c3d4e5f6a',
  now() - interval '30 days',
  'broadcast', NULL, NULL, NULL, NULL
),
(
  gen_random_uuid(),
  'Karu vendors: fleet onboarding details inside.',
  37,
  '{"type":"vendor","city":"all","locale":"all"}',
  'email_2c3d4e5f6a7b',
  now() - interval '18 days',
  'broadcast', NULL, NULL, NULL, NULL
),
(
  gen_random_uuid(),
  'Lancement imminent à Yaoundé. Votre accès prioritaire.',
  61,
  '{"type":"all","city":"yaounde","locale":"fr"}',
  'email_3d4e5f6a7b8c',
  now() - interval '10 days',
  'broadcast', NULL, NULL, NULL, NULL
),
(
  gen_random_uuid(),
  'Karu launch week. What to expect.',
  198,
  '{"type":"all","city":"all","locale":"en"}',
  'email_4e5f6a7b8c9d',
  now() - interval '3 days',
  'broadcast', NULL, NULL, NULL, NULL
),
(
  gen_random_uuid(),
  'Douala vendors: your dashboard is ready.',
  22,
  '{"type":"vendor","city":"douala","locale":"all"}',
  'email_5f6a7b8c9d0e',
  now() - interval '1 day',
  'broadcast', NULL, NULL, NULL, NULL
),

-- ── Customer signups ─────────────────────────────────────────────────────────
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '47 days', 'customer_signup', 'marie.fomo@gmail.com',       '{"city":"douala","locale":"en","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '46 days', 'customer_signup', 'paul.ndongo@yahoo.fr',        '{"city":"yaounde","locale":"fr","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '44 days', 'customer_signup', 'sylvie.biyong@hotmail.com',   '{"city":"douala","locale":"fr","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '40 days', 'customer_signup', 'eric.talla@gmail.com',        '{"city":"douala","locale":"en","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'Vous êtes sur la liste. Karu arrive bientôt', 1, NULL, NULL, now() - interval '38 days', 'customer_signup', 'nadine.kamga@gmail.com',  '{"city":"yaounde","locale":"fr","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '35 days', 'customer_signup', 'alex.mbarga@outlook.com',     '{"city":"other","locale":"en","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '31 days', 'customer_signup', 'j.kouam@gmail.com',           '{"city":"douala","locale":"en","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'Vous êtes sur la liste. Karu arrive bientôt', 1, NULL, NULL, now() - interval '28 days', 'customer_signup', 'c.nguini@yahoo.fr',       '{"city":"yaounde","locale":"fr","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '22 days', 'customer_signup', 'thomas.ateba@gmail.com',      '{"city":"douala","locale":"en","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '19 days', 'customer_signup', 'diane.fouda@live.fr',         '{"city":"yaounde","locale":"fr","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '15 days', 'customer_signup', 'r.essomba@gmail.com',         '{"city":"douala","locale":"en","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '12 days', 'customer_signup', 'f.nkemdirim@gmail.com',       '{"city":"other","locale":"en","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'Vous êtes sur la liste. Karu arrive bientôt', 1, NULL, NULL, now() - interval '9 days',  'customer_signup', 'aline.mbassi@yahoo.fr',  '{"city":"douala","locale":"fr","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '6 days',  'customer_signup', 'k.tchatchou@gmail.com',       '{"city":"yaounde","locale":"en","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '4 days',  'customer_signup', 'b.eyinga@hotmail.fr',         '{"city":"douala","locale":"fr","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '2 days',  'customer_signup', 'samuel.mvondo@gmail.com',     '{"city":"douala","locale":"en","type":"customer","business_name":null}', NULL, NULL),
(gen_random_uuid(), 'You''re on the list. Karu launches soon', 1, NULL, NULL, now() - interval '6 hours', 'customer_signup', 'grace.nlend@gmail.com',       '{"city":"yaounde","locale":"fr","type":"customer","business_name":null}', NULL, NULL),

-- ── Vendor signups ────────────────────────────────────────────────────────────
(gen_random_uuid(), 'You''re registered. Karu vendor early access', 1, NULL, NULL, now() - interval '46 days', 'vendor_signup', 'ops@deltacarsdouala.cm',    '{"city":"douala","locale":"en","type":"vendor","business_name":"Delta Cars Douala"}', NULL, NULL),
(gen_random_uuid(), 'Inscription confirmée. Accès anticipé prestataire Karu', 1, NULL, NULL, now() - interval '43 days', 'vendor_signup', 'contact@elitefleetsarl.cm', '{"city":"douala","locale":"fr","type":"vendor","business_name":"Elite Fleet SARL"}', NULL, NULL),
(gen_random_uuid(), 'You''re registered. Karu vendor early access', 1, NULL, NULL, now() - interval '39 days', 'vendor_signup', 'info@camerentals.com',      '{"city":"yaounde","locale":"en","type":"vendor","business_name":"CamRentals"}', NULL, NULL),
(gen_random_uuid(), 'Inscription confirmée. Accès anticipé prestataire Karu', 1, NULL, NULL, now() - interval '34 days', 'vendor_signup', 'admin@prestige-auto-cm.fr', '{"city":"douala","locale":"fr","type":"vendor","business_name":"Prestige Auto CM"}', NULL, NULL),
(gen_random_uuid(), 'You''re registered. Karu vendor early access', 1, NULL, NULL, now() - interval '27 days', 'vendor_signup', 'fleet@sunriserentals.cm',   '{"city":"douala","locale":"en","type":"vendor","business_name":"Sunrise Rentals"}', NULL, NULL),
(gen_random_uuid(), 'You''re registered. Karu vendor early access', 1, NULL, NULL, now() - interval '21 days', 'vendor_signup', 'booking@akwamotors.cm',     '{"city":"yaounde","locale":"en","type":"vendor","business_name":"Akwa Motors"}', NULL, NULL),
(gen_random_uuid(), 'Inscription confirmée. Accès anticipé prestataire Karu', 1, NULL, NULL, now() - interval '16 days', 'vendor_signup', 'contact@autoservicecm.com', '{"city":"other","locale":"fr","type":"vendor","business_name":"AutoService CM"}', NULL, NULL),
(gen_random_uuid(), 'You''re registered. Karu vendor early access', 1, NULL, NULL, now() - interval '8 days',  'vendor_signup', 'ops@bonanzafleet.cm',       '{"city":"douala","locale":"en","type":"vendor","business_name":"Bonanza Fleet"}', NULL, NULL),
(gen_random_uuid(), 'You''re registered. Karu vendor early access', 1, NULL, NULL, now() - interval '3 days',  'vendor_signup', 'manager@topgear-cm.com',    '{"city":"douala","locale":"en","type":"vendor","business_name":"TopGear Cameroon"}', NULL, NULL),
(gen_random_uuid(), 'Inscription confirmée. Accès anticipé prestataire Karu', 1, NULL, NULL, now() - interval '1 day',   'vendor_signup', 'info@transitplusdla.cm', '{"city":"douala","locale":"fr","type":"vendor","business_name":"Transit Plus DLA"}', NULL, NULL);
