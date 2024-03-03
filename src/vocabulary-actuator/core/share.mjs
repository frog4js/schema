import $schemaConfigs from "./$schema.mjs";
// import idConfigs from "./id.mjs";
// import $idConfigs from "./$id.mjs";

export default [...$schemaConfigs].sort((item1, item2) => item1.index - item2.index);
