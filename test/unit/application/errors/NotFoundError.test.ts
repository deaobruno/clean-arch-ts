import { expect } from "chai";
import NotFoundError from "../../../../src/application/errors/NotFoundError";

describe("/application/errors/NotFoundError.ts", () => {
  it("should throw a Not Found Error", () => {
    expect(() => {
      throw new NotFoundError();
    }).throw("Not Found");
  });
});
