import { describe, test, expect, vitest } from 'vitest';
import { Interactor, AppError, AppException } from '../src';

import { Fakes } from './utils/fakes';

class StubInteractor extends Interactor<any, void, string> {
  doExecute = vitest.fn(async (): Promise<any> => {
    return {
      output: 'ok',
    };
  });

  validateInput = vitest.fn(async () => {});

  getConfig() {
    return this.config;
  }
}

describe('interactor', () => {
  test('new instance', async () => {
    const config = { logger: new Fakes.FakeLogger(), dummy: 1 };
    const interactor = new StubInteractor(config);

    expect(interactor.getConfig()).toEqual(config);

    expect(config.logger.child).toBeCalledWith({ interactor_name: 'StubInteractor' });
  });

  test('error result', async () => {
    const errors = [new AppError('test', 'test')];
    const interactor = new StubInteractor({ logger: new Fakes.FakeLogger() });

    interactor.doExecute.mockImplementationOnce(async () => {
      return {
        errors,
      };
    });

    const e = await interactor.execute().catch(e => e);

    expect((e as AppException).getErrors()).toStrictEqual(errors);
  });

  test('input validation', async () => {
    const error = new Error('test');
    const interactor = new StubInteractor({ logger: new Fakes.FakeLogger() });

    interactor.validateInput.mockImplementationOnce(async () => {
      throw error;
    });

    return expect(interactor.execute()).rejects.toStrictEqual(error);
  });

  test('successful result', async () => {
    const interactor = new StubInteractor({ logger: new Fakes.FakeLogger() });

    return expect(interactor.execute()).resolves.toStrictEqual('ok');
  });
});
