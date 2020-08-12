type Canvas = {
  cols: number;
  rows: number;
};

type Input = 'RIGHT' | 'LEFT' | 'UP' | 'DOWN';

type Move = {
  x: number;
  y: number;
};

type Pixel = {
  x: number;
  y: number;
};

type Snake = Pixel[];

type Frame = {
  gameStarted: boolean;
  gameOver: boolean;
  snake: Snake;
  apple: Pixel;
};

type State = {
  canvas: Canvas;
  frame: Frame;
  moves: Move[];
};

type MoveMap = {
  [key: string]: Move;
};

type NextFrame = {
  (state: State): PartialFrame;
};

type PartialFrame = {
  (inputs: Input[]): [Frame, PartialFrame];
};
