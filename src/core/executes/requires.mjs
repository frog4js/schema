import { executeConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
import { getSiblingInstanceRefData } from "../helper.mjs";
/**
 * @typedef {import("../../../types/core")}
 */

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.requires,
        version: versionConstant.jsonSchemaVersion.all,
        index: 1,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.string],
                /**
                 *
                 * @param {Context} context
                 */
                resolve: (context) => {
                    const parentInstance = getSiblingInstanceRefData(
                        context,
                        context.schemaData.current.$ref[context.schemaData.current.key],
                    );

                    if (!(parentInstance.key in parentInstance.$ref)) {
                        return executeConstant.ticks.endExecute;
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const errors = startRefOrSchemaExecute(context);
                    if (errors.length > 0) {
                        return executeConstant.ticks.endExecute;
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];

export default configs;
