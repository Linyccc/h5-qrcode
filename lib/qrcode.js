(function ($) {
  var Qrcode = function (tempBtn) {
    var _this_ = this;
    var isWeiboWebView = /__weibo__/.test(navigator.userAgent);

    if (isWeiboWebView) {
      if (window.WeiboJSBridge) {
        _this_.bridgeReady(tempBtn);
      } else {
        document.addEventListener("WeiboJSBridgeReady", function () {
          _this_.bridgeReady(tempBtn);
        });
      }
    } else {
      _this_.nativeReady(tempBtn);
    }
  };

  Qrcode.prototype = {
    nativeReady: function (tempBtn) {
      $("[node-type=jsbridge]", tempBtn).on("click", function (e) {
        e.stopPropagation();
      });

      $(tempBtn).bind("click", function (e) {
        $(this).find("input[node-type=jsbridge]").trigger("click");
      });

      $(tempBtn).bind("change", this.getImgFile);
    },
    bridgeReady: function (tempBtn) {
      $(tempBtn).bind("click", this.weiBoBridge);
    },
    weiBoBridge: function () {
      window.WeiboJSBridge.invoke("scanQRCode", null, function (params) {
        //得到扫码的结果
        $(".result-qrcode").append(params.result + "<br/>");
        console.log("11111");
      });
    },
    getImgFile: function () {
      var _this_ = this;
      var inputDom = $(this).find("input[node-type=jsbridge]");
      var imgFile = inputDom[0].files;
      var oFile = imgFile[0];
      var oFReader = new FileReader();
      var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

      if (imgFile.length === 0) {
        return;
      }

      if (!rFilter.test(oFile.type)) {
        alert("选择正确的图片格式!");
        return;
      }

      oFReader.onload = function (oFREvent) {
        qrcode.decode(oFREvent.target.result);
        qrcode.callback = function (data) {
          //得到扫码的结果
          //   $(".result-qrcode").append(data + "<br/>");
          //   console.log("11");
          var confirm = new ConfirmClass();
          confirm.show({
            title: "核销确认",
            content: "核销单：FZ1858688338232",
            btns: [
              {
                text: "取消",
                // callback: function () {
                //   console.log("点击了不需要按钮");
                // },
              },
              {
                text: "确定",
                callback: function (instance) {
                  instance.close = true;
                  var toast = new ToastClass();
                  toast.show({
                    loading: true,
                    onShow: function () {
                      setTimeout(function () {
                        toast.show({
                          text:
                            '<div><svg t="1608882127520" class="icon" style="width: 1.6em; height: 1.6em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4814"><path d="M512 960A448 448 0 1 1 512 64a448 448 0 0 1 0 896z m207.744-682.048L442.752 595.712 299.136 464.704 212.864 559.36l240.384 219.264 363.008-416.512-96.512-84.096z" p-id="4815" fill="#1afa29" data-spm-anchor-id="a313x.7781069.0.i6" class="selected"></path></svg><span style="vertical-align:middle">核销成功！</span></div>',
                          duration: 2000,
                        });
                      }, 1000);
                    },
                  });
                },
              },
            ],
          });
        };
      };

      oFReader.readAsDataURL(oFile);
    },
    destory: function () {
      $(tempBtn).off("click");
    },
  };

  Qrcode.init = function (tempBtn) {
    var _this_ = this;

    tempBtn.each(function () {
      new _this_($(this));
    });
  };
  window.Qrcode = Qrcode;
})(window.Zepto ? Zepto : jQuery);
