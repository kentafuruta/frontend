(function($) {
  let _click = 'ontouchstart' in window ? 'touchend' : 'click';

  $(function() {
    // menuBtn
    $('.menuBtn').on(_click, function(e) {
      $(this).toggleClass('is-active');
    })
  });
})(jQuery);
