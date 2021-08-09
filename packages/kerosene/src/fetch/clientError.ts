import HttpError from "./httpError";

class ClientError extends HttpError {
  constructor(message: string, status: number, response?: any) {
    super(message, status, response);
    this.name = "ClientError";
    this.status = status;
    this.response = response;
  }
}

export default ClientError;