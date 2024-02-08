import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { dataOperateUtil } from "../../util/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 * @typedef {import("../../../types/core")}
 */

function validateDefault(context, schemaValue, startExecute) {
    if (context.phase === "schemaValidate") {
        const parentSchema = dataOperateUtil.deepClone(context.getParentSchema(context));
        delete parentSchema.default;
        const defaultContext = startExecute(parentSchema, schemaValue, { phase: "instanceValidate" });
        if (defaultContext.errors.length > 0) {
            errorManage.pushError(context, "defaultMustComplyWithSchema");
            return false;
        }
    }
    return true;
}
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.default,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 3,
        matches: [
            {
                schemaTypes: typeConstant.jsonTypeGroups.reference,
                instanceTypes: [typeConstant.typeofTypes.undefined],
                resolve: (context, { startExecute }) => {
                    const schemaValue = context.schemaData.current.$ref[context.schemaData.current.key];
                    context.instanceData.current.$ref[context.instanceData.current.key] =
                        dataOperateUtil.deepClone(schemaValue);
                    if (context.instancePaths.length === 0) {
                        context.instanceData.origin =
                            context.instanceData.current.$ref[context.instanceData.current.key];
                    }
                    validateDefault(context, schemaValue, startExecute);
                    return executeConstant.ticks.endExecute;
                },
            },
            {
                schemaTypes: typeConstant.jsonTypeGroups.primitive,
                instanceTypes: [typeConstant.typeofTypes.undefined],
                resolve: (context, { startExecute }) => {
                    context.instanceData.current.$ref[context.instanceData.current.key] =
                        context.schemaData.current.$ref[context.schemaData.current.key];
                    if (context.instancePaths.length === 0) {
                        context.instanceData.origin =
                            context.instanceData.current.$ref[context.instanceData.current.key];
                    }
                    validateDefault(
                        context,
                        context.schemaData.current.$ref[context.schemaData.current.key],
                        startExecute,
                    );
                    return executeConstant.ticks.endExecute;
                },
            },
        ],
    },
];
export default configs;
