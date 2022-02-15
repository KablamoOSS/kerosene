import HttpError from "./httpError";

class ClientError extends HttpError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, status: number, response?: any) {
    super(message, status, response);
    this.name = "ClientError";
  }
}

export default ClientError;
