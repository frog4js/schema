import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { errorManage } from "../../error/share.js";
import { contextManage } from "../../context/share.js";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.anyOf,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 42,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: typeConstant.typeofTypeGroups.exist,
                resolve: (context, { startSubSchemaExecute }) => {
                    const schemaArrayLength = context.schemaData.current.$ref[context.schemaData.current.key].length;
                    let status = false;
                    for (let index = 0; index < schemaArrayLength; index++) {
                        contextManage.enterContext(context, index);
                        const errors = startSubSchemaExecute(context, true);
                        contextManage.backContext(context, index);
                        if (errors.length === 0) {
                            status = true;
                            break;
                        }
                    }
                    if (!status) {
                        errorManage.pushError(context);
                    }

                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
