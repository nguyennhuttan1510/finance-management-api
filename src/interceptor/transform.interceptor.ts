import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

export interface ResponseFallback {
  data: any;
  status: boolean;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}

@Injectable()
export class TransformFallbackInterceptor
  implements NestInterceptor<ResponseFallback, ResponseFallback>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<ResponseFallback>,
  ): Observable<ResponseFallback> {
    return next.handle().pipe(
      map((response) => ({
        data: response.data,
        status: response.status,
        message: response.message,
      })),
    );
  }
}

export class ResponsePattern<T> implements ResponseFallback {
  data: T;
  message?: string;
  status: boolean;
  constructor(data: T, status: boolean, message?: string) {
    this.data = data;
    this.status = status;
    this.message = message;
  }
}
