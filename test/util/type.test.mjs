import { describe, it } from "node:test";
import { typeConstant } from "../../src/constants/share.mjs";
import { typeUtil } from "../../src/util/share.mjs";
import * as assert from "assert";
function getValues(val) {
    return [typeUtil.getPlatformType(val), typeUtil.getPlatformTypeByRefData({ $ref: { k: val }, key: "k" })];
}

describe("test the type module", () => {
    describe("test the typeUtil.getPlatformType or typeUtil.getPlatformTypeByRefData function", () => {
        it("should return typeConstant.platformType.Null for null input", () => {
            getValues(null).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Null);
            });
        });

        it("should return typeConstant.platformType.Undefined for undefined input", () => {
            getValues(undefined).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Undefined);
            });
        });

        it("should return typeConstant.platformType.BigInt when typeof value is 'bigint'", () => {
            getValues(BigInt(10)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.PrimitiveBigInt);
            });
        });

        it("should return typeConstant.platformType.Number when typeof value is 'number'", () => {
            [...getValues(42), ...getValues(Number.MAX_VALUE)].forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.PrimitiveNumber);
            });
        });

        it("should return typeConstant.platformType.Boolean when typeof value is 'boolean'", () => {
            [...getValues(true), ...getValues(false)].forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.PrimitiveBoolean);
            });
        });

        it("should return typeConstant.platformType.String when typeof value is 'string'", () => {
            getValues("Hello").forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.PrimitiveString);
            });
        });

        it("should return typeConstant.platformType.Symbol when typeof value is 'symbol'", () => {
            getValues(Symbol("test")).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.PrimitiveSymbol);
            });
        });

        it("should return typeConstant.platformType.Function for normal function", () => {
            getValues(() => {}).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Function);
            });
        });

        it("should return typeConstant.platformType.AsyncFunction for AsyncFunction", () => {
            getValues(async () => {}).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.AsyncFunction);
            });
        });

        it("should return typeConstant.platformType.GeneratorFunction for GeneratorFunction", () => {
            getValues(function* generatorFunc() {}).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.GeneratorFunction);
            });
        });

        it("should return typeConstant.platformType.Array when value is an array", () => {
            getValues([1, 2, 3]).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Array);
            });
        });

        it("should return typeConstant.platformType.Int8Array for Int8Array instance", () => {
            getValues(new Int8Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Int8Array);
            });
        });

        it("should return typeConstant.platformType.Uint8Array for Uint8Array instance", () => {
            getValues(new Uint8Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Uint8Array);
            });
        });

        it("should return typeConstant.platformType.Uint8ClampedArray for Uint8ClampedArray instance", () => {
            getValues(new Uint8ClampedArray(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Uint8ClampedArray);
            });
        });

        it("should return typeConstant.platformType.Int16Array for Int16Array instance", () => {
            getValues(new Int16Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Int16Array);
            });
        });

        it("should return typeConstant.platformType.Uint16Array for Uint16Array instance", () => {
            getValues(new Uint16Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Uint16Array);
            });
        });

        it("should return typeConstant.platformType.Int32Array for Int32Array instance", () => {
            getValues(new Int32Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Int32Array);
            });
        });

        it("should return typeConstant.platformType.Uint32Array for Uint32Array instance", () => {
            getValues(new Uint32Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Uint32Array);
            });
        });

        it("should return typeConstant.platformType.Float32Array for Float32Array instance", () => {
            getValues(new Float32Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Float32Array);
            });
        });

        it("should return typeConstant.platformType.Float64Array for Float64Array instance", () => {
            getValues(new Float64Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Float64Array);
            });
        });

        it("should return typeConstant.platformType.BigUint64Array for BigUint64Array instance", () => {
            getValues(new BigUint64Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.BigUint64Array);
            });
        });

        it("should return typeConstant.platformType.Set for Set instance", () => {
            getValues(new Set()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Set);
            });
        });

        it("should return typeConstant.platformType.Map for Map instance", () => {
            getValues(new Map()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Map);
            });
        });

        it("should return typeConstant.platformType.Date for Date instance", () => {
            getValues(new Date()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Date);
            });
        });

        it("should return typeConstant.platformType.RegExp for RegExp instance", () => {
            getValues(new RegExp("\\d+")).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.RegExp);
            });
        });

        it("should return typeConstant.platformType.Promise for Promise instance", () => {
            getValues(new Promise(() => {})).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Promise);
            });
        });

        it("should return typeConstant.platformType.WeakMap for WeakMap instance", () => {
            getValues(new WeakMap()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.WeakMap);
            });
        });

        it("should return typeConstant.platformType.WeakSet for WeakSet instance", () => {
            getValues(new WeakSet()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.WeakSet);
            });
        });

        it("should return typeConstant.platformType.Proxy for Proxy instance", () => {
            getValues(new Proxy({}, {})).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.Object);
            });
        });

        it("should return typeConstant.platformType.DataView for DataView instance", () => {
            getValues(new DataView(new ArrayBuffer(10))).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.DataView);
            });
        });

        it("should return typeConstant.platformType.ReadableStream for ReadableStream instance", () => {
            getValues(new ReadableStream()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.ReadableStream);
            });
        });

        it("should return typeConstant.platformType.WritableStream for WritableStream instance", () => {
            getValues(new WritableStream()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.WritableStream);
            });
        });

        it("should return typeConstant.platformType.ByteLengthQueuingStrategy for ByteLengthQueuingStrategy instance", () => {
            getValues(new ByteLengthQueuingStrategy({ highWaterMark: 1024 })).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.ByteLengthQueuingStrategy);
            });
        });

        it("should return typeConstant.platformType.CountQueuingStrategy for CountQueuingStrategy instance", () => {
            getValues(new CountQueuingStrategy({ highWaterMark: 10 })).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.CountQueuingStrategy);
            });
        });

        it("should return typeConstant.platformType.TransformStream for TransformStream instance", () => {
            getValues(new TransformStream()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.TransformStream);
            });
        });

        it("should return typeConstant.platformType.TypeError for TypeError instance", () => {
            const error = new TypeError();
            const result = typeUtil.getPlatformType(error);
            assert.strictEqual(result, typeConstant.platformType.TypeError);

            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.TypeError);
            });
        });

        it("should return typeConstant.platformType.RangeError for RangeError instance", () => {
            const error = new RangeError();
            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.RangeError);
            });
        });

        it("should return typeConstant.platformType.SyntaxError for SyntaxError instance", () => {
            const error = new SyntaxError();
            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.SyntaxError);
            });
        });

        it("should return typeConstant.platformType.URIError for URIError instance", () => {
            const error = new URIError();
            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.URIError);
            });
        });

        it("should return typeConstant.platformType.ReferenceError for ReferenceError instance", () => {
            const error = new ReferenceError();
            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.ReferenceError);
            });
        });

        it("should return typeConstant.platformType.EvalError for EvalError instance", () => {
            const error = new EvalError();
            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformType.EvalError);
            });
        });
    });

    describe("test the typeUtil.dispatchPlatformType function", () => {
        it("should call callback function for matching type", () => {
            let checkValue;
            typeUtil.dispatchPlatformType(
                42,
                [
                    { type: typeConstant.platformType.PrimitiveNumber, callback: () => (checkValue = true) },
                    { type: typeConstant.platformType.PrimitiveString, callback: () => (checkValue = false) },
                ],
                () => (checkValue = false),
            );
            assert.equal(checkValue, true);
        });

        it("should call callback function for matching type in array", () => {
            let checkValue;
            typeUtil.dispatchPlatformType(
                Symbol("test"),
                [
                    {
                        type: [typeConstant.platformType.PrimitiveSymbol, typeConstant.platformType.PrimitiveBigInt],
                        callback: () => (checkValue = true),
                    },
                    { type: typeConstant.platformType.PrimitiveString, callback: () => (checkValue = false) },
                ],
                () => (checkValue = false),
            );
            assert.strictEqual(checkValue, true);
        });

        it("should call otherCallback when no match is found", () => {
            let checkValue;
            typeUtil.dispatchPlatformType(
                null,
                [{ type: typeConstant.platformType.PrimitiveNumber, callback: () => (checkValue = true) }],
                () => (checkValue = false),
            );
            assert.strictEqual(checkValue, false);
        });

        it("should not call otherCallback when no match is found and otherCallback is not provided", () => {
            let checkValue;
            typeUtil.dispatchPlatformType(undefined, [
                { type: typeConstant.platformType.PrimitiveNumber, callback: () => (checkValue = true) },
            ]);
            assert.strictEqual(checkValue, undefined);
        });
    });
});
