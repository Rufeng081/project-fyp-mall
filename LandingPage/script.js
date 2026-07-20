(() => {
  const chapterLinks = [...document.querySelectorAll('.chapter-nav a[href^="#"]')];
  const chapters = chapterLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || chapters.length === 0) return;

  const setCurrentChapter = (chapterId) => {
    for (const link of chapterLinks) {
      const isCurrent = link.getAttribute('href') === `#${chapterId}`;
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setCurrentChapter(visible[0].target.id);
    },
    { rootMargin: '-22% 0px -58% 0px', threshold: [0, 0.2, 0.5] }
  );

  for (const chapter of chapters) observer.observe(chapter);
})();
