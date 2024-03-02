import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { contextManage } from "../../context/share.mjs";

/**
 * @typedef {import("../../../types/share")}
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.items,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 6,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context, { startSubSchemaExecute }) => {
                    let index = 0;
                    const instanceData = context.instanceData.current.$ref[context.instanceData.current.key];
                    for (const instanceItem of instanceData) {
                        contextManage.enterContext(context, undefined, index);
                        startSubSchemaExecute(context, false);
                        contextManage.backContext(context, undefined, index);
                        index++;
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context, { startSubSchemaExecute }) => {
                    const schemaData = context.schemaData.current.$ref[context.schemaData.current.key];
                    let index = 0;
                    for (const schemaItem of schemaData) {
                        contextManage.enterContext(context, index, index);
                        startSubSchemaExecute(context, false);
                        contextManage.backContext(context, index, index);
                        index++;
                    }

                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
    {
        key: vocabularyActuatorConstant.keys.items,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: 6.1,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === false) {
                        errorManage.pushError(context, vocabularyActuatorConstant.errorMessageKeys.schemaIsFalse);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
