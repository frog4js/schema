import {
    jsonTypes,
    platformTypes,
    typeofTypes,
    typeofTypeGroups,
    jsonTypeGroups,
    platformTypeGroups,
} from "./type.mjs";
import { jsonSchema$schemaVersionMap, jsonSchemaVersionGroups, jsonSchemaVersions } from "./version.mjs";
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
    jsonSchemaVersions,
    jsonSchemaVersionGroups,
    jsonSchema$schemaVersionMap,
};
export const executeConstant = {
    keys,
    ticks,
    pathKeys,
    errorCodes,
};
