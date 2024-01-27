export default {
  validate(payload: any): void | Error {
    const { memo_id, title, text, start, end } = payload;
    const uuidRegex =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi;

    if (!uuidRegex.test(memo_id)) return Error('Invalid "memo_id" format');

    if (title !== undefined && title === "")
      return Error('"title" is required');

    if (text !== undefined && text === "") return Error('"text" is required');

    if (start !== undefined && start === "")
      return Error('"start" is required');

    if (end !== undefined && end === "") return Error('"end" is required');

    const invalidParams = Object.keys(payload)
      .filter(
        (key) => !["memo_id", "title", "text", "start", "end"].includes(key)
      )
      .map((key) => `"${key}"`)
      .join(", ");

    if (invalidParams) return Error(`Invalid param(s): ${invalidParams}`);
  },
};
