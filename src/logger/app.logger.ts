import {
  LoggerService,
  Injectable,
  Scope,
  ConsoleLogger,
} from '@nestjs/common';

export enum LogAction {
  GENERATE_SEQUENCE = 'GENERATE_SEQUENCE',
}

@Injectable({ scope: Scope.DEFAULT })
export class ValleysLogger extends ConsoleLogger implements LoggerService {
  constructor() {
    super({ prefix: 'Valley' });
  }

  log(message: any, trace?: string) {
    if (typeof trace === 'object') (trace as any).process_id = process.pid;
    super.log(message, trace);
  }

  error(message: any, trace?: string, context?: string) {
    if (typeof trace === 'object') (trace as any).process_id = process.pid;
    super.error(message, trace, context);
  }

  warn(message: any, trace?: string) {
    if (typeof trace === 'object') (trace as any).process_id = process.pid;
    super.warn(message, trace);
  }

  debug(message: any, trace?: string) {
    if (typeof trace === 'object') (trace as any).process_id = process.pid;
    super.debug(message, trace);
  }

  verbose(message: any, trace?: string) {
    if (typeof trace === 'object') (trace as any).process_id = process.pid;
    super.verbose(message, trace);
  }
}
