import "./share";

declare namespace JSONSchema {
    type VocabularyActuatorConfig = {
        key: string;
        versions: number[];
        index: number;
        matches: Array<{
            schemaTypes?: string[];
            instanceTypes: string[];
            throwCode: string;
            resolve: (
                context: Context,
                hooks: {
                    startRefOrSchemaExecute: (context: Context, isPushError?: boolean) => ExecuteError[];
                },
            ) => number;
        }>;
    };
}
