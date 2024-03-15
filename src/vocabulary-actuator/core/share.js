import $schemaConfigs from "./$schema.js";
import $idConfigs from "./$id.js";

export default [...$schemaConfigs, ...$idConfigs].sort((item1, item2) => item1.index - item2.index);
