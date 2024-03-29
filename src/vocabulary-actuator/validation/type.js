import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { errorManage } from "../../error/share.js";
import { getTypeofTypeByRefData } from "../../util/type.js";
import { contextManage } from "../../context/share.js";

/**
 * @typedef {import("../../../types/share")}
 */
const schemaTypes = {
    string: "string",
    object: "object",
    number: "number",
    integer: "integer",
    boolean: "boolean",
    array: "array",
    null: "null",
    any: "any",
};

function signTypeExecute(context, schemaType) {
    if (schemaType === schemaTypes.any) {
        return true;
    }
    const instanceType = getTypeofTypeByRefData(context.instanceData.current);

    if (schemaType === schemaTypes.integer) {
        return Number.isInteger(context.instanceData.current.$ref[context.instanceData.current.key]);
    }
    return schemaType === instanceType;
}

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.type,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 4,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.string],
                instanceTypes: typeConstant.typeofTypeGroups.exist,
                resolve: (context) => {
                    if (!signTypeExecute(context, context.schemaData.current.$ref[context.schemaData.current.key])) {
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: typeConstant.typeofTypeGroups.exist,
                resolve: (context, { startSubSchemaExecute }) => {
                    const types = context.schemaData.current.$ref[context.schemaData.current.key];
                    let status;
                    let i = 0;
                    for (const type of types) {
                        contextManage.enterContext(context, i, undefined);
                        if (typeof type === typeConstant.typeofTypes.string) {
                            status = signTypeExecute(context, type);
                        } else if (typeof type === typeConstant.typeofTypes.object) {
                            const errors = startSubSchemaExecute(context, true);
                            status = errors.length === 0;
                        }
                        contextManage.backContext(context, i, undefined);
                        i++;
                        if (status) {
                            break;
                        }
                    }
                    if (!status) {
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
