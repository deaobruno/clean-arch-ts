import { User } from '../User'
import IMapper from './IMapper'

export type DbUser = {
  user_id: string
  email: string
  password: string
  level: number
}

export class UserMapper implements IMapper<User, DbUser> {
  entityToDb(user: User): DbUser {
    const {
      userId,
      email,
      password,
      level,
    } = user
    
    return {
      user_id: userId,
      email,
      password,
      level,
    }
  }

  dbToEntity(data: DbUser): User {
    const {
      user_id,
      email,
      password,
      level,
    } = data
    
    return User.create({
      userId: user_id,
      email,
      password,
      level,
    })
  }
}
