import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { isEmpty } from 'ramda';

/*
  Log every incoming requests
*/

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(0);
    console.log(`------ Request to ${req.path} ------`);
    console.log(`   Method : ${req.method}`);
    if(!isEmpty(req.query)){
        console.log(`   Query parameters : ${JSON.stringify(req.query)}`);
    }
    if(!isEmpty(req.params)){
        console.log(`   Params : ${JSON.stringify(req.params)}`);
    }
    if(!isEmpty(req.body)){
        console.log(`   Body : ${JSON.stringify(req.body)}`);
    }
    return next.handle();
  }
}