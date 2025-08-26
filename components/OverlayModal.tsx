import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Goal, TimeValue, OverlayTheme } from '../types/goal';

interface OverlayModalProps {
  visible: boolean;
  goals: Goal[];
  theme: OverlayTheme;
  onClose: () => void;
  onRandomizeTheme: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const overlayWidth = screenWidth - 80;
const overlayHeight = 300;

export default function OverlayModal({
  visible,
  goals,
  theme,
  onClose,
  onRandomizeTheme,
}: OverlayModalProps) {
  const viewShotRef = useRef<ViewShot>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatValue = (goal: Goal) => {
    if (goal.value === undefined) return 'Not set';
    
    switch (goal.metricType) {
      case 'count':
        return goal.value.toString();
      case 'time':
        const time = goal.value as TimeValue;
        if (time.hours === 0 && time.minutes === 0) return 'Not set';
        if (time.hours === 0) return `${time.minutes}m`;
        if (time.minutes === 0) return `${time.hours}h`;
        return `${time.hours}h ${time.minutes}m`;
      case 'binary':
        return goal.value ? 'Yes ✅' : 'No ❌';
      default:
        return 'Not set';
    }
  };

  const generatePNG = async () => {
    if (!viewShotRef.current || goals.length === 0) {
      Alert.alert('No Goals', 'Please add some goals before generating!');
      return;
    }

    setIsGenerating(true);
    try {
      const uri = await viewShotRef.current.capture();
      setGeneratedImage(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate image');
      console.error('ViewShot error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!generatedImage) {
      generatePNG();
      return;
    }

    try {
      if (Platform.OS === 'web') {
        // For web, create a download link
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `striva-goals-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Use window.alert for web
        window.alert(
          'Your goal overlay has been downloaded to your device.\n\nJoin the Striva crew! Text "Striva" to 954-644-9294 for updates + feature drops'
        );
      } else {
        // For mobile, save to photo library
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant photo library access to save the image.');
          return;
        }

        // Copy to a permanent location first
        const filename = `striva-goals-${new Date().toISOString().split('T')[0]}.png`;
        const permanentUri = FileSystem.documentDirectory + filename;
        await FileSystem.copyAsync({
          from: generatedImage,
          to: permanentUri,
        });

        // Save to photo library
        await MediaLibrary.saveToLibraryAsync(permanentUri);
        
        Alert.alert(
          'Saved to Photos!',
          'Your goal overlay has been saved to your photo library.\n\nJoin the Striva crew! Text "Striva" to 954-644-9294 for updates + feature drops',
          [{ text: 'Got it!', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save image to device');
      console.error('Save error:', error);
    }
  };

  const handleClose = () => {
    setGeneratedImage(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Goal Overlay</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {!generatedImage ? (
            <View style={styles.overlayContainer}>
              <ViewShot
                ref={viewShotRef}
                options={{
                  format: 'png',
                  quality: 1.0,
                  result: 'tmpfile',
                  width: overlayWidth,
                  height: overlayHeight,
                }}
                style={styles.viewShot}
              >
                <View style={[styles.overlay, theme.containerStyle, { width: overlayWidth, height: overlayHeight }]}>
                  <Image source={require('../assets/images/striva-logo.png')} style={styles.overlayLogo} />
                  <View style={styles.statsContainer}>
                    {goals.map((goal, index) => (
                      <View key={goal.id} style={styles.statItem}>
                        <Text style={[styles.goalName, theme.textStyle]}>
                          {goal.name.toUpperCase()}
                        </Text>
                        <Text style={[styles.goalValue, theme.textStyle]}>
                          {formatValue(goal)}
                        </Text>
                        {index < goals.length - 1 && (
                          <View style={[styles.separator, { backgroundColor: theme.textStyle.color, opacity: 0.3 }]} />
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </ViewShot>
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: '#000000' }]}
              onPress={onRandomizeTheme}
              activeOpacity={0.8}
            >
              <Text style={styles.shareText}>🎲 Randomize Overlay</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.shareButton, goals.length === 0 && styles.disabledButton]}
              onPress={generatedImage ? handleShare : generatePNG}
              activeOpacity={0.8}
              disabled={goals.length === 0}
            >
              <Text style={[styles.shareText, goals.length === 0 && styles.disabledText]}>
                {isGenerating ? '⏳ Generating...' : generatedImage ? '💾 Download' : '📸 Generate PNG'}
              </Text>
            </TouchableOpacity>
          </View>

          {goals.length === 0 && (
            <Text style={styles.noGoalsText}>
              Add some goals to generate your overlay!
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c2bebe',
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
  closeButton: {
    padding: 8,
  },
  closeText: {
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
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  overlayContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  viewShot: {
    backgroundColor: 'transparent',
  },
  overlay: {
    padding: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  overlayLogo: {
    width: 120,
    height: 40,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  overlayLogoText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  statsContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  goalName: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  goalValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  separator: {
    width: 40,
    height: 1,
    marginTop: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  generatedImage: {
    width: overlayWidth,
    height: overlayHeight,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  shareButton: {
    backgroundColor: '#228B22',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  shareText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  disabledText: {
    color: '#000000',
  },
  noGoalsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});