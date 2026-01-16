
export interface MoodSketch {
  id: string;
  originalMood: string;
  refinedPrompt: string;
  imageUrl: string;
  colors: string[];
  style: string;
  timestamp: number;
}

export interface GenerationStatus {
  loading: boolean;
  error: string | null;
  count: number;
}

export enum PredefinedMoods {
  CALM = "Calm",
  ENERGIZED = "Energized",
  MELANCHOLIC = "Melancholic",
  DREAMY = "Dreamy",
  ANXIOUS = "Anxious",
  JOYFUL = "Joyful",
  MYSTERIOUS = "Mysterious",
  LONELY = "Lonely"
}

export const ART_STYLES = [
  { id: 'abstract', name: 'Abstract', icon: '🎨' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌆' },
  { id: 'watercolor', name: 'Watercolor', icon: '💧' },
  { id: 'renaissance', name: 'Renaissance', icon: '🏛️' },
  { id: 'sketch', name: 'Charcoal', icon: '✏️' },
  { id: 'surreal', name: 'Surrealism', icon: '👁️' }
];
