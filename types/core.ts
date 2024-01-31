type RefData = {
    $ref: object | Array<any>;
    key: string | number;
};
type SchemaBasicType = "string" | "boolean" | "array" | "object" | "integer" | "null" | "any" | "number" | string;
type SchemaV1 = {
    $ref?: string;
    type?: SchemaBasicType | Array<SchemaBasicType | Schema>;
    $schema?: string;
    $id?: string;
    default?: any;
    optional?: boolean;
    properties?: Record<string, SchemaV1>;
    items?: SchemaV1 | Array<SchemaV1>;
    additionalProperties?: boolean | SchemaV1;
    requires?: string | SchemaV1;
    minimum?: number;
    maximum?: number;
    minimumCanEqual?: boolean;
    maximumCanEqual?: boolean;
    minItems?: number;
    maxItems?: number;
    format?: string;
    pattern?: string;
    maxLength?: number;
    minLength?: number;
    enum?: Array<string>;
    title?: string;
    description?: string;
    contentEncoding?: string;
    maxDecimal?: number;
    disallow?: SchemaBasicType | Array<SchemaBasicType>;
};

type Schema = SchemaV1;

type ExecuteError = {
    instancePath: string;
    schemaPath: string;
    currentSchemaKey: string;
    currentSchemaValue: any;
    currentInstanceKey: string;
    currentInstanceValue: any;
    message: string;
    code: string;
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
    schemaData: {
        origin: Schema;
        current: RefData;
    };
    instanceData: {
        origin: any;
        current: RefData;
    };
    refSchemas: Record<string, Schema>;
    phase: "schemaValidate" | "instanceValidate";
};
type ExecuteConfig = {
    key: string;
    version: number[];
    index: number;
    matches: Array<{
        schemaTypes: string[];
        instanceTypes: string[];
        throwCode: string;
        resolve: (
            context: Context,
            hooks: {
                startRefOrSchemaExecute: (context: Context) => ExecuteError[];
                startChildExecute: (context: Context, schemaKey: string, instanceKey: string) => void;
                enterContext: (context: Context, schemaKey: string, instanceKey: string) => void;
                backContext: (context: Context, schemaKey: string, instanceKey: string) => void;
                startExecute: (schema: Schema, instance: any, configs: Record<string, any>) => void;
            },
        ) => number;
    }>;
};
