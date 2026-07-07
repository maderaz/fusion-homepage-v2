// Scale the fixed 1880px design canvas to fit the viewport width so the
// layout never overflows and stays horizontally centered on any screen.
// The flex parent (#fv-scale-outer) handles horizontal centering; this only
// computes the uniform scale and reserves the scaled height.
(function () {
  var CANVAS_W = 1880;
  var scale = document.getElementById('fv-scale');
  var outer = document.getElementById('fv-scale-outer');
  if (!scale || !outer) return;
  function fit() {
    var vw = document.documentElement.clientWidth;
    var s = Math.min(1, vw / CANVAS_W);
    scale.style.transform = 'scale(' + s + ')';
    // Transform doesn't affect layout, so reserve the scaled height only.
    outer.style.height = (scale.offsetHeight * s) + 'px';
  }
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fit);
  } else {
    fit();
  }
})();
