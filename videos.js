(function () {
  // YouTube 영상 ID만 넣으면 페이지에서 바로 재생됩니다.
  // 예: https://www.youtube.com/watch?v=ABC123 → id: 'ABC123'
  var videos = [
    { id: 'OQqJojyrkrM', title: '공연 영상 01' },
    { id: 'O2FAYElIkGk', title: '공연 영상 02' }
  ];

  var grid = document.querySelector('.video-grid');
  if (!grid) return;

  grid.innerHTML = videos.map(function (video) {
    var embedHtml = video.id
      ? '<iframe src="https://www.youtube.com/embed/' + encodeURIComponent(video.id) + '?rel=0&modestbranding=1&playsinline=1"' +
        ' title="' + video.title + '"' +
        ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"' +
        ' allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>'
      : '<div class="video-placeholder">YouTube 영상 ID 추가<br><code>videos.js</code></div>';

    return (
      '<article class="video-card">' +
        '<div class="video-embed">' + embedHtml + '</div>' +
        '<p class="video-title">' + video.title + '</p>' +
      '</article>'
    );
  }).join('');
})();
