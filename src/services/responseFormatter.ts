export class ResponseFormatter {
    static success(data: any, message: string = 'Operation successful') {
      return {
        success: true,
        message,
        data,
      };
    }
  
    static error(message: string, errorCode: number = 400) {
      return {
        success: false,
        message,
        errorCode,
      };
    }
  }
  