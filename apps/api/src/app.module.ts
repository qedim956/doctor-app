import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PatientsModule } from './modules/patients/patients.module.js';
import { LabsModule } from './modules/labs/labs.module.js';

@Module({
  imports: [DbModule, PatientsModule, LabsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}