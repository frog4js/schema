import { Context } from "./context";
import { Schema } from "./schema";

declare module "@frog4js/schema/context" {
    import { Context, DefaultConfig } from "./context";
    export const contextManage: {
        create: (defaultConfig?: DefaultConfig) => Context;
    };
}
declare module "@frog4js/schema/schema" {
    import { Context } from "./context";
    import { Schema } from "./schema";

    export const schemaManage: {
        addReferenceSchema: (context: Context, schema: Schema) => void;
        setMainSchema: (context: Context, schema: Schema) => void;
        compile: (context: Context) => void;
    };
}
declare module "@frog4js/schema/vocabulary-actuator" {
    import { Context } from "./context";
    import { ExecuteError } from "./error";

    export const vocabularyActuatorManage: {
        validate: (
            context: Context,
            instance: any,
            locale?: string,
        ) => {
            errors: ExecuteError[];
            valid: boolean;
        };
    };
}
