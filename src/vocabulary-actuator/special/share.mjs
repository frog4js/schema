import $refConfigs from "./$ref.mjs";
import defaultConfigs from "./default.mjs";
import formatConfigs from "./format.mjs";
import examplesConfigs from "./examples.mjs";
import $idConfigs from "./$id.mjs";
export default [...$refConfigs, ...defaultConfigs, ...formatConfigs, ...examplesConfigs, ...$idConfigs].sort(
    (item1, item2) => item1.index - item2.index,
);
