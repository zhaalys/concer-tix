'use client';

import LogoLoop from './LogoLoop';

const paymentLogos = [
  { src: '/img_payment/qris.png', alt: 'QRIS' },
  { src: '/img_payment/bca.png', alt: 'BCA' },
  { src: '/img_payment/mandiri.png', alt: 'Mandiri' },
  { src: '/img_payment/bni.png', alt: 'BNI' },
  { src: '/img_payment/bri.png', alt: 'BRI' },
  { src: '/img_payment/bsi.png', alt: 'BSI' },
  { src: '/img_payment/btn.png', alt: 'BTN' },
  { src: '/img_payment/gopay.png', alt: 'GoPay' },
  { src: '/img_payment/shopeepay.png', alt: 'ShopeePay' },
  { src: '/img_payment/visa.png', alt: 'Visa' },
  { src: '/img_payment/mastercard.png', alt: 'Mastercard' },
  { src: '/img_payment/alfamart.png', alt: 'Alfamart' },
  { src: '/img_payment/indomaret.png', alt: 'Indomaret' },
];

export default function OurJourneyView() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '48px 32px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Payment logo loop */}
        <div style={{ padding: '28px 0' }}>
          <LogoLoop
            logos={paymentLogos}
            speed={60}
            gap={52}
            logoHeight={64}
            fadeOut={true}
            fadeOutColor="#ffffff"
          />
        </div>

        {/* Merchandise */}
        <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/image_merchandise/merchandise.png"
            alt="Concer TIX Merchandise"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>
    </div>
  );
}
