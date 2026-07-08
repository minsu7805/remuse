(function () {
  // YouTube 영상 ID만 넣으면 페이지에서 바로 재생됩니다.
  // 예: https://www.youtube.com/watch?v=ABC123 → id: 'ABC123'
  var videos = [
    { id: 'xzZA-FK_sRY', title: '해변의 여인 / 쿨(COOL)' },
    { id: 'O2FAYElIkGk', title: 'Rude / 하트투하츠 커버댄스' }
  ];

  var grid = document.querySelector('.video-grid');
  if (!grid) return;

  function disableCaptions(player) {
    if (!player || typeof player.unloadModule !== 'function') return;

    try {
      player.unloadModule('captions');
    } catch (e) {}

    try {
      player.unloadModule('cc');
    } catch (e) {}

    try {
      player.setOption('captions', 'track', {});
    } catch (e) {}
  }

  grid.innerHTML = videos.map(function (video, index) {
    if (!video.id) {
      return (
        '<article class="video-card">' +
          '<div class="video-embed">' +
            '<div class="video-placeholder">YouTube 영상 ID 추가<br><code>videos.js</code></div>' +
          '</div>' +
          '<p class="video-title">' + video.title + '</p>' +
        '</article>'
      );
    }

    return (
      '<article class="video-card">' +
        '<div class="video-embed">' +
          '<div id="yt-player-' + index + '" class="video-player"></div>' +
        '</div>' +
        '<p class="video-title">' + video.title + '</p>' +
      '</article>'
    );
  }).join('');

  function initPlayers() {
    videos.forEach(function (video, index) {
      if (!video.id) return;

      new YT.Player('yt-player-' + index, {
        videoId: video.id,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          origin: window.location.origin
        },
        events: {
          onReady: function (event) {
            disableCaptions(event.target);
          },
          onStateChange: function (event) {
            if (event.data === YT.PlayerState.PLAYING) {
              disableCaptions(event.target);
            }
          },
          onApiChange: function (event) {
            disableCaptions(event.target);
          }
        }
      });
    });
  }

  if (window.YT && window.YT.Player) {
    initPlayers();
    return;
  }

  var previousReady = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = function () {
    if (typeof previousReady === 'function') {
      previousReady();
    }
    initPlayers();
  };

  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
})();
