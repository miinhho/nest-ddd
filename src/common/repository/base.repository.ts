export abstract class BaseRepository<T> {
  abstract save(entity: T): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
