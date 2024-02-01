import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { mergeError } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.items,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 6,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context, { startRefOrSchemaExecute, enterContext, backContext }) => {
                    let index = 0;
                    const instanceData = context.instanceData.current.$ref[context.instanceData.current.key];
                    for (const instanceItem of instanceData) {
                        enterContext(context, undefined, index);
                        const errors = startRefOrSchemaExecute(context);
                        mergeError(context, errors);
                        backContext(context, undefined, index);
                        index++;
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context, { startRefOrSchemaExecute, enterContext, backContext }) => {
                    const schemaData = context.schemaData.current.$ref[context.schemaData.current.key];
                    let index = 0;
                    for (const schemaItem of schemaData) {
                        enterContext(context, index, index);
                        const errors = startRefOrSchemaExecute(context);
                        mergeError(context, errors);
                        backContext(context, index, index);
                        index++;
                    }

                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
