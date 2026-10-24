import sanitizeHtml from "sanitize-html";

// Allows only the formatting the instructor's editor can produce.
export function sanitizeDescription(html: string) {
    return sanitizeHtml(html, {
        allowedTags: [
            "p", "br", "strong", "b", "em", "i", "u", "s", "a",
            "ul", "ol", "li", "h1", "h2", "h3", "blockquote", "code", "pre", "hr",
        ],
        allowedAttributes: { a: ["href", "target", "rel"] },
        allowedSchemes: ["http", "https", "mailto"],
        transformTags: {
            a: sanitizeHtml.simpleTransform("a", {
                target: "_blank",
                rel: "noopener noreferrer nofollow",
            }),
        },
    });
}