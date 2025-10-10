import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { SkpdModule } from './skpd/skpd.module';
import { PenggunaModule } from './pengguna/pengguna.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CommonModule,
    SkpdModule,
    PenggunaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
