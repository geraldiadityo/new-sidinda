import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { SkpdModule } from './skpd/skpd.module';

@Module({
  imports: [
    CommonModule,
    SkpdModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
