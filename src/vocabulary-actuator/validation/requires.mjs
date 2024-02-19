import { vocabularyActuatorConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
/**
 * @typedef {import("../../../types/core")}
 */

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.requires,
        versions: [versionConstant.jsonSchemaVersions.draft01, versionConstant.jsonSchemaVersions.draft02],
        index: 1,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.string],
                /**
                 *
                 * @param {Context} context
                 */
                resolve: (context) => {
                    const parentInstance = contextManage.getSiblingInstanceRefData(
                        context,
                        context.schemaData.current.$ref[context.schemaData.current.key],
                    );

                    if (!(parentInstance.key in parentInstance.$ref)) {
                        return vocabularyActuatorConstant.ticks.endExecute;
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const errors = startRefOrSchemaExecute(context, true);
                    if (errors.length > 0) {
                        return vocabularyActuatorConstant.ticks.endExecute;
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];

export default configs;
