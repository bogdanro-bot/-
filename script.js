(function () {
  const feedbackBtn = document.getElementById("feedbackBtn");
  const feedbackOutput = document.getElementById("feedbackOutput");
  const galleryImage = document.getElementById("galleryImage");
  const prevSlide = document.getElementById("prevSlide");
  const nextSlide = document.getElementById("nextSlide");
  const galleryCounter = document.getElementById("galleryCounter");

  /** Основные фото (Unsplash). Если не открываются — сработает fallback ниже. */
  const slides = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85"
  ];

  /** Запасные картинки (picsum), если основной хост недоступен */
  const slideFallbacks = [
    "https://picsum.photos/seed/nedvizh1/1600/900",
    "https://picsum.photos/seed/nedvizh2/1600/900",
    "https://picsum.photos/seed/nedvizh3/1600/900"
  ];

  let currentSlide = 0;
  let usingFallback = false;

  if (feedbackBtn && feedbackOutput) {
    feedbackBtn.addEventListener("click", () => {
      feedbackOutput.textContent = "Телефон: 89137463760";
    });
  }

  function renderSlide() {
    if (!galleryImage || slides.length === 0) {
      return;
    }
    const list = usingFallback ? slideFallbacks : slides;
    galleryImage.src = list[currentSlide];
    galleryImage.decoding = "async";
    if (galleryCounter) {
      galleryCounter.textContent = `${currentSlide + 1} / ${slides.length}`;
    }
  }

  function bindGalleryImageError() {
    if (!galleryImage) return;
    galleryImage.addEventListener("error", () => {
      if (!usingFallback) {
        usingFallback = true;
        renderSlide();
      }
    });
  }

  function initGalleryControls() {
    if (!galleryImage || !prevSlide || !nextSlide) {
      return;
    }
    bindGalleryImageError();
    renderSlide();

    prevSlide.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      renderSlide();
    });

    nextSlide.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % slides.length;
      renderSlide();
    });
  }

  initGalleryControls();

  /**
   * Пока #siteShell скрыт (display:none до входа), браузер часто не грузит img.
   * После показа сайта Firebase — перезапускаем слайд и прогреваем картинки.
   */
  window.addEventListener("site-visible", () => {
    requestAnimationFrame(() => {
      renderSlide();
      slides.forEach((src) => {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
      });
    });
  });
})();
