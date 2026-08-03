const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTHS_FULL_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatPrice(n: number | string): string {
  const num = Number(n) || 0;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

export function formatPriceCompact(n: number | string): string {
  const num = Number(n) || 0;
  if (num === 0) return 'Gratis';
  if (num >= 1_000_000) {
    const jt = num / 1_000_000;
    return `Rp ${jt % 1 === 0 ? jt.toFixed(0) : jt.toFixed(1).replace('.', ',')}jt`;
  }
  return formatPrice(num);
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value.length <= 10 ? `${value}T00:00:00` : value);
  return isNaN(d.getTime()) ? null : d;
}

export function formatEventDate(value: string): string {
  const d = parseDate(value);
  if (!d) return value || '';
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateFull(value: string): string {
  const d = parseDate(value);
  if (!d) return value || '';
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_FULL_EN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateShortID(value: string): string {
  const d = parseDate(value);
  if (!d) return value || '';
  return `${d.getDate()} ${MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatMonthYear(value: string): string {
  const d = parseDate(value);
  if (!d) return value || '';
  return `${MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateMonthOnly(value: string): string {
  const d = parseDate(value);
  if (!d) return value || '';
  return `${d.getDate()} ${MONTHS_EN[d.getMonth()]}`;
}

export function formatDateMonthShort(value: string): string {
  const d = parseDate(value);
  if (!d) return value || '';
  return MONTHS_EN[d.getMonth()].toUpperCase();
}

export function formatDateDay(value: string): string {
  const d = parseDate(value);
  if (!d) return '';
  return String(d.getDate()).padStart(2, '0');
}

export function formatEventDayID(value: string): string {
  const d = parseDate(value);
  if (!d) return value || '';
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return `${days[d.getDay()]}, ${d.getDate()} ${MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatWhatsAppTime(value: string): string {
  const d = parseDate(value);
  if (!d) return value || '';
  return `${d.getDate()} ${MONTHS_FULL_EN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatPhone(input: string): string {
  const digits = (input || '').replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.startsWith('0')) return `+62 ${digits.slice(1)}`;
  if (digits.startsWith('62')) return `+${digits}`;
  if (digits.startsWith('8')) return `+62 ${digits}`;
  return `+${digits}`;
}

export function phoneDigits(input: string): string {
  const digits = (input || '').replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}

export function isValidPhone(digits: string): boolean {
  const d = (digits || '').replace(/\D/g, '');
  return d.startsWith('62') && d.length >= 10 && d.length <= 15;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const IDENTITY_MAX_LENGTHS: Record<string, number> = {
  ktp: 16,
  sim: 12,
  passport: 9,
};

export const GENDER_OPTIONS = [
  { id: 'male', label: 'Laki-laki' },
  { id: 'female', label: 'Perempuan' },
];

export const DOMICILE_OPTIONS = [
  'Ambon', 'Balikpapan', 'Banda Aceh', 'Bandar Lampung', 'Bandung', 'Banjarmasin',
  'Batam', 'Batu', 'Bekasi', 'Bogor', 'Bontang', 'Cilegon', 'Cimahi', 'Cirebon',
  'Denpasar', 'Depok', 'Gorontalo', 'Jakarta', 'Jambi', 'Jayapura', 'Kediri',
  'Kendari', 'Kupang', 'Lubuklinggau', 'Madiun', 'Magelang', 'Makassar', 'Malang',
  'Manado', 'Mataram', 'Medan', 'Mojokerto', 'Padang', 'Palangkaraya', 'Palembang',
  'Palopo', 'Palu', 'Pangkalpinang', 'Parepare', 'Pekalongan', 'Pekanbaru',
  'Pematangsiantar', 'Pontianak', 'Prabumulih', 'Probolinggo', 'Salatiga',
  'Samarinda', 'Semarang', 'Serang', 'Sibolga', 'Sidoarjo', 'Sukabumi', 'Surabaya',
  'Surakarta', 'Tangerang', 'Tanjungpinang', 'Tasikmalaya', 'Tebingtinggi', 'Tegal',
  'Ternate', 'Yogyakarta',
];

export const PAYMENT_METHODS = [
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
