export function encodeString(string: string) {
  switch (string) {
    case "\\":
      return "\\\\";
    case '"':
      return '\\"';
    case "n":
      return "\\n";
    case "r":
      return "\\r";
    case "t":
      return "\\t";
    case "b":
      return "\\b";
    case "f":
      return "\\f";
    default:
      return string;
  }
}
