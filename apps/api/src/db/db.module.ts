import { Global, Module } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';

export const DB = Symbol('DB');
export type Db = NodePgDatabase;

@Global()
@Module({
  providers: [
    {
      provide: DB,
      useFactory: () => drizzle(process.env.DATABASE_URL!, { logger: true }),
    },
  ],
  exports: [DB],
})
export class DbModule {}
