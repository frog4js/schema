import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { urlUtil } from "../../util/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { contextManage } from "../../context/share.mjs";

/**
 * @typedef import("../../types/share")
 */

/**
 *
 * @param {Context} context
 */
function resolveId(context) {
    const originId = context.instanceData.current.$ref[context.instanceData.current.key];
    if (!context.instanceData.current.$ref[vocabularyActuatorConstant.flags.originId]) {
        Object.defineProperty(context.instanceData.current.$ref, vocabularyActuatorConstant.flags.originId, {
            value: originId,
            enumerable: false,
        });
    }

    /**
     * @type {string}
     */
    let parentId;
    let level = 0;
    let max = context.instancePaths.length;
    while (true) {
        parentId = contextManage.getCache(context, vocabularyActuatorConstant.keys.$id, undefined, level);
        if (parentId) {
            break;
        }
        if (level >= max) {
            break;
        }
        level++;
    }
    if (!parentId) {
        parentId = context.defaultConfig.baseURI;
    }
    const id = urlUtil.calculateId(originId, parentId);
    if (!id) {
        errorManage.pushError(context);
    } else {
        context.instanceData.current.$ref[context.instanceData.current.key] = id;
        context.referenceSchemas[id] = context.instanceData.current.$ref;
        contextManage.setCache(context, vocabularyActuatorConstant.keys.$id, id, undefined, 1);
    }
}
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
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
        index: -20.1,
        matches: [
            {
                instanceTypes: [typeConstant.jsonTypes.string],
                resolve: (context) => {
                    resolveId(context);
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
    {
        key: vocabularyActuatorConstant.keys.$id,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: -20.2,
        matches: [
            {
                instanceTypes: [typeConstant.jsonTypes.string],
                resolve: (context) => {
                    resolveId(context);
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
