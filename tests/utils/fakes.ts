import { vitest } from 'vitest';

import { Logger } from '../../src';

class FakeLogger implements Logger {
  fatal = vitest.fn();
  error = vitest.fn();
  warn = vitest.fn();
  info = vitest.fn();
  debug = vitest.fn();
  trace = vitest.fn();
  child = vitest.fn(() => {
    return this;
  });
}

export const Fakes = {
  FakeLogger,
};
