import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { getParentSchema } from "../../context/manage.mjs";

/**
 * @typedef {import("../../../types/share")}
 */

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.additionalProperties,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 200,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === false) {
                        const parentSchemaInfo = contextManage.getParentSchema(context);
                        const propertyKeys = Object.keys(
                            parentSchemaInfo[vocabularyActuatorConstant.keys.properties] || {},
                        );
                        const patternKeys =
                            contextManage.getCache(context, vocabularyActuatorConstant.keys.patternProperties, 1) || [];
                        const matchKeySet = new Set([...propertyKeys, ...patternKeys]);
                        const diffProperties = Object.keys(
                            context.instanceData.current.$ref[context.instanceData.current.key],
                        ).filter((x) => !matchKeySet.has(x));
                        if (diffProperties.length > 0) {
                            errorManage.pushError(context);
                        }
                    }

                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startSubSchemaExecute }) => {
                    const parentSchemaInfo = contextManage.getParentSchema(context);
                    const propertyKeys = Object.keys(
                        parentSchemaInfo[vocabularyActuatorConstant.keys.properties] || {},
                    );
                    const patternKeys =
                        contextManage.getCache(context, vocabularyActuatorConstant.keys.patternProperties, 1) || [];
                    const matchKeySet = new Set([...propertyKeys, ...patternKeys]);
                    const diffProperties = Object.keys(
                        context.instanceData.current.$ref[context.instanceData.current.key],
                    ).filter((x) => !matchKeySet.has(x));
                    for (const diffProperty of diffProperties) {
                        contextManage.enterContext(context, undefined, diffProperty);
                        startSubSchemaExecute(context, false);
                        contextManage.backContext(context, undefined, diffProperty);
                    }

                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
