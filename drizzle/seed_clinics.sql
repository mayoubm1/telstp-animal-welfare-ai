-- Seed Egyptian Veterinary Clinics for TELSTP
INSERT INTO vet_clinics (name, address, city, phone, rating, clinic_type, emergency_services, latitude, longitude, verified)
VALUES
('Cairo Advanced Veterinary Clinic', '15 Tahrir Square, Downtown', 'Cairo', '+20 2 2345 6789', 4.9, 'hospital', true, 30.0444, 31.2357, true),
('Zamalek Pet Care Center', '22 Gezira St, Zamalek', 'Cairo', '+20 2 2735 1234', 4.8, 'specialty', true, 30.0566, 31.2223, true),
('Maadi Veterinary Hospital', '9 Road 9, Maadi', 'Cairo', '+20 2 2358 9876', 4.7, 'emergency', true, 29.9602, 31.2569, true),
('Heliopolis Vet Clinic', '45 El-Higaz St, Heliopolis', 'Cairo', '+20 2 2415 4321', 4.8, 'general', false, 30.0898, 31.3236, true),
('Alexandria Coastal Vet Hospital', '120 Corniche Rd, Stanley', 'Alexandria', '+20 3 5467 8901', 4.9, 'hospital', true, 31.2234, 29.9512, true),
('Giza Pyramids Animal Clinic', '88 Al Haram St, Giza', 'Giza', '+20 2 3388 5544', 4.6, 'general', false, 29.9936, 31.1376, true);
