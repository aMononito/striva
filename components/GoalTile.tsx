import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Goal } from '../types/goal';

interface GoalTileProps {
  goal: Goal | { name: string; isCreateOwn: boolean };
  onPress: () => void;
  isSelected?: boolean;
}

export default function GoalTile({ goal, onPress, isSelected }: GoalTileProps) {
  const isCreateOwn = 'isCreateOwn' in goal;
  
  return (
    <TouchableOpacity
      style={[
        styles.tile,
        isSelected && styles.selectedTile,
        isCreateOwn && styles.createOwnTile
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {!isCreateOwn && 'icon' in goal && (
          <Text style={styles.icon}>{goal.icon}</Text>
        )}
        {isCreateOwn && <Text style={styles.icon}>➕</Text>}
        <Text style={[
          styles.goalName,
          isCreateOwn && styles.createOwnText,
          isSelected && styles.selectedText
        ]}>
          {goal.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTile: {
    borderColor: '#228B22',
    borderWidth: 2,
    backgroundColor: '#F5F5F5',
  },
  createOwnTile: {
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  goalName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000000',
    flex: 1,
  },
  selectedText: {
    color: '#228B22',
    fontFamily: 'Inter-Bold',
  },
  createOwnText: {
    color: '#000000',
    fontStyle: 'italic',
    fontFamily: 'Inter-Bold',
  },
});