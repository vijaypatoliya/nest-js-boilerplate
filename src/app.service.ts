import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {

  constructor(config: ConfigService) {
    // Please take note that this check is case sensitive!
    const app_host = config.get('NODE_ENV');
    console.log('app_host', app_host);

  }

  root(): string {
    return 'Hello World!';
  }
}
