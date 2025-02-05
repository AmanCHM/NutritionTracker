    export interface CustomError extends Error {
        data?: {
        message: string;
        code: number;
        data: unknown;
        };
    }
    

    export interface User {
        id: number;
        email: string;
        isActive: boolean;
      }
      