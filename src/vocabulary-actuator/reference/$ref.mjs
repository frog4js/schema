import { executeConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
/**
 * @typedef {import("../../../types/share").JSONSchema.VocabularyActuatorConfig} VocabularyActuatorConfig
 */
/**
 * @type {VocabularyActuatorConfig[]}
 */
export default [
    {
        key: executeConstant.keys.$ref,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: -10,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
