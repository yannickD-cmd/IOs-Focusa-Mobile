import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, List, Divider, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => navigation.navigate('Account')}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.name && user?.surname 
                ? `${user.name} ${user.surname}`
                : user?.user_metadata?.full_name || 'Utilisateur'}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <View style={styles.sectionCard}>
            <List.Item
              title="Mon compte"
              description="Gérer vos informations personnelles"
              left={() => (
                <View style={[styles.iconBox, { backgroundColor: colors.secondary + '20' }]}>
                  <Ionicons name="person" size={20} color={colors.secondary} />
                </View>
              )}
              right={() => <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />}
              onPress={() => navigation.navigate('Account')}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Mes tags"
              description="Personnaliser vos étiquettes"
              left={() => (
                <View style={[styles.iconBox, { backgroundColor: colors.accent + '40' }]}>
                  <Ionicons name="pricetag" size={20} color={colors.black} />
                </View>
              )}
              right={() => <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />}
              onPress={() => navigation.navigate('Tags')}
              style={styles.listItem}
            />
          </View>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abonnement</Text>
          <View style={styles.sectionCard}>
            <List.Item
              title="Mon plan"
              description={`Plan ${user?.subscription_plan || 'gratuit'}`}
              left={() => (
                <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name="diamond" size={20} color={colors.primary} />
                </View>
              )}
              right={() => <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />}
              onPress={() => navigation.navigate('Plan')}
              style={styles.listItem}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aide</Text>
          <View style={styles.sectionCard}>
            <List.Item
              title="Support"
              description="Obtenir de l'aide"
              left={() => (
                <View style={[styles.iconBox, { backgroundColor: colors.info + '20' }]}>
                  <Ionicons name="help-circle" size={20} color={colors.info} />
                </View>
              )}
              right={() => <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />}
              onPress={() => navigation.navigate('Support')}
              style={styles.listItem}
            />
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Focusa v1.0.0</Text>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  listItem: {
    paddingVertical: spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error + '10',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  appVersion: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
