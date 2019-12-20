class HttpException {
  public status: number;
  public message: string;
  public data: any;
  public date: Date;

  public constructor(status: number, message: string, data?: any) {
    this.status = status;
    this.message = message;
    this.data = data || {};
    this.date = new Date();
  }
}

export { HttpException };
export default HttpException;
