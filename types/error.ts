export type ExecuteError = {
    instancePath: string;
    schemaPath: string;
    currentSchemaKey: string;
    currentSchemaValue: any;
    currentInstanceKey: string;
    currentInstanceValue: any;
    message: string;
};
