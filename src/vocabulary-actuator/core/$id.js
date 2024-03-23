import { vocabularyActuatorConstant, typeConstant, versionConstant } from "../../constants/share.js";
import { dataOperateUtil, randomUtil, urlUtil } from "../../util/share.js";
import { errorManage } from "../../error/share.js";
import { getPseudoRandomString } from "../../util/random.js";
/**
 * @typedef {import("../../../types/share")}
 */
/**
 * @type {VocabularyActuatorConfig[]}
 */
export default [
    {
        key: vocabularyActuatorConstant.keys.id,
        versions: [
            versionConstant.jsonSchemaVersions.draft01,
            versionConstant.jsonSchemaVersions.draft02,
            versionConstant.jsonSchemaVersions.draft03,
            versionConstant.jsonSchemaVersions.draft04,
            versionConstant.jsonSchemaVersions.draft05,
        ],
        index: -19.1,
        matches: [
            {
                instanceTypes: typeConstant.typeofTypeGroups.empty,
                resolve: (context) => {
                    context.instanceData.current.$ref[context.instanceData.current.key] =
                        context.schemaParamId || randomUtil.getPseudoRandomString();
                    return vocabularyActuatorConstant.ticks.nextMatch;
                },
            },
        ],
    },
    {
        key: vocabularyActuatorConstant.keys.$id,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: -19.2,
        matches: [
            {
                instanceTypes: typeConstant.typeofTypeGroups.empty,
                resolve: (context) => {
                    context.instanceData.current.$ref[context.instanceData.current.key] =
                        context.schemaParamId || randomUtil.getPseudoRandomString();
                    return vocabularyActuatorConstant.ticks.nextMatch;
                },
            },
        ],
    },
];
