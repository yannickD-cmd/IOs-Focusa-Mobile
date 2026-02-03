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
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { colors, spacing, borderRadius } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre email');
      return;
    }

    setIsLoading(true);
    try {
      await api.forgotPassword(email.trim());
      setIsSuccess(true);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
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
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.black} />
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="lock-closed" size={40} color={colors.white} />
              </View>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {isSuccess ? (
                <>
                  <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
                  </View>
                  <Text style={styles.title}>Email envoyé !</Text>
                  <Text style={styles.subtitle}>
                    Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Login')}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                  >
                    Retour à la connexion
                  </Button>
                </>
              ) : (
                <>
                  <Text style={styles.title}>Mot de passe oublié ?</Text>
                  <Text style={styles.subtitle}>
                    Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </Text>

                  <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    style={styles.input}
                    outlineColor={colors.border}
                    activeOutlineColor={colors.primary}
                    left={<TextInput.Icon icon="email-outline" />}
                  />

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                  >
                    Envoyer le lien
                  </Button>

                  <TouchableOpacity
                    style={styles.backToLogin}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={styles.backToLoginText}>
                      Retour à la connexion
                    </Text>
                  </TouchableOpacity>
                </>
              )}
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
    padding: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
  successIcon: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  backToLogin: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  backToLoginText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});
