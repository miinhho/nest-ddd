export abstract class BaseRepository<T> {
  abstract save(entity: T): void;
  abstract delete(id: string): Promise<void>;
}
