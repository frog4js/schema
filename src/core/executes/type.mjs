import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError, mergeError } from "../helper.mjs";
import { getTypeofTypesByRefData } from "../../util/type.mjs";

/**
 * @typedef {import("../../../types/core")}
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
    const instanceType = getTypeofTypesByRefData(context.instanceData.current);

    if (schemaType === schemaTypes.integer) {
        return Number.isInteger(context.instanceData.current.$ref[context.instanceData.current.key]);
    }
    return schemaType === instanceType;
}

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.type,
        version: versionConstant.jsonSchemaVersion.all,
        index: 4,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.undefined],
                resolve: () => {
                    return executeConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    if (!signTypeExecute(context, context.schemaData.current.$ref[context.schemaData.current.key])) {
                        pushError(
                            context,
                            `must be ${context.schemaData.current.$ref[context.schemaData.current.key]}`,
                            1,
                        );
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.typeofTypes.array],
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const types = context.schemaData.current.$ref[context.schemaData.current.key];
                    let status;
                    context.isLogError = false;
                    for (const type of types) {
                        if (typeof type === typeConstant.typeofTypes.string) {
                            status = signTypeExecute(context, type);
                        } else if (typeof type === typeConstant.typeofTypes.object) {
                            const errors = startRefOrSchemaExecute(context);
                            if (errors.length > 0) {
                                status = false;
                            }
                        }
                        if (status) {
                            break;
                        }
                    }
                    context.isLogError = true;

                    if (!status) {
                        pushError(context, `must be ${JSON.stringify(types)}`, 1);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const errors = startRefOrSchemaExecute(context);
                    if (errors.length > 0) {
                        mergeError(context, errors);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
