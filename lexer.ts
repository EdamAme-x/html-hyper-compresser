import type { Tokens, Token } from "./global.types";
import { encodeString } from "./utils/encodeString";

export function HTMLLexer(htmlString: string): Tokens {
  let pointer = 0;
  function next(step: number = 1) {
    const char = htmlString[pointer] || null;
    pointer += step;
    return char;
  }

  function back(step: number = 1) {
    pointer -= step;
    const char = htmlString[pointer];
    if (!char) throw new Error("Unexpected end of html string");
    return char;
  }

  function skipEmpty() {
    while (/\s/.test(peek())) {
      next();
    }
    return peek();
  }

  function peek(step: number = 0) {
    const peekString = htmlString[pointer + step];
    if (!peekString) throw new Error("Unexpected end of html string");
    return peekString;
  }

  function stringParser() {
    let string = "";
    while (true) {
      const char = next();
      if (char === "\\") {
        const nextChar = next();
        if (!nextChar) throw new Error("Unexpected end of html string");
        if (nextChar === "u") {
          let unicode = 0;
          for (let i = 0; i < 4; i++) {
            const char = next();
            if (!char) throw new Error("Unexpected end of html string");
            const code = char.charCodeAt(0) * Math.pow(16, 3 - i);
            if (isFinite(code)) {
              unicode += code;
            } else {
              back();
              break;
            }
          }
          continue;
        }
        string += encodeString(nextChar);
        continue;
      }
      if (char === '"' || char === "'") {
        break;
      }
      string += char;
    }
    return string;
  }

  function attributesParser() {
    while (true) {
      skipEmpty();
      const char = next();
      if (char === ">") {
        tokensArray.push({ type: "tag-right-bracket", value: ">" });
        break;
      }

      if (char === "/" && peek() === ">") {
        if (peek(-1) === "<")
          throw new Error("Unexpected end of html attribute");

        next();
        tokensArray.push({
          type: "tag-self-closing-right-bracket",
          value: "/>",
        });
        break;
      }

      if (!char) throw new Error("Unexpected end of html attribute");

      let name = char;
      let value = "";

      while (/[a-zA-Z_]/.test(peek())) {
        name += next();
      }

      tokensArray.push({ type: "attribute-name", value: name });

      if (peek() === "=") {
        next();
        tokensArray.push({ type: "attribute-assign", value: "=" });
        if (peek() === '"' || peek() === "'") {
          next();
          value = stringParser();
          tokensArray.push({ type: "attribute-value", value: value });
        } else {
          const nextChar = next();
          if (
            nextChar !== ">" &&
            nextChar !== " " &&
            nextChar !== "/" &&
            peek() !== ">"
          ) {
            value += nextChar;
            while (true) {
              const nextChar = next();
              if (
                nextChar === " " ||
                nextChar === ">" ||
                (nextChar === "/" && peek() === ">")
              ) {
                break;
              }
              value += nextChar;
            }
          } else {
            value = "";
          }
          tokensArray.push({ type: "attribute-value", value });
        }
      } else {
        next();
        tokensArray.push({ type: "attribute-assign", value: "=" });
        tokensArray.push({ type: "attribute-value", value: "" });
        continue;
      }

      if (!name || !value) throw new Error("Unexpected end of html attribute");
    }
  }

  let tokensArray: Token[] = [];

  while (true) {
    const char = next();
    if (char === "<") {
      const nextChar = skipEmpty();
      if (!nextChar) throw new Error("Unexpected end of html tag");

      if (/[a-zA-Z_-]/.test(nextChar)) {
        tokensArray.push({ type: "tag-left-bracket", value: "<" });
        let tagName = "";
        while (/[a-zA-Z_-]/.test(peek())) {
          tagName += next();
        }

        tokensArray.push({ type: "tag-name", value: tagName });
        attributesParser();

        continue;
      } else if (nextChar === "/" && /[a-zA-Z_-]/.test(peek(2) || "")) {
        tokensArray.push({
          type: "tag-closing-left-bracket",
          value: "</",
        });
        next();
        let tagName = "";
        while (/[a-zA-Z_-]/.test(peek())) {
          tagName += next();
        }
        tokensArray.push({ type: "tag-name", value: tagName });
        next();
        tokensArray.push({ type: "tag-right-bracket", value: ">" });
        continue;
      } else if (nextChar === ">") {
        if (peek(-1) === "<") throw new Error("Unexpected end of html tag");

        tokensArray.push({ type: "tag-right-bracket", value: ">" });
        next();
        continue;
      } else if (nextChar === "/") {
        tokensArray.push({ type: "tag-closing-left-bracket", value: "</" });
        next();
        continue;
      } else {
        throw new Error("Unexpected character: <" + nextChar);
      }
    } else if (!!char) {
      tokensArray.push({ type: "content", value: char });
      continue;
    } else {
      break;
    }
  }

  for (let i = 0; i < tokensArray.length; i++) {
    const token = tokensArray[i];
    if (token.type === "content") {
      const nextToken = tokensArray[i + 1];
      if (nextToken && nextToken.type === "content") {
        token.value += nextToken.value;
        tokensArray.splice(i + 1, 1);
        i--;
      }
    }
  }

  return tokensArray;
}
