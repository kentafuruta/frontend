'use strict';

(function ($) {
  $(function () {
    // ツールチップ
    $('.js-tooltip').tipso();

    // smoothscroll
    $('#to-top a, .js-smooth').click(function (e) {
      var speed = 600;
      var href = $(this).attr('href');
      var $target = href === '#' || href === '' ? $('html') : $(href);
      var position = $target.offset().top;
      $('body, html').animate({ scrollTop: position }, speed, 'swing');
      return false;
    });

    // moment.js 日付用ライブラリ
    var output = moment().format('YYYY年MM月DD日 HH:mm:ss dddd');
    console.log(output);
  });

  /********************************
  // トップへ戻る
  *********************************/
  $(function () {
    var showFlug = false;
    $(window).on('scroll load', function (e) {
      if ($(this).scrollTop() > 100) {
        if (showFlug === false) {
          showFlug = true;
          $('#to-top').addClass('on');
        }
      } else {
        if (showFlug) {
          showFlug = false;
          $('#to-top').removeClass('on');
        }
      }
    });
  });

  /********************************
  // 表示非表示
  *********************************/
  $.fn.isVisible = function () {
    return $.expr.filters.visible(undefined[0]);
  };
})(jQuery);
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
