(($)=>{
  $(() => {
    // ツールチップ
    $('.js-tooltip').tipso();

    // smoothscroll
    $('#to-top a, .js-smooth').click(function(e) {
      let speed = 600;
      let href = $(this).attr('href');
      let $target = (href === '#' || href === '') ? $('html') : $(href);
      let position = $target.offset().top;
      $('body, html').animate({scrollTop: position}, speed, 'swing');
      return false;
    });

    // moment.js 日付用ライブラリ
    var output = moment().format('YYYY年MM月DD日 HH:mm:ss dddd');
    console.log(output);
  });

  /********************************
  // トップへ戻る
  *********************************/
  $(() => {
    let showFlug = false;
    $(window).on('scroll load', function(e) {
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
  $.fn.isVisible = () => {
    return $.expr.filters.visible(this[0]);
  };
})(jQuery);
