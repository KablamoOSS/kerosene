import HttpError from "./httpError";

class ServerError extends HttpError {
  constructor(message: string, status: number, response?: any) {
    super(message, status, response);
    this.name = "ServerError";
    this.status = status;
    this.response = response;
  }
}

export default ServerError;