import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Goal } from '../../types/goal';
import { presetGoals } from '../../data/presetGoals';
import { overlayThemes } from '../../data/overlayThemes';
import GoalTile from '../../components/GoalTile';
import GoalConfigModal from '../../components/GoalConfigModal';
import TabButton from '../../components/TabButton';
import OverlayModal from '../../components/OverlayModal';

type Category = 'Professional' | 'Wellness' | 'Personal';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<Category>('Professional');
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal | undefined>();
  const [isCustomGoal, setIsCustomGoal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(overlayThemes[0]);
  const [overlayModalVisible, setOverlayModalVisible] = useState(false);

  const categories: Category[] = ['Professional', 'Wellness', 'Personal'];

  const getGoalsForCategory = (category: Category) => {
    return presetGoals.filter(goal => goal.category === category);
  };

  const isGoalSelected = (goalId: string) => {
    return selectedGoals.some(goal => goal.id === goalId);
  };

  const handleGoalPress = (goal: Goal) => {
    if (isGoalSelected(goal.id)) {
      // Remove goal if already selected
      setSelectedGoals(prev => prev.filter(g => g.id !== goal.id));
    } else {
      if (selectedGoals.length >= 3) {
        Alert.alert('Goal Limit', 'You can only select up to 3 goals at a time!');
        return;
      }
      
      setCurrentGoal(goal);
      setIsCustomGoal(false);
      setModalVisible(true);
    }
  };

  const handleCreateOwnPress = () => {
    if (selectedGoals.length >= 3) {
      Alert.alert('Goal Limit', 'You can only select up to 3 goals at a time!');
      return;
    }
    
    setCurrentGoal({
      id: `custom-${Date.now()}`,
      name: '',
      category: activeTab,
      metricType: 'count',
      isCustom: true,
    });
    setIsCustomGoal(true);
    setModalVisible(true);
  };

  const handleGoalSave = (configuredGoal: Goal) => {
    const existingIndex = selectedGoals.findIndex(g => g.id === configuredGoal.id);
    
    if (existingIndex >= 0) {
      // Update existing goal
      setSelectedGoals(prev => 
        prev.map((g, index) => index === existingIndex ? configuredGoal : g)
      );
    } else {
      // Add new goal
      setSelectedGoals(prev => [...prev, configuredGoal]);
    }
    
    setModalVisible(false);
    setCurrentGoal(undefined);
    setIsCustomGoal(false);
  };

  const handleRandomizeTheme = () => {
    const availableThemes = overlayThemes.filter(theme => theme.id !== currentTheme.id);
    const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
    setCurrentTheme(randomTheme);
  };

  const handleOpenOverlay = () => {
    if (selectedGoals.length === 0) {
      Alert.alert('No Goals', 'Please add some goals before viewing the overlay!');
      return;
    }
    setOverlayModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/striva-logo.png')} style={styles.logo} />
          <Text style={styles.title}>Set and Share Your Goal(s) for the Day!</Text>
          <Text style={styles.subtitle}>
            {selectedGoals.length}/3 goals selected
          </Text>
          {selectedGoals.length > 0 && (
            <TouchableOpacity
              style={styles.previewButton}
              onPress={handleOpenOverlay}
              activeOpacity={0.8}
            >
              <Text style={styles.previewButtonText}>👁️ Preview Overlay</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabs}
        >
          {categories.map((category) => (
            <TabButton
              key={category}
              title={category}
              isActive={activeTab === category}
              onPress={() => setActiveTab(category)}
            />
          ))}
        </ScrollView>

        {/* Goals List */}
        <ScrollView style={styles.goalsList} showsVerticalScrollIndicator={false}>
          {/* Create Your Own - Always First */}
          <GoalTile
            goal={{ name: 'Create Your Own', isCreateOwn: true }}
            onPress={handleCreateOwnPress}
          />

          {/* Preset Goals */}
          {getGoalsForCategory(activeTab).map((goal) => (
            <GoalTile
              key={goal.id}
              goal={goal}
              onPress={() => handleGoalPress(goal)}
              isSelected={isGoalSelected(goal.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Overlay Modal */}
      <OverlayModal
        visible={overlayModalVisible}
        goals={selectedGoals}
        theme={currentTheme}
        onClose={() => setOverlayModalVisible(false)}
        onRandomizeTheme={handleRandomizeTheme}
      />

      {/* Goal Configuration Modal */}
      <GoalConfigModal
        visible={modalVisible}
        goal={currentGoal}
        isCustom={isCustomGoal}
        onSave={handleGoalSave}
        onCancel={() => {
          setModalVisible(false);
          setCurrentGoal(undefined);
          setIsCustomGoal(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#228B22',
  },
  logo: {
    width: 160,
    height: 53,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#228B22',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E0E0E0',
    textAlign: 'center',
  },
  previewButton: {
    backgroundColor: '#228B22',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 12,
    shadowColor: '#228B22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabs: {
    maxHeight: 60,
    backgroundColor: '#F5F5F5',
    minHeight: 60,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: '2%',
    alignItems: 'center',
  },
  goalsList: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
});