import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppImage } from '@/components/AppImage';
import { AppButton } from '@/components/AppButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { FACILITY_ICON_IMAGES } from '@/lib/content';
import { formatEventDate, formatPrice } from '@/lib/format';
import { getEventBySlug } from '@/lib/useEvents';
import type { Event } from '@/lib/types';

type TabKey = 'description' | 'terms' | 'facilities';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('description');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let active = true;
    getEventBySlug(id ?? '')
      .then((ev) => {
        if (active) setEvent(ev);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
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
        <MaterialIcons name="event-busy" size={40} color="#868E96" />
        <ThemedText style={styles.notFound}>Event Not Found</ThemedText>
        <AppButton label="Kembali" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} variant="outline" style={{ marginTop: 16, width: 200 }} />
      </View>
    );
  }

  const hasCoords =
    (event.map_url ?? '').split(',').length === 2 &&
    event.map_url!.split(',').every((v) => !isNaN(parseFloat(v.trim())));

  const onShare = () => {
    Share.share({
      title: event.title,
      message: `${event.title} - ${event.organizer}\n${event.location ?? ''}\nBeli tiketnya di Concer TIX!`,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          setScrolled(y > 60);
        }}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.posterWrap}>
          <AppImage src={event.image_url} style={styles.poster} radius={0} />
        </View>

        {/* Fixed top bar */}
        <View
          style={[
            styles.topBar,
            {
              paddingTop: Math.max(insets.top, 8) + 8,
              backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
              borderBottomWidth: scrolled ? 1 : 0,
            },
          ]}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={({ pressed }) => [styles.topBtn, pressed && styles.pressed]}
            hitSlop={8}>
            <MaterialIcons name="arrow-back" size={22} color={scrolled ? '#1A1D2E' : '#1A1D2E'} />
          </Pressable>
          <Pressable
            onPress={onShare}
            style={({ pressed }) => [styles.topBtn, pressed && styles.pressed]}
            hitSlop={8}>
            <MaterialIcons name="share" size={20} color="#1A1D2E" />
          </Pressable>
        </View>

        <View style={styles.body}>
          <ThemedText style={styles.title}>{event.title}</ThemedText>

          <View style={styles.organizerRow}>
            <AppImage src={event.organizer_logo} style={styles.organizerLogo} radius={14} />
            <View>
              <ThemedText style={styles.orgLabel}>Penyelenggara</ThemedText>
              <ThemedText style={styles.orgName}>{event.organizer}</ThemedText>
            </View>
          </View>

          {/* Location */}
          <Pressable
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location ?? '')}`
              )
            }
            style={({ pressed }) => [styles.locationRow, pressed && styles.pressed]}>
            <MaterialIcons name="location-on" size={18} color="#0E9375" />
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.locationText}>{event.location}</ThemedText>
              {!!event.city_label && <ThemedText style={styles.cityText}>{event.city_label}</ThemedText>}
            </View>
            <MaterialIcons name="open-in-new" size={14} color="#ADB5BD" />
          </Pressable>

          {/* Social media */}
          {event.social_media && event.social_media.length > 0 && (
            <View style={styles.socialWrap}>
              <ThemedText style={styles.socialLabel}>Media Sosial</ThemedText>
              <View style={styles.socialRow}>
                {event.social_media.map((s) => (
                  <Pressable
                    key={s.platform}
                    onPress={() => Linking.openURL(s.url)}
                    style={[styles.socialChip, s.platform.toLowerCase().includes('instagram') ? styles.socialChipIg : styles.socialChipOther]}>
                    <MaterialIcons name={s.platform.toLowerCase().includes('instagram') ? 'camera-alt' : 'music-note'} size={14} color={s.platform.toLowerCase().includes('instagram') ? '#3B5BDB' : '#1A1D2E'} />
                    <ThemedText style={[styles.socialChipText, s.platform.toLowerCase().includes('instagram') && { color: '#3B5BDB' }]}>
                      {s.platform}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Tabs */}
          <View style={styles.tabBar}>
            {(
              [
                { key: 'description', label: 'Description' },
                { key: 'terms', label: 'Terms & Conditions' },
                { key: 'facilities', label: 'Facilities' },
              ] as { key: TabKey; label: string }[]
            ).map((t) => (
              <Pressable key={t.key} onPress={() => setTab(t.key)} style={styles.tabItem}>
                <ThemedText style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
                  {t.label}
                </ThemedText>
                {tab === t.key && <View style={styles.tabUnderline} />}
              </Pressable>
            ))}
          </View>

          <View style={styles.tabContent}>
            {tab === 'description' && <ThemedText style={styles.paragraph}>{event.description}</ThemedText>}
            {tab === 'terms' && (
              <View style={styles.termsList}>
                {(event.terms ?? []).map((term, i) => (
                  <ThemedText key={i} style={styles.termItem}>
                    {i + 1}. {term}
                  </ThemedText>
                ))}
              </View>
            )}
            {tab === 'facilities' && (
              <View style={styles.facilityGrid}>
                {(event.facilities ?? []).map((f, i) => (
                  <View key={i} style={styles.facilityItem}>
                    <AppImage src={FACILITY_ICON_IMAGES[f.icon]} style={styles.facilityIcon} contentFit="contain" />
                    <ThemedText style={styles.facilityLabel}>{f.label}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Detail acara */}
          <View style={styles.detailCard}>
            <ThemedText style={styles.detailLabel}>Detail Acara</ThemedText>
            <View style={styles.detailRow}>
              <MaterialIcons name="calendar-month" size={16} color="#0E9375" />
              <ThemedText style={styles.detailText}>{formatEventDate(event.event_date)}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={16} color="#0E9375" />
              <ThemedText style={styles.detailText}>{event.event_time}</ThemedText>
            </View>
          </View>

          {/* Map */}
          {(event.map_url || event.location) && (
            <Pressable
              onPress={() =>
                Linking.openURL(
                  hasCoords
                    ? `https://www.google.com/maps?q=${encodeURIComponent(event.map_url ?? '')}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location ?? '')}`
                )
              }
              style={({ pressed }) => [styles.mapCard, pressed && styles.pressed]}>
              {hasCoords ? (
                <AppImage
                  src={`https://staticmap.openstreetmap.de/staticmap.php?center=${encodeURIComponent(event.map_url ?? '')}&zoom=15&size=600x300&markers=${encodeURIComponent(event.map_url ?? '')}`}
                  style={styles.mapImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.mapPlaceholder}>
                  <MaterialIcons name="map" size={36} color="#0E9375" />
                  <ThemedText style={styles.mapText}>Buka Google Maps</ThemedText>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.ctaLabel}>Harga mulai dari</ThemedText>
          <ThemedText style={styles.ctaPrice}>{formatPrice(event.numericPrice ?? 0)}</ThemedText>
        </View>
        <AppButton
          label="Beli Tiket"
          icon="confirmation-number"
          style={{ width: 200, height: 46 }}
          onPress={() => router.push(`/event/${event.id}/checkout` as never)}
        />
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
    paddingBottom: 110,
  },
  posterWrap: {
    position: 'relative',
    width: '100%',
  },
  poster: {
    width: '100%',
    aspectRatio: 16 / 10,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    zIndex: 10,
  },
  topBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  body: {
    padding: 16,
    gap: 16,
  },
  notFound: {
    marginTop: 12,
    fontSize: 16,
    color: '#1A1D2E',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1D2E',
    lineHeight: 32,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  organizerLogo: {
    width: 36,
    height: 36,
  },
  orgLabel: {
    fontSize: 11,
    color: '#868E96',
  },
  orgName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7F9FB',
    borderRadius: 10,
    padding: 12,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D2E',
  },
  cityText: {
    fontSize: 12,
    color: '#868E96',
  },
  socialWrap: {
    gap: 8,
  },
  socialLabel: {
    fontSize: 12,
    color: '#868E96',
  },
  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  socialChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  socialChipIg: {
    backgroundColor: '#E7F0FD',
  },
  socialChipOther: {
    backgroundColor: '#F0F0F0',
  },
  socialChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1D2E',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
    gap: 24,
  },
  tabItem: {
    paddingVertical: 10,
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    color: '#868E96',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#0E9375',
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#0E9375',
  },
  tabContent: {
    minHeight: 60,
  },
  paragraph: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 22,
  },
  termsList: {
    gap: 10,
  },
  termItem: {
    fontSize: 13,
    color: '#495057',
    lineHeight: 20,
  },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  facilityItem: {
    width: '30%',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  facilityIcon: {
    width: 36,
    height: 36,
  },
  facilityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1D2E',
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#F8FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F3F5',
    padding: 14,
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1D2E',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#495057',
  },
  mapCard: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5F2',
    gap: 6,
  },
  mapText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E9375',
  },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  ctaLabel: {
    fontSize: 12,
    color: '#868E96',
  },
  ctaPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1D2E',
  },
  pressed: {
    opacity: 0.8,
  },
});
