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
import { deepClone, clone, toString, fastDeepHasDuplicates } from "./data-operate.mjs";
import { findFiles } from "./file.mjs";
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
};
export const fileUtil = {
    findFiles,
};
