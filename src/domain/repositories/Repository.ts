export default interface Repository<Entity> {
  save(data: Entity): Promise<Entity>
  find(params?: object): Promise<Entity[]>
  findOne(params: object): Promise<Entity | undefined>
  findOneByID(id: string): Promise<Entity | undefined>
  exists(id: string): Promise<boolean>
  delete(id: string): Promise<void>
}
