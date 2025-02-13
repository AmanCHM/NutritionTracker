import { string } from "yup";

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
      

      export interface ChartData {
        
            labels: string[];
            datasets: {
                data: number[];
                backgroundColor: string[];
                hoverOffset: number;
            }[];
        
      }