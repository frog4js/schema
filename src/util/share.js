import {
    getPlatformType,
    getPlatformTypeByRefData,
    dispatchPlatformType,
    dispatchPlatformTypeByRefData,
    getJsonType,
    getJsonTypeByRefData,
    getTypeofTypeByRefData,
    getTypeofType,
} from "./type.js";
import {
    deepClone,
    clone,
    toString,
    fastDeepHasDuplicates,
    getValueByJsonPointer,
    getPathsByJsonPointer,
    getPathsByRef,
    merge,
    compareToArray,
    fastDeepEqual,
    fastDeepIncludes,
} from "./data-operate.js";
import { getPseudoRandomString } from "./random.js";
import { calculateId, calculateIdAndPointer } from "./url.js";
export const typeUtil = {
    getPlatformType,
    getPlatformTypeByRefData,
    dispatchPlatformType,
    dispatchPlatformTypeByRefData,
    getJsonType,
    getJsonTypeByRefData,
    getTypeofTypeByRefData,
    getTypeofType,
};

export const dataOperateUtil = {
    deepClone,
    clone,
    toString,
    fastDeepHasDuplicates,
    getValueByJsonPointer,
    getPathsByJsonPointer,
    getPathsByRef,
    merge,
    compareToArray,
    fastDeepEqual,
    fastDeepIncludes,
};

export const randomUtil = {
    getPseudoRandomString,
};

export const urlUtil = {
    calculateId,
    calculateIdAndPointer,
};
