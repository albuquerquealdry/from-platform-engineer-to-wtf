/**
 * Rewrites root-relative links and images inside Markdown/MDX to include the
 * site base, so a post can keep writing plain `/logs/004-...` and still work
 * when the site is served from a subpath.
 *
 * Deliberately small — no unist-util-visit dependency.
 */
export function rehypeBaseLinks(base = '/') {
  const prefix = base.replace(/\/+$/, '');

  const needsPrefix = (value) =>
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    (prefix === '' || !value.startsWith(`${prefix}/`));

  return () => (tree) => {
    if (prefix === '') return;

    const walk = (node) => {
      if (node.type === 'element') {
        const props = node.properties ?? {};
        if (node.tagName === 'a' && needsPrefix(props.href)) {
          props.href = prefix + props.href;
        }
        if ((node.tagName === 'img' || node.tagName === 'source') && needsPrefix(props.src)) {
          props.src = prefix + props.src;
        }
      }
      for (const child of node.children ?? []) walk(child);
    };

    walk(tree);
  };
}
