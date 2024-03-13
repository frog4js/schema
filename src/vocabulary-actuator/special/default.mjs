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
        key: vocabularyActuatorConstant.keys.default,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: -9,
        matches: [
            {
                instanceTypes: typeConstant.typeofTypeGroups.exist,
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
                    defaultContext.instanceData.origin =
                        context.instanceData.current.$ref[context.instanceData.current.key];
                    defaultContext.instanceData.locale = context.instanceData.locale;
                    contextManage.enterContext(defaultContext, vocabularyActuatorConstant.pathKeys.ref);
                    contextManage.enterContext(defaultContext, vocabularyActuatorConstant.pathKeys.self);
                    vocabularyActuatorManage.startValidate(defaultContext);

                    if (defaultContext.errors.length > 0) {
                        if (context.defaultConfig.strict === false) {
                            delete context.instanceData.current.$ref[context.instanceData.current.key];
                        } else {
                            errorManage.pushError(context);
                        }
                    }

                    return vocabularyActuatorConstant.ticks.endExecute;
                },
            },
        ],
    },
];
export default configs;
