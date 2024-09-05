import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsModule } from './ws/ws.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    // MongooseModule.forRoot(process.env.MONGO_URL, {
    //   dbName: process.env.MONGO_DB,
    // }),
    WsModule,
    // UsersModule,
    // AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
