import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { AppImage } from '@/components/AppImage';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { DOMICILE_OPTIONS, EMAIL_RE, GENDER_OPTIONS, IDENTITY_MAX_LENGTHS, formatPhone, getIdentityMax, isValidPhone, phoneDigits } from '@/lib/format';
import { PAYMENT_GROUP_ORDER, PAYMENT_METHODS } from '@/lib/content';
import { openSnap } from '@/lib/payment';
import type { Event, EventTicket, Order } from '@/lib/types';
import { getEventBySlug } from '@/lib/useEvents';

const STEPS = ['Pilih Kategori', 'Detail Pesanan', 'Metode Pembayaran', 'Pembayaran'];
const COUNTDOWN_SECONDS = 600;

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);

  const [selectedTicket, setSelectedTicket] = useState<EventTicket | null>(null);

  // Step 2 form
  const [bookerName, setBookerName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [identityType, setIdentityType] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [domicile, setDomicile] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Step 3
  const [paymentMethod, setPaymentMethod] = useState<string>('bca_va');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let active = true;
    getEventBySlug(id ?? '')
      .then((ev) => {
        if (active) setEvent(ev);
      })
      .finally(() => {
        if (active) setLoadingEvent(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!user) {
      router.replace(`/login?next=/event/${id}/checkout` as never);
    }
  }, [user, id, router]);

  useEffect(() => {
    if (step === 1) {
      setCountdown(COUNTDOWN_SECONDS);
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  useEffect(() => {
    if (user) {
      setBookerName((p) => p || user.display_name || '');
      setEmail((p) => p || user.email || '');
    }
  }, [user]);

  const availableTickets = useMemo(
    () => (event?.event_tickets ?? []).filter((t) => t.is_active !== false),
    [event]
  );

  const onSale = (selectedTicket?.remaining ?? 0) > 0;

  const emailValid = EMAIL_RE.test(email);
  const phoneDigitsStr = phoneDigits(whatsapp);
  const phoneValid = isValidPhone(phoneDigitsStr);

  const identityMax = getIdentityMax(identityType);

  const step1Valid = !!selectedTicket;
  const step2Valid =
    !!bookerName.trim() &&
    emailValid &&
    phoneValid &&
    !!ticketName.trim();

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    let d = digits;
    if (d.startsWith('0')) d = d.slice(1);
    if (!d.startsWith('8')) d = d.replace(/^62/, '8');
    d = d.slice(0, 13);
    setWhatsapp(d ? `+62 ${d}` : '');
  };

  const handleCreateOrder = async () => {
    setCreatingOrder(true);
    setOrderError('');
    try {
      const res = await api.createOrder({
        user_id: user!.id,
        event_slug: event!.slug,
        category: selectedTicket!.label,
        unit_price: selectedTicket!.price,
        quantity: 1,
        full_name: ticketName.trim(),
        email: email.trim(),
        whatsapp: formatPhone(phoneDigitsStr),
        identity_type: identityType.toLowerCase(),
        identity_number: identityNumber.trim(),
        gender: gender === 'Laki-laki' ? 'male' : gender === 'Perempuan' ? 'female' : null,
        age: age ? parseInt(age, 10) : null,
        domicile: domicile || null,
        booker_name: bookerName.trim(),
      });
      setOrder(res.data);
      setStep(2);
    } catch (e: any) {
      setOrderError(e?.message || 'Terjadi kesalahan');
    } finally {
      setCreatingOrder(false);
    }
  };

  const handlePay = async () => {
    if (!order) {
      setPayError('Pesanan belum dibuat. Silakan kembali.');
      return;
    }
    setPaying(true);
    setPayError('');
    try {
      const method = PAYMENT_METHODS.find((m) => m.id === paymentMethod) ?? PAYMENT_METHODS[0];
      const orderId = `${order.order_code}-${Date.now()}`;
      const tokenRes = await api.createPaymentToken({
        orderId,
        amount: order.total_amount,
        name: bookerName || user?.display_name || 'User',
        email: email || user?.email || '',
        category: { id: selectedTicket?.label || 'Reguler', label: selectedTicket?.label || 'Reguler' },
        enabledPayments: [method.snapKey],
      });
      await openSnap(tokenRes.token);
      await api.updateOrderStatus(order.order_code, {
        status: 'paid',
        payment_method: method.label,
        payment_token: orderId,
      });
      setOrder({ ...order, status: 'paid', payment_method: method.label });
      setStep(3);
    } catch (e: any) {
      setPayError(e?.message || 'Pembayaran gagal. Silakan coba lagi.');
    } finally {
      setPaying(false);
    }
  };

  if (loadingEvent) {
    return (
      <View style={[styles.container, styles.center]}>
        <ScreenHeader />
        <ActivityIndicator color="#0E9375" size="large" style={{ marginTop: 40 }} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, styles.center]}>
        <ScreenHeader />
        <ThemedText style={styles.notFound}>Event Not Found</ThemedText>
      </View>
    );
  }

  const mm = String(Math.floor(countdown / 60)).padStart(2, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Checkout" subtitle={event.title} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Stepper */}
        <View style={styles.stepper}>
          {STEPS.map((label, i) => (
            <View key={label} style={styles.stepperItem}>
              <View style={[styles.stepCircle, i <= step ? styles.stepCircleActive : styles.stepCircleIdle]}>
                {i < step ? (
                  <MaterialIcons name="check" size={16} color="#FFFFFF" />
                ) : (
                  <ThemedText style={[styles.stepNum, i <= step ? styles.stepNumActive : styles.stepNumIdle]}>
                    {i + 1}
                  </ThemedText>
                )}
              </View>
              <ThemedText style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{label}</ThemedText>
              {i < STEPS.length - 1 && <ThemedText style={styles.stepSep}>›</ThemedText>}
            </View>
          ))}
        </View>

        {step === 0 && (
          <>
            <AppImage src={event.stage_image || '/stage/stage.png'} style={styles.stage} contentFit="contain" />
            {(event.stages ?? []).length > 0 && (
              <View style={styles.stageRow}>
                <ThemedText style={styles.stageLabel}>Area penonton:</ThemedText>
                <View style={styles.stageChips}>
                  {(event.stages ?? []).map((s) => (
                    <View key={s} style={styles.stageChip}>
                      <ThemedText style={styles.stageChipText}>{s}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}
            <ThemedText style={styles.catTitle}>Kategori Tiket</ThemedText>
            {availableTickets.length === 0 ? (
              <ThemedText style={styles.emptyTickets}>
                Tiket untuk event ini belum tersedia. Silakan hubungi penyelenggara.
              </ThemedText>
            ) : (
              <View style={styles.ticketList}>
                {availableTickets.map((t) => {
                  const soldOut = (t.remaining ?? 0) <= 0;
                  const selected = selectedTicket?.id === t.id;
                  return (
                    <Pressable
                      key={t.id}
                      onPress={() => !soldOut && setSelectedTicket(t)}
                      style={[styles.ticketCard, selected && styles.ticketCardSelected, soldOut && styles.ticketCardSold]}>
                      <View style={styles.ticketRow}>
                        <ThemedText style={styles.ticketLabel}>{t.label}</ThemedText>
                        <ThemedText style={styles.ticketPrice}>Rp{t.price.toLocaleString('id-ID')}</ThemedText>
                      </View>
                      <View style={styles.ticketDivider} />
                      <View style={styles.ticketFooter}>
                        {soldOut ? (
                          <ThemedText style={styles.soldOut}>Sold Out</ThemedText>
                        ) : selected ? (
                          <ThemedText style={styles.selected}>Dipilih</ThemedText>
                        ) : (
                          <ThemedText style={styles.choose}>Pilih Tiket</ThemedText>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <View style={styles.countdownBanner}>
              <ThemedText style={styles.countdownText}>
                {mm}:{ss}
              </ThemedText>
              <ThemedText style={styles.countdownLabel}>Batas Waktu Tersisa</ThemedText>
            </View>

            <View style={styles.formCard}>
              <ThemedText style={styles.formCardTitle}>Data Pemesan</ThemedText>
              <FormInput
                label="Nama Lengkap"
                placeholder="Nama pemesan"
                value={bookerName}
                onChangeText={setBookerName}
                required
              />
              <FormInput
                label="Email"
                placeholder="Masukkan email Anda"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                required
                error={email ? (emailValid ? undefined : 'Email tidak valid, contoh: nama@email.com') : undefined}
              />
              <FormInput
                label="No. WhatsApp"
                placeholder="+62 8xxxxxxxxx"
                value={whatsapp}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                required
                error={whatsapp ? (phoneValid ? undefined : 'Nomor tidak valid, minimal 10 digit setelah +62') : undefined}
                valid={phoneValid ? `Tersimpan sebagai ${formatPhone(phoneDigitsStr)}` : undefined}
              />
            </View>

            <View style={styles.formCard}>
              <View style={styles.ticketTitleRow}>
                <ThemedText style={styles.formCardTitle}>Detail Tiket - 1</ThemedText>
                {selectedTicket ? (
                  <View style={styles.ticketChip}>
                    <ThemedText style={styles.ticketChipText}>{selectedTicket.label}</ThemedText>
                  </View>
                ) : null}
              </View>
              <FormInput
                label="Nama Lengkap"
                placeholder="Nama sesuai KTP/SIM/Passport"
                value={ticketName}
                onChangeText={setTicketName}
                required
              />
              <FormSelect
                label="Tipe Identitas"
                placeholder="Pilih tipe identitas"
                value={identityType || ''}
                options={['KTP (maks 16 digit)', 'SIM (maks 12 digit)', 'Passport (maks 9 digit)']}
                onChange={(v) => {
                  setIdentityType(v);
                  setIdentityNumber('');
                }}
                required={false}
              />
              {identityType ? (
                <FormInput
                  label={`Nomor Identitas (maks ${identityMax} digit)`}
                  placeholder={`${identityMax} digit`}
                  value={identityNumber}
                  onChangeText={(t) => setIdentityNumber(t.replace(/\D/g, '').slice(0, identityMax))}
                  keyboardType="number-pad"
                  required
                  error={
                    identityNumber && identityNumber.length > 0 && identityNumber.length !== identityMax
                      ? `Harus ${identityMax} digit`
                      : undefined
                  }
                />
              ) : null}
              <FormSelect
                label="Jenis Kelamin"
                placeholder="Pilih jenis kelamin"
                value={gender}
                options={GENDER_OPTIONS.map((g) => g.label)}
                onChange={setGender}
              />
              <FormInput
                label="Usia"
                placeholder="Usia"
                value={age}
                onChangeText={(t) => setAge(t.replace(/\D/g, ''))}
                keyboardType="number-pad"
              />
              <FormSelect
                label="Domisili"
                placeholder="Pilih kota domisili"
                value={domicile}
                options={DOMICILE_OPTIONS}
                onChange={setDomicile}
              />
            </View>

            <View style={styles.summaryCard}>
              <ThemedText style={styles.summaryTitle}>Rincian Pesanan</ThemedText>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryText}>
                  {selectedTicket?.label} x1
                </ThemedText>
                <ThemedText style={styles.summaryText}>Rp{selectedTicket?.price.toLocaleString('id-ID')}</ThemedText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryTotalLabel}>Total Bayar</ThemedText>
                <ThemedText style={styles.summaryTotal}>Rp{selectedTicket?.price.toLocaleString('id-ID')}</ThemedText>
              </View>
            </View>

            {orderError ? (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>{orderError}</ThemedText>
              </View>
            ) : null}
          </>
        )}

        {step === 2 && (
          <>
            <ThemedText style={styles.payTitle}>Metode Pembayaran</ThemedText>
            {PAYMENT_GROUP_ORDER.map((group) => (
              <View key={group} style={styles.payGroup}>
                <ThemedText style={styles.payGroupTitle}>{group}</ThemedText>
                <View style={styles.payGrid}>
                  {PAYMENT_METHODS.filter((m) => m.group === group).map((m) => {
                    const selected = paymentMethod === m.id;
                    return (
                      <Pressable
                        key={m.id}
                        onPress={() => setPaymentMethod(m.id)}
                        style={[styles.payCard, selected && styles.payCardSelected]}>
                        <AppImage src={m.image} style={styles.payLogo} contentFit="contain" />
                        <ThemedText style={[styles.payLabel, selected && styles.payLabelSelected]} numberOfLines={2}>
                          {m.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
            <ThemedText style={styles.payFootnote}>Semua metode pembayaran tersedia melalui Midtrans Snap.</ThemedText>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryTotalLabel}>Total Bayar</ThemedText>
                <ThemedText style={styles.summaryTotal}>
                  Rp{order?.total_amount.toLocaleString('id-ID')}
                </ThemedText>
              </View>
            </View>

            {payError ? (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>{payError}</ThemedText>
              </View>
            ) : null}
          </>
        )}

        {step === 3 && (
          <View style={styles.successWrap}>
            <View style={styles.lanyardContainer}>
              <AppImage src="/history_lanyard/lanyard_accept.png" style={styles.lanyardImgLarge} contentFit="contain" />
              <View style={styles.badgeTextOverlay}>
                <MaterialIcons name="check-circle" size={24} color="#0E9375" />
                <ThemedText style={styles.badgeSuccessTitle}>PAYMENT SUCCESSFUL</ThemedText>
                <ThemedText style={styles.badgeOrderCode}>{order?.order_code}</ThemedText>
              </View>
            </View>

            <View style={styles.successCard}>
              <View style={styles.successRow}>
                <ThemedText style={styles.successLabel}>Event</ThemedText>
                <ThemedText style={styles.successValue}>{event.title}</ThemedText>
              </View>
              <View style={styles.successRow}>
                <ThemedText style={styles.successLabel}>Order</ThemedText>
                <ThemedText style={[styles.successValue, { fontFamily: 'monospace' }]}>
                  {order?.order_code}
                </ThemedText>
              </View>
              <View style={styles.successRow}>
                <ThemedText style={styles.successLabel}>Category</ThemedText>
                <ThemedText style={styles.successValue}>{selectedTicket?.label}</ThemedText>
              </View>
              <View style={styles.successRow}>
                <ThemedText style={styles.successLabel}>Total</ThemedText>
                <ThemedText style={styles.successValue}>
                  Rp{order?.total_amount.toLocaleString('id-ID')}
                </ThemedText>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom actions */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {step === 0 && (
          <AppButton
            label="Beli Sekarang"
            disabled={!step1Valid}
            onPress={() => setStep(1)}
            style={styles.bottomBtn}
          />
        )}
        {step === 1 && (
          <View style={styles.bottomRow}>
            <AppButton label="Kembali" variant="ghost" onPress={() => setStep(0)} style={[styles.bottomBtn, styles.halfBtn]} />
            <AppButton
              label={creatingOrder ? 'Memproses...' : 'Lanjutkan'}
              disabled={!step2Valid || creatingOrder}
              loading={creatingOrder}
              onPress={handleCreateOrder}
              variant="outline"
              style={[styles.bottomBtn, styles.halfBtn]}
            />
          </View>
        )}
        {step === 2 && (
          <View style={styles.bottomRow}>
            <AppButton label="Kembali" variant="ghost" onPress={() => setStep(1)} style={[styles.bottomBtn, styles.halfBtn]} />
            <AppButton
              label={paying ? 'Memproses...' : 'Bayar Sekarang'}
              loading={paying}
              onPress={handlePay}
              style={[styles.bottomBtn, styles.halfBtn]}
            />
          </View>
        )}
        {step === 3 && (
          <AppButton
            label="VIEW E-TICKET"
            variant="outline"
            onPress={() => router.push(`/my-tickets/${order?.order_code}` as never)}
            style={styles.bottomBtn}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    alignItems: 'center',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  notFound: {
    marginTop: 20,
    fontSize: 16,
    color: '#1A1D2E',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  stepperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#0E9375',
  },
  stepCircleIdle: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepNumActive: {
    color: '#FFFFFF',
  },
  stepNumIdle: {
    color: '#868E96',
  },
  stepLabel: {
    fontSize: 12,
    color: '#868E96',
    marginLeft: 6,
  },
  stepLabelActive: {
    color: '#1A1D2E',
    fontWeight: '700',
  },
  stepSep: {
    fontSize: 16,
    color: '#D0D0D0',
    marginHorizontal: 8,
  },
  stage: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: '#F8FAFB',
  },
  stageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  stageLabel: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  stageChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  stageChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  stageChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1D2E',
  },
  catTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  emptyTickets: {
    fontSize: 13,
    color: '#868E96',
  },
  ticketList: {
    gap: 10,
  },
  ticketCard: {
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  ticketCardSelected: {
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  ticketCardSold: {
    opacity: 0.5,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D2E',
  },
  ticketPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  ticketDivider: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    marginVertical: 8,
  },
  ticketFooter: {
    alignItems: 'flex-end',
  },
  choose: {
    fontSize: 12,
    color: '#0E9375',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  selected: {
    fontSize: 12,
    color: '#1A1D2E',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  soldOut: {
    fontSize: 11,
    color: '#BDBDBD',
  },
  countdownBanner: {
    backgroundColor: '#F5A623',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countdownText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  countdownLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  formCard: {
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 8,
    padding: 16,
    gap: 14,
  },
  formCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  ticketTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketChip: {
    backgroundColor: '#F1F3F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ticketChipText: {
    fontSize: 11,
    color: '#1A1D2E',
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1D2E',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#1A1D2E',
  },
  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    marginVertical: 4,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1D2E',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
  },
  payTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  payGroup: {
    gap: 8,
  },
  payGroupTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
  },
  payGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  payCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  payCardSelected: {
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  payLogo: {
    width: 32,
    height: 32,
  },
  payLabel: {
    fontSize: 12,
    color: '#495057',
    flex: 1,
  },
  payLabelSelected: {
    fontWeight: '700',
    color: '#1A1D2E',
  },
  payFootnote: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  successWrap: {
    alignItems: 'center',
    gap: 16,
  },
  lanyardContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lanyardImgLarge: {
    width: '100%',
    height: '100%',
  },
  badgeTextOverlay: {
    position: 'absolute',
    top: '55%',
    left: '15%',
    right: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  badgeSuccessTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1D2E',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  badgeOrderCode: {
    fontSize: 11,
    color: '#0E9375',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 20,
    gap: 10,
    width: '100%',
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1D2E',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  successDivider: {
    borderTopWidth: 1,
    borderTopColor: '#DEE2E6',
    borderStyle: 'dashed',
    marginVertical: 4,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  successLabel: {
    fontSize: 13,
    color: '#868E96',
  },
  successValue: {
    fontSize: 13,
    color: '#1A1D2E',
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  bottomBtn: {
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfBtn: {
    flex: 1,
  },
});
