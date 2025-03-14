export type Direction = 'north' | 'east' | 'south' | 'west';

export interface Question {
  id: number;
  text: string;
  options: {
    [key in Direction]: string;
  };
}

export interface Answer {
  questionId: number;
  scores: {
    [key in Direction]: number;
  };
}

export interface Result {
  primary: Direction;
  secondary: Direction;
  scores: {
    [key in Direction]: number;
  };
  percentages: {
    [key in Direction]: number;
  };
}