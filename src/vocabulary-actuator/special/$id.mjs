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

    const paths = [...context.instancePaths];
    /**
     * @type {string}
     */
    let parentId;
    while (true) {
        parentId = contextManage.getCache(context, vocabularyActuatorConstant.keys.$id, paths);
        if (parentId) {
            break;
        }
        if (paths.length === 0) {
            break;
        }
        paths.pop();
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
        const setPaths = [...context.instancePaths];
        setPaths.pop();
        contextManage.setCache(context, vocabularyActuatorConstant.keys.$id, id, setPaths);
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
