export type Canvas = {
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
  gameStarted: boolean;
  gameOver: boolean;
  snake: Snake;
  apple: Pixel;
};

export type State = {
  canvas: Canvas;
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
