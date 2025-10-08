import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { SkpdModule } from './skpd/skpd.module';
import { PenggunaModule } from './pengguna/pengguna.module';

@Module({
  imports: [
    CommonModule,
    SkpdModule,
    PenggunaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
