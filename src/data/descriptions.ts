import { Direction } from '../types';

export const descriptions: Record<Direction, {
  title: string;
  icon: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
  workStyle: string;
}> = {
  north: {
    title: "The Summit Seeker",
    icon: "M6.75 12a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l3.734-2.9c.533-.44.72-1.291.634-2.309A5.342 5.342 0 016.75 12zM20.663 12a.75.75 0 01.514.927 3.25 3.25 0 01-6.362 0 .75.75 0 011.44-.425c.402.963 1.384 1.639 2.454 1.639s2.052-.676 2.454-1.639a.75.75 0 01.5-.502z",
    traits: [
      "Results-oriented",
      "Decisive",
      "Direct",
      "Takes charge"
    ],
    strengths: [
      "Quick decision making",
      "Goal achievement",
      "Leadership",
      "Initiative"
    ],
    challenges: [
      "May appear too aggressive",
      "Can overlook details",
      "Might not consider others' feelings",
      "Impatient with slower processes"
    ],
    workStyle: "Like a determined mountaineer, leads the way to the peak with clear direction and unwavering focus."
  },
  east: {
    title: "The Horizon Hunter",
    icon: "M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z",
    traits: [
      "Creative",
      "Innovative",
      "Enthusiastic",
      "Vision-oriented"
    ],
    strengths: [
      "Generating ideas",
      "Seeing possibilities",
      "Inspiring others",
      "Thinking big picture"
    ],
    challenges: [
      "May seem unrealistic",
      "Can lack follow-through",
      "Might overlook practicalities",
      "Difficulty with routine"
    ],
    workStyle: "Like an explorer at dawn, always seeking new paths and possibilities on the horizon."
  },
  south: {
    title: "The Valley Guardian",
    icon: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
    traits: [
      "Empathetic",
      "Supportive",
      "Diplomatic",
      "Team-oriented"
    ],
    strengths: [
      "Building relationships",
      "Creating harmony",
      "Supporting others",
      "Facilitating collaboration"
    ],
    challenges: [
      "May avoid conflict",
      "Can be indecisive",
      "Might prioritize others over tasks",
      "Difficulty with tough decisions"
    ],
    workStyle: "Like a nurturing valley, creates a supportive environment where all can flourish and grow together."
  },
  west: {
    title: "The Forest Sage",
    icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    traits: [
      "Analytical",
      "Detail-oriented",
      "Systematic",
      "Precise"
    ],
    strengths: [
      "Attention to detail",
      "Quality control",
      "Process improvement",
      "Logical thinking"
    ],
    challenges: [
      "May over-analyze",
      "Can be too cautious",
      "Might resist change",
      "Difficulty with ambiguity"
    ],
    workStyle: "Like an ancient forest keeper, observes patterns and maintains wisdom through careful analysis and deep understanding."
  }
};