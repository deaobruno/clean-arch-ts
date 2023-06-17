import BaseMiddleware from "../BaseMiddleware"

export default class TestMiddleware extends BaseMiddleware {
  constructor() {
    super({
      exec: async () => {
        console.log('test middleware')
      }
    })
  }
}
