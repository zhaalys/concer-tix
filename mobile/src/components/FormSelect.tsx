import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';

interface FormSelectProps {
  label: string;
  placeholder?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function FormSelect({ label, placeholder, value, options, onChange, error, hint, required }: FormSelectProps) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.label}>
        {label} {required ? '*' : ''}
      </ThemedText>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.select, error && styles.selectError]}>
        <ThemedText style={value ? styles.valueText : styles.placeholderText}>
          {value || placeholder || 'Pilih'}
        </ThemedText>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#9B9B9B" />
      </Pressable>
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : hint ? (
        <ThemedText style={styles.hintText}>{hint}</ThemedText>
      ) : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
            <View style={styles.handle} />
            <ThemedText style={styles.sheetTitle}>{label}</ThemedText>
            <ScrollView style={styles.sheetList}>
              {options.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  style={[styles.option, value === opt && styles.optionActive]}>
                  <ThemedText style={[styles.optionText, value === opt && styles.optionTextActive]}>
                    {opt}
                  </ThemedText>
                  {value === opt && <MaterialIcons name="check" size={18} color="#0E9375" />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9B9B9B',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  select: {
    height: 44,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  selectError: {
    borderColor: '#E5484D',
  },
  valueText: {
    fontSize: 14,
    color: '#1A1D2E',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  errorText: {
    fontSize: 11,
    color: '#E5484D',
  },
  hintText: {
    fontSize: 11,
    color: '#9B9B9B',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
    maxHeight: '70%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E9ECEF',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1D2E',
    marginBottom: 8,
  },
  sheetList: {
    flexGrow: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  optionActive: {
    backgroundColor: '#F7FDFB',
  },
  optionText: {
    fontSize: 14,
    color: '#1A1D2E',
  },
  optionTextActive: {
    color: '#0E9375',
    fontWeight: '700',
  },
});
