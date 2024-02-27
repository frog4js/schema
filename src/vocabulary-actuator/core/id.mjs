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
        ],
        index: -19,
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
