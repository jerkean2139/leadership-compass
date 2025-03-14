export const COLORS = {
  primary: '#2E2A5E',
  primaryHover: '#373175',
  secondary: '#4CC9F0',
  secondaryHover: '#3DB8DF',
  accent: '#9FD33D',
  accentHover: '#8FBD35',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#F9FAFB'
  }
} as const;

export const TRANSITIONS = {
  default: 'transition-all duration-200',
  hover: 'transform hover:scale-105 transition-all duration-200'
} as const;

export const CONTAINER_STYLES = {
  maxWidth: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
} as const;