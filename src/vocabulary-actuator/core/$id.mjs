import { vocabularyActuatorConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
import { dataOperateUtil, randomUtil, urlUtil } from "../../util/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { getPseudoRandomString } from "../../util/random.mjs";
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
            versionConstant.jsonSchemaVersions.draft06,
        ],
        index: -19.1,
        matches: [
            {
                instanceTypes: typeConstant.typeofTypeGroups.empty,
                resolve: (context) => {
                    context.instanceData.current.$ref[context.instanceData.current.key] =
                        randomUtil.getPseudoRandomString();
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
                        randomUtil.getPseudoRandomString();
                    return vocabularyActuatorConstant.ticks.nextMatch;
                },
            },
        ],
    },
];
