import Middleware from "./Middleware"

export default class TestMiddleware extends Middleware {
  constructor() {
    super({
      exec: async () => {
        console.log('test middleware')
      }
    })
  }
}
