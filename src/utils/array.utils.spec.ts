// load CRITICAL exports via dynamic import to avoid ESM/CJS interop issues in jest
let asyncReduce: typeof import("./array.utils").arrayUtils.asyncReduce;

beforeAll(async () => {
  asyncReduce = (await import("./array.utils")).arrayUtils.asyncReduce;
});

describe("asyncReduce", () => {
  test("accumulates values with initial value", async () => {
    const arr = [1, 2, 3, 4];
    const sum = await asyncReduce(arr, async (acc, cur) => acc + cur, 0);
    expect(sum).toBe(10);
  });

  test("accumulates values without initial value", async () => {
    const arr = ["a", "b", "c"];
    const res = await asyncReduce(arr, async (acc, cur) => acc + cur);
    expect(res).toBe("abc");
  });

  test("throws on empty array without initial", async () => {
    await expect(asyncReduce([], async (acc, cur) => acc + (cur as any), undefined)).rejects.toThrow(
      /Reduce of empty array with no initial value/
    );
  });

  test("works with empty array and initial value", async () => {
    const res = await asyncReduce([], async (acc, cur) => acc + (cur as any), 5);
    expect(res).toBe(5);
  });

  test("maintains order with async reducer", async () => {
    const arr = [1, 2, 3];
    const calls: number[] = [];
    const res = await asyncReduce(
      arr,
      async (acc, cur) => {
        // simulate async work
        await new Promise((r) => setTimeout(r, 1));
        calls.push(cur);
        return acc + cur;
      },
      0
    );
    expect(res).toBe(6);
    expect(calls).toEqual([1, 2, 3]);
  });
});
