import { expect } from "chai";
import ForbiddenError from "../../../../src/application/errors/ForbiddenError";

describe("/application/errors/ForbiddenError.ts", () => {
  it("should throw a Forbidden Error", () => {
    expect(() => {
      throw new ForbiddenError();
    }).throw("Forbidden");
  });
});
