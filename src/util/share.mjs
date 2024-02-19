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
} from "./data-operate.mjs";
import { getUUID } from "./random.mjs";
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
};

export const randomUtil = {
    getUUID,
};
