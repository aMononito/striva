import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

export default function TabButton({ title, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: 20,
    paddingVertical: '3%',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minHeight: 48,
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#000000',
    borderColor: '#228B22',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});