# @frog4js/schema

-   [中文](README-zh_CN.md)
-   [English](README.md)

JSON schema suitable for Node.js and browsers. We will soon support all drafts (currently supporting drafts 01, 02, 03, 04, 05, 06, 07).

## Feature

-   using functional programming(esm + jsDoc + Function)
-   will precompile the schema, which will occupy additional memory and will not generate additional code (fundamentally different from AJV)
-   0 dependencies
-   [x] pass JSON Schema test suite，include optional(partially skipped as follows)
    -   (optional)none of the properties mentioned
    -   (optional)valid leap second, large positive time-offset
    -   (optional)valid leap second, large negative time-offset
    -   (optional)a float is not an integer even without fractional part
    -   (optional)refs to future drafts are processed as future drafts
    -   (optional)format is iri, iri-reference, idn-email.json,idn-hostname
-   [x] vocabulary based validation
-   [x] format assertions
    -   [x] flag to enable in draft <= 7
    -   [ ] custom format
    -   [ ] built-in format
        -   [x] regex, uuid
        -   [x] ipv4, ipv6
        -   [x] hostname, email
        -   [ ] idn-hostname, idn-email
        -   [x] date, time, date-time
        -   [x] json-pointer, relative-json-pointer
        -   [x] uri, uri-reference, uri-template
        -   [ ] iri, iri-reference
        -   [ ] period
-   [x] content assertions
    -   [x] flag to enable in draft <= 7
    -   [x] contentEncoding
        -   [x] base64
        -   [ ] custom
    -   [x] contentMediaType
        -   [x] application/json
        -   [ ] custom
    -   [ ] contentSchema
-   [ ] custom vocabulary
-   [x] the referenced schema can have different drafts
-   [x] more stringent checks on schema
    -   [x] default
    -   [x] examples
    -   [x] ref
    -   [x] format

## Installation

```shell
npm install --save @frog4js/schema
```

## Quick Usage

```javascript
import { contextManage } from "@frog4js/schema/context";
import { schemaManage } from "@frog4js/schema/schema";
import { vocabularyActuatorManage } from "@frog4js/schema/vocabulary-actuator";

const context = contextManage.create();
schemaManage.setMainSchema(context, {
    type: "object",
});
schemaManage.compile(context);
console.log(vocabularyActuatorManage.validate(context, 1));
```

## API Reference

### contextManage

it is mainly used to create Context, which is used to mount various data (such as schema, instance, errors, etc.) and is the context data for the execution process.

#### contextManage.create(defaultConfig?: DefaultConfig) => Context

create a context where defaultConfiguration is the default configuration.

### schemaManage

You can set the main schema and ref schema.

#### schemaManage.addReferenceSchema: (context: Context, schema: Schema) => void;

add referenced schema

#### schemaManage.setMainSchema: (context: Context, schema: Schema) => void;

set main schema

#### schemaManage.compile: () => void;

complete the setup, here we will check if the schema specified by $ref exists, and prohibit any further modification of schema related data

### vocabularyActuatorManage

verify if the instance meets the requirements of the schema

#### vocabularyActuatorManage.validate: (context: Context,instance: any,locale?: string) => {errors: ExecuteError[];valid: boolean;};

verify that the valid value is true, otherwise it is false, and the errors field indicates the specific reason for the failure

## Struct Definition

### Context

```ts
export type Context = {
    errors: Array<ExecuteError>;
    locks: Array<{
        paths: Array<string>;
        errors: Array<ExecuteError>;
    }>;
    caches: Array<{
        schemaPaths: Array<string>;
        instancePaths: Array<string>;
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
};
```

### DefaultConfig

```ts
export type DefaultConfig = {
    $schema?: string;
    baseURI?: string;
    errorMessages?: Record<string, Record<string, string>>;
    locale?: string;
    strict?: boolean;
};
```

### Schema

```ts
type Reference = { $ref: string };
type CoreV3 = {
    id?: string;
};

type BasicTypeV3 = "string" | "boolean" | "array" | "object" | "integer" | "null" | "any" | "number";
type BasicTypeV4 = "string" | "boolean" | "array" | "object" | "integer" | "null" | "number";
//  ============= v1
type ValidationV1 = {
    type?: BasicTypeV3 | Array<BasicTypeV3 | ChildSchemaV1>;
    default?: any;
    optional?: boolean;
    properties?: Record<string, ChildSchemaV1>;
    items?: ChildSchemaV1 | Array<ChildSchemaV1>;
    additionalProperties?: boolean | ChildSchemaV1;
    requires?: string | ChildSchemaV1;
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
    disallow?: BasicTypeV3 | Array<BasicTypeV3>;
};
type ChildSchemaV1 = ValidationV1 | Reference;
type SchemaV1 = CoreV3 & ValidationV1 & { $schema: "http://json-schema.org/draft-01/schema#" };
//  ============= v1

//  ============= v2
type ValidationV2 = Exclude<ValidationV1, "maxDecimal"> & {
    type?: BasicTypeV3 | Array<BasicTypeV3 | ChildSchemaV2>;
    properties?: Record<string, ChildSchemaV2>;
    items?: ChildSchemaV2 | Array<ChildSchemaV2>;
    additionalProperties?: boolean | ChildSchemaV2;
    requires?: string | ChildSchemaV2;
    divisibleBy?: number;
    uniqueItems?: boolean;
};
type ChildSchemaV2 = ValidationV2 | Reference;
type SchemaV2 = CoreV3 & ValidationV2 & { $schema: "http://json-schema.org/draft-01/schema#" };
//  ============= v2

//  ============= v3
type ValidationV3 = Exclude<ValidationV2, "maximumCanEqual" | "minimumCanEqual"> & {
    type?: BasicTypeV3 | Array<BasicTypeV3 | ChildSchemaV3>;
    properties?: Record<string, ChildSchemaV3>;
    items?: ChildSchemaV3 | Array<ChildSchemaV3>;
    additionalProperties?: boolean | ChildSchemaV3;
    requires?: string | ChildSchemaV3;
    additionalItems?: boolean | ChildSchemaV3;
    patternProperties?: Record<string, ChildSchemaV3>;
    dependencies?: Record<string, string | Array<string> | ChildSchemaV3>;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
};
type ChildSchemaV3 = ValidationV3 | Reference;
type SchemaV3 = CoreV3 & ValidationV3 & { $schema: "http://json-schema.org/draft-01/schema#" };
//  ============= v3

//  ============= v4
type CoreV4 = {
    id?: string;
    definitions?: Record<string, ChildSchemaV4>;
};
type ValidationV4 = Exclude<ValidationV3, "contentEncoding" | "divisibleBy"> & {
    type?: BasicTypeV4 | Array<BasicTypeV4>;
    properties?: Record<string, ChildSchemaV4>;
    items?: ChildSchemaV4 | Array<ChildSchemaV4>;
    additionalProperties?: boolean | ChildSchemaV4;
    additionalItems?: boolean | ChildSchemaV4;
    patternProperties?: Record<string, ChildSchemaV4>;
    dependencies?: Record<string, Array<string> | ChildSchemaV4>;
    anyOf?: Array<ChildSchemaV4>;
    oneOf?: Array<ChildSchemaV4>;
    allOf?: Array<ChildSchemaV4>;
    requires?: Array<string>;
    minProperties?: number;
    maxProperties?: number;
    multipleOf?: number;
};
type ChildSchemaV4 = ValidationV4 | Reference;
type SchemaV4 = CoreV4 & ValidationV4 & { $schema: "http://json-schema.org/draft-04/schema#" };
//  ============= v4

//  ============= v5
type SchemaV5 = CoreV4 & ValidationV4 & { $schema: "http://json-schema.org/draft-05/schema#" };
//  ============= v5

//  ============= v6
type CoreV6 = {
    $id?: string;
    definitions?: Record<string, ChildSchemaV6>;
};
type ValidationV6 = ValidationV4 & {
    properties?: Record<string, ChildSchemaV6>;
    items?: ChildSchemaV6 | Array<ChildSchemaV6>;
    additionalProperties?: boolean | ChildSchemaV6;
    additionalItems?: boolean | ChildSchemaV6;
    patternProperties?: Record<string, ChildSchemaV6>;
    dependencies?: Record<string, Array<string> | ChildSchemaV6>;
    anyOf?: Array<ChildSchemaV6>;
    oneOf?: Array<ChildSchemaV6>;
    allOf?: Array<ChildSchemaV6>;
    propertyNames?: ChildSchemaV6;
    const?: any;
    examples?: Array<any>;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
};
type ChildSchemaV6 = ValidationV6 | Reference | boolean;
type SchemaV6 = CoreV6 & ValidationV6 & { $schema: "http://json-schema.org/draft-06/schema#" };
//  ============= v6

//  ============= v7
type CoreV7 = {
    $schema?: "http://json-schema.org/draft-07/schema#";
    $id?: string;
    definitions?: Record<string, ChildSchemaV6>;
};
type ValidationV7 = ValidationV6 & {
    properties?: Record<string, ChildSchemaV7>;
    items?: ChildSchemaV7 | Array<ChildSchemaV7>;
    additionalProperties?: boolean | ChildSchemaV7;
    additionalItems?: boolean | ChildSchemaV7;
    patternProperties?: Record<string, ChildSchemaV7>;
    dependencies?: Record<string, Array<string> | ChildSchemaV7>;
    anyOf?: Array<ChildSchemaV7>;
    oneOf?: Array<ChildSchemaV7>;
    allOf?: Array<ChildSchemaV7>;
    propertyNames?: ChildSchemaV7;
    if?: boolean | ChildSchemaV7;
    then?: boolean | ChildSchemaV7;
    else?: boolean | ChildSchemaV7;
};
type ChildSchemaV7 = ValidationV7 | Reference | boolean;
type SchemaV7 = CoreV7 & ValidationV7;
//  ============= v7
export type Schema = SchemaV1 | SchemaV2 | SchemaV3 | SchemaV4 | SchemaV5 | SchemaV6 | SchemaV7;
```

### Error

```ts
export type ExecuteError = {
    instancePath: string;
    schemaPath: string;
    currentSchemaKey: string;
    currentSchemaValue: any;
    currentInstanceKey: string;
    currentInstanceValue: any;
    message: string;
};
```
