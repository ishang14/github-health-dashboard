/**
 * Accepts a GitHub repo in several shapes and returns { owner, repo }, or
 * null if it can't be understood.
 *
 *   facebook/react
 *   https://github.com/facebook/react
 *   github.com/facebook/react.git
 *   https://github.com/facebook/react/tree/main/packages
 */
export const parseRepoInput = (value) => {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  let pathname = trimmed;

  if (/^https?:\/\//i.test(trimmed) || /^github\.com/i.test(trimmed)) {
    try {
      const url = new URL(
        /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
      );

      if (url.hostname.replace(/^www\./, "") !== "github.com") {
        return null;
      }

      pathname = url.pathname;
    } catch {
      return null;
    }
  }

  const parts = pathname.split("/").filter(Boolean);

  if (parts.length < 2) return null;

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/, "");

  if (!owner || !repo) return null;

  return { owner, repo };
};
