!function(t,a,e){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof exports?module.exports=t(require("jquery")):t(a||e)}(function(t){"use strict";var a=function(a,e,n){var s={invalid:[],getCaret:function(){try{var t,e=0,n=a.get(0),r=document.selection,o=n.selectionStart;return r&&navigator.appVersion.indexOf("MSIE 10")===-1?(t=r.createRange(),t.moveStart("character",-s.val().length),e=t.text.length):(o||"0"===o)&&(e=o),e}catch(i){}},setCaret:function(t){try{if(a.is(":focus")){var e,n=a.get(0);n.setSelectionRange?n.setSelectionRange(t,t):(e=n.createTextRange(),e.collapse(!0),e.moveEnd("character",t),e.moveStart("character",t),e.select())}}catch(s){}},events:function(){a.on("keydown.mask",function(t){a.data("mask-keycode",t.keyCode||t.which),a.data("mask-previus-value",a.val()),a.data("mask-previus-caret-pos",s.getCaret()),s.maskDigitPosMapOld=s.maskDigitPosMap}).on(t.jMaskGlobals.useInput?"input.mask":"keyup.mask",s.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){a.keydown().keyup()},100)}).on("change.mask",function(){a.data("changed",!0)}).on("blur.mask",function(){i===s.val()||a.data("changed")||a.trigger("change"),a.data("changed",!1)}).on("blur.mask",function(){i=s.val()}).on("focus.mask",function(a){n.selectOnFocus===!0&&t(a.target).select()}).on("focusout.mask",function(){n.clearIfNotMatch&&!r.test(s.val())&&s.val("")})},getRegexMask:function(){for(var t,a,n,s,r,i,l=[],c=0;c<e.length;c++)t=o.translation[e.charAt(c)],t?(a=t.pattern.toString().replace(/.{1}$|^.{1}/g,""),n=t.optional,s=t.recursive,s?(l.push(e.charAt(c)),r={digit:e.charAt(c),pattern:a}):l.push(n||s?a+"?":a)):l.push(e.charAt(c).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"));return i=l.join(""),r&&(i=i.replace(new RegExp("("+r.digit+"(.*"+r.digit+")?)"),"($1)?").replace(new RegExp(r.digit,"g"),r.pattern)),new RegExp(i)},destroyEvents:function(){a.off(["input","keydown","keyup","paste","drop","blur","focusout",""].join(".mask "))},val:function(t){var e,n=a.is("input"),s=n?"val":"text";return arguments.length>0?(a[s]()!==t&&a[s](t),e=a):e=a[s](),e},calculateCaretPosition:function(){var t=a.data("mask-previus-value")||"",e=s.getMasked(),n=s.getCaret();if(t!==e){var r=a.data("mask-previus-caret-pos")||0,o=e.length,i=t.length,l=0,c=0,u=0,k=0,f=0;for(f=n;f<o&&s.maskDigitPosMap[f];f++)c++;for(f=n-1;f>=0&&s.maskDigitPosMap[f];f--)l++;for(f=n-1;f>=0;f--)s.maskDigitPosMap[f]&&u++;for(f=r-1;f>=0;f--)s.maskDigitPosMapOld[f]&&k++;if(n>i)n=10*o;else if(r>=n&&r!==i){if(!s.maskDigitPosMapOld[n]){var v=n;n-=k-u,n-=l,s.maskDigitPosMap[n]&&(n=v)}}else n>r&&(n+=u-k,n+=c)}return n},behaviour:function(e){e=e||window.event,s.invalid=[];var n=a.data("mask-keycode");if(t.inArray(n,o.byPassKeys)===-1){var r=s.getMasked(),i=s.getCaret();return setTimeout(function(){s.setCaret(s.calculateCaretPosition())},t.jMaskGlobals.keyStrokeCompensation),s.val(r),s.setCaret(i),s.callbacks(e)}},getMasked:function(t,a){var r,i,l=[],c=void 0===a?s.val():a+"",u=0,k=e.length,f=0,v=c.length,p=1,d="push",h=-1,g=0,m=[];n.reverse?(d="unshift",p=-1,r=0,u=k-1,f=v-1,i=function(){return u>-1&&f>-1}):(r=k-1,i=function(){return u<k&&f<v});for(var M;i();){var y=e.charAt(u),b=c.charAt(f),w=o.translation[y];w?(b.match(w.pattern)?(l[d](b),w.recursive&&(h===-1?h=u:u===r&&u!==h&&(u=h-p),r===h&&(u-=p)),u+=p):b===M?(g--,M=void 0):w.optional?(u+=p,f-=p):w.fallback?(l[d](w.fallback),u+=p,f-=p):s.invalid.push({p:f,v:b,e:w.pattern}),f+=p):(t||l[d](y),b===y?(m.push(f),f+=p):(M=y,m.push(f+g),g++),u+=p)}var C=e.charAt(r);k!==v+1||o.translation[C]||l.push(C);var j=l.join("");return s.mapMaskdigitPositions(j,m,v),j},mapMaskdigitPositions:function(t,a,e){var r=n.reverse?t.length-e:0;s.maskDigitPosMap={};for(var o=0;o<a.length;o++)s.maskDigitPosMap[a[o]+r]=1},callbacks:function(t){var r=s.val(),o=r!==i,l=[r,t,a,n],c=function(t,a,e){"function"==typeof n[t]&&a&&n[t].apply(this,e)};c("onChange",o===!0,l),c("onKeyPress",o===!0,l),c("onComplete",r.length===e.length,l),c("onInvalid",s.invalid.length>0,[r,t,a,s.invalid,n])}};a=t(a);var r,o=this,i=s.val();e="function"==typeof e?e(s.val(),void 0,a,n):e,o.mask=e,o.options=n,o.remove=function(){var t=s.getCaret();return o.options.placeholder&&a.removeAttr("placeholder"),a.data("mask-maxlength")&&a.removeAttr("maxlength"),s.destroyEvents(),s.val(o.getCleanVal()),s.setCaret(t),a},o.getCleanVal=function(){return s.getMasked(!0)},o.getMaskedVal=function(t){return s.getMasked(!1,t)},o.init=function(i){if(i=i||!1,n=n||{},o.clearIfNotMatch=t.jMaskGlobals.clearIfNotMatch,o.byPassKeys=t.jMaskGlobals.byPassKeys,o.translation=t.extend({},t.jMaskGlobals.translation,n.translation),o=t.extend(!0,{},o,n),r=s.getRegexMask(),i)s.events(),s.val(s.getMasked());else{n.placeholder&&a.attr("placeholder",n.placeholder),a.data("mask")&&a.attr("autocomplete","off");for(var l=0,c=!0;l<e.length;l++){var u=o.translation[e.charAt(l)];if(u&&u.recursive){c=!1;break}}c&&a.attr("maxlength",e.length).data("mask-maxlength",!0),s.destroyEvents(),s.events();var k=s.getCaret();s.val(s.getMasked()),s.setCaret(k)}},o.init(!a.is("input"))};t.maskWatchers={};var e=function(){var e=t(this),s={},r="data-mask-",o=e.attr("data-mask");if(e.attr(r+"reverse")&&(s.reverse=!0),e.attr(r+"clearifnotmatch")&&(s.clearIfNotMatch=!0),"true"===e.attr(r+"selectonfocus")&&(s.selectOnFocus=!0),n(e,o,s))return e.data("mask",new a(this,o,s))},n=function(a,e,n){n=n||{};var s=t(a).data("mask"),r=JSON.stringify,o=t(a).val()||t(a).text();try{return"function"==typeof e&&(e=e(o)),"object"!=typeof s||r(s.options)!==r(n)||s.mask!==e}catch(i){}},s=function(t){var a,e=document.createElement("div");return t="on"+t,a=t in e,a||(e.setAttribute(t,"return;"),a="function"==typeof e[t]),e=null,a};t.fn.mask=function(e,s){s=s||{};var r=this.selector,o=t.jMaskGlobals,i=o.watchInterval,l=s.watchInputs||o.watchInputs,c=function(){if(n(this,e,s))return t(this).data("mask",new a(this,e,s))};return t(this).each(c),r&&""!==r&&l&&(clearInterval(t.maskWatchers[r]),t.maskWatchers[r]=setInterval(function(){t(document).find(r).each(c)},i)),this},t.fn.masked=function(t){return this.data("mask").getMaskedVal(t)},t.fn.unmask=function(){return clearInterval(t.maskWatchers[this.selector]),delete t.maskWatchers[this.selector],this.each(function(){var a=t(this).data("mask");a&&a.remove().removeData("mask")})},t.fn.cleanVal=function(){return this.data("mask").getCleanVal()},t.applyDataMask=function(a){a=a||t.jMaskGlobals.maskElements;var n=a instanceof t?a:t(a);n.filter(t.jMaskGlobals.dataMaskAttr).each(e)};var r={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,keyStrokeCompensation:10,useInput:!/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent)&&s("input"),watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{0:{pattern:/\d/},9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},S:{pattern:/[a-zA-Z]/}}};t.jMaskGlobals=t.jMaskGlobals||{},r=t.jMaskGlobals=t.extend(!0,{},r,t.jMaskGlobals),r.dataMask&&t.applyDataMask(),setInterval(function(){t.jMaskGlobals.watchDataMask&&t.applyDataMask()},r.watchInterval)},window.jQuery,window.Zepto);
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=function(t,r){return"undefined"==typeof r&&(r="undefined"!=typeof window?require("jquery"):require("jquery")(t)),e(r),r}:e(jQuery)}(function(e){"use strict";function t(t){var r=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(t.target).closest("form").ajaxSubmit(r))}function r(t){var r=t.target,a=e(r);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;r=n[0]}var i=r.form;if(i.clk=r,"image"===r.type)if("undefined"!=typeof t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=a.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-r.offsetLeft,i.clk_y=t.pageY-r.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function a(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n=/\r?\n/g,i={};i.fileapi=void 0!==e('<input type="file">').get(0).files,i.formdata="undefined"!=typeof window.FormData;var o=!!e.fn.prop;e.fn.attr2=function(){if(!o)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t,r,n,s){function u(r){var a,n,i=e.param(r,t.traditional).split("&"),o=i.length,s=[];for(a=0;a<o;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function c(r){for(var a=new FormData,n=0;n<r.length;n++)a.append(r[n].name,r[n].value);if(t.extraData){var i=u(t.extraData);for(n=0;n<i.length;n++)i[n]&&a.append(i[n][0],i[n][1])}t.data=null;var o=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:f||"POST"});t.uploadProgress&&(o.xhr=function(){var r=e.ajaxSettings.xhr();return r.upload&&r.upload.addEventListener("progress",function(e){var r=0,a=e.loaded||e.position,n=e.total;e.lengthComputable&&(r=Math.ceil(a/n*100)),t.uploadProgress(e,a,n,r)},!1),r}),o.data=null;var s=o.beforeSend;return o.beforeSend=function(e,r){t.formData?r.data=t.formData:r.data=a,s&&s.call(this,e,r)},e.ajax(o)}function l(r){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(r){a("cannot get iframe.contentWindow document: "+r)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(r){a("cannot get iframe.contentDocument: "+r),t=e.document}return t}function i(){function t(){try{var e=n(v).readyState;a("state = "+e),e&&"uninitialized"===e.toLowerCase()&&setTimeout(t,50)}catch(r){a("Server abort: ",r," (",r.name,")"),s(L),j&&clearTimeout(j),j=void 0}}var r=m.attr2("target"),i=m.attr2("action"),o="multipart/form-data",u=m.attr("enctype")||m.attr("encoding")||o;w.setAttribute("target",p),f&&!/post/i.test(f)||w.setAttribute("method","POST"),i!==l.url&&w.setAttribute("action",l.url),l.skipEncodingOverride||f&&!/post/i.test(f)||m.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),l.timeout&&(j=setTimeout(function(){T=!0,s(A)},l.timeout));var c=[];try{if(l.extraData)for(var d in l.extraData)l.extraData.hasOwnProperty(d)&&(e.isPlainObject(l.extraData[d])&&l.extraData[d].hasOwnProperty("name")&&l.extraData[d].hasOwnProperty("value")?c.push(e('<input type="hidden" name="'+l.extraData[d].name+'">',k).val(l.extraData[d].value).appendTo(w)[0]):c.push(e('<input type="hidden" name="'+d+'">',k).val(l.extraData[d]).appendTo(w)[0]));l.iframeTarget||h.appendTo(D),v.attachEvent?v.attachEvent("onload",s):v.addEventListener("load",s,!1),setTimeout(t,15);try{w.submit()}catch(g){var y=document.createElement("form").submit;y.apply(w)}}finally{w.setAttribute("action",i),w.setAttribute("enctype",u),r?w.setAttribute("target",r):m.removeAttr("target"),e(c).remove()}}function s(t){if(!g.aborted&&!X){if(O=n(v),O||(a("cannot access response document"),t=L),t===A&&g)return g.abort("timeout"),void S.reject(g,"timeout");if(t===L&&g)return g.abort("server abort"),void S.reject(g,"error","server abort");if(O&&O.location.href!==l.iframeSrc||T){v.detachEvent?v.detachEvent("onload",s):v.removeEventListener("load",s,!1);var r,i="success";try{if(T)throw"timeout";var o="xml"===l.dataType||O.XMLDocument||e.isXMLDoc(O);if(a("isXml="+o),!o&&window.opera&&(null===O.body||!O.body.innerHTML)&&--C)return a("requeing onLoad callback, DOM not available"),void setTimeout(s,250);var u=O.body?O.body:O.documentElement;g.responseText=u?u.innerHTML:null,g.responseXML=O.XMLDocument?O.XMLDocument:O,o&&(l.dataType="xml"),g.getResponseHeader=function(e){var t={"content-type":l.dataType};return t[e.toLowerCase()]},u&&(g.status=Number(u.getAttribute("status"))||g.status,g.statusText=u.getAttribute("statusText")||g.statusText);var c=(l.dataType||"").toLowerCase(),f=/(json|script|text)/.test(c);if(f||l.textarea){var p=O.getElementsByTagName("textarea")[0];if(p)g.responseText=p.value,g.status=Number(p.getAttribute("status"))||g.status,g.statusText=p.getAttribute("statusText")||g.statusText;else if(f){var m=O.getElementsByTagName("pre")[0],y=O.getElementsByTagName("body")[0];m?g.responseText=m.textContent?m.textContent:m.innerText:y&&(g.responseText=y.textContent?y.textContent:y.innerText)}}else"xml"===c&&!g.responseXML&&g.responseText&&(g.responseXML=q(g.responseText));try{M=N(g,c,l)}catch(x){i="parsererror",g.error=r=x||i}}catch(x){a("error caught: ",x),i="error",g.error=r=x||i}g.aborted&&(a("upload aborted"),i=null),g.status&&(i=g.status>=200&&g.status<300||304===g.status?"success":"error"),"success"===i?(l.success&&l.success.call(l.context,M,"success",g),S.resolve(g.responseText,"success",g),d&&e.event.trigger("ajaxSuccess",[g,l])):i&&("undefined"==typeof r&&(r=g.statusText),l.error&&l.error.call(l.context,g,i,r),S.reject(g,"error",r),d&&e.event.trigger("ajaxError",[g,l,r])),d&&e.event.trigger("ajaxComplete",[g,l]),d&&!--e.active&&e.event.trigger("ajaxStop"),l.complete&&l.complete.call(l.context,g,i),X=!0,l.timeout&&clearTimeout(j),setTimeout(function(){l.iframeTarget?h.attr("src",l.iframeSrc):h.remove(),g.responseXML=null},100)}}}var u,c,l,d,p,h,v,g,x,b,T,j,w=m[0],S=e.Deferred();if(S.abort=function(e){g.abort(e)},r)for(c=0;c<y.length;c++)u=e(y[c]),o?u.prop("disabled",!1):u.removeAttr("disabled");l=e.extend(!0,{},e.ajaxSettings,t),l.context=l.context||l,p="jqFormIO"+(new Date).getTime();var k=w.ownerDocument,D=m.closest("body");if(l.iframeTarget?(h=e(l.iframeTarget,k),b=h.attr2("name"),b?p=b:h.attr2("name",p)):(h=e('<iframe name="'+p+'" src="'+l.iframeSrc+'" />',k),h.css({position:"absolute",top:"-1000px",left:"-1000px"})),v=h[0],g={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var r="timeout"===t?"timeout":"aborted";a("aborting upload... "+r),this.aborted=1;try{v.contentWindow.document.execCommand&&v.contentWindow.document.execCommand("Stop")}catch(n){}h.attr("src",l.iframeSrc),g.error=r,l.error&&l.error.call(l.context,g,r,t),d&&e.event.trigger("ajaxError",[g,l,r]),l.complete&&l.complete.call(l.context,g,r)}},d=l.global,d&&0===e.active++&&e.event.trigger("ajaxStart"),d&&e.event.trigger("ajaxSend",[g,l]),l.beforeSend&&l.beforeSend.call(l.context,g,l)===!1)return l.global&&e.active--,S.reject(),S;if(g.aborted)return S.reject(),S;x=w.clk,x&&(b=x.name,b&&!x.disabled&&(l.extraData=l.extraData||{},l.extraData[b]=x.value,"image"===x.type&&(l.extraData[b+".x"]=w.clk_x,l.extraData[b+".y"]=w.clk_y)));var A=1,L=2,F=e("meta[name=csrf-token]").attr("content"),E=e("meta[name=csrf-param]").attr("content");E&&F&&(l.extraData=l.extraData||{},l.extraData[E]=F),l.forceSync?i():setTimeout(i,10);var M,O,X,C=50,q=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!==t.documentElement.nodeName?t:null},_=e.parseJSON||function(e){return window.eval("("+e+")")},N=function(t,r,a){var n=t.getResponseHeader("content-type")||"",i=("xml"===r||!r)&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),a&&a.dataFilter&&(o=a.dataFilter(o,r)),"string"==typeof o&&(("json"===r||!r)&&n.indexOf("json")>=0?o=_(o):("script"===r||!r)&&n.indexOf("javascript")>=0&&e.globalEval(o)),o};return S}if(!this.length)return a("ajaxSubmit: skipping submit process - no element selected"),this;var f,d,p,m=this;"function"==typeof t?t={success:t}:"string"==typeof t||t===!1&&arguments.length>0?(t={url:t,data:r,dataType:n},"function"==typeof s&&(t.success=s)):"undefined"==typeof t&&(t={}),f=t.method||t.type||this.attr2("method"),d=t.url||this.attr2("action"),p="string"==typeof d?e.trim(d):"",p=p||window.location.href||"",p&&(p=(p.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:p,success:e.ajaxSettings.success,type:f||e.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var h={};if(this.trigger("form-pre-serialize",[this,t,h]),h.veto)return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&t.beforeSerialize(this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var v=t.traditional;"undefined"==typeof v&&(v=e.ajaxSettings.traditional);var g,y=[],x=this.formToArray(t.semantic,y,t.filtering);if(t.data){var b=e.isFunction(t.data)?t.data(x):t.data;t.extraData=b,g=e.param(b,v)}if(t.beforeSubmit&&t.beforeSubmit(x,this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[x,this,t,h]),h.veto)return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var T=e.param(x,v);g&&(T=T?T+"&"+g:g),"GET"===t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+T,t.data=null):t.data=T;var j=[];if(t.resetForm&&j.push(function(){m.resetForm()}),t.clearForm&&j.push(function(){m.clearForm(t.includeHidden)}),!t.dataType&&t.target){var w=t.success||function(){};j.push(function(r,a,n){var i=arguments,o=t.replaceTarget?"replaceWith":"html";e(t.target)[o](r).each(function(){w.apply(this,i)})})}else t.success&&(e.isArray(t.success)?e.merge(j,t.success):j.push(t.success));if(t.success=function(e,r,a){for(var n=t.context||this,i=0,o=j.length;i<o;i++)j[i].apply(n,[e,r,a||m,m])},t.error){var S=t.error;t.error=function(e,r,a){var n=t.context||this;S.apply(n,[e,r,a,m])}}if(t.complete){var k=t.complete;t.complete=function(e,r){var a=t.context||this;k.apply(a,[e,r,m])}}var D=e("input[type=file]:enabled",this).filter(function(){return""!==e(this).val()}),A=D.length>0,L="multipart/form-data",F=m.attr("enctype")===L||m.attr("encoding")===L,E=i.fileapi&&i.formdata;a("fileAPI :"+E);var M,O=(A||F)&&!E;t.iframe!==!1&&(t.iframe||O)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){M=l(x)}):M=l(x):M=(A||F)&&E?c(x):e.ajax(t),m.removeData("jqxhr").data("jqxhr",M);for(var X=0;X<y.length;X++)y[X]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n,i,o,s){if(("string"==typeof n||n===!1&&arguments.length>0)&&(n={url:n,data:i,dataType:o},"function"==typeof s&&(n.success=s)),n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var u={s:this.selector,c:this.context};return!e.isReady&&u.s?(a("DOM not ready, queuing ajaxForm"),e(function(){e(u.s,u.c).ajaxForm(n)}),this):(a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,r).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,r),this):this.ajaxFormUnbind().on("submit.form-plugin",n,t).on("click.form-plugin",n,r)},e.fn.ajaxFormUnbind=function(){return this.off("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,r,a){var n=[];if(0===this.length)return n;var o,s=this[0],u=this.attr("id"),c=t||"undefined"==typeof s.elements?s.getElementsByTagName("*"):s.elements;if(c&&(c=e.makeArray(c)),u&&(t||/(Edge|Trident)\//.test(navigator.userAgent))&&(o=e(':input[form="'+u+'"]').get(),o.length&&(c=(c||[]).concat(o))),!c||!c.length)return n;e.isFunction(a)&&(c=e.map(c,a));var l,f,d,p,m,h,v;for(l=0,h=c.length;l<h;l++)if(m=c[l],d=m.name,d&&!m.disabled)if(t&&s.clk&&"image"===m.type)s.clk===m&&(n.push({name:d,value:e(m).val(),type:m.type}),n.push({name:d+".x",value:s.clk_x},{name:d+".y",value:s.clk_y}));else if(p=e.fieldValue(m,!0),p&&p.constructor===Array)for(r&&r.push(m),f=0,v=p.length;f<v;f++)n.push({name:d,value:p[f]});else if(i.fileapi&&"file"===m.type){r&&r.push(m);var g=m.files;if(g.length)for(f=0;f<g.length;f++)n.push({name:d,value:g[f],type:m.type});else n.push({name:d,value:"",type:m.type})}else null!==p&&"undefined"!=typeof p&&(r&&r.push(m),n.push({name:d,value:p,type:m.type,required:m.required}));if(!t&&s.clk){var y=e(s.clk),x=y[0];d=x.name,d&&!x.disabled&&"image"===x.type&&(n.push({name:d,value:y.val()}),n.push({name:d+".x",value:s.clk_x},{name:d+".y",value:s.clk_y}))}return n},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var r=[];return this.each(function(){var a=this.name;if(a){var n=e.fieldValue(this,t);if(n&&n.constructor===Array)for(var i=0,o=n.length;i<o;i++)r.push({name:a,value:n[i]});else null!==n&&"undefined"!=typeof n&&r.push({name:this.name,value:n})}}),e.param(r)},e.fn.fieldValue=function(t){for(var r=[],a=0,n=this.length;a<n;a++){var i=this[a],o=e.fieldValue(i,t);null===o||"undefined"==typeof o||o.constructor===Array&&!o.length||(o.constructor===Array?e.merge(r,o):r.push(o))}return r},e.fieldValue=function(t,r){var a=t.name,i=t.type,o=t.tagName.toLowerCase();if("undefined"==typeof r&&(r=!0),r&&(!a||t.disabled||"reset"===i||"button"===i||("checkbox"===i||"radio"===i)&&!t.checked||("submit"===i||"image"===i)&&t.form&&t.form.clk!==t||"select"===o&&t.selectedIndex===-1))return null;if("select"===o){var s=t.selectedIndex;if(s<0)return null;for(var u=[],c=t.options,l="select-one"===i,f=l?s+1:c.length,d=l?s:0;d<f;d++){var p=c[d];if(p.selected&&!p.disabled){var m=p.value;if(m||(m=p.attributes&&p.attributes.value&&!p.attributes.value.specified?p.text:p.value),l)return m;u.push(m)}}return u}return e(t).val().replace(n,"\r\n")},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var r=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var a=this.type,n=this.tagName.toLowerCase();r.test(a)||"textarea"===n?this.value="":"checkbox"===a||"radio"===a?this.checked=!1:"select"===n?this.selectedIndex=-1:"file"===a?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(t===!0&&/hidden/.test(a)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){var t=e(this),r=this.tagName.toLowerCase();switch(r){case"input":this.checked=this.defaultChecked;case"textarea":return this.value=this.defaultValue,!0;case"option":case"optgroup":var a=t.parents("select");return a.length&&a[0].multiple?"option"===r?this.selected=this.defaultSelected:t.find("option").resetForm():a.resetForm(),!0;case"select":return t.find("option").each(function(e){if(this.selected=this.defaultSelected,this.defaultSelected&&!t[0].multiple)return t[0].selectedIndex=e,!1}),!0;case"label":var n=e(t.attr("for")),i=t.find("input,select,textarea");return n[0]&&i.unshift(n[0]),i.resetForm(),!0;case"form":return("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset(),!0;default:return t.find("form,input,label,select,textarea").resetForm(),!0}})},e.fn.enable=function(e){return"undefined"==typeof e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return"undefined"==typeof t&&(t=!0),this.each(function(){var r=this.type;if("checkbox"===r||"radio"===r)this.checked=t;else if("option"===this.tagName.toLowerCase()){var a=e(this).parent("select");t&&a[0]&&"select-one"===a[0].type&&a.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1});
/**
 * Rmodal
 * @author Rock'n'code
 * @version 0.2.0
 */

;
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {

    var rmodal = {
        options: {},
        init: function(delegate, data) {

            var _ = this;
 
            $(document)
                .off('click', delegate)
                .on('click', delegate, data, function(e) {
                    e.preventDefault();

                    _.reset();

                    var el = $(this);

                    //console.log(e.data);

                    _.options = $.extend({}, defaults, e.data);
                    var params = _.options.before(el, e.data.params);

                     //console.log(params);

                    $.ajax({
                        url: _.options.path,
                        data: params,
                        method: _.options.method || "post",
                        dataType: _.options.datatype || "html",
                        beforeSend: function(xhr) {
                            $('body').append('<div class="bf-loading"></div>');
                        },
                        success: function(xhr) {

                            _.set_template();
                            _.set_close_event();

                            $('.bf-modal, .bf-fixed-overlay').css('opacity', '0');
                            $('.bf-modal-box').html(xhr);
                            $('.bf-loading').remove();
                            $('.bf-modal, .bf-fixed-overlay').animate({ 'opacity': "1" }, 500);

                            _.options.after(el, $('.bf-modal-box'), params);

                        }
                    });

                });
        },
        set_template: function() {
            var _ = this;

            $('[data-rmodal="wrap"]').remove();
            $('body').append(_.options.template);

        }, 
        set_close_event: function() {
            var _ = this;

            $(document).on("click", "[data-rmodal='reset']", function() {
                _.reset();
                _.options.reset();
            });

            $(document).on("click", ".bf-modal", function(e) {
                e.stopImmediatePropagation();
            });
        },
        reset: function() {
            $(".bf-fixed-overlay").remove();
        }
    };

    // определяем необходимые параметры по умолчанию
    var defaults = {
        path: '',
        attributes: {},
        template: '<div data-rmodal="reset" data-rmodal="wrap"  class="bf-fixed-overlay bf-fixed-overlay__modal"> \
                            <div class="bf-modal"> \
                                <div class="bf-modal_container"> \
                                    <a href="javascript:;" data-rmodal="reset" class="bf-modal-reset" title=""></a> \
                                      <div class="bf-modal-box"></div> \
                                </div> \
                            </div> \
                            <small class="bf-modal-after"></small> \
                        </div>',
        before: function(el, option) {
            return option;
        },
        after: function(el, wrap_form, opt) {

        },
        reset: function(el, opt) {

        }
    };

    var methods = {
        init: function(delegate, arguments) {
            return rmodal.init(delegate, arguments);
        },
        reset: function() {
            rmodal.reset();
        }
    };

    $.rmodal = function(delegate) {

        if (methods[delegate]) {
            return methods[delegate].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (delegate.length > 0) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method "' + delegate + '" not find');
        }
        return delegate;
    };

}));
/**
 * Rtooltip
 * @author Rock'n'code
 * @version 0.2.0
 */

;
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {

    var tooltip = {
        options: {},
        init: function(el, msg) {
            var _ = this;

            $(document).on('mouseover', '.bf-tooltip', function() {
                $(this).remove();
            });

            if (msg.length > 0) {

                tooltip.set({
                    'el': el,
                    'msg': msg
                });

                $(window).on("resize", {
                    'el': el,
                    'msg': msg
                }, tooltip.set);

            } else {
                //убираем тултип, если нету сообщения об ошибке
                var id = el.attr('name') || '';
                if (id) {
                    $('[data-bf-tooltip-id="' + id + '"]').remove();
                }
            }
        },
        set: function(event) {

            var _ = this,
                el, msg;

            //Выбираем данные при прямой передачи и через событие ресайза
            if (event.data) {
                el = event.data.el;
                msg = event.data.msg;
            } else {
                el = event.el;
                msg = event.msg;
            }

            var id = el.attr('name') || el.attr('data-name') || '';

            if (id.length > 0) {

                //получаем первый элемент формы для групп с одинаковым именем
                el = $('[name="' + id + '"]:first', el.parents('form'));

                //получаем позицию для вывода
                var pos = el.attr('data-bf-tooltip') || el.parents('form').attr('data-bf-tooltip') || tooltip.options.pos;

                $('[data-bf-tooltip-id="' + id + '"]').remove();

                el.after(
                    '<span class="bf-tooltip bf-tooltip-' + pos + '" data-bf-tooltip-id="' + id + '"> \
                         <span class="bf-arrow"></span>' + msg + '</span>'
                );

                tooltip.position(el, pos);
            }

        },
        reset: function() {
            $(window).off("resize", tooltip.set);
            $('.bf-tooltip').remove();

        },
        response: function(left, top, w_tooltip, el_offset, w_el, t) {
            var _ = this;

            t.css('white-space', 'nowrap');

            if (t.is('[class*="left"]')) {

                if (left <= _.options.min_dist_border_window) {

                    t.css('white-space', 'normal');
                    left = _.options.min_dist_border_window;

                    //добавляем адаптив для левой позиции
                    if (t.hasClass('bf-tooltip-left')) {
                        t.removeClass('bf-tooltip-left').addClass('bf-tooltip-bottom-left');
                    }
                }

            } else {
                var pos = left + w_tooltip + _.options.min_dist_border_window;
                var pos_min = $(window).outerWidth() - _.options.min_dist_border_window - w_tooltip;

                if (pos > $(window).outerWidth()) {
                    left = pos_min;

                    //добавляем адаптив для правой позиции
                    if (t.hasClass('bf-tooltip-right')) {
                        t.removeClass('bf-tooltip-right').addClass('bf-tooltip-top-right');
                    }
                }

                if (pos_min <= el_offset['left']) {

                    t.css('white-space', 'normal');
                    left = el_offset['left'];
                }
            } 

            return { top: top, left: left };
        },
        position: function(el, pos) {
            var _ = this;

            if (el.length > 0) {

                var el_offset = el.offset();
                var id = el.attr('name') || el.attr('data-name') || '';
                var t = $('[data-bf-tooltip-id="' + id + '"]');

                var h_el = el.outerHeight();
                var w_el = el.outerWidth();
                var w_tooltip = t.outerWidth();
                var h_tooltip = t.outerHeight();
                var top = 0,
                    left = 0;

                if (pos === 'top') {

                    top = el_offset['top'] - h_tooltip;
                    left = el_offset['left'] + w_el / 2 - w_tooltip / 2;
                    
                } else if (pos == 'top-right') {

                    left = el_offset['left'] + w_el / 6 * 5;
                    top = parseInt(el_offset['top']) - parseInt(h_tooltip) - _.options.dist_from_item;
                    
                } else if (pos === 'top-center') {

                    top = el_offset['top'] - h_tooltip;
                    left = el_offset['left'] + w_el / 2;

                } else if (pos === 'top-left') {

                    top = parseInt(el_offset['top']) - parseInt(h_tooltip) - _.options.dist_from_item;
                    left = el_offset['left'] + w_el / 6 - w_tooltip;

                } else if (pos === 'bottom') {

                    top = el_offset['top'] + h_el;
                    left = el_offset['left'] + w_el / 2 - w_tooltip / 2;

                } else if (pos === 'bottom-left') {

                    top = el_offset['top'] + h_el;
                    left = el_offset['left'] + w_el / 6 - w_tooltip;

                } else if (pos === 'bottom-center') {

                    top = el_offset['top'] + h_el;
                    left = el_offset['left'] + w_el / 2;

                } else if (pos === 'bottom-right') {

                    top = el_offset['top'] + h_el;
                    left = el_offset['left'] + w_el / 6 * 5;

                } else if (pos === 'left') {

                    top = el_offset['top'] + h_el / 2 - h_tooltip / 2;
                    left = el_offset['left'] - w_tooltip;

                } else if (pos === 'right') {

                    top = el_offset['top'] + h_el / 2 - h_tooltip / 2;
                    left = el_offset['left'] + w_el;
                }

                t.offset(tooltip.response(left, top, w_tooltip, el_offset, w_el, t));
            }
        }
    };

    // определяем необходимые параметры по умолчанию
    var defaults = {
        'min_dist_border_window': 20, //расстояние до границы после которого начинается адаптив
        'dist_from_item': 5, //расстояние от элемента
        'pos': 'top-right'
    };

    // наши публичные методы
    var methods = {
        // инициализация плагина
        init: function(params) {
            // актуальные настройки, будут индивидуальными при каждом запуске
            var options = $.extend({}, defaults, params);

            tooltip.options = options;

            return this.each(function() {
             
                if (params !== undefined) {
                    var msg = params.msg || '';

                    if (msg.length > 0) {
                        tooltip.init($(this), msg);
                    }
                }
            });
        },
        reset: function() {
            tooltip.reset(); 
        }
    };

    $.fn.rtooltip = function(method) {

        // немного магии
        if (methods[method]) {
            // если запрашиваемый метод существует, мы его вызываем
            // все параметры, кроме имени метода прийдут в метод
            // this так же перекочует в метод
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {

            // если первым параметром идет объект, либо совсем пусто
            // выполняем метод init
            return methods.init.apply(this, arguments);
        } else {
            // если ничего не получилось
            $.error('Method "' + method + '" not find');
        }
    };

}));
/**
 * Rockform - Simple, flexible ajax webform.
 * @author Rock'n'code
 * @version 4.4.0
 */

;
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'jquery.form.min', 'jquery.mask.min', 'jquery.rtooltip', 'jquery.rmodal'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {

    var baseform = window.baseform || {};
    baseform = (function() {

        function baseform(element, settings) {
            var _ = this,
                element = element || '',
                settings = settings || {};

            _.defaults = {
                config: '',
                path: '/rockform/init.php',
                timer: 2000,
                fields: {},
                submit_selector: '[type="submit"], [type="image"], [type="button"]',
                before_send_form: function(form) {},
                after_send_form: function(form) {},
                before_show_modal: function() {},
                after_show_modal: function() {},
                close_modal: function() {}
            };

            _.options = $.extend({}, _.defaults, settings);

            _.init(element, settings);
        }

        return baseform;
    }());

    baseform.prototype.fileupload = function(creation) {
        var _ = this;

        //Стилизация загружаемого файла
        $(document).on('change', '.bf-input-file', function(e) {

            var $input = $(this),
                $label = $input.next('label'),
                labelVal = $label.html();
            var fileName = '';

            if (this.files && this.files.length > 1) {
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
            } else if (e.target.value) {
                fileName = e.target.value.split('\\').pop();
            }

            if (fileName) {
                $label.find('span').html(fileName);
            } else {
                $label.html(labelVal);
            }
        });

    };

    baseform.prototype.capcha = function(creation) {
        var _ = this;

        //Отслеживание создания капчи для динамически вставленных форм
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || '';

        if (MutationObserver.length > 0) {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            var callback = function(allmutations) {
                    allmutations.map(function(mr) {
                        var jq = $(mr.addedNodes);
                        jq.find('img[data-bf-capcha]').click();
                    });
                },
                mo = new MutationObserver(callback),
                options = {
                    'childList': true,
                    'subtree': true
                };
            mo.observe(document, options);
        }

        var capcha = {
            init: function() {
                capcha.update();
                $(document)
                    .off("click", 'img[data-bf-capcha]')
                    .on("click", 'img[data-bf-capcha]', function() {
                        capcha.update();
                    });
            },
            update: function() {
                $('img[data-bf-capcha]').attr('src', _.options.path + '?type=capcha&u=' + Math.random());
            }
        };

        capcha.init();

    };

    baseform.prototype.mask_fields = function(creation) {

        var _ = this;

        var mask_pattern = '',
            mask_placeholder = {};

        var mask_fields = {
            init: function() {

                $(document).on('focus', '[data-bf-mask]', function() {
                    mask_fields.set($(this));
                });

                $('[data-bf-mask]').each(function() {
                    mask_fields.set($(this));
                });
            },
            set: function(el) {
                mask_pattern = el.data('bf-mask');
                mask_placeholder = el.attr('placeholder');

                if (mask_pattern.length > 0) {

                    if (typeof mask_placeholder == 'undefined' || mask_placeholder.length < 1) {
                        mask_placeholder = mask_pattern.replace(/[a-z0-9]+?/gi, "_");
                    }

                    mask_placeholder = { placeholder: mask_placeholder };

                    el.mask(mask_pattern, mask_placeholder);
                }
            }
        }

        mask_fields.init();

    };

    baseform.prototype.validation = function(form, data) {
        var _ = this;
        var validation = {

            init: function(form, data) {

                var err_msg,
                    el;
                valid = 0,
                    data = data || {};

                $('.bf-tooltip').rtooltip('reset');

                if (data.mail_to) {

                    $(_.options.submit_selector, form).rtooltip({ 'msg': data.mail_to });
                    return false;
                }

                if (data.filesize) {

                    $(_.options.submit_selector, form).rtooltip({ 'msg': data.filesize });
                    return false;
                }

                $.each(data, function(name, value) {
                    err_msg = '';

                    if (name == 'token') {
                        //устанавливаем токен в форму
                        _.set_attr_form(form, 'bf-token', data.token);
                    } else if (name == 'filesize') {

                    } else {

                        err_msg = validation.set_err_msg(value);
                        el = $('[name="' + name + '"]', form);

                        el.rtooltip({ 'msg': err_msg });

                        if (err_msg.length > 0) {
                            valid = +1;
                        }
                    }
                });

                if (parseInt(valid) > 0) {
                    return false;
                } else {
                    return true;
                }
            },
            set_err_msg: function(err) {
                var err_msg = '';
                if (err.required) {
                    err_msg = err.required;
                } else {
                    if (err.rangelength) {
                        err_msg = err.rangelength;
                    } else if (err.minlength) {
                        err_msg = err.minlength;
                    } else if (err.maxlength) {
                        err_msg = err.maxlength;
                    } else {
                        $.each(err, function(name, msg) {
                            if (
                                name == 'required' ||
                                name == 'rangelength' ||
                                name == 'minlength' ||
                                name == 'maxlength'
                            ) {

                            } else {
                                err_msg = msg;
                                return false;
                            }
                        });
                    }
                }

                return err_msg;
            }
        }
        return validation.init(form, data);
    };

    baseform.prototype.set_attr_form = function(form, name, value) {
        form.prepend('<input name="' + name + '" class="bf-attr" type="hidden" value="' + value + '" />');
    };

    baseform.prototype.init = function(el, settings) {

        var _ = this;

        var bf = {

            init: function(el, settings) {
                _.capcha();
                _.mask_fields();

                var init_custom = '',
                    form_el = '',
                    modal_el = '';

                if (el.length > 0) {
                    init_custom = el;
                    form_el = 'form' + el + ',form[data-delegate="' + el + '"]';
                } else {
                    form_el = 'form[data-bf]';
                }

                bf.set_form(form_el);

                if (el.length > 0) {
                    modal_el = el + ':not(form)'
                } else {
                    modal_el = '[data-bf]:not(form)';
                }

                var modal_options = {
                    config: _.options.config,
                    timer: _.options.timer,
                    fields: _.options.fields
                }

                $.rmodal(modal_el, {
                    path: _.options.path,
                    params: modal_options,
                    before: function(this_el, params) {
                        //очищаем тултипы
                        $('.bf-tooltip').rtooltip('reset');

                        //получаем дата-атрибуты с элемента
                        data = this_el.data('bf') || '';
                        if (typeof data === 'string') {
                            if (data.length > 0) {
                                data = { 'config': data };
                            }
                        }

                        //передаём дополнительные поля к форме отправки
                        var custom_fields = bf.get_custom_fields(this_el);
                        //проверяем если есть поля переданные в вызове конфига
                        data.fields = data.fields || {};
                        data.fields = $.extend({}, data.fields, custom_fields);

                        params = $.extend({}, params, data);

                        var attributes = {
                            'data': params.fields,
                            'bf-config': params.config,
                            'timer': params.timer,
                            'config': params.config,
                            'type': 'form'
                        }

                        return attributes;
                    },
                    after: function(this_el, wrap_form, params) {
                        //передаём в новую форму параметры с кнопки

                        var option = {};
                        option.fields = params.data || {};
                        option.timer = params.timer || {};
                        option.config = params.config || {};

                        var data = JSON.stringify(option);

                        if (init_custom.length > 0) {
                            wrap_form.find('form').attr('data-delegate', init_custom);
                        } else {
                            wrap_form.find('form').attr('data-bf', data);
                        }

                    }
                });
            },
            set_form: function(el, params) {

                params = params || _.options;

                $(document).off('submit', el)
                    .on('submit', el, params, function(e) {
                        e.preventDefault();
                        var form = $(this);

                        $('.bf-tooltip').rtooltip('reset');

                        //получаем дата-атрибуты с элемента
                        data = form.data('bf') || '';
                        if (typeof data === 'string') {
                            if (data.length > 0) {
                                data = { 'config': data };
                            }
                        }

                        _.options = $.extend({}, _.options, e.data, data);

                        //сериализуем форму
                        var formdata = form.formToArray();
                        var filesize = [];

                        //заменяем объект файла именем файла
                        $.each(formdata, function(index, element) {
                            if (element.type == 'file') {
                                formdata[index].size = element.value.size || '';
                                formdata[index].value = element.value.name || '';

                                //вычисляем размер файлов для загрузки
                                filesize.push(formdata[index].size);
                            }
                        });

                        //console.log(_.options.config);

                        //серверная валидация
                        $.post(
                            _.options.path, {
                                'fields': formdata,
                                'type': 'validation',
                                'bf-config': _.options.config,
                                'filesize': filesize
                            },
                            function(response) {

                                response = response || {};
                                //отправка формы, если валидация прошла
                                if (_.validation(form, response)) {

                                    _.set_attr_form(form, 'bf-config', _.options.config);

                                    //добавляем дополнительные параметры в форму из всплывающего окна
                                    $.each(_.options.fields, function(name_item, value_item) {
                                        _.set_attr_form(form, 'bf[fields][' + name_item + ']', value_item);
                                    });

                                    form.ajaxSubmit({
                                        beforeSubmit: function(arr, form, options) {
                                            //событие перед отправкой формы
                                            _.options.before_send_form(form);
                                            $(_.options.submit_selector, form).prop('disabled', true);
                                        },
                                        url: _.options.path,
                                        type: 'post',
                                        dataType: 'json',
                                        success: bf.show_response,
                                        error: function(jqXHR, textStatus, errorThrown) {
                                            alert('Server: ' + textStatus);
                                        }
                                    });

                                }
                                $('.bf-attr').remove();
                            });
                    });
            },
            get_custom_fields: function(el) {

                var attributes = {};
                var attr_el = '';

                if (el.length) {
                    $.each(el[0].attributes, function(index, attr) {
                        attr_el = attr.name;
                        if (/data\-bf\-field/.test(attr_el)) {
                            attr_el = attr_el.replace(/data\-bf\-field(\-|_)/, '');
                            attributes[attr_el] = attr.value;
                        }
                    });
                }

                attributes['page_h1'] = $('h1:first').text() || '';
                attributes['page_url'] = document.location.href;

                return attributes;

            },
            show_response: function(response, statusText, xhr, form) {

                var focused = $(_.options.submit_selector, form);
                focused.prop('disabled', false).removeAttr("disabled");


                if (parseInt(response.status) > 0) {

                    //событие после успешной отправки формы
                    _.options.after_send_form(form);

                    //выводим окно об успешной отправке
                    $.post(
                        _.options.path, {
                            'type': 'form_success',
                            'bf-config': response['bf-config']
                        },

                        function(content) {
                            form.hide();

                            form.after(content);

                            //закрываем окно всплывающее
                            setTimeout(
                                function() {
                                    $.rmodal('reset');
                                }, _.options.timer
                            );

                            //сбрасываем состояние встроенной формы
                            setTimeout(
                                function() {
                                    form.show();
                                    form.clearForm();
                                    $('[data-bf-success]').remove();
                                }, (_.options.timer + 1000)
                            );
                        },
                        'html'
                    );

                } else {
                    focused.rtooltip({ 'msg': response.value });
                }
            }
        }
        bf.init(el, settings);
    };

    $.bf = function(el) {
        var _ = this,
            opt = arguments[1] || {};
        new baseform(el, opt);
        return _;
    };

    new baseform();

}));