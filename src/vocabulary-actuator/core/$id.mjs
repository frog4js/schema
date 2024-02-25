import { vocabularyActuatorConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
import { dataOperateUtil, randomUtil } from "../../util/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 * @typedef {import("../../../types/share")}
 */
/**
 * @type {VocabularyActuatorConfig[]}
 */
export default [
    {
        key: vocabularyActuatorConstant.keys.$id,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: -18,
        matches: [
            {
                instanceTypes: typeConstant.typeofTypeGroups.empty,
                resolve: (context) => {
                    context.instanceData.current.$ref[context.instanceData.current.key] = randomUtil.getUUID() + "#";
                    return vocabularyActuatorConstant.ticks.nextMatch;
                },
            },
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    const url = new URL(
                        context.instanceData.current.$ref[context.instanceData.current.key],
                        context.defaultConfig.baseURI,
                    );
                    if (url.hash !== "" || url.href[url.href.length - 1] !== vocabularyActuatorConstant.pathKeys.self) {
                        errorManage.pushError(context);
                    } else {
                        context.instanceData.current.$ref[context.instanceData.current.key] = url.href;
                        context.referenceSchemas[url.href] = context.instanceData.origin;
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
