import type { PaymentMethod } from './types';

export interface FacilityIcon {
  icon: string;
  label: string;
  img: string;
}

export const FACILITY_OPTIONS: FacilityIcon[] = [
  { icon: 'fastfood', label: 'Food Court', img: '/icon/fastfood.png' },
  { icon: 'local_parking', label: 'Area Parkir', img: '/icon/localparking.png' },
  { icon: 'shopping_bag', label: 'Merchandise', img: '/icon/merch.png' },
  { icon: 'medical_services', label: 'Pos Kesehatan', img: '/icon/poskesehatan.png' },
  { icon: 'wifi', label: 'WiFi', img: '/icon/wifi.png' },
  { icon: 'vip', label: 'Area VIP', img: '/icon/vip.png' },
  { icon: 'toilet', label: 'Toilet', img: '/icon/toilet.png' },
  { icon: 'sound', label: 'Sound System', img: '/icon/sound.png' },
  { icon: 'security', label: 'Keamanan', img: '/icon/securty.png' },
  { icon: 'wheelchair', label: 'Akses Kursi Roda', img: '/icon/kursiroda.png' },
  { icon: 'atm', label: 'ATM', img: '/icon/atm.png' },
  { icon: 'ac', label: 'Ber-AC', img: '/icon/ac.png' },
];

export const FACILITY_ICON_IMAGES: Record<string, string> = Object.fromEntries(
  FACILITY_OPTIONS.map((f) => [f.icon, f.img])
);

export interface HomeIconItem {
  icon: string;
  label: string;
  img: string;
}

export const HOME_ICONS: HomeIconItem[] = [
  { icon: 'fastfood', label: 'Food Court', img: '/icon/fastfood.png' },
  { icon: 'localparking', label: 'Parkir Luas', img: '/icon/localparking.png' },
  { icon: 'wifi', label: 'Wi-Fi', img: '/icon/wifi.png' },
  { icon: 'toilet', label: 'Toilet', img: '/icon/toilet.png' },
  { icon: 'kursiroda', label: 'Akses Kursi Roda', img: '/icon/kursiroda.png' },
  { icon: 'ac', label: 'AC', img: '/icon/ac.png' },
  { icon: 'securty', label: 'Keamanan', img: '/icon/securty.png' },
  { icon: 'sound', label: 'Sound System', img: '/icon/sound.png' },
  { icon: 'vip', label: 'VIP Seats', img: '/icon/vip.png' },
  { icon: 'merch', label: 'Merchandise', img: '/icon/merch.png' },
  { icon: 'atm', label: 'ATM', img: '/icon/atm.png' },
  { icon: 'poskesehatan', label: 'Pos Kesehatan', img: '/icon/poskesehatan.png' },
];

export const HERO_SLIDES = ['/banner/banner_1.png', '/banner/banner_6.png'];

export const PROMO_BANNER = '/banner/banner_2.png';

export interface StaticEvent {
  id: string;
  title: string;
  price: number;
  date: string;
  organizer: string;
}

export const EVENT_SERU: StaticEvent[] = [
  { id: 'hillsong-worship-nights-asia-tour-2026', title: 'Hillsong Worship Nights Asia Tour 2026', price: 850000, date: '11 Sep 2026', organizer: 'Live Nation Asia' },
  { id: 'ev-2', title: 'Latihan Pestapora Makassar', price: 225000, date: '26 Jul 2026', organizer: 'Boss Creator' },
  { id: 'ev-3', title: 'VIXTAPE KONEKT Showcase', price: 125000, date: '25-26 Jul 2026', organizer: 'VINDES Media' },
  { id: 'ev-4', title: 'Joyland Sessions 2026', price: 588000, date: 'Nov 2026', organizer: 'Plainsong Live' },
  { id: 'ev-5', title: 'Soundrenaline 2026 Jakarta', price: 450000, date: '15 Dec 2026', organizer: 'Ravel Entertainment' },
  { id: 'ev-11', title: 'Festival Indie Jakarta', price: 180000, date: '1 Aug 2026', organizer: 'Kompas Event' },
  { id: 'ev-7', title: 'Ancol Aquathlon 2026', price: 250000, date: '23 Aug 2026', organizer: 'JakLingko' },
  { id: 'ev-8', title: 'Home Sweet Loan The Musical', price: 350000, date: 'Every Sat & Sun', organizer: 'Tix ID' },
];

export interface City {
  id: string;
  name: string;
  img: string | null;
  label: string;
}

export const CITIES: City[] = [
  { id: 'jabodetabek', name: 'Jabodetabek', img: '/image_kota/jabodetabek.png', label: 'DKI Jakarta & Sekitar' },
  { id: 'jawa_barat', name: 'West Java', img: '/image_kota/jawa_barat.png', label: 'Bandung, Bogor, Cirebon' },
  { id: 'jawa_tengah', name: 'Central Java & DIY', img: '/image_kota/jawa_tengah.png', label: 'Yogyakarta, Semarang, Solo' },
  { id: 'jawa_timur', name: 'East Java', img: '/image_kota/jawa_timur.png', label: 'Surabaya, Malang, Banyuwangi' },
  { id: 'bali', name: 'Bali', img: null, label: 'Denpasar, Kuta, Ubud' },
  { id: 'sumatera', name: 'Sumatera', img: '/image_kota/sumatera.png', label: 'Medan, Palembang, Padang' },
  { id: 'kalimantan', name: 'Kalimantan', img: '/image_kota/kalimantan.png', label: 'Balikpapan, Samarinda, Pontianak' },
  { id: 'indonesia_timur', name: 'Eastern Indonesia', img: '/image_kota/indonesia_timur.png', label: 'Makassar, Manado, Ambon' },
];

export const HOME_CITIES: { name: string; img: string }[] = [
  { name: 'Jabodetabek', img: '/image_kota/jabodetabek.png' },
  { name: 'Jawa Barat', img: '/image_kota/jawa_barat.png' },
  { name: 'Jawa Tengah', img: '/image_kota/jawa_tengah.png' },
  { name: 'Jawa Timur', img: '/image_kota/jawa_timur.png' },
  { name: 'Kalimantan', img: '/image_kota/kalimantan.png' },
  { name: 'Sumatera', img: '/image_kota/sumatera.png' },
  { name: 'Indonesia Timur', img: '/image_kota/indonesia_timur.png' },
];

export const EXPLORE_CATEGORIES = ['All', 'Music Concert', 'Festival', 'Arts & Culture', 'Pop & Rock', 'Indie & Alternative'];

export const CITY_EXPLORE_LIST = [
  { id: 'jabodetabek', name: 'Jabodetabek', region: 'DKI Jakarta & Sekitar', img: '/image_kota/jabodetabek.png', tagline: 'Pusat konser megah internasional dan festival terbesar di Indonesia', count: 42, venues: ['GBK Main Stadium', 'Beach City International Stadium', 'JIExpo Kemayoran', 'Indomilk Arena'], color: '#3B5BDB' },
  { id: 'jawa_barat', name: 'Jawa Barat', region: 'Bandung, Bogor, Cirebon', img: '/image_kota/jawa_barat.png', tagline: 'Rumah bagi musisi indie, festival musik alam, dan konser kreatif', count: 28, venues: ['Gedung Sate', 'Sabuga ITB', 'Lapangan Jaswita Bandung', 'Bogor Rainfield'], color: '#7950F2' },
  { id: 'jawa_tengah', name: 'Jawa Tengah & DIY', region: 'Yogyakarta, Semarang, Solo', img: '/image_kota/jawa_tengah.png', tagline: 'Perpaduan konser musik bernuansa budaya, seni pertunjukan, dan festival unik', count: 24, venues: ['Candi Prambanan', 'De Tjolomadoe Solo', 'PRPP Semarang', 'JOGJA Expo Center'], color: '#1098AD' },
  { id: 'jawa_timur', name: 'Jawa Timur', region: 'Surabaya, Malang, Banyuwangi', img: '/image_kota/jawa_timur.png', tagline: 'Energi festival musik yang membara dan pertunjukan musik rock hingga pop', count: 19, venues: ['Grand City Convention Surabaya', 'Jatim Park Malang', 'Gelora Pancasila', 'Lapangan Rampal'], color: '#2F9E44' },
  { id: 'bali', name: 'Bali & Nusa Tenggara', region: 'Denpasar, Kuta, Ubud, Mataram', img: null, tagline: 'Festival musik internasional di tepi pantai dan pertunjukan seni tropis', count: 16, venues: ['GWK Cultural Park', 'Peninsula Island Nusa Dua', 'Savaya Bali', 'Atlas Beach Fest'], color: '#FF6B2C' },
  { id: 'sumatera', name: 'Sumatera', region: 'Medan, Palembang, Padang, Lampung', img: '/image_kota/sumatera.png', tagline: 'Pesta musik musisi nasional dan konser lintas genre khas pulau Sumatera', count: 15, venues: ['Lapangan Benteng Medan', 'PTC Mall Palembang', 'GOR Prayoga Padang', 'GSG Unila'], color: '#E03131' },
  { id: 'kalimantan', name: 'Kalimantan', region: 'Pontianak, Samarinda, Balikpapan, Banjarmasin', img: '/image_kota/kalimantan.png', tagline: 'Semarak pertunjukan panggung musik luar ruangan dan tur musisi papan atas', count: 12, venues: ['BSCC Dome Balikpapan', 'Convention Hall Samarinda', 'Stadion Sultan Agung', 'Pontianak Convention Center'], color: '#F59F00' },
  { id: 'indonesia_timur', name: 'Indonesia Timur', region: 'Makassar, Manado, Ambon, Jayapura', img: '/image_kota/indonesia_timur.png', tagline: 'Gemuruh pertunjukan musik penuh talenta dan tur nasional di wilayah timur', count: 14, venues: ['Celebes Convention Center Makassar', 'Karebosi Link', 'Lapangan Sparta Manado'], color: '#1864AB' },
] as const;

export const SORT_OPTIONS = [
  { id: 'popular', label: 'Terpopuler & Hot Deal' },
  { id: 'price_low', label: 'Harga: Terendah ke Tertinggi' },
  { id: 'price_high', label: 'Harga: Tertinggi ke Terendah' },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]['id'];

export const ABOUT_PARAGRAPHS = [
  'Concer TIX is a Ticket Management Service (TMS) platform built to support every kind of live event: concerts, festivals, sports, and more. We make it effortless for organizers to create, market, sell, and distribute tickets with full transparency and control.',
  'Our technology is designed to empower organizers and venue providers at every stage: from pre-event ticket distribution and management, right through to post-event reporting and settlement.',
  'Concer TIX was founded with a single mission: to eliminate long queues and bring a fast, secure, and transparent ticket-buying experience to music fans across Indonesia. Now it is your turn. Let us help you sell your event tickets with ease.',
];

export const FAQ_ITEMS = [
  { q: 'What is Concer TIX?', a: 'Concer TIX is a ticketing platform for concerts and live events. We provide digital tickets, wristband printing, and gate scanning integration for event organizers and attendees.' },
  { q: 'How do I buy a ticket?', a: 'Browse the available events on our homepage, select your desired event, choose your ticket category, and complete the payment process. Your e-ticket will be sent to your email.' },
  { q: 'What payment methods are accepted?', a: 'We accept a wide range of payment methods including bank transfers (BCA, BNI, BRI, Mandiri, BSI, BTN), e-wallets (GoPay, ShopeePay, QRIS), credit/debit cards (Visa, Mastercard), and convenience stores (Indomaret, Alfamart).' },
  { q: 'Can I get a refund for my ticket?', a: "Refunds are subject to the event organizer's policy. Please check the event detail page for the specific refund terms before purchasing." },
  { q: 'What is a wristband ticket?', a: 'A wristband ticket is a physical fabric wristband used as your event entry pass. It can be customized with or without a QR Code for gate scanning.' },
  { q: 'How do I order a wristband?', a: 'Visit the Wristband Ticket page, select your QR Code preference, enter your desired print quantity, and click Order Now. Production takes 6-9 working days.' },
  { q: 'Is the QR Code on the wristband scannable at the gate?', a: 'Yes! Wristbands ordered with QR Code are fully integrated with the gate scanning system for fast and seamless entry.' },
  { q: 'How can I contact support?', a: 'You can reach us via the Contact Us button on this page, or through our official social media channels. Our team is ready to help you.' },
];

export const WRISTBAND_DESCRIPTION = [
  'Premium tissue fabric material',
  'Wristband size (Length 33cm x Width 1.5cm)',
  'Single-sided print',
  'Water resistant',
  'Stain resistant',
  'Tangle resistant',
  'Uses central lock system',
];

export const WRISTBAND_UNIT_PRICE = 3500;
export const WRISTBAND_PRODUCTION_TIME = '6-9 days';

export const WRISTBAND_VARIANTS = {
  without_qr: {
    label: 'Without QR',
    images: ['/tiket_version/gelang_kain_1.png', '/tiket_version/gelang_kain_2.png', '/tiket_version/gelang_kain_3.png'],
  },
  with_qr: {
    label: 'With QR',
    images: ['/tiket_version/gelang_kain_qr_1.png', '/tiket_version/gelang_kain_qr_2.png', '/tiket_version/gelang_kain_qr_3.png'],
  },
} as const;

export type WristbandVariant = keyof typeof WRISTBAND_VARIANTS;

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'bca_va', label: 'BCA Virtual Account', group: 'Bank Transfer', image: '/img_payment/bca.png', snapKey: 'bca_va' },
  { id: 'bni_va', label: 'BNI Virtual Account', group: 'Bank Transfer', image: '/img_payment/bni.png', snapKey: 'bni_va' },
  { id: 'bri_va', label: 'BRI Virtual Account', group: 'Bank Transfer', image: '/img_payment/bri.png', snapKey: 'bri_va' },
  { id: 'echannel', label: 'Mandiri Virtual Account', group: 'Bank Transfer', image: '/img_payment/mandiri.png', snapKey: 'echannel' },
  { id: 'gopay', label: 'GoPay', group: 'E-Wallet', image: '/img_payment/gopay.png', snapKey: 'gopay' },
  { id: 'shopeepay', label: 'ShopeePay', group: 'E-Wallet', image: '/img_payment/shopeepay.png', snapKey: 'shopeepay' },
  { id: 'qris', label: 'QRIS', group: 'E-Wallet', image: '/img_payment/qris.png', snapKey: 'qris' },
  { id: 'indomaret', label: 'Indomaret', group: 'Convenience Store', image: '/img_payment/indomaret.png', snapKey: 'indomaret' },
  { id: 'alfamart', label: 'Alfamart', group: 'Convenience Store', image: '/img_payment/alfamart.png', snapKey: 'alfamart' },
];

export const PAYMENT_GROUP_ORDER = ['Bank Transfer', 'E-Wallet', 'Convenience Store'];

export const SUPPORT_WHATSAPP = '6281316936289';

export const TICKET_ISSUE_MSG = (orderCode: string, title: string) =>
  `Hello Concer TIX, I would like to submit a request.

Order Code: ${orderCode}
Event: ${title}

1. Ticket data change request
2. Ticket cancellation
3. Refund request
4. Account issue
5. Ticket not showing
6. Payment issue
7. Other`;

export const WRISTBAND_ISSUE_MSG = (orderCode: string) =>
  `Hello Concer TIX! I would like to submit a request for my wristband order.

Order Code: ${orderCode}

1. Change request
2. Cancellation
3. Refund request
4. Shipping issue
5. Other`;

export const WRISTBAND_INVOICE_MSG = (order: {
  order_code: string;
  variant: string;
  quantity: number;
  total_amount: number;
  customer_name: string;
  status: string;
}) =>
  `Halo Concer TIX! Saya telah melakukan pemesanan wristband:

Order Code: ${order.order_code}
Variant: ${order.variant === 'with_qr' ? 'With QR' : 'Without QR'}
Quantity: ${order.quantity}
Total: Rp ${order.total_amount.toLocaleString('id-ID')}
Nama: ${order.customer_name}
Status: ${order.status === 'paid' ? 'Lunas' : 'Pending'}

Mohon proses pesanan saya. Terima kasih!`;

export const SEARCH_PLACEHOLDERS = [
  'Search Sheila On 7...',
  'Search Coldplay...',
  'Search Hindia...',
  'Search Bernadya...',
  'Search Mahalini...',
  'Search Tulus...',
  'Search JKT48...',
  'Search Bruno Mars...',
  'Search Raisa...',
  'Search Pamungkas...',
];
