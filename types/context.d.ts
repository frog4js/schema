import "./share";
declare namespace JSONSchema {
    type RefData = {
        $ref: object | Array<any>;
        key: string | number;
    };
    type Context = {
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
        cacheReferenceSchemas: Record<string, Schema>;
        defaultConfig: DefaultConfig;
    };
    type DefaultConfig = { $schema?: string; baseURI?: string };
    function create(defaultConfig: DefaultConfig): Context;
}
