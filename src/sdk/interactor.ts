import { Logger } from './logger';
import { AppError } from './app-error';
import { AppException } from './app-exception';

type InteractorConfig = {
  logger: Logger;
};

type FailedResult = { errors: AppError[] };

type SuccessfulResult<T> = { output: T };

const isFailedResult = (result: FailedResult | SuccessfulResult<unknown>): result is FailedResult => {
  return Object.hasOwn(result, 'errors');
};

abstract class Interactor<C, I, O> {
  protected readonly logger: Logger;
  protected readonly config: Readonly<Omit<C, keyof InteractorConfig>>;

  protected input: Readonly<I>;

  public constructor(config: C & InteractorConfig) {
    this.config = config;
    this.logger = config.logger.child({ interactor_name: this.constructor.name });
  }

  protected async validateInput(_input: I): Promise<void> {
    return Promise.resolve();
  }

  protected abstract doExecute(): Promise<SuccessfulResult<O> | FailedResult>;

  public readonly execute = async (input: I): Promise<O> => {
    const result = await this.validateInput(input).then(() => {
      return this.doExecute();
    });

    if (isFailedResult(result)) {
      throw new AppException(result.errors);
    }

    return result.output;
  };
}

export { Interactor, InteractorConfig };
