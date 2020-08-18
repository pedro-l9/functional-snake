import { getInitialState } from './utils';
import { nextState } from './core';
import { PartialFrame, NextFrame, State, Input, Dimensions } from './types';

const getNextFrame: NextFrame = (state: State) => (inputs: Input[]) => {
  const newState = nextState(state, inputs);

  return [newState.frame, getNextFrame(newState)];
};

export function startGame(frameDimensions: Dimensions): PartialFrame {
  return getNextFrame(getInitialState(frameDimensions));
}

export * as types from './types';
