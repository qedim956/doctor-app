import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PatientsModule } from './modules/patients/patients.module.js';

@Module({
  imports: [DbModule, PatientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}