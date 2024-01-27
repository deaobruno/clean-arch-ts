import { faker } from "@faker-js/faker";
import { expect } from "chai";
import UpdateMemoSchema from "../../../../../src/infra/schemas/memo/UpdateMemoSchema";

const { validate } = UpdateMemoSchema;

describe("/infra/schemas/memo/UpdateMemoSchema.ts", () => {
  it("should execute without errors", () => {
    const validation = validate({
      memo_id: faker.string.uuid(),
      title: "New Title",
      text: "Lorem ipsum",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    });

    expect(validation).equal(undefined);
  });

  it("should fail when memo_id is empty", () => {
    const validation = <Error>validate({
      memo_id: "",
      title: "New Title",
      text: "Lorem ipsum",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    });

    expect(validation.message).equal('Invalid "memo_id" format');
  });

  it("should fail when memo_id is invalid", () => {
    const validation = <Error>validate({
      memo_id: "test",
      title: "New Title",
      text: "Lorem ipsum",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    });

    expect(validation.message).equal('Invalid "memo_id" format');
  });

  it("should fail when title is empty", () => {
    const validation = <Error>validate({
      memo_id: faker.string.uuid(),
      title: "",
      text: "Lorem ipsum",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    });

    expect(validation.message).equal('"title" is required');
  });

  it("should fail when text is empty", () => {
    const validation = <Error>validate({
      memo_id: faker.string.uuid(),
      title: "New Title",
      text: "",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    });

    expect(validation.message).equal('"text" is required');
  });

  it("should fail when start is empty", () => {
    const validation = <Error>validate({
      memo_id: faker.string.uuid(),
      title: "New Title",
      text: "Lorem ipsum",
      start: "",
      end: new Date().toISOString(),
    });

    expect(validation.message).equal('"start" is required');
  });

  it("should fail when end is empty", () => {
    const validation = <Error>validate({
      memo_id: faker.string.uuid(),
      title: "New Title",
      text: "Lorem ipsum",
      start: new Date().toISOString(),
      end: "",
    });

    expect(validation.message).equal('"end" is required');
  });

  it("should fail when passing invalid param", () => {
    const validation = <Error>validate({
      memo_id: faker.string.uuid(),
      title: "New Title",
      text: "Lorem ipsum",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      test: "test",
    });

    expect(validation.message).equal('Invalid param(s): "test"');
  });
});
