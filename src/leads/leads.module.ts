import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminLeadsController } from './admin-leads.controller';

@Module({
  imports: [PrismaModule],
  providers: [LeadsService],
  controllers: [LeadsController, AdminLeadsController],
})
export class LeadsModule {}
