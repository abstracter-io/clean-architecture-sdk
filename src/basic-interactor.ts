import Joi from 'joi';

import { AppError } from './sdk/app-error';
import { Interactor } from './sdk/interactor';
import { AppException } from './sdk/app-exception';

const validateInput = <I>(input: I, joiSchema: Joi.AnySchema | null) => {
  const errors: AppError[] = [];

  if (joiSchema && input) {
    const validation = joiSchema.validate(input, {
      abortEarly: false,
      allowUnknown: false,
      presence: 'required',
    });

    if (validation.error) {
      for (const detail of validation.error.details) {
        errors.push(new AppError('INVALID_ARG', detail.message));
      }
    }
    else {
      return {
        errors,
        input: validation.value as I,
      };
    }
  }

  return { errors, input };
};

abstract class BasicInteractor<C, I, O> extends Interactor<C, I, O> {
  protected abstract getJoiSchema(): Joi.AnySchema | null;

  protected async validateInput(input: I) {
    const validation = validateInput(input, this.getJoiSchema());

    if (validation.errors.length > 0) {
      this.logger.error(`input has ${validation.errors.length} validation error(s)`);

      for (const error of validation.errors) {
        this.logger.error(error.getMessage());
      }

      throw new AppException(validation.errors);
    }

    this.input = validation.input;
  }
}

export { BasicInteractor };
