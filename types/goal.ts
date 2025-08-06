export type MetricType = 'time' | 'count' | 'binary';

export interface Goal {
  id: string;
  name: string;
  category: 'Professional' | 'Wellness' | 'Personal';
  metricType: MetricType;
  value?: any;
  isCustom?: boolean;
  icon?: string;
}

export interface TimeValue {
  hours: number;
  minutes: number;
}

export interface OverlayTheme {
  id: string;
  name: string;
  textStyle: any;
  containerStyle: any;
}