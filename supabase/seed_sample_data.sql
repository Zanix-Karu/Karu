-- ─────────────────────────────────────────────────────────────────────────────
-- KARU — Sample waitlist data (run in Supabase SQL Editor)
-- Covers: vendors + customers, EN + FR, Douala + Yaoundé,
--         local + diaspora geo, varied fleet sizes, hot/warm/cold leads
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO waitlist_entries
  (email, type, city, locale, business_name, business_email, phone, vehicle_count,
   country, region, city_geo, lat, lng, created_at, ip_hash)
VALUES

-- ── HOT VENDOR LEADS (fleet operators, corporate emails) ──────────────────────

('info@doualafleet.cm', 'vendor', 'douala', 'en',
 'Douala Fleet Services', 'info@doualafleet.cm', '+237 650 112 233', '21+',
 'CM', 'LT', 'Douala', 4.0511, 9.7679,
 NOW() - INTERVAL '2 days', 'hash_001'),

('contact@cameroonlux.cm', 'vendor', 'douala', 'en',
 'Cameroon Luxury Motors', 'contact@cameroonlux.cm', '+237 699 442 100', '21+',
 'CM', 'LT', 'Douala', 4.0463, 9.7018,
 NOW() - INTERVAL '3 days', 'hash_002'),

('direction@transitafrique.cm', 'vendor', 'yaounde', 'fr',
 'Transit Afrique SARL', 'direction@transitafrique.cm', '+237 677 884 521', '21+',
 'CM', 'CE', 'Yaoundé', 3.8667, 11.5167,
 NOW() - INTERVAL '5 days', 'hash_003'),

('fleet@karisma-cars.com', 'vendor', 'douala', 'en',
 'Karisma Car Hire', 'fleet@karisma-cars.com', '+237 655 091 447', '6-20',
 'CM', 'LT', 'Douala', 4.0611, 9.7129,
 NOW() - INTERVAL '7 days', 'hash_004'),

('gestion@premiumride.cm', 'vendor', 'yaounde', 'fr',
 'Premium Ride Cameroun', 'gestion@premiumride.cm', '+237 698 773 254', '6-20',
 'CM', 'CE', 'Yaoundé', 3.8480, 11.5021,
 NOW() - INTERVAL '8 days', 'hash_005'),

('ops@elitetransport.cm', 'vendor', 'douala', 'en',
 'Elite Transport DLA', 'ops@elitetransport.cm', '+237 670 335 812', '6-20',
 'CM', 'LT', 'Douala', 4.0388, 9.6946,
 NOW() - INTERVAL '10 days', 'hash_006'),

('reservations@safariautos.cm', 'vendor', 'yaounde', 'fr',
 'Safari Autos Cameroun', 'reservations@safariautos.cm', '+237 677 112 980', '21+',
 'CM', 'CE', 'Yaoundé', 3.8600, 11.5300,
 NOW() - INTERVAL '12 days', 'hash_007'),

-- ── WARM VENDOR LEADS (SME, some with free email) ─────────────────────────────

('pascal.nkono@gmail.com', 'vendor', 'douala', 'fr',
 'Nkono Auto Location', 'nkono.autos@gmail.com', '+237 651 234 567', '6-20',
 'CM', 'LT', 'Douala', 4.0444, 9.7083,
 NOW() - INTERVAL '1 day', 'hash_008'),

('josephine.mbarga@yahoo.fr', 'vendor', 'yaounde', 'fr',
 'Mbarga Premium Cars', NULL, '+237 677 009 123', '6-20',
 'CM', 'CE', 'Yaoundé', 3.8550, 11.5100,
 NOW() - INTERVAL '4 days', 'hash_009'),

('samuel.eloundou@gmail.com', 'vendor', 'douala', 'en',
 'Eloundou Car Rentals', NULL, '+237 690 881 445', '1-5',
 'CM', 'LT', 'Douala', 4.0533, 9.7200,
 NOW() - INTERVAL '6 days', 'hash_010'),

('christian.biya@outlook.com', 'vendor', 'douala', 'fr',
 'CB Transport Services', 'christian.biya@outlook.com', '+237 655 772 341', '6-20',
 'CM', 'LT', 'Douala', 4.0600, 9.7400,
 NOW() - INTERVAL '9 days', 'hash_011'),

('aminata.diallo@gmail.com', 'vendor', 'yaounde', 'fr',
 'Diallo Prestige Location', NULL, '+237 698 441 023', '1-5',
 'CM', 'CE', 'Yaoundé', 3.8700, 11.5250,
 NOW() - INTERVAL '11 days', 'hash_012'),

('roger.fochive@yahoo.fr', 'vendor', 'douala', 'fr',
 'Fochive Auto', NULL, '+237 670 993 112', '1-5',
 'CM', 'LT', 'Douala', 4.0320, 9.6850,
 NOW() - INTERVAL '14 days', 'hash_013'),

('herve.tagne@gmail.com', 'vendor', 'yaounde', 'fr',
 'Tagne VIP Cars', 'contact@tagnevip.cm', '+237 677 554 881', '6-20',
 'CM', 'CE', 'Yaoundé', 3.8440, 11.5080,
 NOW() - INTERVAL '16 days', 'hash_014'),

('ndongo.pierre@gmail.com', 'vendor', 'douala', 'en',
 NULL, NULL, '+237 651 002 334', '1-5',
 'CM', 'LT', 'Douala', 4.0490, 9.7011,
 NOW() - INTERVAL '19 days', 'hash_015'),

('beatrice.kamga@gmail.com', 'vendor', 'yaounde', 'fr',
 'Kamga Location Véhicules', NULL, NULL, '1-5',
 'CM', 'CE', 'Yaoundé', 3.8620, 11.5190,
 NOW() - INTERVAL '21 days', 'hash_016'),

-- ── DIASPORA VENDORS (Europe / USA) ───────────────────────────────────────────

('info@africarentals.fr', 'vendor', 'douala', 'fr',
 'Africa Rentals Paris', 'info@africarentals.fr', '+33 6 12 34 56 78', '6-20',
 'FR', 'IDF', 'Paris', 48.8566, 2.3522,
 NOW() - INTERVAL '3 days', 'hash_017'),

('contact@cmrentalusa.com', 'vendor', 'douala', 'en',
 'CM Rental USA LLC', 'contact@cmrentalusa.com', '+1 202 555 0147', '6-20',
 'US', 'MD', 'Silver Spring', 38.9940, -77.0260,
 NOW() - INTERVAL '15 days', 'hash_018'),

-- ── CUSTOMERS — diaspora (high value, travelling back) ────────────────────────

('james.ateba@gmail.com', 'customer', 'douala', 'en',
 NULL, NULL, NULL, NULL,
 'GB', 'ENG', 'London', 51.5074, -0.1278,
 NOW() - INTERVAL '1 day', 'hash_019'),

('marie.fouda@gmail.com', 'customer', 'yaounde', 'fr',
 NULL, NULL, NULL, NULL,
 'FR', 'IDF', 'Paris', 48.8566, 2.3522,
 NOW() - INTERVAL '2 days', 'hash_020'),

('paul.ondoa@hotmail.com', 'customer', 'douala', 'en',
 NULL, NULL, NULL, NULL,
 'US', 'TX', 'Houston', 29.7604, -95.3698,
 NOW() - INTERVAL '3 days', 'hash_021'),

('claire.nlend@yahoo.fr', 'customer', 'yaounde', 'fr',
 NULL, NULL, NULL, NULL,
 'BE', 'BRU', 'Brussels', 50.8503, 4.3517,
 NOW() - INTERVAL '5 days', 'hash_022'),

('albert.nguema@gmail.com', 'customer', 'douala', 'en',
 NULL, NULL, NULL, NULL,
 'CA', 'ON', 'Toronto', 43.6532, -79.3832,
 NOW() - INTERVAL '7 days', 'hash_023'),

('fatou.diop@gmail.com', 'customer', 'douala', 'fr',
 NULL, NULL, NULL, NULL,
 'DE', 'BE', 'Berlin', 52.5200, 13.4050,
 NOW() - INTERVAL '9 days', 'hash_024'),

('nguyen.cam@gmail.com', 'customer', 'yaounde', 'en',
 NULL, NULL, NULL, NULL,
 'CH', 'GE', 'Geneva', 46.2044, 6.1432,
 NOW() - INTERVAL '11 days', 'hash_025'),

-- ── LOCAL CUSTOMERS ───────────────────────────────────────────────────────────

('ines.ngo@gmail.com', 'customer', 'douala', 'fr',
 NULL, NULL, NULL, NULL,
 'CM', 'LT', 'Douala', 4.0511, 9.7679,
 NOW() - INTERVAL '1 day', 'hash_026'),

('wilfried.manga@gmail.com', 'customer', 'yaounde', 'fr',
 NULL, NULL, NULL, NULL,
 'CM', 'CE', 'Yaoundé', 3.8480, 11.5021,
 NOW() - INTERVAL '2 days', 'hash_027'),

('stephanie.ndi@yahoo.fr', 'customer', 'douala', 'fr',
 NULL, NULL, NULL, NULL,
 'CM', 'LT', 'Douala', 4.0388, 9.6946,
 NOW() - INTERVAL '4 days', 'hash_028'),

('raphael.ewane@gmail.com', 'customer', 'yaounde', 'en',
 NULL, NULL, NULL, NULL,
 'CM', 'CE', 'Yaoundé', 3.8600, 11.5300,
 NOW() - INTERVAL '6 days', 'hash_029'),

('celine.abena@gmail.com', 'customer', 'douala', 'fr',
 NULL, NULL, NULL, NULL,
 'CM', 'LT', 'Douala', 4.0463, 9.7018,
 NOW() - INTERVAL '8 days', 'hash_030'),

('patrick.essomba@outlook.com', 'customer', 'yaounde', 'fr',
 NULL, NULL, NULL, NULL,
 'CM', 'CE', 'Yaoundé', 3.8550, 11.5100,
 NOW() - INTERVAL '10 days', 'hash_031'),

('grace.mfou@gmail.com', 'customer', 'douala', 'en',
 NULL, NULL, NULL, NULL,
 'CM', 'LT', 'Douala', 4.0533, 9.7200,
 NOW() - INTERVAL '13 days', 'hash_032'),

('simon.assamba@gmail.com', 'customer', 'other', 'fr',
 NULL, NULL, NULL, NULL,
 'CM', 'NO', 'Garoua', 9.3017, 13.3910,
 NOW() - INTERVAL '17 days', 'hash_033'),

('lydie.nana@gmail.com', 'customer', 'other', 'fr',
 NULL, NULL, NULL, NULL,
 'CM', 'AD', 'Ngaoundéré', 7.3271, 13.5841,
 NOW() - INTERVAL '20 days', 'hash_034'),

('kevin.nzounga@gmail.com', 'customer', 'douala', 'en',
 NULL, NULL, NULL, NULL,
 'NG', 'LA', 'Lagos', 6.5244, 3.3792,
 NOW() - INTERVAL '22 days', 'hash_035'),

('adama.traore@gmail.com', 'customer', 'yaounde', 'fr',
 NULL, NULL, NULL, NULL,
 'SN', 'DK', 'Dakar', 14.7167, -17.4677,
 NOW() - INTERVAL '25 days', 'hash_036')

ON CONFLICT (email) DO NOTHING;
