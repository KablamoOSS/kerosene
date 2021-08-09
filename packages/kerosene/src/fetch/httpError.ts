class HttpError extends Error {
  public response: unknown;

  public status: number;
  
  constructor(message: string, status: number, response?: any) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.response = response;
  }
}

export default HttpError;