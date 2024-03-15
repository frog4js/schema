import { describe, it } from "node:test";
import * as assert from "assert";
import { dataOperateUtil } from "../../src/util/share.js";

describe("test the data operate module", () => {
    describe("test the clone function", () => {
        it("should return null when given data is null", () => {
            const result = dataOperateUtil.clone(null);
            assert.strictEqual(result, null);
        });

        it("should return the same data when given data type is not object", () => {
            const result1 = dataOperateUtil.clone(true);
            const result2 = dataOperateUtil.clone(123);
            const result3 = dataOperateUtil.clone("test");
            assert.strictEqual(result1, true);
            assert.strictEqual(result2, 123);
            assert.strictEqual(result3, "test");
        });

        it("should return a shallow copy of the given array", () => {
            const arr = [1, 2, "test"];
            const result = dataOperateUtil.clone(arr);
            assert.deepStrictEqual(result, [1, 2, "test"]);
            assert.notStrictEqual(result, arr);
        });

        it("should return a shallow copy of the given object", () => {
            const obj = { a: 1, b: "test" };
            const result = dataOperateUtil.clone(obj);
            assert.deepStrictEqual(result, { a: 1, b: "test" });
            assert.notStrictEqual(result, obj);
        });
    });

    describe("test the deepClone function", () => {
        it("should return null when given data is null", () => {
            const result = dataOperateUtil.deepClone(null);
            assert.strictEqual(result, null);
        });

        it("should return the same data when given data type is not object", () => {
            const result1 = dataOperateUtil.deepClone(true);
            const result2 = dataOperateUtil.deepClone(123);
            const result3 = dataOperateUtil.deepClone("test");
            assert.strictEqual(result1, true);
            assert.strictEqual(result2, 123);
            assert.strictEqual(result3, "test");
        });

        it("should return a deep copy of the given array", () => {
            const arr = [1, { a: 2 }, [3]];
            const result = dataOperateUtil.deepClone(arr);
            assert.deepStrictEqual(result, [1, { a: 2 }, [3]]);
            assert.notStrictEqual(result, arr);
            assert.notStrictEqual(result[1], arr[1]);
            assert.notStrictEqual(result[2], arr[2]);
        });

        it("should return a deep copy of the given object", () => {
            const obj = { a: 1, b: { c: 2 }, d: [3] };
            const result = dataOperateUtil.deepClone(obj);
            assert.deepStrictEqual(result, { a: 1, b: { c: 2 }, d: [3] });
            assert.notStrictEqual(result, obj);
            assert.notStrictEqual(result.b, obj.b);
            assert.notStrictEqual(result.d, obj.d);
        });
    });

    describe("test the toString function", () => {
        it("should return 'null' when given data is null", () => {
            const result = dataOperateUtil.toString(null);
            assert.strictEqual(result, "null");
        });

        it("should return 'undefined' when given data is undefined", () => {
            const result = dataOperateUtil.toString(undefined);
            assert.strictEqual(result, "");
        });

        it("should return the string representation of a function when given data is a function", () => {
            const result = dataOperateUtil.toString(() => {});
            assert.strictEqual(result, "");
        });

        it("should return the string representation of a bigint when given data is a bigint", () => {
            const result = dataOperateUtil.toString(BigInt(123));
            assert.strictEqual(result, '"123"');
        });

        it("should return the string representation of a string when given data is a string", () => {
            const result = dataOperateUtil.toString("test");
            assert.strictEqual(result, '"test"');
        });

        it("should return the same number when given data is a number", () => {
            const result = dataOperateUtil.toString(123);
            assert.strictEqual(result, "123");
        });

        it("should return the same boolean when given data is a boolean", () => {
            const result1 = dataOperateUtil.toString(true);
            const result2 = dataOperateUtil.toString(false);
            assert.strictEqual(result1, "true");
            assert.strictEqual(result2, "false");
        });

        it("should return a shallow string representation of the given array when depth is 1", () => {
            const arr = [1, { a: 2 }, [3]];
            const result = dataOperateUtil.toString(arr, 1);
            assert.strictEqual(result, "[ 1, Object, Array ]");
        });

        it("should return a deep string representation of the given array when depth is greater than 1", () => {
            const arr = [1, { a: 2 }, [3]];
            const result = dataOperateUtil.toString(arr, 2);
            assert.strictEqual(result, '[ 1, { "a": 2 }, [ 3 ] ]');
        });

        it("should return a shallow string representation of the given object when depth is 1", () => {
            const obj = { a: 1, b: { c: 2 }, d: [3] };
            const result = dataOperateUtil.toString(obj, 1);
            assert.strictEqual(result, '{ "a": 1, "b": Object, "d": Array }');
        });

        it("should return a deep string representation of the given object when depth is greater than 1", () => {
            const obj = { a: 1, b: { c: 2 }, d: [3] };
            const result = dataOperateUtil.toString(obj, 2);
            assert.strictEqual(result, '{ "a": 1, "b": { "c": 2 }, "d": [ 3 ] }');
        });
    });
    describe("test the fastDeepHasDuplicates function", () => {
        it("should return false for empty array", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([]);
            assert.equal(result, false);
        });

        it("should return false for array with unique elements", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([1, 2, 3, "4", 4, true, false]);
            assert.equal(result, false);
        });

        it("should return true for array with duplicate primitive values", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([1, 2, 1, 3]);
            assert.equal(result, true);
        });

        it("should return true for array with duplicate object properties", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([
                { a: 1, b: 2 },
                { a: 1, b: 2 },
            ]);
            assert.equal(result, true);
        });

        it("should return false for array with duplicate object properties", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([
                { a: 1, b: 2 },
                { a: 1, b: 3 },
            ]);
            assert.equal(result, false);
        });

        it("should return false for array with duplicate nested array values", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([
                { a: 1, b: 2, c: [] },
                { a: 1, b: 2, c: 0 },
            ]);
            assert.equal(result, false);
        });

        it("should return false for array with complex nested values", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([
                { a: { b: 1 }, c: [{ d: 1 }, true] },
                {
                    a: { b: 1 },
                    c: [{ d: 1 }, false],
                },
                undefined,
                null,
                true,
            ]);
            assert.equal(result, false);
        });

        it("should return true for array with duplicate nested array values", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([
                [1, 2],
                [3, 4],
                [1, 2],
            ]);
            assert.equal(result, true);
        });

        it("should handle nested arrays and objects", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([{ a: [1, 2] }, { a: [1, 2] }]);
            assert.equal(result, true);
        });

        it("should handle complex array with mixed types", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([1, "foo", { a: 1 }, [1, 2], "foo"]);
            assert.equal(result, true);
        });

        it("should handle complex array with two empty object", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([{}, {}]);
            assert.equal(result, true);
        });
        it("should handle complex array with two empty array", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([[], []]);
            assert.equal(result, true);
        });
        it("should handle complex array with two empty array", () => {
            const result = dataOperateUtil.fastDeepHasDuplicates([
                {
                    type: "string",
                    maxLength: 2,
                },
                {
                    type: "number",
                    maximum: 10,
                },
                {
                    type: "string",
                    minLength: 5,
                },
            ]);
            assert.equal(result, false);
        });
    });

    describe("test the merge function", () => {
        it("should merge two objects correctly", () => {
            const obj1 = {
                a: 1,
                b: {
                    c: 2,
                    d: [3, 4],
                    e: {
                        f: 5,
                    },
                },
            };
            const obj2 = {
                a: 10,
                b: {
                    c: 20,
                    d: [30, 40],
                    e: {
                        f: 50,
                        g: 60,
                    },
                },
                h: 70,
            };

            const expectedResult = {
                a: 10,
                b: {
                    c: 20,
                    d: [30, 40],
                    e: {
                        f: 50,
                        g: 60,
                    },
                },
                h: 70,
            };

            assert.deepStrictEqual(dataOperateUtil.merge(obj1, obj2), expectedResult);
        });

        it("should handle null and undefined values correctly", () => {
            const obj1 = {
                a: 1,
                b: null,
            };

            const obj2 = {
                a: null,
                b: {
                    c: undefined,
                },
            };

            const expectedResult = {
                a: 1,
                b: {
                    c: undefined,
                },
            };

            assert.deepStrictEqual(dataOperateUtil.merge(obj1, obj2), expectedResult);
        });

        it("should merge arrays correctly", () => {
            const arr1 = [1, 2, [3, 4]];
            const arr2 = [10, 20, [30, 40, [50, 60]]];
            const expectedArrResult = [10, 20, [30, 40, [50, 60]]];

            assert.deepStrictEqual(dataOperateUtil.merge(arr1, arr2), expectedArrResult);
        });

        it("should merge objects with different key types correctly", () => {
            const obj1 = {
                a: 1,
                b: {
                    c: 2,
                    d: [3, 4],
                    e: {
                        f: 5,
                    },
                },
                g: new Date(),
            };

            const obj2 = {
                a: 10,
                b: {
                    c: 20,
                    d: [30, 40],
                    e: {
                        f: 50,
                        g: 60,
                    },
                },
                h: "hello world",
            };

            const expectedResult = {
                a: 10,
                b: {
                    c: 20,
                    d: [30, 40],
                    e: {
                        f: 50,
                        g: 60,
                    },
                },
                g: obj1.g,
                h: "hello world",
            };

            assert.deepStrictEqual(dataOperateUtil.merge(obj1, obj2), expectedResult);
        });
    });

    describe("test the compareToArray function", () => {
        it("equal arrays", () => {
            assert.equal(dataOperateUtil.compareToArray([1, 2, 3], [1, 2, 3]), 0);
            assert.equal(dataOperateUtil.compareToArray([], []), 0);
        });

        it("array2 is a superset of array1", () => {
            assert.equal(dataOperateUtil.compareToArray([1, 2], [1, 2, 3]), 1);
            assert.equal(dataOperateUtil.compareToArray([1, 2, 3], [1, 2, 3, 4]), 1);
        });

        it("array1 is a superset of array2", () => {
            assert.equal(dataOperateUtil.compareToArray([1, 2, 3], [1, 2]), 2);
            assert.equal(dataOperateUtil.compareToArray([1, 2, 3, 4], [1, 2, 3]), 2);
        });

        it("arrays have different elements", () => {
            assert.equal(dataOperateUtil.compareToArray([1, 2, 3], [1, 2, 4]), 3);
            assert.equal(dataOperateUtil.compareToArray([], [1]), 1);
        });
    });
});
