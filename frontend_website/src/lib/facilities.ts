export interface FacilityOption {
  icon: string;
  label: string;
  img?: string;
}

export const FACILITY_OPTIONS: FacilityOption[] = [
  { icon: "fastfood", label: "Food Court", img: "/icon/fastfood.png" },
  { icon: "local_parking", label: "Area Parkir", img: "/icon/localparking.png" },
  { icon: "shopping_bag", label: "Merchandise", img: "/icon/merch.png" },
  { icon: "medical_services", label: "Pos Kesehatan", img: "/icon/poskesehatan.png" },
  { icon: "wifi", label: "WiFi", img: "/icon/wifi.png" },
  { icon: "vip", label: "Area VIP", img: "/icon/vip.png" },
  { icon: "toilet", label: "Toilet", img: "/icon/toilet.png" },
  { icon: "sound", label: "Sound System", img: "/icon/sound.png" },
  { icon: "security", label: "Keamanan", img: "/icon/securty.png" },
  { icon: "wheelchair", label: "Akses Kursi Roda", img: "/icon/kursiroda.png" },
  { icon: "atm", label: "ATM", img: "/icon/atm.png" },
  { icon: "ac", label: "Ber-AC", img: "/icon/ac.png" },
  { icon: "wc", label: "Mushola" },
  { icon: "confirmation_number", label: "Tiket" },
];

export const FACILITY_ICON_IMAGES: Record<string, string> = Object.fromEntries(
  FACILITY_OPTIONS.filter((f) => f.img).map((f) => [f.icon, f.img as string])
);
