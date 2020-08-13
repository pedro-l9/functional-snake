import { MOVES } from '../constants';
import { willEat, nextHead, nextSnake, nextApple, nextMoves } from '../core';
import * as utils from '../utils';
import { State, Canvas } from '../types';

const DEFAULT_CANVAS: Canvas = Object.freeze({
  cols: 20,
  rows: 20,
});

const INITIAL_STATE: State = Object.freeze({
  frame: {
    gameStarted: true,
    gameOver: false,
    snake: [{ x: 1, y: 1 }],
    apple: { x: 2, y: 1 },
  },
  canvas: DEFAULT_CANVAS,
  moves: [MOVES['STOPPED']],
});

describe('Test the function that determines whether the snake is going to eat an apple in the next frame', () => {
  it('Should return false when the snake is not moving', () => {
    expect(willEat(INITIAL_STATE)).toEqual(false);
  });

  it('Should return false when there is nothing on the space on which the snake is going to be', () => {
    const testState = { ...INITIAL_STATE, moves: [MOVES['UP']] };

    expect(willEat(testState)).toEqual(false);
  });

  it('Should return true when there is an apple on a space on which the snake is going to be', () => {
    const testState = { ...INITIAL_STATE, moves: [MOVES['RIGHT']] };

    expect(willEat(testState)).toEqual(true);
  });
});

describe('Test the function that calculates the next position for the head of the snake', () => {
  it('Should not change the position if the snake is stopped', () => {
    const newPosition = nextHead(INITIAL_STATE);

    expect(newPosition).toEqual(INITIAL_STATE.frame.snake[0]);
  });

  describe('The snake head should move according to the top movement on the stack', () => {
    it('Should move the snakes head UP given an UP movement', () => {
      const testState = {
        ...INITIAL_STATE,
        frame: { ...INITIAL_STATE.frame, snake: [{ x: 10, y: 10 }] },
        moves: [MOVES['UP']],
      };

      const expectedNewPosition = { x: 10, y: 9 };
      const newPosition = nextHead(testState);

      expect(newPosition).toEqual(expectedNewPosition);
    });

    it('Should move the snakes head DOWN given a DOWN movement', () => {
      const testState = {
        ...INITIAL_STATE,
        frame: { ...INITIAL_STATE.frame, snake: [{ x: 10, y: 10 }] },
        moves: [MOVES['DOWN']],
      };

      const expectedNewPosition = { x: 10, y: 11 };
      const newPosition = nextHead(testState);

      expect(newPosition).toEqual(expectedNewPosition);
    });

    it('Should move the snakes head to the RIGHT given a RIGHT movement', () => {
      const testState = {
        ...INITIAL_STATE,
        frame: { ...INITIAL_STATE.frame, snake: [{ x: 10, y: 10 }] },
        moves: [MOVES['RIGHT']],
      };

      const expectedNewPosition = { x: 11, y: 10 };
      const newPosition = nextHead(testState);

      expect(newPosition).toEqual(expectedNewPosition);
    });

    it('Should move the snakes head to the LEFT given a LEFT movement', () => {
      const testState = {
        ...INITIAL_STATE,
        frame: { ...INITIAL_STATE.frame, snake: [{ x: 10, y: 10 }] },
        moves: [MOVES['LEFT']],
      };

      const expectedNewPosition = { x: 9, y: 10 };
      const newPosition = nextHead(testState);

      expect(newPosition).toEqual(expectedNewPosition);
    });
  });

  describe('The snake must be teleported if it exceeds any of the canvas boundaries', () => {
    it('must teleport the snake to the left if it exceeds the canvas boundaries on the right', () => {
      const testState = {
        ...INITIAL_STATE,
        frame: { ...INITIAL_STATE.frame, snake: [{ x: 19, y: 2 }] },
        moves: [MOVES['RIGHT']],
      };

      const expectedNewPosition = { x: 0, y: 2 };
      const newPosition = nextHead(testState);

      expect(newPosition).toEqual(expectedNewPosition);
    });

    it('must teleport the snake to the right if it exceeds the canvas boundaries on the left', () => {
      const testState = {
        ...INITIAL_STATE,
        frame: { ...INITIAL_STATE.frame, snake: [{ x: 0, y: 2 }] },
        moves: [MOVES['LEFT']],
      };

      const expectedNewPosition = { x: 19, y: 2 };
      const newPosition = nextHead(testState);

      expect(newPosition).toEqual(expectedNewPosition);
    });

    it('must teleport the snake down if it exceeds the canvas boundaries to the top', () => {
      const testState = {
        ...INITIAL_STATE,
        frame: { ...INITIAL_STATE.frame, snake: [{ x: 10, y: 0 }] },
        moves: [MOVES['UP']],
      };

      const expectedNewPosition = { x: 10, y: 19 };
      const newPosition = nextHead(testState);

      expect(newPosition).toEqual(expectedNewPosition);
    });

    it('must teleport the snake up if it exceeds the canvas boundaries to the bottom', () => {
      const testState = {
        ...INITIAL_STATE,
        frame: { ...INITIAL_STATE.frame, snake: [{ x: 10, y: 19 }] },
        moves: [MOVES['DOWN']],
      };

      const expectedNewPosition = { x: 10, y: 0 };
      const newPosition = nextHead(testState);

      expect(newPosition).toEqual(expectedNewPosition);
    });
  });
});

describe('Test the function that determines the size of the next snake', () => {
  it('it should keep the snake size while moving', () => {
    const testState = {
      ...INITIAL_STATE,
      frame: {
        ...INITIAL_STATE.frame,
        snake: [{ x: 10, y: 10 }],
        apple: { x: 9, y: 10 },
      },
      moves: [MOVES['UP']],
    };

    const newSnake = nextSnake(testState);

    expect(newSnake.length).toEqual(testState.frame.snake.length);
  });

  it('it should grow given that there is an apple on the next position the snake will be', () => {
    const testState = {
      ...INITIAL_STATE,
      frame: {
        ...INITIAL_STATE.frame,
        snake: [{ x: 10, y: 10 }],
        apple: { x: 9, y: 10 },
      },
      moves: [MOVES['LEFT']],
    };

    const newSnake = nextSnake(testState);

    expect(newSnake.length).toBeGreaterThan(testState.frame.snake.length);
  });
});

describe('Test the function that determines the position of the next apple', () => {
  it('it should keep the apple where it was if the snake hasnt eaten it', () => {
    const testState = {
      ...INITIAL_STATE,
      frame: {
        ...INITIAL_STATE.frame,
        snake: [{ x: 10, y: 10 }],
        apple: { x: 9, y: 10 },
      },
      moves: [MOVES['UP']],
    };

    const newApple = nextApple(testState);

    expect(newApple).toEqual(testState.frame.apple);
  });

  it('it should place a new apple if the snake has eaten the previous', () => {
    const testState = {
      ...INITIAL_STATE,
      frame: {
        ...INITIAL_STATE.frame,
        snake: [{ x: 10, y: 10 }],
        apple: { x: 9, y: 10 },
      },
      moves: [MOVES['LEFT']],
    };
    const newApplePosition = { x: 15, y: 8 };

    const getRandomPixelMock = jest.spyOn(utils, 'getRandomPixel');
    getRandomPixelMock.mockReturnValue(newApplePosition);

    const newApple = nextApple(testState);

    expect(getRandomPixelMock).toHaveBeenCalled();
    expect(newApple).toEqual(newApplePosition);
  });
});

describe('Test the function that determines the next move queue', () => {
  it('Should stop the move queue if the snake has crashed regardless of the users input', () => {
    const testState: State = {
      ...INITIAL_STATE,
      frame: {
        ...INITIAL_STATE.frame,
        snake: [
          { x: 1, y: 6 },
          { x: 2, y: 5 },
          { x: 3, y: 5 },
          { x: 3, y: 6 },
          { x: 1, y: 6 },
        ],
      },
      moves: [MOVES['UP']],
    };

    const newMoveQueue = nextMoves([])(testState);

    expect(newMoveQueue).toEqual([MOVES['STOPPED']]);
  });

  it('Should not queue user inputs that would make the snake go backwards', () => {
    const testState: State = {
      ...INITIAL_STATE,
      frame: {
        ...INITIAL_STATE.frame,
        snake: [
          { x: 1, y: 5 },
          { x: 2, y: 5 },
          { x: 3, y: 5 },
          { x: 3, y: 6 },
        ],
      },
      moves: [MOVES['LEFT']],
    };

    const newMoveQueue = nextMoves(['RIGHT'])(testState);

    expect(newMoveQueue).toEqual(testState.moves);
  });

  it('Should queue the inputs that wont make the snake go backwards into the move queue and drop the current first', () => {
    const testState: State = {
      ...INITIAL_STATE,
      frame: {
        ...INITIAL_STATE.frame,
        snake: [
          { x: 1, y: 5 },
          { x: 2, y: 5 },
          { x: 3, y: 5 },
          { x: 3, y: 6 },
        ],
      },
      moves: [MOVES['LEFT']],
    };
    const expectedNewQueue = [MOVES['UP'], MOVES['RIGHT']];

    const newMoveQueue = nextMoves(['UP', 'RIGHT'])(testState);

    expect(newMoveQueue).toEqual(expectedNewQueue);
  });

  it(`Should queue the inputs that wont make the snake go backwards into the move queue and drop the current first. 
  This is a specific case where the new inputs are not the incoming moves, hence they wont be checked for opposition`, () => {
    const testState: State = {
      ...INITIAL_STATE,
      frame: {
        ...INITIAL_STATE.frame,
        snake: [
          { x: 1, y: 5 },
          { x: 2, y: 5 },
          { x: 3, y: 5 },
          { x: 3, y: 6 },
        ],
      },
      moves: [MOVES['LEFT'], MOVES['UP']],
    };
    const expectedNewQueue = [MOVES['UP'], MOVES['RIGHT']];

    const newMoveQueue = nextMoves(['RIGHT'])(testState);

    expect(newMoveQueue).toEqual(expectedNewQueue);
  });
});
