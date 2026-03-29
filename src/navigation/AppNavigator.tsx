import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store';
import { colors } from '../constants/theme';
import { ActivityIndicator, View } from 'react-native';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import ProjectsScreen from '../screens/main/ProjectsScreen';
import ProjectDetailScreen from '../screens/main/ProjectDetailScreen';
import CalendarScreen from '../screens/main/CalendarScreen';
import NotesScreen from '../screens/main/NotesScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

// Task Screens
import CreateTaskScreen from '../screens/tasks/CreateTaskScreen';
import EditTaskScreen from '../screens/tasks/EditTaskScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';

// Note Screens
import CreateNoteScreen from '../screens/notes/CreateNoteScreen';
import NoteDetailScreen from '../screens/notes/NoteDetailScreen';
import EditNoteScreen from '../screens/notes/EditNoteScreen';

// Settings Screens
import AccountScreen from '../screens/settings/AccountScreen';
import PlanScreen from '../screens/settings/PlanScreen';
import SupportScreen from '../screens/settings/SupportScreen';
import TagsScreen from '../screens/settings/TagsScreen';

// Create Project Screen
import CreateProjectScreen from '../screens/projects/CreateProjectScreen';

import { RootStackParamList, BottomTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProjectsTab') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'CalendarTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'NotesTab') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="ProjectsTab" 
        component={ProjectsScreen}
        options={{ tabBarLabel: 'Projets' }}
      />
      <Tab.Screen 
        name="CalendarTab" 
        component={CalendarScreen}
        options={{ tabBarLabel: 'Calendrier' }}
      />
      <Tab.Screen 
        name="NotesTab" 
        component={NotesScreen}
        options={{ tabBarLabel: 'Notes' }}
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsScreen}
        options={{ tabBarLabel: 'Paramètres' }}
      />
    </Tab.Navigator>
  );
}

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth().catch((error) => {
      console.error('Failed to load stored auth:', error);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="ProjectDetail" 
            component={ProjectDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Détails du projet',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
            }}
          />
          <Stack.Screen 
            name="CreateTask" 
            component={CreateTaskScreen}
            options={{
              headerShown: true,
              headerTitle: 'Nouvelle tâche',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="EditTask" 
            component={EditTaskScreen}
            options={{
              headerShown: true,
              headerTitle: 'Modifier la tâche',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="TaskDetail" 
            component={TaskDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Détails de la tâche',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
            }}
          />
          <Stack.Screen 
            name="CreateNote" 
            component={CreateNoteScreen}
            options={{
              headerShown: true,
              headerTitle: 'Nouvelle note',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="NoteDetail" 
            component={NoteDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Note',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
            }}
          />
          <Stack.Screen 
            name="EditNote" 
            component={EditNoteScreen}
            options={{
              headerShown: true,
              headerTitle: 'Modifier la note',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="CreateProject" 
            component={CreateProjectScreen}
            options={{
              headerShown: true,
              headerTitle: 'Nouveau projet',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="Account" 
            component={AccountScreen}
            options={{
              headerShown: true,
              headerTitle: 'Mon compte',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
            }}
          />
          <Stack.Screen 
            name="Plan" 
            component={PlanScreen}
            options={{
              headerShown: true,
              headerTitle: 'Mon abonnement',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
            }}
          />
          <Stack.Screen 
            name="Support" 
            component={SupportScreen}
            options={{
              headerShown: true,
              headerTitle: 'Support',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
            }}
          />
          <Stack.Screen 
            name="Tags" 
            component={TagsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Mes tags',
              headerBackTitle: 'Retour',
              headerTintColor: colors.primary,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
