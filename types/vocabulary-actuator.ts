import { Context } from "./context";
import { ExecuteError } from "./error";

export type VocabularyActuatorConfig = {
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
                startRefOrSchemaExecute: (context: Context, isTryExecute?: boolean) => ExecuteError[];
            },
        ) => number;
    }>;
};
