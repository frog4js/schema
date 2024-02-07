import { executeConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
/**
 * @typedef {import("../../../types/share").JSONSchema.VocabularyActuatorConfig} VocabularyActuatorConfig
 */
/**
 * @type {VocabularyActuatorConfig[]}
 */
export default [
    {
        key: executeConstant.keys.id,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: -19,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    const url = new URL(
                        context.instanceData.current.$ref[context.instanceData.current.key],
                        context.defaultConfig.baseURI,
                    );
                    context.instanceData.current.$ref[context.instanceData.current.key] = url.href;
                    context.cacheReferenceSchemas[url.href] = context.instanceData.origin;
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
