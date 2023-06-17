import { LevelEnum, User } from '../../../domain/User'
import IPresenter from '../IPresenter'

export default class AdminPresenter implements IPresenter {
  present(user: User) {
    const {
      user_id,
      email,
      level,
    } = user

    return {
      id: user_id,
      email,
      level: LevelEnum[level],
    }
  }
}
