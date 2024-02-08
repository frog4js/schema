import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { typeUtil } from "../../util/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.disallow,
        versions: [
            versionConstant.jsonSchemaVersions.draft01,
            versionConstant.jsonSchemaVersions.draft02,
            versionConstant.jsonSchemaVersions.draft03,
        ],
        index: 18,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.string],
                resolve: (context) => {
                    const instanceType = typeUtil.getTypeofTypeByRefData(context.instanceData.current);
                    if (instanceType === context.schemaData.current.$ref[context.schemaData.current.key]) {
                        errorManage.pushError(context, "disallowMustNotBeDisallowType");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                resolve: (context) => {
                    const instanceType = typeUtil.getTypeofTypeByRefData(context.instanceData.current);
                    if (context.schemaData.current.$ref[context.schemaData.current.key].includes(instanceType)) {
                        errorManage.pushError(context, "disallowMustNotBeDisallowType");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
