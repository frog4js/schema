import { ExecuteError } from "./error";
import { Schema } from "./schema";

export type RefData = {
    $ref: object | Array<any>;
    key: string | number;
};
export type Context = {
    errors: Array<ExecuteError>;
    locks: Array<{
        paths: Array<string>;
        errors: Array<ExecuteError>;
    }>;
    caches: Array<{
        paths: Array<string>;
        data: Record<string, any>;
    }>;
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
        locale?: string;
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
type DefaultConfig = {
    $schema?: string;
    baseURI?: string;
    errorMessages?: Record<string, Record<string, string>>;
    locale?: string;
    strict?: boolean;
};
// function create(defaultConfig: DefaultConfig): Context;
