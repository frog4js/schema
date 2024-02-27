import $refConfigs from "./$ref.mjs";
import defaultConfigs from "./default.mjs";
import formatConfigs from "./format.mjs";
import examplesConfigs from "./examples.mjs";
export default [...$refConfigs, ...defaultConfigs, ...formatConfigs, ...examplesConfigs];
