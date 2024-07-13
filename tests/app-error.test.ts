import { describe, test, expect } from 'vitest';

import { AppError } from '../src';

describe('app error', () => {
  test('getters', async () => {
    const code = 'test';
    const message = 'test';
    const data = { t: 1 };
    const error = new AppError(code, message, data);

    expect(error.getCode()).toStrictEqual(code);

    expect(error.getData()).toStrictEqual(data);

    expect(error.getMessage()).toStrictEqual(message);
  });
});
