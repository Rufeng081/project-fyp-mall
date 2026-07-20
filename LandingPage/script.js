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

  const syncChapterFromScroll = () => {
    const readingLine = window.scrollY + Math.min(window.innerHeight * 0.28, 240);
    let activeChapter = chapters[0];

    for (const chapter of chapters) {
      if (chapter.offsetTop <= readingLine) activeChapter = chapter;
      else break;
    }

    setCurrentChapter(activeChapter.id);
  };

  let scrollFramePending = false;
  window.addEventListener('scroll', () => {
    if (scrollFramePending) return;
    scrollFramePending = true;
    window.requestAnimationFrame(() => {
      syncChapterFromScroll();
      scrollFramePending = false;
    });
  }, { passive: true });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) syncChapterFromScroll();
    },
    { rootMargin: '-18% 0px -81% 0px', threshold: 0 }
  );

  for (const chapter of chapters) observer.observe(chapter);
  syncChapterFromScroll();
})();
