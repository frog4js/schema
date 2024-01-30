import { typeConstant } from "../constants/share.mjs";
import { platformType, typeofTypes } from "../constants/type.mjs";

const JsTypeMap = new Map([
    [Object.prototype, typeConstant.platformType.Object],
    [Set.prototype, typeConstant.platformType.Set],
    [Map.prototype, typeConstant.platformType.Map],
    [Date.prototype, typeConstant.platformType.Date],
    [RegExp.prototype, typeConstant.platformType.RegExp],
    [Promise.prototype, typeConstant.platformType.Promise],
    [WeakMap.prototype, typeConstant.platformType.WeakMap],
    [WeakSet.prototype, typeConstant.platformType.WeakSet],
    [DataView.prototype, typeConstant.platformType.DataView],
    [ReadableStream.prototype, typeConstant.platformType.ReadableStream],
    [WritableStream.prototype, typeConstant.platformType.WritableStream],
    [ByteLengthQueuingStrategy.prototype, typeConstant.platformType.ByteLengthQueuingStrategy],
    [CountQueuingStrategy.prototype, typeConstant.platformType.CountQueuingStrategy],
    [TransformStream.prototype, typeConstant.platformType.TransformStream],
    [Error.prototype, typeConstant.platformType.Error],
    [TypeError.prototype, typeConstant.platformType.TypeError],
    [RangeError.prototype, typeConstant.platformType.RangeError],
    [SyntaxError.prototype, typeConstant.platformType.SyntaxError],
    [URIError.prototype, typeConstant.platformType.URIError],
    [ReferenceError.prototype, typeConstant.platformType.ReferenceError],
    [EvalError.prototype, typeConstant.platformType.EvalError],
    [AggregateError.prototype, typeConstant.platformType.AggregateError],
    [Buffer.prototype, typeConstant.platformType.Buffer],
    [ArrayBuffer.prototype, typeConstant.platformType.ArrayBuffer],
    [SharedArrayBuffer.prototype, typeConstant.platformType.SharedArrayBuffer],
    [String.prototype, typeConstant.platformType.String],
    [Number.prototype, typeConstant.platformType.Number],
    [Boolean.prototype, typeConstant.platformType.Boolean],
    [BigInt.prototype, typeConstant.platformType.BigInt],
    [Symbol.prototype, typeConstant.platformType.Symbol],
    [Int8Array.prototype, typeConstant.platformType.Int8Array],
    [Uint8Array.prototype, typeConstant.platformType.Uint8Array],
    [Uint8ClampedArray.prototype, typeConstant.platformType.Uint8ClampedArray],
    [Int16Array.prototype, typeConstant.platformType.Int16Array],
    [Uint16Array.prototype, typeConstant.platformType.Uint16Array],
    [Int32Array.prototype, typeConstant.platformType.Int32Array],
    [Uint32Array.prototype, typeConstant.platformType.Uint32Array],
    [Float32Array.prototype, typeConstant.platformType.Float32Array],
    [Float64Array.prototype, typeConstant.platformType.Float64Array],
    [BigInt64Array.prototype, typeConstant.platformType.BigInt64Array],
    [BigUint64Array.prototype, typeConstant.platformType.BigUint64Array],
]);

/**
 * @typedef {* | {$ref: parent, key: string| number}} ValueOfRef
 */

const refKeys = {
    $ref: "$ref",
    key: "key",
};

/**
 * @param {ValueOfRef} [value] - The value to check.
 */
function isRef(value) {
    return typeof value === typeConstant.typeofTypes.object && refKeys.$ref in value && refKeys.key in value;
}

/**
 * Checks if a value is a number.
 *
 * @param {ValueOfRef} [value] - The value to check.
 * @throws {TypeError} If the input value is not a number type.
 */
function assertPrimitiveNumber(value) {
    if (isRef(value)) {
        if (typeof value[refKeys.$ref]?.[value[refKeys.key]] !== typeConstant.typeofTypes.number) {
            throw new TypeError(
                `Input value must be a number type, received ${typeof value[refKeys.$ref]?.[value[refKeys.key]]}`,
            );
        }
        return;
    }

    if (typeof value !== typeConstant.typeofTypes.number) {
        throw new TypeError(`Input value must be a number type, received ${typeof value}`);
    }
}

/**
 * Checks if a value is an array.
 *
 * @param {ValueOfRef} [value] - The value to check.
 * @throws {TypeError} If the input value is not an array type.
 */
function assertPrimitiveArray(value) {
    if (isRef(value)) {
        if (!Array.isArray(value[refKeys.$ref]?.[value[refKeys.key]])) {
            throw new TypeError(
                `Input value must be an array type, received ${typeof value[refKeys.$ref]?.[value[refKeys.key]]}`,
            );
        }
        return;
    }
    if (!Array.isArray(value)) {
        throw new TypeError(`Input value must be an array type, received ${typeof value}`);
    }
}

/**
 * Checks if a value is an object.
 *
 * @param {ValueOfRef} [value] - The value to check.
 * @throws {TypeError} If the input value is not an object type.
 */
function assertObject(value) {
    if (isRef(value)) {
        if (
            typeof value[refKeys.$ref]?.[value[refKeys.key]] !== typeConstant.typeofTypes.object ||
            value[refKeys.$ref]?.[value[refKeys.key]] === null ||
            Array.isArray(value[refKeys.$ref]?.[value[refKeys.key]])
        ) {
            throw new TypeError(
                `Input value must be an object type, received ${
                    Array.isArray(value[refKeys.$ref]?.[value[refKeys.key]])
                        ? "array"
                        : typeof value[refKeys.$ref]?.[value[refKeys.key]]
                }`,
            );
        }
        return;
    }
    if (typeof value !== typeConstant.typeofTypes.object || value === null || Array.isArray(value)) {
        throw new TypeError(
            `Input value must be an object type, received ${Array.isArray(value) ? "array" : typeof value}`,
        );
    }
}

/**
 * Checks if a value is a boolean.
 *
 * @param {ValueOfRef} [value] - The value to check.
 * @throws {TypeError} If the input value is not a boolean type.
 */
function assertPrimitiveBoolean(value) {
    if (isRef(value)) {
        if (typeof value[refKeys.$ref]?.[value[refKeys.key]] !== typeConstant.typeofTypes.boolean) {
            throw new TypeError(
                `Input value must be a boolean type, received ${typeof value[refKeys.$ref]?.[value[refKeys.key]]}`,
            );
        }
        return;
    }
    if (typeof value !== typeConstant.typeofTypes.boolean) {
        throw new TypeError(`Input value must be a boolean type, received ${typeof value}`);
    }
}

/**
 * Checks if a value is a string.
 *
 * @param {ValueOfRef} [value] - The value to check.
 * @throws {TypeError} If the input value is not a string type.
 */
function assertPrimitiveString(value) {
    if (isRef(value)) {
        if (typeof value[refKeys.$ref]?.[value[refKeys.key]] !== typeConstant.typeofTypes.string) {
            throw new TypeError(
                `Input value must be a string type, received ${typeof value[refKeys.$ref]?.[value[refKeys.key]]}`,
            );
        }
        return;
    }
    if (typeof value !== typeConstant.typeofTypes.string) {
        throw new TypeError(`Input value must be a string type, received ${typeof value}`);
    }
}

/**
 * Checks if a value is a symbol.
 *
 * @param {ValueOfRef} [value] - The value to check.
 * @throws {TypeError} If the input value is not a string type.
 */
function assertPrimitiveSymbol(value) {
    if (isRef(value)) {
        if (typeof value[refKeys.$ref]?.[value[refKeys.key]] !== typeConstant.typeofTypes.symbol) {
            throw new TypeError(
                `Input value must be a symbol type, received ${typeof value[refKeys.$ref]?.[value[refKeys.key]]}`,
            );
        }
        return;
    }
    if (typeof value !== typeConstant.typeofTypes.symbol) {
        throw new TypeError(`Input value must be a symbol type, received ${typeof value}`);
    }
}

/**
 * Checks if a value is a bigint.
 *
 * @param {ValueOfRef} [value] - The value to check.
 * @throws {TypeError} If the input value is not a string type.
 */
function assertPrimitiveBigint(value) {
    if (isRef(value)) {
        if (typeof value[refKeys.$ref]?.[value[refKeys.key]] !== typeConstant.typeofTypes.bigint) {
            throw new TypeError(
                `Input value must be a bigint type, received ${typeof value[refKeys.$ref]?.[value[refKeys.key]]}`,
            );
        }
        return;
    }
    if (typeof value !== typeConstant.typeofTypes.bigint) {
        throw new TypeError(`Input value must be a bigint type, received ${typeof value}`);
    }
}

function getPrototypes(prototype) {
    const prototypes = [];
    while (true) {
        prototype = Object.getPrototypeOf(prototype);
        prototypes.push(prototype);
        if (prototype === Object.prototype) {
            break;
        }
    }
    return prototypes;
}
function getJsonType(value) {}
function getJsonTypeByRefData(value) {
    if (value.$ref?.[value.key] === null) {
        return typeConstant.jsonTypes.null;
    }
    if (value.$ref?.[value.key] === undefined) {
        return typeConstant.jsonTypes.undefined;
    }
    if (Array.isArray(value.$ref?.[value.key])) {
        return typeConstant.jsonTypes.array;
    }
    switch (typeof value.$ref?.[value.key]) {
        case typeConstant.typeofTypes.number:
            return typeConstant.jsonTypes.number;
        case typeConstant.typeofTypes.boolean:
            return typeConstant.jsonTypes.boolean;
        case typeConstant.typeofTypes.string:
            return typeConstant.jsonTypes.string;
        case typeConstant.typeofTypes.object:
            return typeConstant.jsonTypes.object;
    }
    return typeConstant.jsonTypes.object;
}

function getTypeofTypesByRefData(value) {
    if (value.$ref?.[value.key] === null) {
        return typeConstant.typeofTypes.null;
    }
    if (value.$ref?.[value.key] === undefined) {
        return typeConstant.typeofTypes.undefined;
    }
    if (Array.isArray(value.$ref?.[value.key])) {
        return typeConstant.typeofTypes.array;
    }
    switch (typeof value.$ref?.[value.key]) {
        case typeConstant.typeofTypes.number:
            return typeConstant.typeofTypes.number;
        case typeConstant.typeofTypes.boolean:
            return typeConstant.typeofTypes.boolean;
        case typeConstant.typeofTypes.string:
            return typeConstant.typeofTypes.string;
        case typeConstant.typeofTypes.symbol:
            return typeConstant.typeofTypes.symbol;
        case typeConstant.typeofTypes.bigint:
            return typeConstant.typeofTypes.bigint;
        case typeConstant.typeofTypes.function:
            return typeConstant.typeofTypes.function;
        case typeConstant.typeofTypes.object:
            return typeConstant.typeofTypes.object;
    }
    return typeConstant.jsonTypes.object;
}
/**
 *
 * @param {*} value
 * @return {JsType}
 */
function getPlatformType(value) {
    if (value === null) {
        return typeConstant.platformType.Null;
    }
    if (value === undefined) {
        return typeConstant.platformType.Undefined;
    }
    switch (typeof value) {
        case typeConstant.typeofTypes.bigint:
            return typeConstant.platformType.PrimitiveBigInt;
        case typeConstant.typeofTypes.number:
            return typeConstant.platformType.PrimitiveNumber;
        case typeConstant.typeofTypes.boolean:
            return typeConstant.platformType.PrimitiveBoolean;
        case typeConstant.typeofTypes.string:
            return typeConstant.platformType.PrimitiveString;
        case typeConstant.typeofTypes.symbol:
            return typeConstant.platformType.PrimitiveSymbol;
        case typeConstant.typeofTypes.function:
            if (value.constructor.name === "AsyncFunction") {
                return typeConstant.platformType.AsyncFunction;
            }
            if (value.constructor.name === "GeneratorFunction") {
                return typeConstant.platformType.GeneratorFunction;
            }
            return typeConstant.platformType.Function;
    }
    if (isRef(value)) {
        return typeConstant.platformType.RefData;
    }
    if (value.constructor === Object) {
        return typeConstant.platformType.Object;
    }
    if (Array.isArray(value)) {
        return typeConstant.platformType.Array;
    }
    const prototypes = getPrototypes(value);
    for (const prototype of prototypes) {
        const mapValue = JsTypeMap.get(prototype);
        if (mapValue) {
            return mapValue;
        }
    }

    return typeConstant.platformType.Object;
}

/**
 *
 * @param {*} value
 * @return {JsType}
 */
function getPlatformTypeByRefData(value) {
    if (value[refKeys.$ref]?.[value[refKeys.key]] === null) {
        return typeConstant.platformType.Null;
    }
    if (value[refKeys.$ref]?.[value[refKeys.key]] === undefined) {
        return typeConstant.platformType.Undefined;
    }
    switch (typeof value[refKeys.$ref]?.[value[refKeys.key]]) {
        case typeConstant.typeofTypes.bigint:
            return typeConstant.platformType.PrimitiveBigInt;
        case typeConstant.typeofTypes.number:
            return typeConstant.platformType.PrimitiveNumber;
        case typeConstant.typeofTypes.boolean:
            return typeConstant.platformType.PrimitiveBoolean;
        case typeConstant.typeofTypes.string:
            return typeConstant.platformType.PrimitiveString;
        case typeConstant.typeofTypes.symbol:
            return typeConstant.platformType.PrimitiveSymbol;
        case typeConstant.typeofTypes.function:
            if (value[refKeys.$ref]?.[value[refKeys.key]].constructor.name === "AsyncFunction") {
                return typeConstant.platformType.AsyncFunction;
            }
            if (value[refKeys.$ref]?.[value[refKeys.key]].constructor.name === "GeneratorFunction") {
                return typeConstant.platformType.GeneratorFunction;
            }
            return typeConstant.platformType.Function;
    }
    if (isRef(value[refKeys.$ref]?.[value[refKeys.key]])) {
        return typeConstant.platformType.RefData;
    }
    if (value[refKeys.$ref]?.[value[refKeys.key]].constructor === Object) {
        return typeConstant.platformType.Object;
    }
    if (Array.isArray(value[refKeys.$ref]?.[value[refKeys.key]])) {
        return typeConstant.platformType.Array;
    }
    const prototypes = getPrototypes(value[refKeys.$ref]?.[value[refKeys.key]]);
    for (const prototype of prototypes) {
        const mapValue = JsTypeMap.get(prototype);
        if (mapValue) {
            return mapValue;
        }
    }

    return typeConstant.platformType.Object;
}
/**
 *
 * @param {*} value
 * @param {Array<{type: Array<JsType> | JsType, callback: function}>} rules
 * @param {function} [otherCallback]
 */
function dispatchPlatformType(value, rules, otherCallback) {
    let isMatch = false;
    const jsType = getPlatformType(value);
    for (let rule of rules) {
        if (jsType === rule.type) {
            isMatch = true;
            rule.callback(jsType);
        }
        if (Array.isArray(rule.type) && rule.type.includes(jsType)) {
            isMatch = true;
            rule.callback(jsType);
        }
    }
    if (!isMatch && otherCallback) {
        otherCallback(jsType);
    }
}
const otherTypeMap = {
    [platformType.NullOrUndefined]: [platformType.Null, platformType.Undefined],
    [platformType.Primitive]: [
        platformType.PrimitiveNumber,
        platformType.PrimitiveBoolean,
        platformType.PrimitiveString,
        platformType.PrimitiveBigInt,
        platformType.PrimitiveSymbol,
    ],
    [platformType.Primitive]: [platformType.Object],
    [platformType.ChildObject]: Object.values(platformType).filter(
        (v) =>
            ![
                platformType.Null,
                platformType.Undefined,
                platformType.Object,
                platformType.PrimitiveNumber,
                platformType.PrimitiveBoolean,
                platformType.PrimitiveString,
                platformType.PrimitiveBigInt,
                platformType.PrimitiveSymbol,
            ].includes(v),
    ),
};
/**
 *
 * @param {*} value
 * @param {Array<{type: Array<JsType> | JsType, callback: function}>} rules
 * @param {function} [otherCallback]
 */
function dispatchPlatformTypeByRefData(value, rules, otherCallback) {
    let isMatch = false;
    if (!isRef(value)) {
        throw new Error("value is invalid");
    }
    const jsType = getPlatformTypeByRefData(value);
    for (let rule of rules) {
        if (Array.isArray(rule.type)) {
            if (rule.type.includes(jsType)) {
                isMatch = true;
                rule.callback(jsType);
            }
        } else if (typeof rule.type === typeofTypes.string) {
            if (jsType === rule.type) {
                isMatch = true;
                rule.callback(jsType);
            } else if (otherTypeMap[rule.type]?.includes(rule.type)) {
                isMatch = true;
                rule.callback(jsType);
            }
        }
    }
    if (!isMatch && otherCallback) {
        otherCallback(jsType);
    }
}

export {
    assertPrimitiveString,
    assertPrimitiveNumber,
    assertObject,
    assertPrimitiveBoolean,
    assertPrimitiveArray,
    getPlatformType,
    getPlatformTypeByRefData,
    dispatchPlatformType,
    dispatchPlatformTypeByRefData,
    getJsonTypeByRefData,
    getTypeofTypesByRefData,
};
