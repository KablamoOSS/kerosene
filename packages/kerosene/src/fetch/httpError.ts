import ExtendableError from "../error/ExtendableError";

class HttpError extends ExtendableError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, public status: number, public response?: any) {
    super(message);
    this.name = "HttpError";
  }
}

export default HttpError;
