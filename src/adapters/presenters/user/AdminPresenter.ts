import { LevelEnum, User } from '../../../domain/User'
import IPresenter from '../IPresenter'

export default class AdminPresenter implements IPresenter {
  present(user: User) {
    const {
      userId,
      email,
      level,
    } = user

    return {
      id: userId,
      email,
      level: LevelEnum[level],
    }
  }
}
