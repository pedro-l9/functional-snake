import { getInitialState } from './utils';
import { nextState } from './core';

const getNextFrame: NextFrame = (state: State) => (inputs: Input[]) => {
  const newState = nextState(state, inputs);

  return [state.frame, getNextFrame(newState)];
};

export function startGame(canvas: Canvas): PartialFrame {
  return getNextFrame(getInitialState(canvas));
}
