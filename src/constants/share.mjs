import { jsonTypes, platformType, typeofTypes, typeofTypeGroups, jsonTypeGroups } from "./type.mjs";
import { jsonSchemaVersion } from "./version.mjs";
import { keys, ticks, pathKeys, errorCodes } from "./execute.mjs";

export const typeConstant = {
    jsonTypes,
    platformType,
    typeofTypes,
    typeofTypeGroups,
    jsonTypeGroups,
};
export const versionConstant = {
    jsonSchemaVersion,
};
export const executeConstant = {
    keys,
    ticks,
    pathKeys,
    errorCodes,
};
