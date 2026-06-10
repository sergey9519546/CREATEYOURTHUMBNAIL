export interface ThumbnailConcept {
  concept_number: number;
  concept_name: string;
  hook: string;
  layout: string;
  text_overlay: string;
  color_strategy: string;
  psychology: string;
  ctr_explanation: string;
  image_generation_prompt: string;
  imageUrl?: string;
  refinement_notes?: string;
}

export interface StrategistResponse {
  video_context_summary: string;
  niche_applied: string;
  style_preset_applied: string;
  thumbnails: ThumbnailConcept[];
  optimization_notes: string;
  chat_prompt: string;
}

export interface ImageEditState {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  subjectSize?: number;
  textPosition?: string;
  emphasis?: string;
}
