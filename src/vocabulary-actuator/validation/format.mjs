import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { formatManage } from "../../format/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.format,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 12,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.string],
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    if (!formatManage.validate(context)) {
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
