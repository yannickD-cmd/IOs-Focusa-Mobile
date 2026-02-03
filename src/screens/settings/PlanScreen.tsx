import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Text, Button, List, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    features: [
      '3 projets max',
      '10 tâches par projet',
      '5 notes',
      'Calendrier basique',
    ],
    recommended: false,
  },
  {
    id: 'monthly',
    name: 'Premium Mensuel',
    price: '9,99€',
    period: '/mois',
    features: [
      'Projets illimités',
      'Tâches illimitées',
      'Notes illimitées',
      'Intégration Gmail',
      'Assistant IA',
      'Support prioritaire',
    ],
    recommended: true,
  },
  {
    id: 'yearly',
    name: 'Premium Annuel',
    price: '99,99€',
    period: '/an',
    savings: 'Économisez 20%',
    features: [
      'Tous les avantages Premium',
      '2 mois gratuits',
      'Accès anticipé aux nouvelles fonctionnalités',
    ],
    recommended: false,
  },
];

export default function PlanScreen() {
  const { user } = useAuthStore();

  const currentPlan = user?.subscription_status === 'active' ? 'premium' : 'free';

  const handleUpgrade = (planId: string) => {
    Alert.alert(
      'Mise à niveau',
      'Vous allez être redirigé vers la page de paiement.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Continuer',
          onPress: () => {
            Linking.openURL('https://www.focusa.app/subscribe.html');
          },
        },
      ]
    );
  };

  const handleManageSubscription = () => {
    Linking.openURL('https://billing.stripe.com/p/login/test_xxx');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Current Plan */}
      <View style={styles.currentPlanCard}>
        <View style={styles.currentPlanHeader}>
          <Ionicons
            name={currentPlan === 'premium' ? 'star' : 'star-outline'}
            size={24}
            color={currentPlan === 'premium' ? colors.warning : colors.textSecondary}
          />
          <View style={styles.currentPlanInfo}>
            <Text style={styles.currentPlanLabel}>Votre abonnement</Text>
            <Text style={styles.currentPlanName}>
              {currentPlan === 'premium' ? 'Premium' : 'Gratuit'}
            </Text>
          </View>
        </View>
        {currentPlan === 'premium' && (
          <Button
            mode="outlined"
            onPress={handleManageSubscription}
            compact
          >
            Gérer
          </Button>
        )}
      </View>

      {/* Plans List */}
      <Text style={styles.sectionTitle}>Nos offres</Text>

      {PLANS.map((plan, index) => (
        <View
          key={plan.id}
          style={[
            styles.planCard,
            plan.recommended && styles.planCardRecommended,
          ]}
        >
          {plan.recommended && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Recommandé</Text>
            </View>
          )}

          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>{plan.name}</Text>
              {plan.savings && (
                <Text style={styles.savings}>{plan.savings}</Text>
              )}
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{plan.price}</Text>
              <Text style={styles.period}>{plan.period}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.features}>
            {plan.features.map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.success}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {plan.id !== 'free' && currentPlan !== 'premium' && (
            <Button
              mode="contained"
              onPress={() => handleUpgrade(plan.id)}
              style={[
                styles.upgradeButton,
                plan.recommended && styles.upgradeButtonRecommended,
              ]}
              buttonColor={plan.recommended ? colors.primary : colors.gray[700]}
            >
              Choisir cette offre
            </Button>
          )}

          {plan.id === 'free' && currentPlan === 'free' && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Plan actuel</Text>
            </View>
          )}
        </View>
      ))}

      {/* FAQ */}
      <View style={styles.faq}>
        <Text style={styles.sectionTitle}>Questions fréquentes</Text>

        <List.Accordion
          title="Comment annuler mon abonnement ?"
          titleStyle={styles.faqTitle}
          style={styles.faqItem}
        >
          <Text style={styles.faqAnswer}>
            Vous pouvez annuler votre abonnement à tout moment depuis la page de gestion de votre abonnement. Vous conserverez l'accès Premium jusqu'à la fin de votre période de facturation.
          </Text>
        </List.Accordion>

        <List.Accordion
          title="Puis-je changer de plan ?"
          titleStyle={styles.faqTitle}
          style={styles.faqItem}
        >
          <Text style={styles.faqAnswer}>
            Oui, vous pouvez passer du plan mensuel au plan annuel à tout moment. La différence sera calculée au prorata.
          </Text>
        </List.Accordion>
      </View>
    </ScrollView>
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
  currentPlanCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  currentPlanInfo: {
    gap: spacing.xs,
  },
  currentPlanLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  currentPlanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.md,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  planCardRecommended: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  savings: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  period: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  divider: {
    marginVertical: spacing.md,
  },
  features: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  upgradeButton: {
    borderRadius: borderRadius.md,
  },
  upgradeButtonRecommended: {
    // Already using primary color
  },
  currentBadge: {
    backgroundColor: colors.gray[100],
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  currentBadgeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  faq: {
    marginTop: spacing.lg,
  },
  faqItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  faqTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    padding: spacing.md,
  },
});
