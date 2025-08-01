import * as cookieParser from 'cookie-parser'
import 'module-alias/register'

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { DataSource } from 'typeorm'
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional'

import { AppModule } from '@mush/modules/app.module'

import { convertType } from './core/utils'

async function bootstrap() {
  // Инициализация транзакционного контекста
  initializeTransactionalContext()
  
  const app = await NestFactory.create(AppModule)
  
  // Инициализация typeorm-transactional
  addTransactionalDataSource(app.get(DataSource))
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mushrooms')
    .setDescription('Mushrooms API description')
    .setVersion('1.0')
    // .addTag("Some tag")
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)

  app.enableCors({
    origin: JSON.parse(process.env.CORS_ORIGIN_ARRAY),
    credentials: convertType(process.env.CORS_WITH_CREDENTIALS) as boolean,
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, transformOptions: {
      enableImplicitConversion: true, // <- This line here
    }, }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.use(cookieParser())
  SwaggerModule.setup('api', app, document)
  await app.listen(3000, '0.0.0.0')

  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
