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
                resolve: (context, { startRefOrSchemaExecute }) => {
                    let index = 0;
                    const instanceData = context.instanceData.current.$ref[context.instanceData.current.key];
                    for (const instanceItem of instanceData) {
                        contextManage.enterContext(context, undefined, index);
                        startRefOrSchemaExecute(context, false);
                        contextManage.backContext(context, undefined, index);
                        index++;
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const schemaData = context.schemaData.current.$ref[context.schemaData.current.key];
                    let index = 0;
                    for (const schemaItem of schemaData) {
                        contextManage.enterContext(context, index, index);
                        startRefOrSchemaExecute(context, false);
                        contextManage.backContext(context, index, index);
                        index++;
                    }

                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
