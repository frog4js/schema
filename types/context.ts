import { ExecuteError } from "./error";
import { Schema } from "./schema";

export type RefData = {
    $ref: object | Array<any>;
    key: string | number;
};
export type Context = {
    errors: Array<ExecuteError>;
    tempErrors: Array<ExecuteError>;
    errorState: {
        isTemp: boolean;
        lockKey: string;
    };
    startTime: number;
    endTime: number;
    instancePaths: Array<string | number>;
    schemaPaths: Array<string | number>;
    version: number;
    schemaData: {
        origin?: Schema;
        main?: Schema;
        current?: RefData;
    };
    instanceData: {
        origin?: any;
        current?: RefData;
    };
    referenceSchemas: Record<string, Schema>;
    defaultConfig: DefaultConfig;
    state: number;
    phase?: number;
    waitValidateRefs: {
        $ref: string;
        schema: Schema;
    }[];
    // cache: Record<string, Record<string, any>>
};
type DefaultConfig = { $schema?: string; baseURI?: string };
// function create(defaultConfig: DefaultConfig): Context;
