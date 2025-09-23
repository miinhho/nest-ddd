export interface BaseRepository<T> {
  save(entity: T): void;
  delete(id: string): Promise<void>;
}
