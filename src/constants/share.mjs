import {
    jsonTypes,
    platformTypes,
    typeofTypes,
    typeofTypeGroups,
    jsonTypeGroups,
    platformTypeGroups,
} from "./type.mjs";
import {
    jsonSchema$schemaVersionMap,
    jsonSchemaVersionGroups,
    jsonSchemaVersions,
    jsonSchema$schemaDraftMap,
} from "./version.mjs";
import {
    keys,
    ticks,
    pathKeys,
    defaultErrorMessages,
    flags,
    errorMessageKeys,
    contentEncodings,
    contentMediaTypes,
} from "./vocabulary-actuator.mjs";
import { states, phases } from "./context.mjs";

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
    jsonSchema$schemaDraftMap,
};
export const vocabularyActuatorConstant = {
    keys,
    ticks,
    pathKeys,
    defaultErrorMessages,
    flags,
    errorMessageKeys,
    contentEncodings,
    contentMediaTypes,
};
export const contextConstant = {
    states,
    phases,
};
