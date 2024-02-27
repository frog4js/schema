import { vocabularyActuatorConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
import { schemaManage } from "../../schema/share.mjs";
/**
 * @typedef {import("../../../types/share")}
 */
/**
 * @type {VocabularyActuatorConfig[]}
 */
export default [
    {
        key: vocabularyActuatorConstant.keys.$schema,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: -20,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    schemaManage.switchVersion(
                        context,
                        context.instanceData.current.$ref[context.instanceData.current.key],
                    );
                    context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] =
                        context.referenceSchemas[context.instanceData.current.$ref[context.instanceData.current.key]];

                    context.schemaData.origin =
                        context.referenceSchemas[context.instanceData.current.$ref[context.instanceData.current.key]];
                    context.schemaData.current = {
                        $ref: context.referenceSchemas,
                        key: context.instanceData.current.$ref[context.instanceData.current.key],
                    };
                    context.schemaPaths = [
                        vocabularyActuatorConstant.pathKeys.ref,
                        vocabularyActuatorConstant.pathKeys.self,
                    ];
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
