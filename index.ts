import { Node, parse } from 'node-html-parser';
import { parseTagByShortcase } from './utils/tagByShortcase';
import { parseAttrByShortcase } from './utils/attrByShortcase';

export function HTMLHyperCompresser(htmlString: string): string {
    const htmlTree = parse(htmlString).childNodes;

    const htmlTreeText: string[] = [];

    // parents => parents[0] => parents[0][0] => parents[0][1] => parents[1]
    const walker = function* (nodes: Node[], depth = 0): Generator<[Node, number], null, unknown> {
        for (const node of nodes) {
            yield [node, depth];
            if (node.childNodes.length !== 0) {
                depth++;
                yield* walker(node.childNodes, depth);
                depth--;
            }
        }
        return null
    };

    let beforeDepth = 0;

    for (const [node, depth] of walker(htmlTree)) {
        const type = node.nodeType === 1 ? "tag" : "content";

        if (type === "tag") {
            htmlTreeText.push(parseTagByShortcase(node.rawTagName));
            // @ts-expect-error NOT TYPED WELL
            const attributes = node.attributes as Record<string, string>;
            for (const [key, value] of Object.entries(attributes)) {
                htmlTreeText.push(`${parseAttrByShortcase(key)}@${value};`);
            }
        } else if (type === "content") {
            htmlTreeText.push(`^${node.rawText}`);
        }

        if (depth < beforeDepth) {
            htmlTreeText.push("<");
        }else if (depth > beforeDepth) {
            htmlTreeText.push(">");
        }else {
            htmlTreeText.push("=");
        }

        beforeDepth = depth;
    }

    return htmlTreeText.join("");
}

const raw = "<div><h1>Hello</h1><a href=\"#a\">a</a></div>aiueo<i />aaa<a id=\'a\'>a</a><custom id=\"a\">a</custom>"
const text = HTMLHyperCompresser(raw)
console.log(text)
console.log(text.length / raw.length)