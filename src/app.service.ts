if (process.env.NODE_ENV !== 'production') require('dotenv').config();
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
