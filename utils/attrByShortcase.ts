const AttrByShortcase = {
    "alt": "a",
    "autocomplete": "b",
    "checked": "c",
    "class": "d",
    "data": "e",
    "disabled": "f",
    "enctype": "g",
    "for": "h",
    "form": "i",
    "formaction": "j",
    "height": "k",
    "href": "l",
    "id": "m",
    "multiple": "n",
    "name": "o",
    "novalidate": "p",
    "pattern": "q",
    "placeholder": "r",
    "readonly": "s",
    "rel": "t",
    "required": "u",
    "role": "v",
    "selected": "w",
    "sizes": "x",
    "src": "y",
    "srcset": "z",
    "style": "aa",
    "target": "ab",
    "title": "ac",
    "type": "ad",
    "value": "ae",
    "width": "af",
    "accept": "ag",
    "accept-charset": "ah",
    "action": "ai",
    "method": "aj",
} as Record<string, string>;

const AttrByShortcaseKeys = Object.keys(AttrByShortcase);

export function parseAttrByShortcase(type: string): string {
  if (type.startsWith("on")) {
    return "$" + type.slice(2);
  }
  if (AttrByShortcaseKeys.includes(type)) {
    return AttrByShortcase[type];
  }
  return "_" + type;
}