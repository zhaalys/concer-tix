import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const MENU_SECTIONS = [
    {
      title: 'Aktivitas Saya',
      items: [
        { id: '1', title: 'Pesanan & Tiket Saya', icon: 'receipt-long', route: '/tickets' },
        { id: '2', title: 'Event Favorit', icon: 'favorite', route: '/explore' },
        { id: '3', title: 'Review & Ulasan Event', icon: 'rate-review', route: null },
      ],
    },
    {
      title: 'Promo & Hadiah',
      items: [
        { id: '4', title: 'Kupon Saya (2 Promo)', icon: 'local-offer', route: null },
        { id: '5', title: 'Poin Artatix (250 Pts)', icon: 'stars', route: null },
      ],
    },
    {
      title: 'Pengaturan & Bantuan',
      items: [
        { id: '6', title: 'Pusat Bantuan & FAQ', icon: 'help-outline', route: null },
        { id: '7', title: 'Syarat & Ketentuan', icon: 'description', route: null },
      ],
    },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Apakah Anda yakin ingin keluar dari akun Artatix?')) {
        router.push('/');
      }
    } else {
      Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: () => router.push('/') },
      ]);
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: '#FFFFFF' }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* User Header Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: '#F4F6FC' }]}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={38} color="#FFFFFF" />
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <ThemedText type="headlineLg" style={{ color: theme.text }}>
              Faisal Dacter
            </ThemedText>
            <MaterialIcons name="verified" size={18} color="#0e3ec7" />
          </View>
          <ThemedText type="bodyMd" style={{ color: theme.textSecondary }}>
            faisal@concertix.id
          </ThemedText>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsRow}>
        <Pressable
          onPress={() => router.push('/tickets')}
          style={[styles.statBox, { backgroundColor: '#FFFFFF' }]}>
          <ThemedText type="headlineLg" style={{ color: '#0e3ec7' }}>
            1
          </ThemedText>
          <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
            Tiket Aktif
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push('/explore')}
          style={[styles.statBox, { backgroundColor: '#FFFFFF' }]}>
          <ThemedText type="headlineLg" style={{ color: '#0e3ec7' }}>
            5
          </ThemedText>
          <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
            Favorit
          </ThemedText>
        </Pressable>

        <View style={[styles.statBox, { backgroundColor: '#FFFFFF' }]}>
          <ThemedText type="headlineLg" style={{ color: '#a33800' }}>
            250
          </ThemedText>
          <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
            Poin
          </ThemedText>
        </View>
      </View>

      {/* Notification Toggle Row */}
      <View style={[styles.toggleRow, { backgroundColor: '#F4F6FC' }]}>
        <View style={styles.toggleLeft}>
          <MaterialIcons name="notifications-active" size={22} color="#0e3ec7" />
          <View>
            <ThemedText type="headlineMd" style={{ color: theme.text }}>
              Notifikasi Event
            </ThemedText>
            <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
              Dapatkan info promo & reminder event
            </ThemedText>
          </View>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#c4c5d7', true: '#0e3ec7' }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Menu Sections */}
      {MENU_SECTIONS.map((section, idx) => (
        <View key={idx} style={styles.menuSection}>
          <ThemedText type="labelMd" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {section.title}
          </ThemedText>

          <View style={styles.menuList}>
            {section.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => item.route && router.push(item.route as any)}
                style={({ pressed }) => [
                  styles.menuItem,
                  { backgroundColor: '#FFFFFF' },
                  pressed && styles.pressed,
                ]}>
                <View style={styles.menuLeft}>
                  <MaterialIcons
                    name={item.icon as keyof typeof MaterialIcons.glyphMap}
                    size={20}
                    color="#0e3ec7"
                  />
                  <ThemedText type="bodyLg" style={{ color: theme.text }}>
                    {item.title}
                  </ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={theme.outline} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutBtn,
          { backgroundColor: 'rgba(186, 26, 26, 0.08)' },
          pressed && styles.pressed,
        ]}>
        <MaterialIcons name="logout" size={20} color="#ba1a1a" />
        <ThemedText type="labelMd" style={{ color: '#ba1a1a', fontWeight: '700' }}>
          Keluar dari Akun
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0e3ec7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuSection: {
    gap: 6,
  },
  sectionTitle: {
    paddingLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  pressed: {
    opacity: 0.8,
  },
});
