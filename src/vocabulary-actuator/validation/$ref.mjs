import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.$ref,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 0,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.string],
                resolve: (context, { startRefExecute }) => {
                    startRefExecute(context);
                    return vocabularyActuatorConstant.ticks.endExecute;
                },
            },
        ],
    },
];
export default configs;
