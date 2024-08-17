import Joi from 'joi';
import { describe, test, expect, vitest } from 'vitest';

import { Fakes } from './utils/fakes';
import { AppError, AppException } from '../src';
import { BasicInteractor } from '../src/basic-interactor';

class StubInteractor extends BasicInteractor<any, any, string> {
  doExecute = vitest.fn(async (): Promise<any> => {
    return {
      output: 'ok',
    };
  });

  getJoiSchema = vitest.fn();
}

const extractAppException = async (promise: Promise<unknown>) => {
  const e = await promise.catch(e => e);

  expect(e).instanceof(AppException);

  return e as AppException;
};

const extractAppErrors = async (promise: Promise<unknown>) => {
  const e = await extractAppException(promise);

  return e.getErrors();
};

describe('basic interactor', () => {
  test('validation errors', async () => {
    const logger = new Fakes.FakeLogger();
    const interactor = new StubInteractor({ logger });

    interactor.getJoiSchema.mockImplementationOnce(() => {
      return Joi.object({ x: Joi.number(), y: Joi.string() });
    });

    expect(extractAppErrors(interactor.execute({ x: null, unknown: [] }))).resolves.toStrictEqual([
      new AppError('INVALID_ARG', '"x" must be a number'),
      new AppError('INVALID_ARG', '"y" is required'),
      new AppError('INVALID_ARG', '"unknown" is not allowed'),
    ]);

    expect(logger.error).toBeCalledWith('input has 3 validation error(s)');

    expect(logger.error).toBeCalledWith('"x" must be a number');

    expect(logger.error).toBeCalledWith('"y" is required');

    expect(logger.error).toBeCalledWith('"unknown" is not allowed');
  });
});
