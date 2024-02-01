import {
    jsonTypes,
    platformTypes,
    typeofTypes,
    typeofTypeGroups,
    jsonTypeGroups,
    platformTypeGroups,
} from "./type.mjs";
import { jsonSchemaVersion } from "./version.mjs";
import { keys, ticks, pathKeys, errorCodes } from "./execute.mjs";

export const typeConstant = {
    jsonTypes,
    platformTypes,
    typeofTypes,
    typeofTypeGroups,
    jsonTypeGroups,
    platformTypeGroups,
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
