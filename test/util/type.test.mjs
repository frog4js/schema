import { describe, it } from "node:test";
import { typeConstant } from "../../src/constants/share.mjs";
import { typeUtil } from "../../src/util/share.mjs";
import * as assert from "assert";

describe("test the type module", () => {
    describe("test the typeUtil.getPlatformType or typeUtil.getPlatformTypeByRefData function", () => {
        function getValues(val) {
            return [typeUtil.getPlatformType(val), typeUtil.getPlatformTypeByRefData({ $ref: { k: val }, key: "k" })];
        }
        it("should return typeConstant.platformTypes.null for null input", () => {
            getValues(null).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.null);
            });
        });

        it("should return typeConstant.platformTypes.undefined for undefined input", () => {
            getValues(undefined).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.undefined);
            });
        });

        it("should return typeConstant.platformTypes.primitiveBigInt when typeof value is 'bigint'", () => {
            getValues(BigInt(10)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.primitiveBigInt);
            });
        });

        it("should return typeConstant.platformTypes.primitiveNumber when typeof value is 'number'", () => {
            [...getValues(42), ...getValues(Number.MAX_VALUE)].forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.primitiveNumber);
            });
        });

        it("should return typeConstant.platformTypes.primitiveBoolean when typeof value is 'boolean'", () => {
            [...getValues(true), ...getValues(false)].forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.primitiveBoolean);
            });
        });

        it("should return typeConstant.platformTypes.primitiveString when typeof value is 'string'", () => {
            getValues("Hello").forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.primitiveString);
            });
        });

        it("should return typeConstant.platformTypes.primitiveSymbol when typeof value is 'symbol'", () => {
            getValues(Symbol("test")).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.primitiveSymbol);
            });
        });

        it("should return typeConstant.platformTypes.function for normal function", () => {
            getValues(() => {}).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.function);
            });
        });

        it("should return typeConstant.platformTypes.asyncFunction for AsyncFunction", () => {
            getValues(async () => {}).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.asyncFunction);
            });
        });

        it("should return typeConstant.platformTypes.generatorFunction for GeneratorFunction", () => {
            getValues(function* generatorFunc() {}).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.generatorFunction);
            });
        });

        it("should return typeConstant.platformTypes.array when value is an array", () => {
            getValues([1, 2, 3]).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.array);
            });
        });

        it("should return typeConstant.platformTypes.int8Array for Int8Array instance", () => {
            getValues(new Int8Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.int8Array);
            });
        });

        it("should return typeConstant.platformTypes.uint8Array for Uint8Array instance", () => {
            getValues(new Uint8Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.uint8Array);
            });
        });

        it("should return typeConstant.platformTypes.uint8ClampedArray for Uint8ClampedArray instance", () => {
            getValues(new Uint8ClampedArray(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.uint8ClampedArray);
            });
        });

        it("should return typeConstant.platformTypes.int16Array for Int16Array instance", () => {
            getValues(new Int16Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.int16Array);
            });
        });

        it("should return typeConstant.platformTypes.uint16Array for Uint16Array instance", () => {
            getValues(new Uint16Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.uint16Array);
            });
        });

        it("should return typeConstant.platformTypes.int32Array for Int32Array instance", () => {
            getValues(new Int32Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.int32Array);
            });
        });

        it("should return typeConstant.platformTypes.uint32Array for Uint32Array instance", () => {
            getValues(new Uint32Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.uint32Array);
            });
        });

        it("should return typeConstant.platformTypes.float32Array for Float32Array instance", () => {
            getValues(new Float32Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.float32Array);
            });
        });

        it("should return typeConstant.platformTypes.float64Array for Float64Array instance", () => {
            getValues(new Float64Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.float64Array);
            });
        });

        it("should return typeConstant.platformTypes.bigUint64Array for BigUint64Array instance", () => {
            getValues(new BigUint64Array(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.bigUint64Array);
            });
        });

        it("should return typeConstant.platformTypes.set for Set instance", () => {
            getValues(new Set()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.set);
            });
        });

        it("should return typeConstant.platformTypes.map for Map instance", () => {
            getValues(new Map()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.map);
            });
        });

        it("should return typeConstant.platformTypes.date for Date instance", () => {
            getValues(new Date()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.date);
            });
        });

        it("should return typeConstant.platformTypes.regExp for RegExp instance", () => {
            getValues(new RegExp("\\d+")).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.regExp);
            });
        });

        it("should return typeConstant.platformTypes.promise for Promise instance", () => {
            getValues(new Promise(() => {})).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.promise);
            });
        });

        it("should return typeConstant.platformTypes.weakMap for WeakMap instance", () => {
            getValues(new WeakMap()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.weakMap);
            });
        });

        it("should return typeConstant.platformTypes.weakSet for WeakSet instance", () => {
            getValues(new WeakSet()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.weakSet);
            });
        });

        it("should return typeConstant.platformTypes.proxy for Proxy instance", () => {
            getValues(new Proxy({}, {})).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.object);
            });
        });

        it("should return typeConstant.platformTypes.dataView for DataView instance", () => {
            getValues(new DataView(new ArrayBuffer(10))).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.dataView);
            });
        });

        it("should return typeConstant.platformTypes.readableStream for ReadableStream instance", () => {
            getValues(new ReadableStream()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.readableStream);
            });
        });

        it("should return typeConstant.platformTypes.writableStream for WritableStream instance", () => {
            getValues(new WritableStream()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.writableStream);
            });
        });

        it("should return typeConstant.platformTypes.byteLengthQueuingStrategy for ByteLengthQueuingStrategy instance", () => {
            getValues(new ByteLengthQueuingStrategy({ highWaterMark: 1024 })).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.byteLengthQueuingStrategy);
            });
        });

        it("should return typeConstant.platformTypes.countQueuingStrategy for CountQueuingStrategy instance", () => {
            getValues(new CountQueuingStrategy({ highWaterMark: 10 })).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.countQueuingStrategy);
            });
        });

        it("should return typeConstant.platformTypes.transformStream for TransformStream instance", () => {
            getValues(new TransformStream()).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.transformStream);
            });
        });

        it("should return typeConstant.platformTypes.typeError for TypeError instance", () => {
            const error = new TypeError();
            const result = typeUtil.getPlatformType(error);
            assert.strictEqual(result, typeConstant.platformTypes.typeError);

            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.typeError);
            });
        });

        it("should return typeConstant.platformTypes.rangeError for RangeError instance", () => {
            const error = new RangeError();
            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.rangeError);
            });
        });

        it("should return typeConstant.platformTypes.syntaxError for SyntaxError instance", () => {
            const error = new SyntaxError();
            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.syntaxError);
            });
        });

        it("should return typeConstant.platformTypes.uriError for URIError instance", () => {
            const error = new URIError();
            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.uriError);
            });
        });

        it("should return typeConstant.platformTypes.referenceError for ReferenceError instance", () => {
            const error = new ReferenceError();
            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.referenceError);
            });
        });

        it("should return typeConstant.platformTypes.evalError for EvalError instance", () => {
            const error = new EvalError();
            getValues(error).forEach((result) => {
                assert.strictEqual(result, typeConstant.platformTypes.evalError);
            });
        });

        it("should throw an error when value is empty object", () => {
            assert.throws(
                () => {
                    typeUtil.dispatchPlatformTypeByRefData({}, []);
                },
                {
                    name: "Error",
                },
            );
        });

        it("should correctly dispatch platform type for primitive string", () => {
            let realityType;
            typeUtil.dispatchPlatformTypeByRefData(
                {
                    $ref: {
                        name: "test",
                    },
                    key: "name",
                },
                [
                    {
                        type: typeConstant.platformTypes.primitiveString,
                        callback: (type) => {
                            realityType = type;
                        },
                    },
                ],
            );
            assert.equal(realityType, typeConstant.platformTypes.primitiveString);
        });
        it("should handle parent object type in dispatching platform type", () => {
            let realityType;
            typeUtil.dispatchPlatformTypeByRefData(
                {
                    $ref: {
                        name: "2",
                    },
                    key: "name",
                },
                [
                    {
                        type: typeConstant.platformTypeGroups.parentObject,
                        callback: (type) => {
                            realityType = null;
                        },
                    },
                ],
                (type) => {
                    realityType = type;
                },
            );
            assert.equal(realityType, typeConstant.platformTypes.primitiveString);
        });
    });

    describe("test the typeUtil.dispatchPlatformType function", () => {
        it("should call callback function for matching type", () => {
            let checkValue;
            typeUtil.dispatchPlatformType(
                42,
                [
                    { type: typeConstant.platformTypes.primitiveNumber, callback: () => (checkValue = true) },
                    { type: typeConstant.platformTypes.primitiveString, callback: () => (checkValue = false) },
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
                        type: [typeConstant.platformTypes.primitiveSymbol, typeConstant.platformTypes.primitiveBigInt],
                        callback: () => (checkValue = true),
                    },
                    { type: typeConstant.platformTypes.primitiveString, callback: () => (checkValue = false) },
                ],
                () => (checkValue = false),
            );
            assert.strictEqual(checkValue, true);
        });

        it("should call otherCallback when no match is found", () => {
            let checkValue;
            typeUtil.dispatchPlatformType(
                null,
                [{ type: typeConstant.platformTypes.primitiveNumber, callback: () => (checkValue = true) }],
                () => (checkValue = false),
            );
            assert.strictEqual(checkValue, false);
        });

        it("should not call otherCallback when no match is found and otherCallback is not provided", () => {
            let checkValue;
            typeUtil.dispatchPlatformType(undefined, [
                { type: typeConstant.platformTypes.primitiveNumber, callback: () => (checkValue = true) },
            ]);
            assert.strictEqual(checkValue, undefined);
        });
    });

    describe("test the typeUtil.getJsonType or typeUtil.getJsonTypeByRefData function", () => {
        function getValues(val) {
            return [typeUtil.getJsonType(val), typeUtil.getJsonTypeByRefData({ $ref: { k: val }, key: "k" })];
        }
        it("should return typeConstant.jsonTypes.null for null input", () => {
            getValues(null).forEach((result) => {
                assert.strictEqual(result, typeConstant.jsonTypes.null);
            });
        });

        it("should return typeConstant.jsonTypes.undefined for undefined input", () => {
            getValues(undefined).forEach((result) => {
                assert.strictEqual(result, typeConstant.jsonTypes.undefined);
            });
        });

        it("should return typeConstant.jsonTypes.number when typeof value is 'bigint'", () => {
            getValues(10).forEach((result) => {
                assert.strictEqual(result, typeConstant.jsonTypes.number);
            });
        });

        it("should return typeConstant.jsonTypes.boolean when typeof value is 'boolean'", () => {
            [...getValues(true), ...getValues(false)].forEach((result) => {
                assert.strictEqual(result, typeConstant.jsonTypes.boolean);
            });
        });

        it("should return typeConstant.jsonTypes.string when typeof value is 'string'", () => {
            getValues("Hello").forEach((result) => {
                assert.strictEqual(result, typeConstant.jsonTypes.string);
            });
        });

        it("should return typeConstant.jsonTypes.object when typeof value is 'object'", () => {
            getValues({}).forEach((result) => {
                assert.strictEqual(result, typeConstant.jsonTypes.object);
            });
        });

        it("should return typeConstant.jsonTypes.array when typeof value is 'array'", () => {
            getValues([]).forEach((result) => {
                assert.strictEqual(result, typeConstant.jsonTypes.array);
            });
        });
    });

    describe("test the typeUtil.getTypeofType or typeUtil.getTypeofTypeByRefData function", () => {
        function getValues(val) {
            return [typeUtil.getTypeofType(val), typeUtil.getTypeofTypeByRefData({ $ref: { k: val }, key: "k" })];
        }
        it("should return typeConstant.typeofTypes.null for null input", () => {
            getValues(null).forEach((result) => {
                assert.strictEqual(result, typeConstant.typeofTypes.null);
            });
        });

        it("should return typeConstant.typeofTypes.undefined for undefined input", () => {
            getValues(undefined).forEach((result) => {
                assert.strictEqual(result, typeConstant.typeofTypes.undefined);
            });
        });

        it("should return typeConstant.typeofTypes.number when typeof value is 'bigint'", () => {
            getValues(10).forEach((result) => {
                assert.strictEqual(result, typeConstant.typeofTypes.number);
            });
        });

        it("should return typeConstant.typeofTypes.boolean when typeof value is 'boolean'", () => {
            [...getValues(true), ...getValues(false)].forEach((result) => {
                assert.strictEqual(result, typeConstant.typeofTypes.boolean);
            });
        });

        it("should return typeConstant.typeofTypes.string when typeof value is 'string'", () => {
            getValues("Hello").forEach((result) => {
                assert.strictEqual(result, typeConstant.typeofTypes.string);
            });
        });

        it("should return typeConstant.typeofTypes.object when typeof value is 'object'", () => {
            getValues({}).forEach((result) => {
                assert.strictEqual(result, typeConstant.typeofTypes.object);
            });
        });

        it("should return typeConstant.typeofTypes.array when typeof value is 'array'", () => {
            getValues([]).forEach((result) => {
                assert.strictEqual(result, typeConstant.typeofTypes.array);
            });
        });

        it("should return typeConstant.typeofTypes.function when typeof value is 'function'", () => {
            getValues(() => {}).forEach((result) => {
                assert.strictEqual(result, typeConstant.typeofTypes.function);
            });
        });

        it("should return typeConstant.typeofTypes.bigint when typeof value is 'bigint'", () => {
            getValues(BigInt(2)).forEach((result) => {
                assert.strictEqual(result, typeConstant.typeofTypes.bigint);
            });
        });

        it("should return typeConstant.typeofTypes.symbol when typeof value is 'symbol'", () => {
            getValues(Symbol("222")).forEach((result) => {
                assert.strictEqual(result, typeConstant.typeofTypes.symbol);
            });
        });
    });
});
