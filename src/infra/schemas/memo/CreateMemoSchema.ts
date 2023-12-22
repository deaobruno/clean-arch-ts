export default {
  validate(payload: any): void | Error {
    const { title, text, start, end } = payload;

    if (!title) return Error('"title" is required');

    if (!text) return Error('"text" is required');

    if (!start) return Error('"start" is required');

    if (!end) return Error('"end" is required');

    const invalidParams = Object.keys(payload)
      .filter((key) => !["title", "text", "start", "end"].includes(key))
      .map((key) => `"${key}"`)
      .join(", ");

    if (invalidParams) return Error(`Invalid param(s): ${invalidParams}`);
  },
};
