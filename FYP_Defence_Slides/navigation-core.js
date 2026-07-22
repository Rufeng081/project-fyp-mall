(function exposeNavigationCore(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SlideNavigation = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createNavigationCore() {
  function parseSlideHash(hash, slideCount) {
    const match = String(hash || '').match(/^#slide-(\d+)$/);
    if (!match) return 0;
    const humanIndex = Number(match[1]);
    if (!Number.isInteger(humanIndex) || humanIndex < 1 || humanIndex > slideCount) return 0;
    return humanIndex - 1;
  }

  return { parseSlideHash };
});
