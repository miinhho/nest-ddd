import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import { defineConfig, SqliteDriver } from '@mikro-orm/sqlite';

export default defineConfig({
  dbName: process.env.NODE_ENV === 'test' ? ':memory:' : 'database.db',
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator, SeedManager],
  debug: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
  driver: SqliteDriver,
  entitiesTs: ['src/**/*.orm-entity.ts'],
  entities: ['dist/**/*.orm-entity.js'],
});
