import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from './themed-text';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  valid?: string;
  required?: boolean;
  containerStyle?: object;
}

export function FormInput({ label, error, hint, valid, required, containerStyle, ...rest }: FormInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.wrap, containerStyle]}>
      <ThemedText style={styles.label}>
        {label} {required ? '*' : ''}
      </ThemedText>
      <TextInput
        placeholderTextColor="#9B9B9B"
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          rest.style,
        ]}
      />
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : valid ? (
        <ThemedText style={styles.validText}>{valid}</ThemedText>
      ) : hint ? (
        <ThemedText style={styles.hintText}>{hint}</ThemedText>
      ) : null}
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
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1A1D2E',
    backgroundColor: '#FFFFFF',
  },
  inputFocused: {
    borderColor: '#0F766E',
  },
  inputError: {
    borderColor: '#E5484D',
  },
  errorText: {
    fontSize: 11,
    color: '#E5484D',
  },
  validText: {
    fontSize: 10,
    color: '#1ABC9C',
  },
  hintText: {
    fontSize: 11,
    color: '#9B9B9B',
  },
});
