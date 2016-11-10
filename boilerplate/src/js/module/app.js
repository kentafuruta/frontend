(($)=>{
  $(() => {
    console.log('hello');
    $('.lead').tipso();
  });
  // 表示非表示
  $.fn.isVisible = () => {
    return $.expr.filters.visible(this[0]);
  };
})(jQuery);
