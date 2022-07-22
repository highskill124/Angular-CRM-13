export const GetLocation = (href: string) => {
    const parser = document.createElement('a');
    parser.href = href;
    // IE doesn't populate all link properties when setting .href with a relative URL,
    // however .href will return an absolute URL which then can be used on itself
    // to populate these additional fields.
    if (location.host === '') {
        parser.href = parser.href;
    }
    return parser;
};

export const AutoAddProtocol = (href: string) => {
    let hrefCopy = href;
    const parser = GetLocation(href);
    // @ts-ignore
    if (parser.protocol !== 'http:' || parser.protocol !== 'https:') {
        hrefCopy = 'http://' + href;
    }

    return hrefCopy;
};
