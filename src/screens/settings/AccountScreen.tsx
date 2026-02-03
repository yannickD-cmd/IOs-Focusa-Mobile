import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, Avatar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import api from '../../services/api';

export default function AccountScreen() {
  const navigation = useNavigation();
  const { user, setUser, token } = useAuthStore();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return;
    }

    setIsLoading(true);
    try {
      if (!token) throw new Error('Non authentifié');
      const updatedUser = await api.updateProfile(token, { full_name: fullName.trim() });
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (!fullName) return user?.email?.charAt(0).toUpperCase() || '?';
    return fullName
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar.Text
            size={100}
            label={getInitials()}
            style={styles.avatar}
          />
          <IconButton
            icon="camera"
            mode="contained"
            containerColor={colors.white}
            iconColor={colors.primary}
            size={20}
            style={styles.cameraButton}
            onPress={() => Alert.alert('Info', 'Changement de photo bientôt disponible')}
          />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              placeholder="Votre nom"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              editable={isEditing}
              left={<TextInput.Icon icon="account" color={colors.textSecondary} />}
            />
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.border}
              editable={false}
              left={<TextInput.Icon icon="email" color={colors.textSecondary} />}
            />
            <Text style={styles.hint}>
              L'adresse email ne peut pas être modifiée
            </Text>
          </View>

          {/* Account Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Membre depuis</Text>
              <Text style={styles.infoValue}>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Abonnement</Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>
                {user?.subscription_status === 'active' ? 'Premium' : 'Gratuit'}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {isEditing ? (
            <>
              <Button
                mode="outlined"
                onPress={() => {
                  setFullName(user?.full_name || '');
                  setIsEditing(false);
                }}
                style={styles.cancelButton}
              >
                Annuler
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={isLoading}
                disabled={isLoading}
                style={styles.saveButton}
                buttonColor={colors.primary}
              >
                Enregistrer
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
              buttonColor={colors.primary}
              icon="pencil"
            >
              Modifier le profil
            </Button>
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Zone de danger</Text>
          <Button
            mode="outlined"
            textColor={colors.error}
            style={styles.deleteButton}
            icon="delete"
            onPress={() => {
              Alert.alert(
                'Supprimer le compte',
                'Cette action est irréversible. Toutes vos données seront perdues.',
                [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => Alert.alert('Info', 'Contactez le support pour supprimer votre compte'),
                  },
                ]
              );
            }}
          >
            Supprimer mon compte
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    ...shadows.sm,
  },
  form: {
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.border,
  },
  saveButton: {
    flex: 1,
  },
  editButton: {
    flex: 1,
  },
  dangerZone: {
    backgroundColor: colors.error + '10',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
    marginBottom: spacing.md,
  },
  deleteButton: {
    borderColor: colors.error,
  },
});
