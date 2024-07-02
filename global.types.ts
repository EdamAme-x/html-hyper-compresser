export type TagTypes =
  | "tag-left-bracket" // <
  | "tag-name" // name
  | "tag-right-bracket" // >
  | "tag-closing-left-bracket" // </
  | "tag-self-closing-right-bracket"; // />

export type AttributeTypes =
  | "attribute-name" // name
  | "attribute-assign" // =
  | "attribute-value"; // "value"

export type ContentTypes = "content"; // text

export type TokenTypes = TagTypes | AttributeTypes | ContentTypes;

export type Token = {
  type: TokenTypes;
  value: string;
};

export type Tokens = Token[];
