'use strict';

(function ($) {
  $(function () {
    console.log('hello');
    $('.lead').tipso();
  });
  // 表示非表示
  $.fn.isVisible = function () {
    return $.expr.filters.visible(undefined[0]);
  };
})(jQuery);
//# sourceMappingURL=app.js.map