import { OverlayTheme } from '../types/goal';

export const overlayThemes: OverlayTheme[] = [
  {
    id: 'default',
    name: 'STRIVA CLASSIC',
    textStyle: {
      color: '#FFFFFF',
      fontFamily: 'Inter-Bold',
      textAlign: 'center' as const,
      textShadowColor: '#228B22',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
  },
  {
    id: 'neon',
    name: 'NEON VIBES',
    textStyle: {
      color: '#228B22',
      fontFamily: 'Inter-Bold',
      textAlign: 'center' as const,
      textShadowColor: '#228B22',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
  },
  {
    id: 'gradient',
    name: 'STREET FADE',
    textStyle: {
      color: '#FFFFFF',
      fontFamily: 'Inter-Bold',
      textAlign: 'center' as const,
      textShadowColor: '#000000',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
  },
  {
    id: 'retro',
    name: 'OLD SCHOOL',
    textStyle: {
      color: '#228B22',
      fontFamily: 'Inter-Bold',
      textAlign: 'center' as const,
      fontSize: 18,
      textTransform: 'uppercase' as const,
      textShadowColor: '#000000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 0,
    },
  },
  {
    id: 'minimal',
    name: 'CLEAN SLATE',
    textStyle: {
      color: '#000000',
      fontFamily: 'Inter-Bold',
      textAlign: 'center' as const,
    },
  },
  {
    id: 'street',
    name: 'STREET ENERGY',
    textStyle: {
      color: '#FFFFFF',
      fontFamily: 'Inter-Bold',
      textAlign: 'center' as const,
      textShadowColor: '#000000',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
  },
  {
    id: 'wellness',
    name: 'WELLNESS GLOW',
    textStyle: {
      color: '#000000',
      fontFamily: 'Inter-Bold',
      textAlign: 'center' as const,
      textShadowColor: '#228B22',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    },
  }
];