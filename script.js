(function () {
  var toggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var open = toggle.classList.toggle('is-open');
      navLinks.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('is-open');
        navLinks.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initCarousel(root) {
    var track = root.querySelector('.carousel-track');
    var slides = root.querySelectorAll('.carousel-slide');
    var prevBtn = root.querySelector('.carousel-prev');
    var nextBtn = root.querySelector('.carousel-next');
    var dotsContainer = root.querySelector('.carousel-dots');
    var viewport = root.querySelector('.carousel-viewport');
    var index = 0;
    var count = slides.length;

    if (!track || count === 0) return;

    if (count <= 1) {
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
      if (dotsContainer) dotsContainer.hidden = true;
      return;
    }

    var dots = [];

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', '사진 ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });

    function goTo(i) {
      index = (i + count) % count;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (dot, j) {
        dot.classList.toggle('is-active', j === index);
        dot.setAttribute('aria-selected', j === index ? 'true' : 'false');
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goTo(index - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(index + 1);
      });
    }

    if (viewport) {
      var startX = 0;
      var dragging = false;

      viewport.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        dragging = true;
      }, { passive: true });

      viewport.addEventListener('touchend', function (e) {
        if (!dragging) return;
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          goTo(index + (diff > 0 ? 1 : -1));
        }
        dragging = false;
      }, { passive: true });

      viewport.addEventListener('mousedown', function (e) {
        startX = e.clientX;
        dragging = true;
      });

      viewport.addEventListener('mouseup', function (e) {
        if (!dragging) return;
        var diff = startX - e.clientX;
        if (Math.abs(diff) > 40) {
          goTo(index + (diff > 0 ? 1 : -1));
        }
        dragging = false;
      });

      viewport.addEventListener('mouseleave', function () {
        dragging = false;
      });
    }

    goTo(0);
  }

  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  function initMemberProfiles() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.member').forEach(function (member) {
      var mainFrame = member.querySelector('.member-main');
      var mainImg = member.querySelector('.member-main img');
      var thumbs = Array.prototype.slice.call(member.querySelectorAll('.thumb[data-src]'));

      if (!mainFrame || !mainImg || !thumbs.length) return;

      function applyPhotoAdjust(img, src) {
        img.classList.remove(
          'member-photo-adjust-1',
          'member-photo-adjust-2',
          'member-photo-adjust-2-tight',
          'member-photo-zoom',
          'member-photo-zoom-2',
          'member-photo-adjust-3',
          'member-photo-zoom-3',
          'member-photo-zoom-3-third'
        );

        if (src.indexOf('member1-1') !== -1) {
          img.classList.add('member-photo-adjust-1');
        } else if (src.indexOf('member2-2') !== -1) {
          img.classList.add('member-photo-adjust-2', 'member-photo-adjust-2-tight', 'member-photo-zoom-2');
        } else if (src.indexOf('member2-1') !== -1) {
          img.classList.add('member-photo-adjust-2', 'member-photo-zoom');
        } else if (src.indexOf('member2') !== -1) {
          img.classList.add('member-photo-adjust-2');
        } else if (src.indexOf('member3-3') !== -1) {
          img.classList.add('member-photo-adjust-3', 'member-photo-zoom-3-third');
        } else if (src.indexOf('member3-1') !== -1) {
          img.classList.add('member-photo-adjust-3', 'member-photo-zoom-3');
        } else if (src.indexOf('member3') !== -1) {
          img.classList.add('member-photo-adjust-3');
        }
      }

      function setActiveThumb(activeThumb) {
        thumbs.forEach(function (thumb) {
          thumb.classList.toggle('is-active', thumb === activeThumb);
        });
      }

      function applyMainPhoto(src, activeThumb) {
        var probe = new Image();
        probe.onload = function () {
          mainImg.src = src;
          mainImg.hidden = false;
          mainFrame.classList.remove('is-placeholder');
          applyPhotoAdjust(mainImg, src);

          var placeholderText = mainFrame.querySelector('span');
          if (placeholderText) placeholderText.remove();

          setActiveThumb(activeThumb);
        };
        probe.src = src;
      }

      function playFlash(onPeak) {
        mainFrame.classList.remove('is-flashing');
        void mainFrame.offsetWidth;
        mainFrame.classList.add('is-flashing');

        window.setTimeout(onPeak, 70);

        window.setTimeout(function () {
          mainFrame.classList.remove('is-flashing');
        }, 280);
      }

      function setMainPhoto(src, activeThumb, withFlash) {
        if (withFlash && activeThumb.classList.contains('is-active')) return;

        if (withFlash && !prefersReducedMotion) {
          playFlash(function () {
            applyMainPhoto(src, activeThumb);
          });
          return;
        }

        applyMainPhoto(src, activeThumb);
      }

      thumbs.forEach(function (thumb) {
        var src = thumb.getAttribute('data-src');
        if (!src) return;

        var loader = new Image();

        loader.onload = function () {
          thumb.classList.remove('is-placeholder');
        };

        loader.onerror = function () {
          thumb.classList.add('is-placeholder');
          if (!thumb.querySelector('span')) {
            var label = thumb.getAttribute('aria-label') || '';
            var num = label.replace('사진 ', '');
            var span = document.createElement('span');
            span.textContent = num;
            thumb.appendChild(span);
          }
        };

        loader.src = src;

        thumb.addEventListener('click', function () {
          setMainPhoto(src, thumb, true);
        });
      });

      var firstThumb = member.querySelector('.thumb.is-active') || thumbs[0];
      if (firstThumb) {
        setMainPhoto(firstThumb.getAttribute('data-src'), firstThumb, false);
      }
    });
  }

  initMemberProfiles();
})();
