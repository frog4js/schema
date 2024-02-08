import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.oneOf,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 41,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: typeConstant.typeofTypeGroups.exist,
                resolve: (context, { startRefOrSchemaExecute }) => {
                    let matchCount = 0;
                    const schemaArrayLength = context.schemaData.current.$ref[context.schemaData.current.key].length;
                    for (let index = 0; index < schemaArrayLength; index++) {
                        contextManage.enterContext(context, index);
                        const errors = startRefOrSchemaExecute(context, index, undefined);
                        if (errors.length === 0) {
                            matchCount++;
                        }
                        contextManage.backContext(context, index);
                    }
                    if (matchCount !== 1) {
                        errorManage.pushError(context, "oneOfMustMatchExactlyOneSchemaInOneOf");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
