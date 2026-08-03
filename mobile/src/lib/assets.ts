import { ImageSourcePropType } from 'react-native';

const IMAGE_MAP: Record<string, number> = {
  // Event images
  '/image_concer/banner_concer_1.png': require('../../assets/public/image_concer/banner_concer_1.png'),
  // Brand / organizer
  '/logo/tix_logo.png': require('../../assets/public/logo/tix_logo.png'),
  // Banners
  '/banner/banner_1.png': require('../../assets/public/banner/banner_1.png'),
  '/banner/banner_2.png': require('../../assets/public/banner/banner_2.png'),
  '/banner/banner_3.png': require('../../assets/public/banner/banner_3.png'),
  '/banner/banner_4.png': require('../../assets/public/banner/banner_4.png'),
  '/banner/banner_5.png': require('../../assets/public/banner/banner_5.png'),
  '/banner/banner_6.png': require('../../assets/public/banner/banner_6.png'),
  // Cities
  '/image_kota/jabodetabek.png': require('../../assets/public/image_kota/jabodetabek.png'),
  '/image_kota/jawa_barat.png': require('../../assets/public/image_kota/jawa_barat.png'),
  '/image_kota/jawa_tengah.png': require('../../assets/public/image_kota/jawa_tengah.png'),
  '/image_kota/jawa_timur.png': require('../../assets/public/image_kota/jawa_timur.png'),
  '/image_kota/kalimantan.png': require('../../assets/public/image_kota/kalimantan.png'),
  '/image_kota/sumatera.png': require('../../assets/public/image_kota/sumatera.png'),
  '/image_kota/indonesia_timur.png': require('../../assets/public/image_kota/indonesia_timur.png'),
  // Stage
  '/stage/stage.png': require('../../assets/public/stage/stage.png'),
  // Facility icons
  '/icon/ac.png': require('../../assets/public/icon/ac.png'),
  '/icon/atm.png': require('../../assets/public/icon/atm.png'),
  '/icon/fastfood.png': require('../../assets/public/icon/fastfood.png'),
  '/icon/kursiroda.png': require('../../assets/public/icon/kursiroda.png'),
  '/icon/localparking.png': require('../../assets/public/icon/localparking.png'),
  '/icon/merch.png': require('../../assets/public/icon/merch.png'),
  '/icon/poskesehatan.png': require('../../assets/public/icon/poskesehatan.png'),
  '/icon/securty.png': require('../../assets/public/icon/securty.png'),
  '/icon/sound.png': require('../../assets/public/icon/sound.png'),
  '/icon/toilet.png': require('../../assets/public/icon/toilet.png'),
  '/icon/vip.png': require('../../assets/public/icon/vip.png'),
  '/icon/wifi.png': require('../../assets/public/icon/wifi.png'),
  // Payment logos
  '/img_payment/alfamart.png': require('../../assets/public/img_payment/alfamart.png'),
  '/img_payment/bca.png': require('../../assets/public/img_payment/bca.png'),
  '/img_payment/bni.png': require('../../assets/public/img_payment/bni.png'),
  '/img_payment/bri.png': require('../../assets/public/img_payment/bri.png'),
  '/img_payment/bsi.png': require('../../assets/public/img_payment/bsi.png'),
  '/img_payment/btn.png': require('../../assets/public/img_payment/btn.png'),
  '/img_payment/gopay.png': require('../../assets/public/img_payment/gopay.png'),
  '/img_payment/indomaret.png': require('../../assets/public/img_payment/indomaret.png'),
  '/img_payment/mandiri.png': require('../../assets/public/img_payment/mandiri.png'),
  '/img_payment/mastercard.png': require('../../assets/public/img_payment/mastercard.png'),
  '/img_payment/qris.png': require('../../assets/public/img_payment/qris.png'),
  '/img_payment/shopeepay.png': require('../../assets/public/img_payment/shopeepay.png'),
  '/img_payment/visa.png': require('../../assets/public/img_payment/visa.png'),
  // Wristband / tickets
  '/tiket_version/gelang_kain_1.png': require('../../assets/public/tiket_version/gelang_kain_1.png'),
  '/tiket_version/gelang_kain_2.png': require('../../assets/public/tiket_version/gelang_kain_2.png'),
  '/tiket_version/gelang_kain_3.png': require('../../assets/public/tiket_version/gelang_kain_3.png'),
  '/tiket_version/gelang_kain_qr_1.png': require('../../assets/public/tiket_version/gelang_kain_qr_1.png'),
  '/tiket_version/gelang_kain_qr_2.png': require('../../assets/public/tiket_version/gelang_kain_qr_2.png'),
  '/tiket_version/gelang_kain_qr_3.png': require('../../assets/public/tiket_version/gelang_kain_qr_3.png'),
  // History / lanyard
  '/history_lanyard/lanyard_accept.png': require('../../assets/public/history_lanyard/lanyard_accept.png'),
  '/history_lanyard/lanyard_history.png': require('../../assets/public/history_lanyard/lanyard_history.png'),
  // Scan instructions
  '/scan_qr/tata_cara.png': require('../../assets/public/scan_qr/tata_cara.png'),
  // Journey / merch
  '/image_merchandise/merchandise.png': require('../../assets/public/image_merchandise/merchandise.png'),
  '/image_merchandise/merchandise1.png': require('../../assets/public/image_merchandise/merchandise1.png'),
  '/image_merchandise/lanyard.png': require('../../assets/public/image_merchandise/lanyard.png'),
  '/image_merchandise/lanyard1.png': require('../../assets/public/image_merchandise/lanyard1.png'),
  '/lanyard_looping/looping_lanyard.png': require('../../assets/public/lanyard_looping/looping_lanyard.png'),
};

const DEFAULT_BANNER = require('../../assets/public/image_concer/banner_concer_1.png');

export type AssetSource = number | { uri: string };

export function resolveAsset(path?: string | null): AssetSource {
  if (!path) return DEFAULT_BANNER;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return { uri: path };
  }
  return IMAGE_MAP[path] ?? DEFAULT_BANNER;
}

export function resolveImage(path?: string | null): ImageSourcePropType {
  const src = resolveAsset(path);
  return typeof src === 'number' ? src : { uri: src.uri };
}

export function isRemoteUrl(path?: string | null): boolean {
  return !!path && (path.startsWith('http://') || path.startsWith('https://'));
}
