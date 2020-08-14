import {
  equals,
  dropLast,
  pipe,
  concat,
  drop,
  gt,
  propSatisfies,
  when,
  __,
  applySpec,
  propEq,
  map,
  always,
  includes,
  converge,
  pathOr,
  or,
  curry,
  cond,
  T,
  insert,
  path,
} from 'ramda';

import {
  scopeValue,
  inputToMove,
  getRandomPixel,
  removeIncomingOppositeMoves,
  getFirst,
} from './utils';
import { MOVES } from './constants';
import { State, Pixel, Snake, Input, Move } from './types';

export const willEat = (state: State): boolean =>
  equals(nextHead(state), state.frame.apple);

export const willCrash = (state: State): boolean =>
  includes(nextHead(state), drop(1, nextSnake(state)));

export const nextHead = ({
  frame: { snake, dimensions },
  moves,
}: State): Pixel => ({
  x: scopeValue(0, dimensions.cols - 1)(snake[0].x + moves[0].x),
  y: scopeValue(0, dimensions.rows - 1)(snake[0].y + moves[0].y),
});

export const nextSnake = (state: State): Snake =>
  cond([
    [
      pathOr(false, ['frame', 'gameOver']),
      pipe(
        pathOr([], ['frame', 'snake']),
        when<Snake, Snake>(
          propSatisfies(gt(__, 1), 'length'),
          curry(dropLast)(1)
        )
      ),
    ],
    [willEat, converge(insert(0), [nextHead, pathOr([], ['frame', 'snake'])])],
    [
      T,
      converge(insert(0), [
        nextHead,
        pipe<State, Snake, Snake>(
          pathOr<Snake>([], ['frame', 'snake']),
          curry(dropLast)(1)
        ),
      ]),
    ],
  ])(state);

export const nextApple = (state: State): Pixel =>
  willEat(state) ? getRandomPixel(state.frame.dimensions) : state.frame.apple;

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
      gameOver: converge(or, [pathOr(false, ['frame', 'gameOver']), willCrash]),
      snake: nextSnake,
      apple: nextApple,
      dimensions: path(['frame', 'dimensions']),
    },
    moves: nextMoves(inputs),
  })(state);
