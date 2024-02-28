import { typeConstant } from "../constants/share.mjs";

const platformTypeMap = new Map([
    [Object.prototype, typeConstant.platformTypes.object],
    [Set.prototype, typeConstant.platformTypes.set],
    [Map.prototype, typeConstant.platformTypes.map],
    [Date.prototype, typeConstant.platformTypes.date],
    [RegExp.prototype, typeConstant.platformTypes.regExp],
    [Promise.prototype, typeConstant.platformTypes.promise],
    [WeakMap.prototype, typeConstant.platformTypes.weakMap],
    [WeakSet.prototype, typeConstant.platformTypes.weakSet],
    [DataView.prototype, typeConstant.platformTypes.dataView],
    [ReadableStream.prototype, typeConstant.platformTypes.readableStream],
    [WritableStream.prototype, typeConstant.platformTypes.writableStream],
    [ByteLengthQueuingStrategy.prototype, typeConstant.platformTypes.byteLengthQueuingStrategy],
    [CountQueuingStrategy.prototype, typeConstant.platformTypes.countQueuingStrategy],
    [TransformStream.prototype, typeConstant.platformTypes.transformStream],
    [Error.prototype, typeConstant.platformTypes.error],
    [TypeError.prototype, typeConstant.platformTypes.typeError],
    [RangeError.prototype, typeConstant.platformTypes.rangeError],
    [SyntaxError.prototype, typeConstant.platformTypes.syntaxError],
    [URIError.prototype, typeConstant.platformTypes.uriError],
    [ReferenceError.prototype, typeConstant.platformTypes.referenceError],
    [EvalError.prototype, typeConstant.platformTypes.evalError],
    [AggregateError.prototype, typeConstant.platformTypes.aggregateError],
    [Buffer.prototype, typeConstant.platformTypes.buffer],
    [ArrayBuffer.prototype, typeConstant.platformTypes.arrayBuffer],
    [SharedArrayBuffer.prototype, typeConstant.platformTypes.sharedArrayBuffer],
    [String.prototype, typeConstant.platformTypes.string],
    [Number.prototype, typeConstant.platformTypes.number],
    [Boolean.prototype, typeConstant.platformTypes.boolean],
    [BigInt.prototype, typeConstant.platformTypes.bigInt],
    [Symbol.prototype, typeConstant.platformTypes.symbol],
    [Int8Array.prototype, typeConstant.platformTypes.int8Array],
    [Uint8Array.prototype, typeConstant.platformTypes.uint8Array],
    [Uint8ClampedArray.prototype, typeConstant.platformTypes.uint8ClampedArray],
    [Int16Array.prototype, typeConstant.platformTypes.int16Array],
    [Uint16Array.prototype, typeConstant.platformTypes.uint16Array],
    [Int32Array.prototype, typeConstant.platformTypes.int32Array],
    [Uint32Array.prototype, typeConstant.platformTypes.uint32Array],
    [Float32Array.prototype, typeConstant.platformTypes.float32Array],
    [Float64Array.prototype, typeConstant.platformTypes.float64Array],
    [BigInt64Array.prototype, typeConstant.platformTypes.bigInt64Array],
    [BigUint64Array.prototype, typeConstant.platformTypes.bigUint64Array],
]);

/**
 * @param {ValueOfRef} [value] - The value to check.
 */
function isRef(value) {
    return typeof value === typeConstant.typeofTypes.object && "$ref" in value && "key" in value;
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
/**
 *
 * @param {*} value
 * @return {string}
 */
function getJsonType(value) {
    if (value === null) {
        return typeConstant.jsonTypes.null;
    }
    if (value === undefined) {
        return typeConstant.jsonTypes.undefined;
    }
    if (Array.isArray(value)) {
        return typeConstant.jsonTypes.array;
    }
    switch (typeof value) {
        case typeConstant.typeofTypes.number:
            return typeConstant.jsonTypes.number;
        case typeConstant.typeofTypes.boolean:
            return typeConstant.jsonTypes.boolean;
        case typeConstant.typeofTypes.string:
            return typeConstant.jsonTypes.string;
    }
    return typeConstant.jsonTypes.object;
}

/**
 *
 * @param {RefData} value
 * @return {string}
 */
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
    }
    return typeConstant.jsonTypes.object;
}

/**
 *
 * @param {*} value
 * @return {string}
 */
function getTypeofType(value) {
    if (value === null) {
        return typeConstant.typeofTypes.null;
    }
    if (value === undefined) {
        return typeConstant.typeofTypes.undefined;
    }
    if (Array.isArray(value)) {
        return typeConstant.typeofTypes.array;
    }
    switch (typeof value) {
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
    }
    return typeConstant.jsonTypes.object;
}

/**
 *
 * @param {*} value
 * @return {string}
 */
function getTypeofTypeByRefData(value) {
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
    }
    return typeConstant.jsonTypes.object;
}

/**
 *
 * @param {*} value
 * @return {number}
 */
function getPlatformType(value) {
    if (value === null) {
        return typeConstant.platformTypes.null;
    }
    if (value === undefined) {
        return typeConstant.platformTypes.undefined;
    }
    switch (typeof value) {
        case typeConstant.typeofTypes.bigint:
            return typeConstant.platformTypes.primitiveBigInt;
        case typeConstant.typeofTypes.number:
            return typeConstant.platformTypes.primitiveNumber;
        case typeConstant.typeofTypes.boolean:
            return typeConstant.platformTypes.primitiveBoolean;
        case typeConstant.typeofTypes.string:
            return typeConstant.platformTypes.primitiveString;
        case typeConstant.typeofTypes.symbol:
            return typeConstant.platformTypes.primitiveSymbol;
        case typeConstant.typeofTypes.function:
            if (value.constructor.name === "AsyncFunction") {
                return typeConstant.platformTypes.asyncFunction;
            }
            if (value.constructor.name === "GeneratorFunction") {
                return typeConstant.platformTypes.generatorFunction;
            }
            return typeConstant.platformTypes.function;
    }
    if (value.constructor === Object) {
        return typeConstant.platformTypes.object;
    }
    if (Array.isArray(value)) {
        return typeConstant.platformTypes.array;
    }
    const prototypes = getPrototypes(value);
    let result = null;
    for (const prototype of prototypes) {
        const mapValue = platformTypeMap.get(prototype);
        if (mapValue) {
            result = mapValue;
            break;
        }
    }
    return result || typeConstant.platformTypes.object;
}

/**
 *
 * @param {RefData} value
 * @return {number}
 */
function getPlatformTypeByRefData(value) {
    if (value.$ref?.[value.key] === null) {
        return typeConstant.platformTypes.null;
    }
    if (value.$ref?.[value.key] === undefined) {
        return typeConstant.platformTypes.undefined;
    }
    switch (typeof value.$ref?.[value.key]) {
        case typeConstant.typeofTypes.bigint:
            return typeConstant.platformTypes.primitiveBigInt;
        case typeConstant.typeofTypes.number:
            return typeConstant.platformTypes.primitiveNumber;
        case typeConstant.typeofTypes.boolean:
            return typeConstant.platformTypes.primitiveBoolean;
        case typeConstant.typeofTypes.string:
            return typeConstant.platformTypes.primitiveString;
        case typeConstant.typeofTypes.symbol:
            return typeConstant.platformTypes.primitiveSymbol;
        case typeConstant.typeofTypes.function:
            if (value.$ref?.[value.key].constructor.name === "AsyncFunction") {
                return typeConstant.platformTypes.asyncFunction;
            }
            if (value.$ref?.[value.key].constructor.name === "GeneratorFunction") {
                return typeConstant.platformTypes.generatorFunction;
            }
            return typeConstant.platformTypes.function;
    }
    if (value.$ref?.[value.key].constructor === Object) {
        return typeConstant.platformTypes.object;
    }
    if (Array.isArray(value.$ref?.[value.key])) {
        return typeConstant.platformTypes.array;
    }
    const prototypes = getPrototypes(value.$ref?.[value.key]);
    let result = null;
    for (const prototype of prototypes) {
        const mapValue = platformTypeMap.get(prototype);
        if (mapValue) {
            result = mapValue;
            break;
        }
    }

    return result || typeConstant.platformTypes.object;
}

/**
 *
 * @param {*} value
 * @param {Array<{type: Array<number> | number, callback: function}>} rules
 * @param {function} [otherCallback]
 */
function dispatchPlatformType(value, rules, otherCallback) {
    let isMatch = false;
    const platformType = getPlatformType(value);
    for (let rule of rules) {
        if (platformType === rule.type) {
            isMatch = true;
            rule.callback(platformType);
        }
        if (Array.isArray(rule.type) && rule.type.includes(platformType)) {
            isMatch = true;
            rule.callback(platformType);
        }
    }
    if (!isMatch && otherCallback) {
        otherCallback(platformType);
    }
}

/**
 *
 * @param {*} value
 * @param {Array<{type: Array<number> | number, callback: function}>} rules
 * @param {function} [otherCallback]
 */
function dispatchPlatformTypeByRefData(value, rules, otherCallback) {
    let isMatch = false;
    if (!isRef(value)) {
        throw new Error("value is invalid");
    }
    const platformType = getPlatformTypeByRefData(value);
    for (let rule of rules) {
        if (Array.isArray(rule.type)) {
            if (rule.type.includes(platformType)) {
                isMatch = true;
                rule.callback(platformType);
            }
        } else if (platformType === rule.type) {
            isMatch = true;
            rule.callback(platformType);
        }
    }
    if (!isMatch && otherCallback) {
        otherCallback(platformType);
    }
}

export {
    getPlatformType,
    getPlatformTypeByRefData,
    dispatchPlatformType,
    dispatchPlatformTypeByRefData,
    getJsonType,
    getJsonTypeByRefData,
    getTypeofType,
    getTypeofTypeByRefData,
};
