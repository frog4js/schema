import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { typeUtil } from "../../util/share.js";
import { contextManage } from "../../context/share.js";
import { errorManage } from "../../error/share.js";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.disallow,
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
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                resolve: (context) => {
                    const instanceType = typeUtil.getTypeofTypeByRefData(context.instanceData.current);
                    if (context.schemaData.current.$ref[context.schemaData.current.key].includes(instanceType)) {
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
