import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getLogger, WechatyClient } from 'src/utils'

const logger = getLogger('proj')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const wechaty = WechatyClient.create()
  wechaty.init()

  await app.listen(process.env.PORT || 3456);
}

bootstrap().then(() => logger.info('proj starting...  🚀'));;
