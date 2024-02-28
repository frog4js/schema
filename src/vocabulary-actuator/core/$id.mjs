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
        key: vocabularyActuatorConstant.keys.$id,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
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
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    const originId = context.instanceData.current.$ref[context.instanceData.current.key];

                    Object.defineProperty(
                        context.instanceData.current.$ref,
                        vocabularyActuatorConstant.flags.originId,
                        {
                            value: originId,
                            enumerable: false,
                        },
                    );
                    const id = urlUtil.calculateId(originId, context.defaultConfig.baseURI);
                    if (!id) {
                        errorManage.pushError(context);
                    } else {
                        context.instanceData.current.$ref[context.instanceData.current.key] = id;
                        context.referenceSchemas[id] = context.instanceData.origin;
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
