type Data = Record<string, unknown>;

class AppError {
  private readonly data: Data;

  private readonly code: string;

  private readonly message: string;

  public constructor(code: string, message: string, data: Data = {}) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  public getData() {
    return this.data;
  }

  public getCode() {
    return this.code;
  }

  public getMessage() {
    return this.message;
  }
}

export { AppError };
