import {
    getPlatformType,
    getPlatformTypeByRefData,
    dispatchPlatformType,
    dispatchPlatformTypeByRefData,
    getJsonType,
    getJsonTypeByRefData,
    getTypeofTypeByRefData,
    getTypeofType,
} from "./type.mjs";
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
} from "./data-operate.mjs";
import { getPseudoRandomString } from "./random.mjs";
import { calculateId, calculateIdAndPointer } from "./url.mjs";
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
