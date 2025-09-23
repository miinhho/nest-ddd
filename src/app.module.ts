import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import { MikroORM, SqliteDriver } from '@mikro-orm/sqlite';
import { Module, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import serverConfig from './config/server.config';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      load: [serverConfig],
    }),
    MikroOrmModule.forRoot({
      dbName: 'database.db',
      metadataProvider: TsMorphMetadataProvider,
      extensions: [Migrator, SeedManager],
      debug: process.env.NODE_ENV !== 'production',
      driver: SqliteDriver,
      autoLoadEntities: true,
    }),
    OrderModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }
}
