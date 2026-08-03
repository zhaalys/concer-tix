/**
 * Concer TIX Theme System - Clean White Backgrounds & Tosca (Teal) Accents
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0b1a3d',
    textSecondary: '#444654',
    background: '#ffffff',
    backgroundElement: '#f4f6fc',
    backgroundSelected: '#e0f2ef',
    primary: '#0E9375',
    primaryContainer: '#1ABC9C',
    onPrimary: '#ffffff',
    secondary: '#064E3B',
    secondaryContainer: '#0F766E',
    onSecondary: '#ffffff',
    outline: '#747686',
    outlineVariant: '#c4c5d7',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f4f6fc',
    surfaceContainer: '#e0f2ef',
    surfaceContainerHigh: '#d0ebe4',
    surfaceContainerHighest: '#c0e4da',
  },
  dark: {
    text: '#0b1a3d', // Clean light UI requested by user
    textSecondary: '#444654',
    background: '#ffffff',
    backgroundElement: '#f4f6fc',
    backgroundSelected: '#e0f2ef',
    primary: '#0E9375',
    primaryContainer: '#1ABC9C',
    onPrimary: '#ffffff',
    secondary: '#ff6b2b',
    secondaryContainer: '#0F766E',
    onSecondary: '#ffffff',
    outline: '#747686',
    outlineVariant: '#c4c5d7',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f4f6fc',
    surfaceContainer: '#e0f2ef',
    surfaceContainerHigh: '#d0ebe4',
    surfaceContainerHighest: '#c0e4da',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'PlusJakartaSans',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'PlusJakartaSans',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Plus Jakarta Sans', sans-serif",
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
