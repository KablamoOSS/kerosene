import ExtendableError from "../error/ExtendableError";

class HttpError extends ExtendableError {
  constructor(
    message: string,
    public status: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public response?: any,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export default HttpError;
