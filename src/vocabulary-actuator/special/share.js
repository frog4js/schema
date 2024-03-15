import $refConfigs from "./$ref.js";
import defaultConfigs from "./default.js";
import formatConfigs from "./format.js";
import examplesConfigs from "./examples.js";
import $idConfigs from "./$id.js";
export default [...$refConfigs, ...defaultConfigs, ...formatConfigs, ...examplesConfigs, ...$idConfigs].sort(
    (item1, item2) => item1.index - item2.index,
);
