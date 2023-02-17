import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'testdb',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'xignature',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
