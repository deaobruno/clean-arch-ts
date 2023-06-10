import { LevelEnum, User } from '../../domain/User'
import Presenter from './Presenter'

export default class AdminPresenter implements Presenter {
  present(user: User) {
    const {
      id,
      email,
      level,
    } = user

    return {
      id,
      email,
      level: LevelEnum[level],
    }
  }
}
