export type Dimensions = {
  cols: number;
  rows: number;
};

export type Input = 'RIGHT' | 'LEFT' | 'UP' | 'DOWN';

export type Move = {
  x: number;
  y: number;
};

export type Pixel = {
  x: number;
  y: number;
};

export type Snake = Pixel[];

export type Frame = {
  hasSnakeCrashed: boolean;
  snake: Snake;
  apple: Pixel;
  dimensions: Dimensions;
  score: number;
};

export type State = {
  frame: Frame;
  moves: Move[];
};

export type MoveMap = {
  [key: string]: Move;
};

export type NextFrame = {
  (state: State): PartialFrame;
};

export type PartialFrame = {
  (inputs: Input[]): [Frame, PartialFrame];
};
