import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store';
import { colors, spacing, borderRadius } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await signup(firstName.trim(), lastName.trim(), email.trim(), password);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Une erreur est survenue');
    }
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>F</Text>
              </View>
              <Text style={styles.appName}>Focusa</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.title}>Créer un compte</Text>
              <Text style={styles.subtitle}>
                Rejoignez Focusa et organisez vos tâches efficacement.
              </Text>

              <View style={styles.nameRow}>
                <TextInput
                  label="Prénom"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    clearError();
                  }}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                />
                <TextInput
                  label="Nom"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    clearError();
                  }}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                />
              </View>

              <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError();
                }}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                left={<TextInput.Icon icon="email-outline" />}
              />

              <TextInput
                label="Mot de passe"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearError();
                }}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <TextInput
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  clearError();
                }}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                left={<TextInput.Icon icon="lock-check-outline" />}
              />

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Button
                mode="contained"
                onPress={handleSignup}
                loading={isLoading}
                disabled={isLoading}
                style={styles.signupButton}
                contentStyle={styles.signupButtonContent}
                labelStyle={styles.signupButtonLabel}
              >
                S'inscrire
              </Button>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Déjà un compte ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  halfInput: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: colors.error + '15',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  signupButtonContent: {
    paddingVertical: spacing.sm,
  },
  signupButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
