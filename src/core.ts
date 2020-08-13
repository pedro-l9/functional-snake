import {
  equals,
  dropLast,
  pipe,
  concat,
  complement,
  drop,
  gt,
  propSatisfies,
  when,
  __,
  applySpec,
  propEq,
  prop,
  map,
  always,
  includes,
} from 'ramda';

import {
  scopeValue,
  inputToMove,
  getRandomPixel,
  removeIncomingOppositeMoves,
  getFirst,
} from './utils';
import { MOVES } from './constants';
import { State, Pixel, Snake, Input, Move, Canvas } from './types';

export const willEat = (state: State): boolean =>
  equals(nextHead(state), state.frame.apple);

export const willCrash = (state: State): boolean =>
  includes(nextHead(state), drop(1, nextSnake(state)));

export const nextHead = ({
  frame: { snake },
  canvas,
  moves,
}: State): Pixel => ({
  x: scopeValue(0, canvas.cols - 1)(snake[0].x + moves[0].x),
  y: scopeValue(0, canvas.rows - 1)(snake[0].y + moves[0].y),
});

export const nextSnake = (state: State): Snake =>
  willEat(state)
    ? [nextHead(state), ...state.frame.snake]
    : [nextHead(state), ...dropLast<Pixel>(1, state.frame.snake)];

export const nextApple = (state: State): Pixel =>
  willEat(state) ? getRandomPixel(state.canvas) : state.frame.apple;

export const nextMoves = (inputs: Input[]) => (state: State): Move[] =>
  state.frame.gameOver
    ? [MOVES['STOPPED']]
    : pipe(
        concat(
          __,
          pipe(
            map(inputToMove),
            when(
              always(propEq('length', 1, state.moves)), // Whenever the inputs are the incoming moves
              removeIncomingOppositeMoves(getFirst(state.moves))
            )
          )(inputs)
        ),
        when(propSatisfies(gt(__, 1), 'length'), drop(1))
      )(state.moves);

export const nextState = (state: State, inputs: Input[]): State =>
  applySpec<State>({
    frame: {
      gameStarted: complement(propEq('moves', [])),
      gameOver: willCrash,
      snake: nextSnake,
      apple: nextApple,
    },
    canvas: prop<string, Canvas>('canvas'),
    moves: nextMoves(inputs),
  })(state);
