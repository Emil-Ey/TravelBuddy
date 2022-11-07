import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config();
const express = require('express')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
  Logger.log(`Server running on http://localhost:${process.env.PORT}`, 'Bootstrap');
}
bootstrap();
