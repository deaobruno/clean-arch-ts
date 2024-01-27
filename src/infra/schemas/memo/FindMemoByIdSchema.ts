export default {
  validate(payload: any): void | Error {
    const { memo_id } = payload;
    const uuidRegex =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi;

    if (!uuidRegex.test(memo_id)) return Error('Invalid "memo_id" format');

    const invalidParams = Object.keys(payload)
      .filter((key) => !["memo_id"].includes(key))
      .map((key) => `"${key}"`)
      .join(", ");

    if (invalidParams) return Error(`Invalid param(s): ${invalidParams}`);
  },
};
