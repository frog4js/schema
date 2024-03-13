import { contextConstant, typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { dataOperateUtil } from "../../util/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { schemaManage } from "../../schema/share.mjs";
import { vocabularyActuatorManage } from "../share.mjs";

/**
 * @typedef {import("../../../types/core")}
 */

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.examples,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: -8,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context) => {
                    const defaultContext = contextManage.clone(context);
                    defaultContext.phase = contextConstant.phases.instanceValidate;
                    const schema = dataOperateUtil.clone(context.instanceData.current.$ref);
                    if (vocabularyActuatorConstant.keys.definitions in context.instanceData.origin) {
                        schema.definitions = context.instanceData.origin[vocabularyActuatorConstant.keys.definitions];
                    }
                    defaultContext.schemaData.origin = schema;
                    defaultContext.schemaData.main = schema;

                    defaultContext.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] = schema;
                    defaultContext.state = contextConstant.states.compile;
                    defaultContext.schemaData.current = {
                        $ref: defaultContext.referenceSchemas,
                        key: vocabularyActuatorConstant.pathKeys.self,
                    };

                    defaultContext.instanceData.locale = context.instanceData.locale;
                    const examples = context.instanceData.current.$ref[context.instanceData.current.key];
                    const errors = [];
                    for (let example of examples) {
                        defaultContext.instanceData.origin = example;
                        defaultContext.schemaPaths = [
                            vocabularyActuatorConstant.pathKeys.ref,
                            vocabularyActuatorConstant.pathKeys.self,
                        ];
                        defaultContext.errors = [];
                        vocabularyActuatorManage.startValidate(defaultContext);
                        errors.push(...defaultContext.errors);
                    }
                    if (errors.length > 0) {
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.endExecute;
                },
            },
        ],
    },
];
export default configs;
