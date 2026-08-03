import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from './themed-text';

export type AppButtonVariant = 'primary' | 'outline' | 'ghost' | 'dark';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  style?: ViewStyle | ViewStyle[];
}

const VARIANTS: Record<AppButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: '#0E9375', text: '#FFFFFF' },
  dark: { bg: '#1A1D2E', text: '#FFFFFF' },
  outline: { bg: 'transparent', text: '#1A1D2E', border: '#DDDDDD' },
  ghost: { bg: 'transparent', text: '#868E96' },
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  style,
}: AppButtonProps) {
  const v = VARIANTS[variant];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: isDisabled ? '#CED4DA' : v.bg, borderColor: v.border ?? 'transparent' },
        isDisabled && variant === 'outline' && { backgroundColor: '#F5F5F5' },
        pressed && !isDisabled && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#1A1D2E' : '#FFFFFF'} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <MaterialIcons name={icon} size={18} color={v.text} />}
          <ThemedText style={[styles.label, { color: isDisabled ? '#FFFFFF' : v.text }]}>
            {label}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
