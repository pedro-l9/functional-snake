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
  gameOver: boolean;
  snake: Snake;
  apple: Pixel;
  dimensions: Dimensions;
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
