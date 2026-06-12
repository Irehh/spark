import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true
  }));
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Spark API')
    .setDescription('The Spark Premium Dating API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3030);
  console.log(`Backend is running on: http://localhost:${process.env.PORT || 3030}`);
  //log api requests and responses in development mode
  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      const oldWrite = res.write;
      const oldEnd = res.end;
      const chunks: any[] = [];
      res.write = (chunk) => {
        chunks.push(chunk);
        return oldWrite.apply(res, arguments);
      };
      res.end = (chunk) => {
        if (chunk) chunks.push(chunk);
        const body = Buffer.concat(chunks).toString('utf8');
        console.log(`Response: ${res.statusCode} ${body}`);
        return oldEnd.apply(res, arguments);
      };
      next();
    });
  }
}
bootstrap();
