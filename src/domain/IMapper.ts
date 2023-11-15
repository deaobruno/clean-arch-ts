export default interface IMapper<T, U> {
  entityToDb(entity: T): U;
  dbToEntity(data: U): T;
}
