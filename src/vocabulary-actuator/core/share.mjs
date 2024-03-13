import $schemaConfigs from "./$schema.mjs";
import $idConfigs from "./$id.mjs";

export default [...$schemaConfigs, ...$idConfigs].sort((item1, item2) => item1.index - item2.index);
