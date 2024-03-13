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
                startSubSchemaExecute: (context: Context, isTryExecute?: boolean) => ExecuteError[];
                startRefExecute: (context: Context) => void;
            },
        ) => number;
    }>;
};
