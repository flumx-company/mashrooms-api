import * as cookieParser from 'cookie-parser'
import 'module-alias/register'

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from '@mush/modules/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mushrooms')
    .setDescription('Mushrooms API description')
    .setVersion('1.0')
    // .addTag("Some tag")
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)

  app.enableCors({
    origin: [
      'http://178.151.201.167/',
      'http://178.151.201.167:51515/',
      'http://178.151.201.167:51516/',
      'http://localhost:3000/',
      'http://localhost:8080/',
      'http://localhost:5173/',
      'http://localhost:5174/',
      'http://localhost:5175/',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.use(cookieParser())
  SwaggerModule.setup('api', app, document)
  await app.listen(3000, '0.0.0.0')

  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
