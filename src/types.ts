export { type ThumbnailConcept, type StrategistResponse } from './services/gemini';

export interface ImageEditState {
  brightness: number;
  contrast: number;
  saturation: number;
  subjectSize: number;
  textPosition: 'top' | 'center' | 'bottom';
  emphasis: 'subject' | 'text' | 'balanced';
}
