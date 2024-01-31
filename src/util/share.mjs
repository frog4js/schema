import {
    assertObject,
    assertPrimitiveArray,
    assertPrimitiveBoolean,
    assertPrimitiveNumber,
    assertPrimitiveString,
    dispatchPlatformType,
    dispatchPlatformTypeByRefData,
    getPlatformType,
    getPlatformTypeByRefData,
    getJsonTypeByRefData,
    getTypeofTypesByRefData,
} from "./type.mjs";
import { deepClone, clone, toString } from "./data-operate.mjs";
export const typeUtil = {
    assertObject,
    assertPrimitiveBoolean,
    assertPrimitiveArray,
    assertPrimitiveString,
    assertPrimitiveNumber,
    getPlatformType,
    getPlatformTypeByRefData,
    dispatchPlatformType,
    dispatchPlatformTypeByRefData,
    getJsonTypeByRefData,
    getTypeofTypesByRefData,
};

export const dataOperateUtil = {
    deepClone,
    clone,
    toString,
};
