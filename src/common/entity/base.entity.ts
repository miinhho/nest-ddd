import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity {
  abstract id: string;
  abstract createdAt: Date;
}

export abstract class BaseOrmEntity {
  @PrimaryKey({ columnType: 'uuid' })
  id: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
