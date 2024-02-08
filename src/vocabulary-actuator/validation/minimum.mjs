import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.minimum,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 8,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    if (contextManage.canEqualInstance(context) === false) {
                        if (
                            context.instanceData.current.$ref[context.instanceData.current.key] <=
                            context.schemaData.current.$ref[context.schemaData.current.key]
                        ) {
                            errorManage.pushError(context, "minimumMustBeLessThanLimit");
                        }
                    } else {
                        if (
                            context.instanceData.current.$ref[context.instanceData.current.key] <
                            context.schemaData.current.$ref[context.schemaData.current.key]
                        ) {
                            pushError(context, "minimumMustBeLessThanOrEqualToLimit");
                        }
                    }

                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
