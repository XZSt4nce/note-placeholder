export class Utils {
    splitHeadersWithEscapedSymbols(hrefAttribute: string): string[] {
        const tempMarker = "|~~~|";
        const [href, ...headers]: string[] = hrefAttribute.replace(/\\#/g, tempMarker).split("#").map(el => el.replace(tempMarker, '\\#'));
        if (href) {
            return [href, ...headers];
        }
        return headers;
    }
}