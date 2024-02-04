import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError } from "../helper.mjs";
import { dataOperateUtil } from "../../util/share.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.required,
        versions: versionConstant.jsonSchemaVersionGroups.draft03ByAdd,
        index: 2.1,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.undefined],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === true) {
                        pushError(context, "requiredMustBeExists");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
