let water = {};
/**
 * 水印
 * @param settings
 */
water.watermark=(settings)=>{
  //默认设置
  var defaultSettings = {
    watermark_Id: 'waterMark',
    watermark_txt: "text",
    watermark_x: 20, //水印起始位置x轴坐标
    watermark_y: 20, //水印起始位置Y轴坐标
    watermark_rows: 20, //水印行数
    watermark_cols: 20, //水印列数
    watermark_x_space: 200, //水印x轴间隔
    watermark_y_space: 50, //水印y轴间隔
    watermark_color: '#565656', //水印字体颜色
    watermark_alpha: 0.15, //水印透明度
    watermark_fontsize: '18px', //水印字体大小
    watermark_font: '微软雅黑', //水印字体
    watermark_width: 200, //水印宽度
    watermark_height: 300, //水印长度
    watermark_angle: 30, //水印倾斜度数
    watermark_contents: [],
    watermark_contents_margin: 200,
    watermark_repeats: 3
  };
  //采用配置项替换默认值，作用类似jquery.extend
  // eslint-disable-next-line no-undef
  if (arguments.length === 1 && typeof arguments[0] === "object") {
    // eslint-disable-next-line no-undef
    var src = arguments[0] || {};
    // eslint-disable-next-line no-undef
    for (key in src) {
      // eslint-disable-next-line no-undef
      if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
        continue;
        // eslint-disable-next-line no-undef
      else if (src[key])
      // eslint-disable-next-line no-undef
        defaultSettings[key] = src[key];
    }
  }
  defaultSettings.watermark_contents = settings.watermark_contents

  var oTemp = document.createDocumentFragment();
  //获取页面最大宽度
  var page_width = document.body.clientWidth;
  //获取页面最大长度
  var page_height = document.documentElement.clientHeight;
  var borderL = Math.sqrt(Math.pow(page_width, 2) + Math.pow(page_height, 2));
  var diffH = (borderL - page_height) / 2;
  var diffW = (borderL - page_width) / 2;
  var waterMark = document.createElement('div');
  waterMark.id = defaultSettings.watermark_Id;
  waterMark.style.width = borderL + 'px';
  waterMark.style.height = borderL + 'px';
  waterMark.style.overflow = "hidden";
  waterMark.style.position = "fixed";
  waterMark.style.left = -diffW + 'px';
  waterMark.style.top = -diffH + 'px';
  waterMark.style.pointerEvents = 'none';
  waterMark.style.pointerEvents = 'none';
  waterMark.style.webkitTransform = "rotate(" + defaultSettings.watermark_angle + "deg)";
  waterMark.style.MozTransform = "rotate(" + defaultSettings.watermark_angle + "deg)";
  waterMark.style.msTransform = "rotate(" + defaultSettings.watermark_angle + "deg)";
  waterMark.style.OTransform = "rotate(" + defaultSettings.watermark_angle + "deg)";
  waterMark.style.transform = "rotate(" + defaultSettings.watermark_angle + "deg)";
  waterMark.style.zIndex = "9999999";

  var markerRows = borderL / defaultSettings.watermark_height;
  var markerConten = '';
  for (var t = 0; t < defaultSettings.watermark_repeats; t++) {
    for (var i = 0; i < defaultSettings.watermark_contents.length; i++) {
      var span = '<span style="margin-left: ' + defaultSettings.watermark_contents_margin + 'px">' + defaultSettings.watermark_contents[i] + '<span>';
      markerConten += span;
    }
  }

  for (i = 0; i < markerRows; i++) {
    var mask_div = document.createElement('div');
    mask_div.id = 'mask_div_' + i;
    mask_div.innerHTML = markerConten;
    mask_div.style.visibility = "";
    mask_div.style.overflow = "hidden";
    mask_div.style.zIndex = "9999999";
    mask_div.style.opacity = defaultSettings.watermark_alpha;
    mask_div.style.fontSize = defaultSettings.watermark_fontsize;
    mask_div.style.fontFamily = defaultSettings.watermark_font;
    mask_div.style.color = defaultSettings.watermark_color;
    mask_div.style.textAlign = "center";
    mask_div.style.width = '100%';
    mask_div.style.height = defaultSettings.watermark_height + 'px';
    mask_div.style.display = "block";
    mask_div.style.whiteSpace = 'nowrap';
    oTemp.appendChild(mask_div);
  }
  waterMark.appendChild(oTemp);
  document.body.appendChild(waterMark);
}

export default water
