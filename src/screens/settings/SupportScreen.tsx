import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Text, Button, List, Divider, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

const FAQ_ITEMS = [
  {
    question: 'Comment créer un nouveau projet ?',
    answer: 'Sur l\'écran Projets, appuyez sur le bouton "+" en bas à droite pour créer un nouveau projet. Donnez-lui un nom, une description optionnelle et choisissez une couleur.',
  },
  {
    question: 'Comment ajouter une tâche à un projet ?',
    answer: 'Ouvrez un projet et appuyez sur le bouton "+" pour ajouter une nouvelle tâche. Vous pouvez définir un titre, une description, une date d\'échéance et une priorité.',
  },
  {
    question: 'Comment fonctionne le calendrier ?',
    answer: 'Le calendrier affiche toutes vos tâches par date d\'échéance. Les points colorés indiquent les jours avec des tâches. Appuyez sur un jour pour voir les tâches associées.',
  },
  {
    question: 'Puis-je synchroniser mes données sur plusieurs appareils ?',
    answer: 'Oui ! Vos données sont automatiquement synchronisées sur le cloud. Connectez-vous avec le même compte sur n\'importe quel appareil pour accéder à vos projets et tâches.',
  },
  {
    question: 'Comment utiliser l\'assistant IA ?',
    answer: 'L\'assistant IA est disponible pour les utilisateurs Premium. Accédez-y depuis le tableau de bord pour obtenir des suggestions sur la gestion de vos tâches et la planification.',
  },
];

export default function SupportScreen() {
  const handleContact = (method: 'email' | 'chat' | 'twitter') => {
    switch (method) {
      case 'email':
        Linking.openURL('mailto:support@focusa.app');
        break;
      case 'twitter':
        Linking.openURL('https://twitter.com/focusaapp');
        break;
      default:
        Alert.alert('Chat', 'Le chat en direct sera bientôt disponible');
    }
  };

  const handleOpenDocs = () => {
    Linking.openURL('https://www.focusa.app/docs');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Quick Help */}
      <View style={styles.quickHelp}>
        <View style={styles.helpIcon}>
          <Ionicons name="help-circle" size={40} color={colors.primary} />
        </View>
        <Text style={styles.helpTitle}>Comment pouvons-nous vous aider ?</Text>
        <Text style={styles.helpSubtitle}>
          Consultez notre FAQ ou contactez notre équipe support
        </Text>
      </View>

      {/* Contact Options */}
      <View style={styles.contactOptions}>
        <Text style={styles.sectionTitle}>Nous contacter</Text>

        <View style={styles.contactGrid}>
          <View style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="mail" size={24} color={colors.primary} />
            </View>
            <Text style={styles.contactLabel}>Email</Text>
            <Button
              mode="text"
              compact
              onPress={() => handleContact('email')}
            >
              Envoyer
            </Button>
          </View>

          <View style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="chatbubbles" size={24} color={colors.success} />
            </View>
            <Text style={styles.contactLabel}>Chat</Text>
            <Button
              mode="text"
              compact
              onPress={() => handleContact('chat')}
            >
              Démarrer
            </Button>
          </View>

          <View style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: colors.info + '15' }]}>
              <Ionicons name="logo-twitter" size={24} color={colors.info} />
            </View>
            <Text style={styles.contactLabel}>Twitter</Text>
            <Button
              mode="text"
              compact
              onPress={() => handleContact('twitter')}
            >
              Suivre
            </Button>
          </View>
        </View>
      </View>

      {/* FAQ */}
      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>Questions fréquentes</Text>

        {FAQ_ITEMS.map((item, index) => (
          <List.Accordion
            key={index}
            title={item.question}
            titleStyle={styles.faqQuestion}
            titleNumberOfLines={2}
            style={styles.faqItem}
            left={(props) => (
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.primary}
                style={{ marginLeft: spacing.md }}
              />
            )}
          >
            <View style={styles.faqAnswerContainer}>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          </List.Accordion>
        ))}
      </View>

      {/* Documentation */}
      <View style={styles.docsCard}>
        <View style={styles.docsContent}>
          <Ionicons name="book" size={32} color={colors.warning} />
          <View style={styles.docsText}>
            <Text style={styles.docsTitle}>Documentation</Text>
            <Text style={styles.docsSubtitle}>
              Guides complets et tutoriels
            </Text>
          </View>
        </View>
        <Button
          mode="contained"
          onPress={handleOpenDocs}
          buttonColor={colors.warning}
        >
          Consulter
        </Button>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Focusa v1.0.0</Text>
        <View style={styles.legalLinks}>
          <Button
            mode="text"
            compact
            onPress={() => Linking.openURL('https://www.focusa.app/politique-confidentialite.html')}
          >
            Confidentialité
          </Button>
          <Text style={styles.separator}>•</Text>
          <Button
            mode="text"
            compact
            onPress={() => Linking.openURL('https://www.focusa.app/cgv.html')}
          >
            CGV
          </Button>
        </View>
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
  quickHelp: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  helpIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  helpSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.md,
  },
  contactOptions: {
    marginBottom: spacing.xl,
  },
  contactGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  contactCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  faqSection: {
    marginBottom: spacing.xl,
  },
  faqItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  faqAnswerContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  docsCard: {
    backgroundColor: colors.warning + '10',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  docsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  docsText: {
    flex: 1,
  },
  docsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  docsSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    color: colors.textMuted,
  },
});
