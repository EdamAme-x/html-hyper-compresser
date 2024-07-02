import { test, expect } from "vitest";
import { HTMLLexer } from "../lexer";

const exampleData = "<div class=\"test\" id='abc'>test<span x /></div>";
const exampleParsedData = [
  {
    type: "tag-left-bracket",
    value: "<",
  },
  {
    type: "tag-name",
    value: "div",
  },
  {
    type: "attribute-name",
    value: "class",
  },
  {
    type: "attribute-assign",
    value: "=",
  },
  {
    type: "attribute-value",
    value: "test",
  },
  {
    type: "attribute-name",
    value: "id",
  },
  {
    type: "attribute-assign",
    value: "=",
  },
  {
    type: "attribute-value",
    value: "abc",
  },
  {
    type: "tag-right-bracket",
    value: ">",
  },
  {
    type: "content",
    value: "test",
  },
  {
    type: "tag-left-bracket",
    value: "<",
  },
  {
    type: "tag-name",
    value: "span",
  },
  {
    type: "attribute-name",
    value: "x",
  },
  {
    type: "attribute-assign",
    value: "=",
  },
  {
    type: "attribute-value",
    value: "",
  },
  {
    type: "tag-self-closing-right-bracket",
    value: "/>",
  },
  {
    type: "tag-closing-left-bracket",
    value: "</",
  },
  {
    type: "tag-name",
    value: "div",
  },
  {
    type: "tag-right-bracket",
    value: ">",
  },
];

test("Lexer works", () => {
  const lex = HTMLLexer(exampleData);
  expect(lex).toEqual(exampleParsedData);
});

const exampleDatas = [
    "a",
    "",
    "<div class=\"test\" />",
    "<div a='b' >",
    "<div a=1 >",
]

test("Lexer works 2", () => {
  for (const data of exampleDatas) {
    expect(HTMLLexer(data)).not.toBeNull();
  }
})