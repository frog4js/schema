import { executeConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { typeUtil } from "../../util/share.mjs";
/**
 * @typedef {import("../../../types/core")}
 */

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.dependencies,
        versions: versionConstant.jsonSchemaVersionGroups.draft03ByAdd,
        index: 30,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const schema = context.schemaData.current.$ref[context.schemaData.current.key];
                    const instance = context.instanceData.current.$ref[context.instanceData.current.key];
                    for (const key of Object.keys(schema)) {
                        if (!(key in instance)) {
                            continue;
                        }
                        contextManage.enterContext(context, key);
                        const type = typeUtil.getTypeofTypeByRefData(context.schemaData.current);

                        let validResult = true;
                        switch (type) {
                            case typeConstant.typeofTypes.string:
                                validResult =
                                    context.schemaData.current.$ref[context.schemaData.current.key] in instance;
                                break;
                            case typeConstant.typeofTypes.array:
                                validResult = context.schemaData.current.$ref[context.schemaData.current.key].every(
                                    (item) => item in instance,
                                );
                                break;
                            case typeConstant.typeofTypes.object:
                                validResult = startRefOrSchemaExecute(context).length === 0;
                                break;
                        }
                        if (!validResult) {
                            errorManage.pushError(context, "dependenciesMustBeTheRightDependency");
                        }
                        contextManage.backContext(context, key);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];

export default configs;
