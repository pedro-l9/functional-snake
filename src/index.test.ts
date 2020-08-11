import { Greeter } from './index';

describe('Test greeting', () => {
  it('should return a greeting', () => {
    expect(Greeter('Pedro')).toEqual('Hello Pedro');
  });
});
