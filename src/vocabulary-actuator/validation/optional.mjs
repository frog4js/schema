import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 * @typedef {import("../../../types/core")}
 */

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.optional,
        versions: [versionConstant.jsonSchemaVersions.draft01, versionConstant.jsonSchemaVersions.draft02],
        index: 2,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.undefined],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === false) {
                        errorManage.pushError(context, "optionalMustBeExists");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
