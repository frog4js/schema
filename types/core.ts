type RefData = {
    $ref: object | Array<any>;
    key: string | number;
};
type SchemaBasicType = "string" | "boolean" | "array" | "object" | "integer" | "null" | "any" | "number" | string;
type SchemaV1 = {
    $ref?: string;
    type?: SchemaBasicType | Array<SchemaBasicType | Schema>;
    $schema?: "http://json-schema.org/draft-01/schema#";
    id?: string;
    default?: any;
    optional?: boolean;
    properties?: Record<string, Schema>;
    items?: Schema | Array<Schema>;
    additionalProperties?: boolean | Schema;
    requires?: string | Schema;
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

type SchemaV2 = {
    $ref?: string;
    type?: SchemaBasicType | Array<SchemaBasicType | Schema>;
    $schema?: "http://json-schema.org/draft-02/schema#";
    id?: string;
    default?: any;
    optional?: boolean;
    properties?: Record<string, Schema>;
    items?: Schema | Array<Schema>;
    additionalProperties?: boolean | Schema;
    requires?: string | Schema;
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
    disallow?: SchemaBasicType | Array<SchemaBasicType>;
    divisibleBy?: number;
    uniqueItems?: boolean;
};

type SchemaV3 = {
    $ref?: string;
    type?: SchemaBasicType | Array<SchemaBasicType | Schema>;
    $schema?: "http://json-schema.org/draft-03/schema#";
    id?: string;
    default?: any;
    required?: boolean;
    properties?: Record<string, Schema>;
    items?: Schema | Array<Schema>;
    additionalProperties?: boolean | Schema;
    requires?: string | Schema;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
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
    disallow?: SchemaBasicType | Array<SchemaBasicType>;
    divisibleBy?: number;
    uniqueItems?: boolean;
    additionalItems?: boolean | Schema;
    patternProperties?: Record<string, Schema>;
    dependencies?: Record<string, string | Array<string> | Schema>;
};
type SchemaV4 = {
    $ref?: string;
    type?: Exclude<SchemaBasicType, "any"> | Array<Exclude<SchemaBasicType, "any"> | Schema>;
    $schema?: "http://json-schema.org/draft-04/schema#";
    id?: string;
    definitions?: Record<string, Schema>;
    default?: any;
    required?: string[];
    properties?: Record<string, Schema>;
    items?: Schema | Array<Schema>;
    additionalProperties?: boolean | Schema;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
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
    divisibleBy?: number;
    uniqueItems?: boolean;
    additionalItems?: boolean | Schema;
    patternProperties?: Record<string, Schema>;
    dependencies?: Record<string, string | Array<string> | Schema>;
    anyOf?: Schema | Array<Schema>;
    oneOf?: Schema | Array<Schema>;
    allOf?: Schema | Array<Schema>;
};
type Schema = SchemaV1 | SchemaV2 | SchemaV3 | SchemaV4;

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
    version: number;
};
type ExecuteConfig = {
    key: string;
    versions: number[];
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
