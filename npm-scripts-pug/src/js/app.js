(function($) {
  $(function() {
     //タブレットはPCと同じものを表示させるためユーザーエージェント判定にてviewportを設定する
    var uaViewport = function(){
      var _ua = (function(u){
        return {
          Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1)
            || u.indexOf("ipad") != -1
            || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
            || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
            || u.indexOf("kindle") != -1
            || u.indexOf("silk") != -1
            || u.indexOf("playbook") != -1,
          Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
            || u.indexOf("iphone") != -1
            || u.indexOf("ipod") != -1
            || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
            || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
            || u.indexOf("blackberry") != -1
        }
      })(window.navigator.userAgent.toLowerCase());

      if(_ua.Mobile){
        $("meta[name='viewport']").attr('content', 'width=device-width,initial-scale=1');
        $('body').removeClass('pc-site');
        $('body').addClass('sp-site');
      }else {
        $("meta[name='viewport']").attr('content', 'width=1230');
        $('body').removeClass('sp-site');
        $('body').addClass('pc-site');
      }
    }

/*************************************************************************************************
* sticky-header
**************************************************************************************************/
    $(window).on('load.sticky resize.sticky scroll.sticky', function(e) {
      var $sticky = $('.sticky-header');
      var stickyHtml = $(window).width() >= 768 ? $('.masthead').html() : $('.masthead__logo').html();
      stickyHtml += $(window).width() >= 768 ? '<div class="btns">' + $('.pc-headbar__right').html() + '</div>': '';
      var $sns = $('.sns');
      var trigger = document.getElementById("billboard") !== null ? $('#billboard').offset().top + $('#billboard').height() : $('#header').offset().top + $('#header').height();

      if(e.type === 'load') {
        $('.sticky-header__inner').html(stickyHtml);
      }

      if( $(this).scrollTop() > trigger ) {
        if($(this).width() >= 768) {
          $sns.css('top', '100px');
        }
        if($(this).width() < 1281) {
          $sticky.css({
            'left': -($(this).scrollLeft()),
            'width': '1280px'
          });
        } else {
          $sticky.css({
            'left': '',
            'width': ''
          });
        }
        $sticky.addClass('active');
      } else {
        if($(this).width() >= 768) {
          $sns.css('top', '');
        }
        $sticky.removeClass('active');
      }
    });

    $(window).on('resize.sticky', function(e) {
      var stickyHtml = $(window).width() >= 768 ? $('.masthead').html() : $('.masthead__logo').html();
      $('.sticky-header__iner').html(stickyHtml);
    });

/*************************************************************************************************
* sticky-header
**************************************************************************************************/

    $(window).on('load.totop scroll.totop', function(e) {
      var $toTop = $('.toTop');
      var trigger = document.getElementById("billboard") !== null ? $('#billboard').offset().top + $('#billboard').height() : $('#header').offset().top + $('#header').height();

      if( $(this).scrollTop() > trigger ) {
        $toTop.addClass('show');
      } else {
        $toTop.removeClass('show');
      }
    })

    $('.toTop').click(function() {
      $('body,html').animate({
            scrollTop: 0
        }, 500);
        return false;
    });
/*************************************************************************************************
* spメニュー
**************************************************************************************************/
    if($(window).width() < 768) {
      $('.sp-menu-btn').click(function() {
        $(this).find('.menu-btn').toggleClass('active');
        $('.sp-menu').toggleClass('active');
      });
      $('.sp-menu .close').click(function() {
        $('.sp-menu-btn').find('.menu-btn').removeClass('active');
        $('.sp-menu').removeClass('active');
      });
    }
    $(window).on('load.spmenu resize.spmenu', function() {
      if ($(window).width() >= 768) {
        $('.sp-menu.active').hide();
      } else {
        $('.sp-menu.active').show();
        $('.sp-menu .overlay').height($(document).height());
      }
    });

/*************************************************************************************************
* TOP 新着情報・おすすめ情報 調整
* カルーセル
* tile.js
**************************************************************************************************/
    var displayMode = '';
    var panelTrigger = 0;
    $(window).on('load resize', function(event){
      var $sliderArea = $('.top-panel .panel-area');
      var pageLength = $sliderArea.find('.panel').length;
      var panelNum = $('.panel').length;
      var slickOption = {
        adaptiveHeight: true,
        dots: true,
        appendDots: $('.pager-custom__top .bx-pager'),
        prevArrow: $('.pager-custom .bx-custom-prev'),
        nextArrow: $('.pager-custom .bx-custom-next'),
        infinite: false,
        speed: 700
      };
/* ロードした時
------------------------------------------------------------------------------*/
      if(event.type === 'load') {
        var li = "";
        panelTrigger = 1;
        //pagerの要素を作る
        if (pageLength > 1) {
          // for (var k = 0; k < pageLength; k++) {
          //   var pageNo = k+1;
          //   li += '<li><a data-slide-index="' + k +'" href="">' + pageNo + '</a></li>';
          // }
          // $('.bx-pager').append($('<ul />').append(li));
        } else {
          $sliderArea.find('.pager-custom').hide();
        }

//////////////// SP用のjs ////////////////
        if($(window).width() < 768){
          // もっとみる
          $(".top-panel").each(function(){
            var Num = 1;
            if(pageLength > Num) {
              $('.panel:gt(0)').hide();
              $(this).find('.sp-pager a').html('<i class="icon-bullet-down"></i><span>次の9件を表示する</span>');
              $(this).find('.sp-pager a').click(function(e){
                e.preventDefault();
                Num += 1;
                $(".panel:lt("+Num+")").show(400);
                if(pageLength <= Num){
                  $(this).off('click').html('<i class="icon-bullet-right"></i><span>一覧を見る</span>');
                }
              });
            } else {
              $(this).find('.sp-pager a').html('<i class="icon-bullet-right"></i><span>一覧を見る</span>');
            }
          });
          displayMode = 'sp';
        }
//////////////// PC用のjs ////////////////
        else if($(window).width() >= 768){
          $('.panel__item').tile(3);
          if (pageLength > 1) {
            $sliderArea.find('.panel-wrap').on('init', function() {
              $('.pager-custom__bottom .bx-pager').html($('.pager-custom__top .bx-pager').html())
              $('.pager-custom__bottom .bx-pager li').on('click', function() {
                $sliderArea.find('.panel-wrap').slick('slickGoTo', $('.pager-custom__bottom .bx-pager li').index(this));
              });
            }).on('beforeChange', function(e, s, c, n) {
              $('.pager-custom__bottom .bx-pager li').eq(n).addClass('slick-active')
              .siblings().removeClass('slick-active');
            }).on('afterChange', function(e, s, n) {
              $('.pager-custom__bottom .bx-pager li').eq(n).addClass('slick-active')
              .siblings().removeClass('slick-active');
            }).slick(slickOption);
          }
          displayMode = 'pc';
        }
      }

/* リサイズした時
------------------------------------------------------------------------------*/
      else {
//////////////// SP用のjs ////////////////
        if($(window).width() < 768 && displayMode !== 'sp'){
          $('body').removeClass('pc-site');
          $('body').addClass('sp-site');
          $('.panel__item').css('height', '');
          // もっとみる
          $(".top-panel").each(function(){
            var Num = 1;
            if(pageLength > Num) {
              if($sliderArea.find('.panel-wrap').hasClass('slick-initialized')) {
                $sliderArea.find('.panel-wrap').slick('unslick');
              }
              $('.panel:gt(0)').hide();
              $(this).find('.sp-pager a').html('<i class="icon-bullet-down"></i><span>次の9件を表示する</span>');
              $(this).find('.sp-pager a').click(function(e){
                e.preventDefault();
                Num += 1;
                $(".panel:lt("+Num+")").show(400);
                if(pageLength <= Num){
                  $(this).off('click').html('<i class="icon-bullet-right"></i><span>一覧を見る</span>');
                }
              });
            } else {
              $(this).find('.sp-pager a').html('<i class="icon-bullet-right"></i><span>一覧を見る</span>');
            }
          });
          displayMode = 'sp';
        }

//////////////// PC用のjs ////////////////
        else if($(window).width() >= 768 && displayMode !== 'pc'){
          $('body').removeClass('sp-site');
          $('body').addClass('pc-site');
          if(pageLength > 1) {
            $('.panel').show();
            $('.panel__item').tile(3);
            $sliderArea.find('.panel-wrap').on('init', function() {
              $('.pager-custom__bottom .bx-pager').html($('.pager-custom__top .bx-pager').html())
              $('.pager-custom__bottom .bx-pager li').on('click', function() {
                $sliderArea.find('.panel-wrap').slick('slickGoTo', $('.pager-custom__bottom .bx-pager li').index(this));
              });
            }).on('beforeChange', function(e, s, c, n) {
              $('.pager-custom__bottom .bx-pager li').eq(n).addClass('slick-active')
              .siblings().removeClass('slick-active');
            }).on('afterChange', function(e, s, n) {
              $('.pager-custom__bottom .bx-pager li').eq(n).addClass('slick-active')
              .siblings().removeClass('slick-active');
            }).slick(slickOption);
          } else {
            $('.panel__item').tile(3);
          }
          displayMode = 'pc';
        }
      }
    });

  });


  // 表示非表示
  $.fn.isVisible = function() {
    return $.expr.filters.visible(this[0]);
  };
})(jQuery);
