import { RefData } from "./context";
export type FormatDefinition =
    | {
          validate?: (refData: RefData) => boolean;
      }
    | {
          regex?: RegExp;
      }
    | {
          regexes?: Array<RegExp>;
      }
    | {
          pattern?: string;
      };
export type Formats = Record<string, FormatDefinition>;
