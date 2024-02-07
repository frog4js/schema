import { executeConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
import { schemaManage } from "../../schema/share.mjs";
/**
 * @typedef {import("../../../types/share").JSONSchema.VocabularyActuatorConfig} VocabularyActuatorConfig
 */
/**
 * @type {VocabularyActuatorConfig[]}
 */
export default [
    {
        key: executeConstant.keys.$schema,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: -20,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context, { enterContext, backContext }) => {
                    const metaSchema = schemaManage.switchVersion(
                        context,
                        context.instanceData.current.$ref[context.instanceData.current.key],
                    );
                    context.schemaData.origin = metaSchema;
                    context.schemaData.current = { $ref: { root: metaSchema }, key: "root" };
                    context.schemaPaths = [];
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
