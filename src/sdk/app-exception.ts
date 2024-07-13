import { AppError } from './app-error';

class AppException extends Error {
  public constructor(private readonly errors: AppError[]) {
    super();
  }

  public getErrors(): AppError[] {
    return this.errors;
  }
}

export { AppException };
