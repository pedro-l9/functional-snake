import {
  cond,
  always,
  lt,
  T,
  gt,
  identity,
  __,
  equals,
  drop,
  propEq,
  pipe,
} from 'ramda';

import { MOVES } from './constants';
import { Input, Move, Pixel, State, Dimensions } from './types';

export function inputToMove(input: Input): Move {
  return MOVES[input];
}

export const isMoveOpposite = (move: Move) => (moveToCheck: Move): boolean => {
  switch (move) {
    case MOVES['UP']:
      return equals(moveToCheck, MOVES['DOWN']);
    case MOVES['DOWN']:
      return equals(moveToCheck, MOVES['UP']);
    case MOVES['LEFT']:
      return equals(moveToCheck, MOVES['RIGHT']);
    case MOVES['RIGHT']:
      return equals(moveToCheck, MOVES['LEFT']);
    default:
      return false;
  }
};

export function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

export function getRandomPixel(frameDimensions: Dimensions): Pixel {
  return {
    x: getRandomValue(0, frameDimensions.cols - 1),
    y: getRandomValue(0, frameDimensions.rows - 1),
  };
}

export function getInitialState(frameDimensions: Dimensions): State {
  return {
    frame: {
      gameOver: false,
      snake: [getRandomPixel(frameDimensions)],
      apple: getRandomPixel(frameDimensions),
      dimensions: frameDimensions,
      score: 0,
    },
    moves: [MOVES['STOPPED']],
  };
}

export const scopeValue = (min: number, max: number) => (
  value: number
): number =>
  cond<number, number>([
    [gt(__, max), always(min)],
    [lt(__, min), always(max)],
    [T, identity],
  ])(value);

export const getFirst = <T>([firstItem]: Array<T>): T => firstItem;

export const removeIncomingOppositeMoves = (currentMove: Move) => (
  incomingMoves: Move[]
): Move[] =>
  cond<Move[], Move[]>([
    [propEq('length', 0), identity],
    [
      pipe(getFirst, isMoveOpposite(currentMove)),
      pipe(drop(1), removeIncomingOppositeMoves(currentMove)),
    ],
    [T, identity],
  ])(incomingMoves);
