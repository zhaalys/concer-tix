import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

export function EmptyStateDelighter() {
  const theme = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    setShowModal(false);
    const msg = `Pengingat event baru berhasil diaktifkan untuk ${email || 'email Anda'}!`;
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(msg);
    } else {
      Alert.alert('Pengingat Aktif!', msg);
    }
    setEmail('');
  };

  return (
    <View style={styles.container}>
      {/* Icon Circle */}
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: 'rgba(14, 62, 199, 0.08)' },
        ]}>
        <MaterialIcons name="rocket-launch" size={42} color="rgba(14, 62, 199, 0.45)" />
      </View>

      {/* Heading & Subtitle */}
      <ThemedText
        type="headlineMd"
        style={[styles.heading, { color: theme.textSecondary }]}>
        Belum nemu yang cocok?
      </ThemedText>

      <ThemedText
        type="bodyMd"
        style={[styles.subtitle, { color: theme.outline }]}>
        Jangan khawatir, event baru ditambahkan setiap harinya!
      </ThemedText>

      {/* Action Button */}
      <Pressable
        onPress={() => setShowModal(true)}
        style={({ pressed }) => [
          styles.button,
          { borderColor: 'rgba(14, 62, 199, 0.25)' },
          pressed && styles.pressed,
        ]}>
        <ThemedText
          type="labelMd"
          style={{ color: '#0e3ec7', fontWeight: '700' }}>
          Ingatkan Saya Event Baru
        </ThemedText>
      </Pressable>

      {/* Modal Subscribe */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalIconBox}>
              <MaterialIcons name="notifications-active" size={32} color="#0e3ec7" />
            </View>

            <ThemedText type="headlineLg" style={{ color: '#0b1a3d', textAlign: 'center' }}>
              Ingatkan Saya Event Baru
            </ThemedText>

            <ThemedText type="bodyMd" style={{ color: '#444654', textAlign: 'center' }}>
              Dapatkan notifikasi langsung saat ada konser, pameran, atau festival baru di kotamu.
            </ThemedText>

            <View style={styles.inputBox}>
              <MaterialIcons name="email" size={20} color="#747686" />
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan alamat email kamu..."
                placeholderTextColor="#747686"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <Pressable
                onPress={() => setShowModal(false)}
                style={styles.cancelBtn}>
                <ThemedText type="labelMd" style={{ color: '#747686' }}>
                  Batal
                </ThemedText>
              </Pressable>

              <Pressable onPress={handleSubscribe} style={styles.submitBtn}>
                <ThemedText type="labelMd" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                  Aktifkan Notifikasi
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heading: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 26, 61, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(14, 62, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  inputBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6FC',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginVertical: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
  },
  modalBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F4F6FC',
  },
  submitBtn: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0e3ec7',
  },
});
