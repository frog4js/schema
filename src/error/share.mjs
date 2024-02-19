import { pushError, mergeError, setLogError } from "./manage.mjs";
import { SchemaInvalidError } from "./schema-invalid-error.mjs";
import { DefaultConfigError } from "./default-config-error.mjs";
import { SystemError } from "./system-error.mjs";
export const errorManage = { pushError, mergeError, setLogError };
export const errorClass = {
    DefaultConfigError,
    SchemaInvalidError,
    SystemError,
};
