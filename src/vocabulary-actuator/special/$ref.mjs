import { vocabularyActuatorConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
/**
 * @typedef {import("../../../types/share").JSONSchema.VocabularyActuatorConfig} VocabularyActuatorConfig
 */
/**
 * @type {VocabularyActuatorConfig[]}
 */
export default [
    {
        key: vocabularyActuatorConstant.keys.$ref,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: -10,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    context.waitValidateRefs.push({
                        $ref: context.instanceData.current.$ref[context.instanceData.current.key],
                        schema: context.instanceData.origin,
                    });
                },
            },
        ],
    },
];
