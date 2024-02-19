import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.maxDecimal,
        versions: [versionConstant.jsonSchemaVersions.draft01],
        index: 17,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    const stringInstance = String(
                        context.instanceData.current.$ref[context.instanceData.current.key],
                    ).split(".");
                    if (
                        stringInstance.length === 2 &&
                        stringInstance[1] &&
                        stringInstance[1].length > context.schemaData.current.$ref[context.schemaData.current.key]
                    ) {
                        errorManage.pushError(context, "maxDecimalMustBeLessThanOrEqualToLimit");
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
