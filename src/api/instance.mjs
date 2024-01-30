import { engine } from "../core/share.mjs";

function validate(schema, instance) {
    return engine.startExecute(schema, instance);
}
export { validate };
