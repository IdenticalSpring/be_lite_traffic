import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();

    
        const status = response.statusCode;

        return next.handle().pipe(
            map((data) => ({
                status,
                message: 'Request processed successfully',
                data: data || null,
            })),
        );
    }
}
