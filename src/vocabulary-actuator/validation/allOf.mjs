import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { contextManage } from "../../context/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.allOf,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 43,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: typeConstant.typeofTypeGroups.exist,
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const schemaArrayLength = context.schemaData.current.$ref[context.schemaData.current.key].length;
                    for (let index = 0; index < schemaArrayLength; index++) {
                        contextManage.enterContext(context, index);
                        const errors = startRefOrSchemaExecute(context, true);
                        contextManage.backContext(context, index);
                        if (errors.length > 0) {
                            errorManage.pushError(context, "allOfMustMatchSchemasInAllOf");
                            break;
                        }
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
