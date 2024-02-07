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
                    enterContext: (context: Context, schemaKey: string, instanceKey: string) => void;
                    backContext: (context: Context, schemaKey: string, instanceKey: string) => void;
                },
            ) => number;
        }>;
    };
}
