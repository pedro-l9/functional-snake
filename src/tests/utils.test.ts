import {
  scopeValue,
  removeIncomingOppositeMoves,
  isMoveOpposite,
  getRandomValue,
  inputToMove,
  getRandomPixel,
  getInitialState,
} from '../utils';
import { MOVES } from '../constants';
import { Dimensions } from '../types';

const DEFAULT_FRAME_DIMENSIONS: Dimensions = Object.freeze({
  cols: 15,
  rows: 20,
});

describe('Test the inputToMove utility that maps inputs to moves', () => {
  it('Should return the move that corresponds to that input', () => {
    const upInputResultingMove = inputToMove('UP');
    const downInputResultingMove = inputToMove('DOWN');
    const rightInputResultingMove = inputToMove('RIGHT');
    const leftInputResultingMove = inputToMove('LEFT');

    expect(upInputResultingMove).toEqual(MOVES['UP']);
    expect(downInputResultingMove).toEqual(MOVES['DOWN']);
    expect(rightInputResultingMove).toEqual(MOVES['RIGHT']);
    expect(leftInputResultingMove).toEqual(MOVES['LEFT']);
  });
});

describe('Test the isMoveOpposite utility that determines wheter a move is the opposite of the other', () => {
  test('That the opposite of UP is DOWN', () => {
    const result = isMoveOpposite(MOVES['UP'])(MOVES['DOWN']);

    expect(result).toBe(true);
  });

  test('That the opposite of DOWN is UP', () => {
    const result = isMoveOpposite(MOVES['DOWN'])(MOVES['UP']);

    expect(result).toBe(true);
  });

  test('That the opposite of RIGHT is LEFT', () => {
    const result = isMoveOpposite(MOVES['RIGHT'])(MOVES['LEFT']);

    expect(result).toBe(true);
  });

  test('That the opposite of LEFT is RIGHT', () => {
    const result = isMoveOpposite(MOVES['LEFT'])(MOVES['RIGHT']);

    expect(result).toBe(true);
  });

  it('Should always return false for STOPPED as it has no opposite', () => {
    const isOppositeOfStopped = isMoveOpposite(MOVES['STOPPED']);

    const [oppositeOfUp, oppositeOfDown, oppositeOfRight, oppositeOfLeft] = [
      MOVES['UP'],
      MOVES['DOWN'],
      MOVES['RIGHT'],
      MOVES['LEFT'],
    ].map(isOppositeOfStopped);

    expect(oppositeOfUp).toBe(false);
    expect(oppositeOfDown).toBe(false);
    expect(oppositeOfRight).toBe(false);
    expect(oppositeOfLeft).toBe(false);
  });
});

describe('Test the scopeValue utility function', () => {
  test("Given a value above the range it should return the range's lower boundary", () => {
    const [lowerBoundary, upperBoundary] = [0, 10];
    const initalValue = 11;

    const newValue = scopeValue(lowerBoundary, upperBoundary)(initalValue);

    expect(newValue).toEqual(lowerBoundary);
  });

  test("Given a value below the range it should return the range's upper boundary", () => {
    const [lowerBoundary, upperBoundary] = [0, 10];
    const initalValue = -1;

    const newValue = scopeValue(lowerBoundary, upperBoundary)(initalValue);

    expect(newValue).toEqual(upperBoundary);
  });

  test('Given a value in the range it should return the value itself', () => {
    const [lowerBoundary, upperBoundary] = [0, 10];
    const initalValue = 5;

    const newValue = scopeValue(lowerBoundary, upperBoundary)(initalValue);

    expect(newValue).toEqual(initalValue);
  });

  test('Given a value equal to the lower boundary it should return the value itself', () => {
    const [lowerBoundary, upperBoundary] = [0, 10];

    const newValue = scopeValue(lowerBoundary, upperBoundary)(lowerBoundary);

    expect(newValue).toEqual(lowerBoundary);
  });

  test('Given a value equal to the upper boundary it should return the value itself', () => {
    const [lowerBoundary, upperBoundary] = [0, 10];

    const newValue = scopeValue(lowerBoundary, upperBoundary)(upperBoundary);

    expect(newValue).toEqual(upperBoundary);
  });
});

describe('Test the removeIncomingOppositeMoves utility function', () => {
  test('The function should return an empty array given no incoming moves', () => {
    const newIncomingMoves = removeIncomingOppositeMoves(MOVES['UP'])([]);

    expect(newIncomingMoves).toEqual([]);
  });

  test('The function should remove incoming moves which are opposite to the current move', () => {
    const newIncomingMoves = removeIncomingOppositeMoves(MOVES['UP'])([
      MOVES['DOWN'],
      MOVES['DOWN'],
    ]);

    expect(newIncomingMoves).toEqual([]);
  });
});

describe('Test the getRandomValue utility function', () => {
  it('Should return a random value between and including the max and min values provided', () => {
    const randomSpy = jest.spyOn(Math, 'random');
    randomSpy.mockReturnValueOnce(1).mockReturnValueOnce(0);

    const highPseudoRandomNumber = getRandomValue(0, 10);
    const lowPseudoRandomNumber = getRandomValue(0, 10);

    expect(randomSpy).toHaveBeenCalledTimes(2);
    expect(highPseudoRandomNumber).toEqual(10);
    expect(lowPseudoRandomNumber).toEqual(0);
  });
});

describe('Test the getRandomPixel utility function', () => {
  it('Should return a random pixel inside the given canvas', () => {
    const randomSpy = jest.spyOn(Math, 'random');
    randomSpy
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const upperBoundaryPseudoRandomPixel = getRandomPixel(
      DEFAULT_FRAME_DIMENSIONS
    );
    const lowerBoundaryPseudoRandomPixel = getRandomPixel(
      DEFAULT_FRAME_DIMENSIONS
    );

    expect(randomSpy).toHaveBeenCalledTimes(4);
    expect(upperBoundaryPseudoRandomPixel).toEqual({
      x: DEFAULT_FRAME_DIMENSIONS.cols - 1,
      y: DEFAULT_FRAME_DIMENSIONS.rows - 1,
    });
    expect(lowerBoundaryPseudoRandomPixel).toEqual({ x: 0, y: 0 });
  });
});

describe('Test the getInitalState utility function', () => {
  it(`Should return a state with the gameOver flag equaling false, 
      the snake and the apple in random positions, 
      the given frame dimensions and the moves array with a single STOPPED move`, () => {
    const randomSpy = jest.spyOn(Math, 'random');
    randomSpy
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const expectedInitialState = {
      frame: {
        gameOver: false,
        snake: [
          {
            x: DEFAULT_FRAME_DIMENSIONS.cols - 1,
            y: DEFAULT_FRAME_DIMENSIONS.rows - 1,
          },
        ],
        apple: { x: 0, y: 0 },
        dimensions: DEFAULT_FRAME_DIMENSIONS,
      },
      moves: [MOVES['STOPPED']],
    };

    const initalState = getInitialState(DEFAULT_FRAME_DIMENSIONS);

    expect(initalState).toEqual(expectedInitialState);
  });
});
