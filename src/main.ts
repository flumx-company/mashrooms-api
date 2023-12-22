import { NestFactory, Reflector } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Mushrooms")
    .setDescription("Mushrooms API description")
    .setVersion("1.0")
    // .addTag("Some tag")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());

  SwaggerModule.setup("api", app, document);
  await app.listen(3000, "0.0.0.0");

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

/**
 * TODO before production:
 *
 * REMOVE endpoint, service, controller, dto related to superadmin creation
 * SET TypeOrmModule.forRoot synchronize to false
 * SET .prod.env as envFilePath in app.module.ts.
 *
 */
