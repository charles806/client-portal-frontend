/**
 * Sanitizes a string value by trimming whitespace and removing potentially malicious HTML tags.
 * This is a basic sanitization suitable for most form inputs.
 */
export function sanitizeValue(value: string): string {
    if (typeof value !== "string") return value;

    // 1. Trim leading and trailing whitespace
    let sanitized = value.trim();

    // 2. Remove potentially malicious tags (basic script/iframe/style removal)
    // This is a simple regex-based approach for client-side defense.
    // For robust security, server-side validation/sanitization is always required.
    sanitized = sanitized
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gim, "")
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
        .replace(/on\w+="[^"]*"/gim, "") // event handlers like onclick="..."
        .replace(/on\w+='[^']*'/gim, "") // event handlers like onclick='...'
        .replace(/href="javascript:[^"]*"/gim, "") // javascript: links
        .replace(/href='javascript:[^']*'/gim, "");

    return sanitized;
}
