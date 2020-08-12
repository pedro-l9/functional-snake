import {
  scopeValue,
  hasSnakeCrashed,
  removeIncomingOppositeMoves,
  isMoveOpposite,
} from './utils';
import { MOVES } from './constants';

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

describe('Test the function that determines whether the snake has crashed on itself', () => {
  const snake = [
    { x: 1, y: 6 },
    { x: 2, y: 5 },
    { x: 3, y: 5 },
    { x: 3, y: 6 },
    { x: 2, y: 6 },
  ];

  it('Should return false when there is nothing on the space on which the snake is going to be', () => {
    expect(hasSnakeCrashed(snake)).toEqual(false);
  });

  it('Should return true when there is some part of the snakes body on the space on which it is going to be', () => {
    const testSnake = [...snake, { x: 1, y: 6 }];

    expect(hasSnakeCrashed(testSnake)).toEqual(true);
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
