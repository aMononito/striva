import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Goal, MetricType, TimeValue } from '../types/goal';

interface GoalConfigModalProps {
  visible: boolean;
  goal?: Goal;
  isCustom?: boolean;
  onSave: (configuredGoal: Goal) => void;
  onCancel: () => void;
}

export default function GoalConfigModal({
  visible,
  goal,
  isCustom = false,
  onSave,
  onCancel,
}: GoalConfigModalProps) {
  const [goalName, setGoalName] = useState('');
  const [metricType, setMetricType] = useState<MetricType>('count');
  const [countValue, setCountValue] = useState('');
  const [timeValue, setTimeValue] = useState<TimeValue>({ hours: 0, minutes: 0 });
  const [binaryValue, setBinaryValue] = useState(false);

  useEffect(() => {
    if (goal) {
      setGoalName(goal.name);
      setMetricType(goal.metricType);
      
      if (goal.value !== undefined) {
        switch (goal.metricType) {
          case 'count':
            setCountValue(goal.value.toString());
            break;
          case 'time':
            setTimeValue(goal.value);
            break;
          case 'binary':
            setBinaryValue(goal.value);
            break;
        }
      }
    } else if (isCustom) {
      setGoalName('');
      setMetricType('count');
      setCountValue('');
      setTimeValue({ hours: 0, minutes: 0 });
      setBinaryValue(false);
    }
  }, [goal, isCustom, visible]);

  const handleSave = () => {
    if (!goalName.trim()) {
      Alert.alert('Error', 'Please enter a goal name');
      return;
    }

    let value: any;
    switch (metricType) {
      case 'count':
        const countNum = parseInt(countValue) || 0;
        if (countNum < 0) {
          Alert.alert('Error', 'Count must be 0 or greater');
          return;
        }
        value = countNum;
        break;
      case 'time':
        if (timeValue.hours < 0 || timeValue.minutes < 0 || timeValue.minutes >= 60) {
          Alert.alert('Error', 'Please enter valid time values');
          return;
        }
        value = timeValue;
        break;
      case 'binary':
        value = binaryValue;
        break;
    }

    const configuredGoal: Goal = {
      id: goal?.id || `custom-${Date.now()}`,
      name: goalName.trim(),
      category: goal?.category || 'Personal',
      metricType,
      value,
      isCustom: isCustom || goal?.isCustom,
      icon: goal?.icon || '⭐',
    };

    onSave(configuredGoal);
  };

  const formatTimeDisplay = () => {
    const h = timeValue.hours;
    const m = timeValue.minutes;
    if (h === 0 && m === 0) return 'Not set';
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const formatCountDisplay = () => {
    const count = parseInt(countValue) || 0;
    return count.toString();
  };

  const formatBinaryDisplay = () => {
    return binaryValue ? 'Yes ✅' : 'No ❌';
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Configure Goal</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Goal Name</Text>
            <TextInput
              style={styles.textInput}
              value={goalName}
              onChangeText={setGoalName}
              placeholder="Enter goal name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metric Type</Text>
            <View style={styles.metricButtons}>
              {(['count', 'time', 'binary'] as MetricType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.metricButton,
                    metricType === type && styles.selectedMetricButton
                  ]}
                  onPress={() => setMetricType(type)}
                >
                  <Text style={[
                    styles.metricButtonText,
                    metricType === type && styles.selectedMetricText
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {metricType === 'count' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Count Value</Text>
              <TextInput
                style={styles.textInput}
                value={countValue}
                onChangeText={setCountValue}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          {metricType === 'time' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Time Value</Text>
              <View style={styles.timeInputs}>
                <View style={styles.timeInput}>
                  <Text style={styles.timeLabel}>Hours</Text>
                  <TextInput
                    style={styles.timeTextInput}
                    value={timeValue.hours.toString()}
                    onChangeText={(text) => setTimeValue(prev => ({ ...prev, hours: parseInt(text) || 0 }))}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.timeInput}>
                  <Text style={styles.timeLabel}>Minutes</Text>
                  <TextInput
                    style={styles.timeTextInput}
                    value={timeValue.minutes.toString()}
                    onChangeText={(text) => setTimeValue(prev => ({ ...prev, minutes: parseInt(text) || 0 }))}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>
          )}

          {metricType === 'binary' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Value</Text>
              <View style={styles.binaryButtons}>
                <TouchableOpacity
                  style={[
                    styles.binaryButton,
                    binaryValue && styles.selectedBinaryButton
                  ]}
                  onPress={() => setBinaryValue(true)}
                >
                  <Text style={[
                    styles.binaryButtonText,
                    binaryValue && styles.selectedBinaryText
                  ]}>
                    Yes ✅
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.binaryButton,
                    !binaryValue && styles.selectedBinaryButton
                  ]}
                  onPress={() => setBinaryValue(false)}
                >
                  <Text style={[
                    styles.binaryButtonText,
                    !binaryValue && styles.selectedBinaryText
                  ]}>
                    No ❌
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewBox}>
              <Text style={styles.previewGoalName}>{goalName || 'Goal Name'}</Text>
              <Text style={styles.previewValue}>
                {metricType === 'count' && formatCountDisplay()}
                {metricType === 'time' && formatTimeDisplay()}
                {metricType === 'binary' && formatBinaryDisplay()}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#228B22',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  saveButton: {
    backgroundColor: '#228B22',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  metricButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  metricButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  selectedMetricButton: {
    backgroundColor: '#000000',
    borderColor: '#228B22',
  },
  metricButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedMetricText: {
    color: '#FFFFFF',
  },
  timeInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeTextInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    textAlign: 'center',
  },
  binaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  binaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
  selectedBinaryButton: {
    backgroundColor: '#000000',
    borderColor: '#228B22',
  },
  binaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedBinaryText: {
    color: '#FFFFFF',
  },
  previewSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewBox: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewGoalName: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
});