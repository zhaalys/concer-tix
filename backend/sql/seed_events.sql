-- ============================================
-- SEED DATA: Events & Event Tickets
-- Jalanin di Supabase SQL Editor setelah schema
-- ============================================

-- Hapus data lama (kalau ada)
delete from event_tickets;
delete from events;

-- Events
insert into events (id, slug, title, organizer, image_url, category, city, city_label, location, venue, event_date, event_time, description, is_hot, facilities, social_media, terms, status) values
  (gen_random_uuid(), 'hillsong-worship-nights-asia-tour-2026', 'Hillsong Worship Nights Asia Tour 2026', 'Live Nation Asia', '/image_concer/banner_concer_1.png', 'Music Concert', 'jabodetabek', 'Jabodetabek', 'GBK Basketball Hall, Jakarta', 'GBK Basketball Hall', '2026-09-11', '19:00 - 22:00', 'Experience an unforgettable night of worship with Hillsong Worship as they bring their Asia Tour 2026 to Jakarta. Join thousands of worshippers for a night filled with powerful music, incredible performances, and an atmosphere unlike any other.', true, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"shopping_bag","label":"Merchandise"},{"icon":"wc","label":"Mushola"},{"icon":"local_parking","label":"Area Parkir"},{"icon":"confirmation_number","label":"Tiket"}]', '[{"platform":"Instagram","url":"#"},{"platform":"TikTok","url":"#"}]', '["Tickets purchased are non-refundable and non-transferable.","One ticket is valid for one person only.","Maximum ticket purchase is 4 tickets per transaction.","Attendees under 12 years of age are not permitted to enter the venue.","Management reserves the right to refuse entry without refund.","Recording devices and professional cameras are not permitted.","The organizer is not responsible for lost or stolen items.","Please arrive at least 30 minutes before the event starts."]', 'upcoming'),

  (gen_random_uuid(), 'pestapora-makassar-2026', 'Pestapora Makassar 2026', 'Boss Creator', '/image_concer/banner_concer_1.png', 'Festival', 'indonesia_timur', 'Eastern Indonesia', 'Celebes Convention Center, Makassar', 'Celebes Convention Center', '2026-07-26', '15:00 - 23:00', 'Pestapora Makassar 2026 hadir kembali dengan lineup artis terbaik dari seluruh Indonesia. Festival musik terbesar di kawasan timur Indonesia ini menghadirkan pengalaman tak terlupakan di Celebes Convention Center.', true, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"shopping_bag","label":"Merchandise"},{"icon":"local_parking","label":"Area Parkir"}]', '[{"platform":"Instagram","url":"#"}]', '["Tiket tidak dapat dikembalikan atau ditukar.","Satu tiket berlaku untuk satu orang.","Dilarang membawa makanan dan minuman dari luar.","Penyelenggara berhak menolak masuk tanpa pengembalian dana."]', 'upcoming'),

  (gen_random_uuid(), 'vixtape-konekt-showcase-band', 'VIXTAPE KONEKT Showcase Band', 'VINDES Media', '/image_concer/banner_concer_1.png', 'Indie & Alternative', 'jabodetabek', 'Jabodetabek', 'Bengkel Space SCBD, Jakarta', 'Bengkel Space SCBD', '2026-07-25', '18:00 - 22:00', 'VIXTAPE KONEKT Showcase hadir menampilkan band-band indie terbaik pilihan VINDES Media. Dua malam penuh musik segar dan penampilan memukau di venue premium kawasan SCBD Jakarta.', false, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"confirmation_number","label":"Tiket"}]', '[{"platform":"Instagram","url":"#"},{"platform":"TikTok","url":"#"}]', '["Tiket tidak dapat dikembalikan.","Satu tiket berlaku untuk satu malam.","Dilarang membawa minuman beralkohol."]', 'upcoming'),

  (gen_random_uuid(), 'joyland-sessions-2026-bali', 'Joyland Sessions 2026 Bali', 'Plainsong Live', '/image_concer/banner_concer_1.png', 'Festival', 'bali', 'Bali', 'Peninsula Island Nusa Dua, Bali', 'Peninsula Island Nusa Dua', '2026-11-14', '14:00 - 23:00', 'Joyland Sessions 2026 returns to the stunning Peninsula Island in Nusa Dua, Bali. Three days of world-class music, art installations, and an unparalleled tropical festival experience.', true, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"shopping_bag","label":"Merchandise"},{"icon":"local_parking","label":"Area Parkir"},{"icon":"wc","label":"Mushola"}]', '[{"platform":"Instagram","url":"#"}]', '["Tickets are non-refundable.","All ages welcome with parental guidance for under 17.","No outside food or beverages allowed.","The organizer reserves the right to change lineup without notice."]', 'upcoming'),

  (gen_random_uuid(), 'soundrenaline-2026-jakarta', 'Soundrenaline 2026 Jakarta', 'Ravel Entertainment', '/image_concer/banner_concer_1.png', 'Festival', 'jabodetabek', 'Jabodetabek', 'Ancol Circuit Carnival, Jakarta', 'Ancol Circuit Carnival', '2026-12-15', '15:00 - 23:00', 'Soundrenaline 2026 kembali hadir di Jakarta dengan lineup artis rock dan pop terbesar. Rasakan adrenalin di Ancol Circuit Carnival bersama ribuan penonton dari seluruh Indonesia.', true, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"shopping_bag","label":"Merchandise"},{"icon":"local_parking","label":"Area Parkir"},{"icon":"confirmation_number","label":"Tiket"}]', '[{"platform":"Instagram","url":"#"},{"platform":"TikTok","url":"#"}]', '["Tiket tidak dapat dikembalikan atau ditukar.","Satu tiket berlaku untuk satu orang.","Dilarang membawa senjata tajam atau benda berbahaya.","Penyelenggara berhak menolak masuk tanpa pengembalian dana."]', 'upcoming'),

  (gen_random_uuid(), 'bandung-indie-nation-fest-2026', 'Bandung Indie Nation Fest 2026', 'Kreatif Bandung', '/image_concer/banner_concer_1.png', 'Indie & Alternative', 'jawa_barat', 'West Java', 'Gedung Sate Open Park, Bandung', 'Gedung Sate Open Park', '2026-08-15', '15:00 - 22:00', 'Festival indie terbesar di Bandung hadir kembali menampilkan musisi-musisi terbaik dari scene indie lokal dan nasional di salah satu venue ikonik Kota Kembang.', false, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"local_parking","label":"Area Parkir"}]', '[{"platform":"Instagram","url":"#"}]', '["Tiket tidak dapat dikembalikan.","Dilarang membawa minuman beralkohol.","Satu tiket berlaku untuk satu orang."]', 'upcoming'),

  (gen_random_uuid(), 'jogja-jazz-heritage-night', 'Jogja Jazz & Heritage Night', 'Jogja Cultural Fest', '/image_concer/banner_concer_1.png', 'Arts & Culture', 'jawa_tengah', 'Central Java & DIY', 'Candi Prambanan, Yogyakarta', 'Candi Prambanan', '2026-08-28', '19:30 - 23:00', 'Nikmati malam jazz yang magis di latar belakang kemegahan Candi Prambanan. Jogja Jazz & Heritage Night menghadirkan musisi jazz terbaik dalam suasana budaya yang tak tertandingi.', false, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"local_parking","label":"Area Parkir"}]', '[{"platform":"Instagram","url":"#"}]', '["Tiket tidak dapat dikembalikan.","Dilarang mengambil foto komersial tanpa izin.","Pakaian sopan diwajibkan."]', 'upcoming'),

  (gen_random_uuid(), 'surabaya-pop-sound-wave', 'Surabaya Pop Sound Wave', 'Surabaya Event Org', '/image_concer/banner_concer_1.png', 'Pop & Rock', 'jawa_timur', 'East Java', 'Grand City Exhibition Hall, Surabaya', 'Grand City Exhibition Hall', '2026-09-05', '18:00 - 22:00', 'Surabaya Pop Sound Wave menghadirkan deretan artis pop terbaik di panggung megah Grand City. Rayakan musik pop Indonesia bersama ribuan penonton di Kota Pahlawan.', false, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"local_parking","label":"Area Parkir"},{"icon":"confirmation_number","label":"Tiket"}]', '[{"platform":"Instagram","url":"#"}]', '["Tiket tidak dapat dikembalikan.","Satu tiket berlaku untuk satu orang."]', 'upcoming'),

  (gen_random_uuid(), 'sumatera-rockfest-palembang', 'Sumatera Rockfest Palembang', 'Palembang Music Fest', '/image_concer/banner_concer_1.png', 'Pop & Rock', 'sumatera', 'Sumatera', 'PTC Open Stage, Palembang', 'PTC Open Stage', '2026-09-19', '17:00 - 22:00', 'Rockfest terbesar di Sumatera hadir di Palembang! Nikmati penampilan band-band rock terbaik dari seluruh penjuru Sumatera di PTC Open Stage.', false, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"local_parking","label":"Area Parkir"}]', '[{"platform":"Instagram","url":"#"}]', '["Tiket tidak dapat dikembalikan.","Dilarang membawa senjata tajam.","Satu tiket berlaku untuk satu orang."]', 'upcoming'),

  (gen_random_uuid(), 'borneo-music-tour-balikpapan', 'Borneo Music Tour Balikpapan', 'Borneo Live Event', '/image_concer/banner_concer_1.png', 'Music Concert', 'kalimantan', 'Kalimantan', 'BSCC Dome Balikpapan', 'BSCC Dome Balikpapan', '2026-10-03', '19:00 - 22:00', 'Borneo Music Tour hadir di Balikpapan membawa artis-artis nasional ke jantung Kalimantan. Saksikan penampilan spektakuler di BSCC Dome yang megah.', false, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"local_parking","label":"Area Parkir"},{"icon":"confirmation_number","label":"Tiket"}]', '[{"platform":"Instagram","url":"#"}]', '["Tiket tidak dapat dikembalikan.","Satu tiket berlaku untuk satu orang.","Dilarang membawa makanan dan minuman dari luar."]', 'upcoming'),

  (gen_random_uuid(), 'ancol-summer-beach-party', 'Ancol Summer Beach Party', 'Tix Experience', '/image_concer/banner_concer_1.png', 'Festival', 'jabodetabek', 'Jabodetabek', 'Symphony of the Sea, Ancol, Jakarta', 'Symphony of the Sea Ancol', '2026-08-22', '15:00 - 23:00', 'Party di tepi pantai Ancol bersama DJ dan artis terbaik. Ancol Summer Beach Party menghadirkan suasana festival pantai yang meriah dengan musik, makanan, dan pemandangan laut yang indah.', true, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"shopping_bag","label":"Merchandise"},{"icon":"local_parking","label":"Area Parkir"}]', '[{"platform":"Instagram","url":"#"},{"platform":"TikTok","url":"#"}]', '["Tiket tidak dapat dikembalikan.","Dilarang membawa minuman beralkohol.","Anak di bawah 12 tahun harus didampingi orang tua."]', 'upcoming'),

  (gen_random_uuid(), 'malang-music-camp-2026', 'Malang Music Camp 2026', 'Malang Creative', '/image_concer/banner_concer_1.png', 'Indie & Alternative', 'jawa_timur', 'East Java', 'Coban Rondo Outdoor Arena, Malang', 'Coban Rondo Outdoor Arena', '2026-10-10', '14:00 - 22:00', 'Malang Music Camp mengajak kamu menikmati musik indie di alam terbuka Coban Rondo yang sejuk dan hijau. Pengalaman festival yang berbeda dari biasanya.', false, '[{"icon":"fastfood","label":"Food Court"},{"icon":"medical_services","label":"Medis"},{"icon":"local_parking","label":"Area Parkir"}]', '[{"platform":"Instagram","url":"#"}]', '["Tiket tidak dapat dikembalikan.","Pakaian hangat disarankan.","Satu tiket berlaku untuk satu orang."]', 'upcoming');

-- Event Tickets (sample ticket categories per event)
-- Each event gets 2-3 ticket types
do $$
declare
  rec record;
begin
  for rec in select id, slug from events loop
    if rec.slug like 'hillsong%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Reguler', 350000, 'confirmation_number', '["Standard entry","Seat in regular zone"]', 500, 500),
        (rec.id, 'VIP', 850000, 'stars', '["VIP seating area","Exclusive merch pack","Early entry"]', 200, 200),
        (rec.id, 'VVIP', 1500000, 'workspace_premium', '["Front row seating","Meet & greet","Premium merch pack","Dinner included"]', 50, 50);
    elsif rec.slug like 'pestapora%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Early Bird', 150000, 'confirmation_number', '["Standard entry"]', 300, 300),
        (rec.id, 'Reguler', 225000, 'confirmation_number', '["Standard entry","Free 1 drink"]', 800, 800),
        (rec.id, 'VIP', 500000, 'stars', '["VIP area access","Free 3 drinks","Merchandise"]', 100, 100);
    elsif rec.slug like 'vixtape%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Presale 1', 85000, 'confirmation_number', '["Standard entry"]', 200, 200),
        (rec.id, 'Presale 2', 100000, 'confirmation_number', '["Standard entry"]', 300, 300),
        (rec.id, 'Reguler', 125000, 'confirmation_number', '["Standard entry"]', 500, 500);
    elsif rec.slug like 'joyland%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, '1-Day Pass', 350000, 'confirmation_number', '["Access for 1 day"]', 1000, 1000),
        (rec.id, '3-Day Pass', 588000, 'stars', '["Access for all 3 days","Free merchandise"]', 500, 500),
        (rec.id, 'VIP 3-Day', 1200000, 'workspace_premium', '["VIP area all days","Meet & greet","Premium merchandise"]', 100, 100);
    elsif rec.slug like 'soundrenaline%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Reguler', 350000, 'confirmation_number', '["Standard entry"]', 1000, 1000),
        (rec.id, 'VIP', 650000, 'stars', '["VIP area","Free merchandise"]', 300, 300);
    elsif rec.slug like 'bandung-indie%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Early Bird', 100000, 'confirmation_number', '["Standard entry"]', 200, 200),
        (rec.id, 'Reguler', 180000, 'confirmation_number', '["Standard entry","Free 1 drink"]', 500, 500);
    elsif rec.slug like 'jogja-jazz%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Reguler', 320000, 'confirmation_number', '["Standard entry","Seat in heritage zone"]', 400, 400),
        (rec.id, 'VIP', 550000, 'stars', '["VIP seating","Dinner included","Free merchandise"]', 100, 100);
    elsif rec.slug like 'surabaya-pop%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Presale', 150000, 'confirmation_number', '["Standard entry"]', 300, 300),
        (rec.id, 'Reguler', 210000, 'confirmation_number', '["Standard entry","Free 1 drink"]', 600, 600);
    elsif rec.slug like 'sumatera-rockfest%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Early Bird', 120000, 'confirmation_number', '["Standard entry"]', 200, 200),
        (rec.id, 'Reguler', 195000, 'confirmation_number', '["Standard entry","Free 1 drink"]', 500, 500);
    elsif rec.slug like 'borneo-music%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Festival', 185000, 'confirmation_number', '["Standard entry"]', 400, 400),
        (rec.id, 'VIP', 350000, 'stars', '["VIP seating","Free merchandise","Free 2 drinks"]', 150, 150);
    elsif rec.slug like 'ancol-summer%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Early Bird', 100000, 'confirmation_number', '["Standard entry"]', 300, 300),
        (rec.id, 'Reguler', 175000, 'confirmation_number', '["Standard entry","Free 1 drink"]', 800, 800);
    elsif rec.slug like 'malang-music%' then
      insert into event_tickets (event_id, label, price, icon, benefits, quantity, remaining) values
        (rec.id, 'Camping', 120000, 'confirmation_number', '["Standard entry","Camping area access"]', 200, 200),
        (rec.id, 'Reguler', 150000, 'confirmation_number', '["Standard entry"]', 400, 400);
    end if;
  end loop;
end $$;
