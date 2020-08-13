import { getInitialState } from './utils';
import { nextState } from './core';
import { PartialFrame, NextFrame, State, Input, Canvas } from './types';

const getNextFrame: NextFrame = (state: State) => (inputs: Input[]) => {
  const newState = nextState(state, inputs);

  return [newState.frame, getNextFrame(newState)];
};

export function startGame(canvas: Canvas): PartialFrame {
  return getNextFrame(getInitialState(canvas));
}
