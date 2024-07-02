import { parse } from 'node-html-parser';

export function HTMLHyperCompresser(htmlString: string) {
    const htmlTree = parse(htmlString);
}
