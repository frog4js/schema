import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.not,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 44,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                resolve: (context, { startRefOrSchemaExecute }) => {
                    if (Object.keys(context.schemaData.current.$ref[context.schemaData.current.key]).length > 0) {
                        const errors = startRefOrSchemaExecute(context);
                        if (errors.length === 0) {
                            errorManage.pushError(context, "notMustNotBeValid");
                        }
                    }

                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
