import { contextConstant, typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { dataOperateUtil } from "../../util/share.js";
import { contextManage } from "../../context/share.js";
import { errorManage } from "../../error/share.js";
import { schemaManage } from "../../schema/share.js";
import { vocabularyActuatorManage } from "../share.js";

/**
 * @typedef {import("../../../types/core")}
 */

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.default,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 3,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.undefined],
                resolve: (context) => {
                    if (
                        context.phase === contextConstant.phases.schemaValidate ||
                        context.defaultConfig.useDefaults === false
                    ) {
                        return vocabularyActuatorConstant.ticks.endExecute;
                    } else {
                        return vocabularyActuatorConstant.ticks.nextMatch;
                    }
                },
            },
            {
                schemaTypes: typeConstant.jsonTypeGroups.reference,
                instanceTypes: [typeConstant.typeofTypes.undefined],
                resolve: (context) => {
                    const schemaValue = context.schemaData.current.$ref[context.schemaData.current.key];
                    context.instanceData.current.$ref[context.instanceData.current.key] =
                        dataOperateUtil.deepClone(schemaValue);
                    if (context.instancePaths.length === 0) {
                        context.instanceData.origin =
                            context.instanceData.current.$ref[context.instanceData.current.key];
                    }
                    return vocabularyActuatorConstant.ticks.endExecute;
                },
            },
            {
                schemaTypes: typeConstant.jsonTypeGroups.primitive,
                instanceTypes: [typeConstant.typeofTypes.undefined],
                resolve: (context) => {
                    context.instanceData.current.$ref[context.instanceData.current.key] =
                        context.schemaData.current.$ref[context.schemaData.current.key];
                    if (context.instancePaths.length === 0) {
                        context.instanceData.origin =
                            context.instanceData.current.$ref[context.instanceData.current.key];
                    }
                    return vocabularyActuatorConstant.ticks.endExecute;
                },
            },
        ],
    },
];
export default configs;
