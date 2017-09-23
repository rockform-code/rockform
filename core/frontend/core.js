"use strict";!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof exports?module.exports=t(require("jquery")):t(jQuery||Zepto)}(function(t){var a=function(a,e,n){var r={invalid:[],getCaret:function(){try{var t,e=0,n=a.get(0),s=document.selection,o=n.selectionStart;return s&&-1===navigator.appVersion.indexOf("MSIE 10")?(t=s.createRange(),t.moveStart("character",-r.val().length),e=t.text.length):(o||"0"===o)&&(e=o),e}catch(c){}},setCaret:function(t){try{if(a.is(":focus")){var e,n=a.get(0);n.setSelectionRange?(n.focus(),n.setSelectionRange(t,t)):(e=n.createTextRange(),e.collapse(!0),e.moveEnd("character",t),e.moveStart("character",t),e.select())}}catch(r){}},events:function(){a.on("keydown.mask",function(t){a.data("mask-keycode",t.keyCode||t.which)}).on(t.jMaskGlobals.useInput?"input.mask":"keyup.mask",r.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){a.keydown().keyup()},100)}).on("change.mask",function(){a.data("changed",!0)}).on("blur.mask",function(){c===r.val()||a.data("changed")||a.trigger("change"),a.data("changed",!1)}).on("blur.mask",function(){c=r.val()}).on("focus.mask",function(a){n.selectOnFocus===!0&&t(a.target).select()}).on("focusout.mask",function(){n.clearIfNotMatch&&!s.test(r.val())&&r.val("")})},getRegexMask:function(){for(var t,a,n,r,s,c,i=[],l=0;l<e.length;l++)t=o.translation[e.charAt(l)],t?(a=t.pattern.toString().replace(/.{1}$|^.{1}/g,""),n=t.optional,r=t.recursive,r?(i.push(e.charAt(l)),s={digit:e.charAt(l),pattern:a}):i.push(n||r?a+"?":a)):i.push(e.charAt(l).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"));return c=i.join(""),s&&(c=c.replace(new RegExp("("+s.digit+"(.*"+s.digit+")?)"),"($1)?").replace(new RegExp(s.digit,"g"),s.pattern)),new RegExp(c)},destroyEvents:function(){a.off(["input","keydown","keyup","paste","drop","blur","focusout",""].join(".mask "))},val:function(t){var e,n=a.is("input"),r=n?"val":"text";return arguments.length>0?(a[r]()!==t&&a[r](t),e=a):e=a[r](),e},getMCharsBeforeCount:function(t,a){for(var n=0,r=0,s=e.length;s>r&&t>r;r++)o.translation[e.charAt(r)]||(t=a?t+1:t,n++);return n},caretPos:function(t,a,n,s){var c=o.translation[e.charAt(Math.min(t-1,e.length-1))];return c?Math.min(t+n-a-s,n):r.caretPos(t+1,a,n,s)},behaviour:function(e){e=e||window.event,r.invalid=[];var n=a.data("mask-keycode");if(-1===t.inArray(n,o.byPassKeys)){var s=r.getCaret(),c=r.val(),i=c.length,l=r.getMasked(),u=l.length,f=r.getMCharsBeforeCount(u-1)-r.getMCharsBeforeCount(i-1),h=i>s;return r.val(l),h&&(8!==n&&46!==n&&(s=r.caretPos(s,i,u,f)),r.setCaret(s)),r.callbacks(e)}},getMasked:function(t,a){var s,c,i=[],l=void 0===a?r.val():a+"",u=0,f=e.length,h=0,v=l.length,d=1,k="push",p=-1;for(n.reverse?(k="unshift",d=-1,s=0,u=f-1,h=v-1,c=function(){return u>-1&&h>-1}):(s=f-1,c=function(){return f>u&&v>h});c();){var g=e.charAt(u),m=l.charAt(h),M=o.translation[g];M?(m.match(M.pattern)?(i[k](m),M.recursive&&(-1===p?p=u:u===s&&(u=p-d),s===p&&(u-=d)),u+=d):M.optional?(u+=d,h-=d):M.fallback?(i[k](M.fallback),u+=d,h-=d):r.invalid.push({p:h,v:m,e:M.pattern}),h+=d):(t||i[k](g),m===g&&(h+=d),u+=d)}var y=e.charAt(s);return f!==v+1||o.translation[y]||i.push(y),i.join("")},callbacks:function(t){var s=r.val(),o=s!==c,i=[s,t,a,n],l=function(t,a,e){"function"==typeof n[t]&&a&&n[t].apply(this,e)};l("onChange",o===!0,i),l("onKeyPress",o===!0,i),l("onComplete",s.length===e.length,i),l("onInvalid",r.invalid.length>0,[s,t,a,r.invalid,n])}};a=t(a);var s,o=this,c=r.val();e="function"==typeof e?e(r.val(),void 0,a,n):e,o.mask=e,o.options=n,o.remove=function(){var t=r.getCaret();return r.destroyEvents(),r.val(o.getCleanVal()),r.setCaret(t-r.getMCharsBeforeCount(t)),a},o.getCleanVal=function(){return r.getMasked(!0)},o.getMaskedVal=function(t){return r.getMasked(!1,t)},o.init=function(e){if(e=e||!1,n=n||{},o.clearIfNotMatch=t.jMaskGlobals.clearIfNotMatch,o.byPassKeys=t.jMaskGlobals.byPassKeys,o.translation=t.extend({},t.jMaskGlobals.translation,n.translation),o=t.extend(!0,{},o,n),s=r.getRegexMask(),e===!1){n.placeholder&&a.attr("placeholder",n.placeholder),a.data("mask")&&a.attr("autocomplete","off"),r.destroyEvents(),r.events();var c=r.getCaret();r.val(r.getMasked()),r.setCaret(c+r.getMCharsBeforeCount(c,!0))}else r.events(),r.val(r.getMasked())},o.init(!a.is("input"))};t.maskWatchers={};var e=function(){var e=t(this),r={},s="data-mask-",o=e.attr("data-mask");return e.attr(s+"reverse")&&(r.reverse=!0),e.attr(s+"clearifnotmatch")&&(r.clearIfNotMatch=!0),"true"===e.attr(s+"selectonfocus")&&(r.selectOnFocus=!0),n(e,o,r)?e.data("mask",new a(this,o,r)):void 0},n=function(a,e,n){n=n||{};var r=t(a).data("mask"),s=JSON.stringify,o=t(a).val()||t(a).text();try{return"function"==typeof e&&(e=e(o)),"object"!=typeof r||s(r.options)!==s(n)||r.mask!==e}catch(c){}},r=function(t){var a,e=document.createElement("div");return t="on"+t,a=t in e,a||(e.setAttribute(t,"return;"),a="function"==typeof e[t]),e=null,a};t.fn.mask=function(e,r){r=r||{};var s=this.selector,o=t.jMaskGlobals,c=o.watchInterval,i=r.watchInputs||o.watchInputs,l=function(){return n(this,e,r)?t(this).data("mask",new a(this,e,r)):void 0};return t(this).each(l),s&&""!==s&&i&&(clearInterval(t.maskWatchers[s]),t.maskWatchers[s]=setInterval(function(){t(document).find(s).each(l)},c)),this},t.fn.masked=function(t){return this.data("mask").getMaskedVal(t)},t.fn.unmask=function(){return clearInterval(t.maskWatchers[this.selector]),delete t.maskWatchers[this.selector],this.each(function(){var a=t(this).data("mask");a&&a.remove().removeData("mask")})},t.fn.cleanVal=function(){return this.data("mask").getCleanVal()},t.applyDataMask=function(a){a=a||t.jMaskGlobals.maskElements;var n=a instanceof t?a:t(a);n.filter(t.jMaskGlobals.dataMaskAttr).each(e)};var s={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,useInput:r("input"),watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{0:{pattern:/\d/},9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},S:{pattern:/[a-zA-Z]/}}};t.jMaskGlobals=t.jMaskGlobals||{},s=t.jMaskGlobals=t.extend(!0,{},s,t.jMaskGlobals),s.dataMask&&t.applyDataMask(),setInterval(function(){t.jMaskGlobals.watchDataMask&&t.applyDataMask()},s.watchInterval)});
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):e("undefined"!=typeof jQuery?jQuery:window.Zepto)}(function(e){"use strict";function t(t){var r=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(t.target).ajaxSubmit(r))}function r(t){var r=t.target,a=e(r);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;r=n[0]}var i=this;if(i.clk=r,"image"==r.type)if(void 0!==t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=a.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-r.offsetLeft,i.clk_y=t.pageY-r.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function a(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n={};n.fileapi=void 0!==e("<input type='file'/>").get(0).files,n.formdata=void 0!==window.FormData;var i=!!e.fn.prop;e.fn.attr2=function(){if(!i)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t){function r(r){var a,n,i=e.param(r,t.traditional).split("&"),o=i.length,s=[];for(a=0;o>a;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function o(a){for(var n=new FormData,i=0;i<a.length;i++)n.append(a[i].name,a[i].value);if(t.extraData){var o=r(t.extraData);for(i=0;i<o.length;i++)o[i]&&n.append(o[i][0],o[i][1])}t.data=null;var s=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:u||"POST"});t.uploadProgress&&(s.xhr=function(){var r=e.ajaxSettings.xhr();return r.upload&&r.upload.addEventListener("progress",function(e){var r=0,a=e.loaded||e.position,n=e.total;e.lengthComputable&&(r=Math.ceil(a/n*100)),t.uploadProgress(e,a,n,r)},!1),r}),s.data=null;var c=s.beforeSend;return s.beforeSend=function(e,r){t.formData?r.data=t.formData:r.data=n,c&&c.call(this,e,r)},e.ajax(s)}function s(r){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(r){a("cannot get iframe.contentWindow document: "+r)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(r){a("cannot get iframe.contentDocument: "+r),t=e.document}return t}function o(){function t(){try{var e=n(g).readyState;a("state = "+e),e&&"uninitialized"==e.toLowerCase()&&setTimeout(t,50)}catch(r){a("Server abort: ",r," (",r.name,")"),s(k),j&&clearTimeout(j),j=void 0}}var r=f.attr2("target"),i=f.attr2("action"),o="multipart/form-data",c=f.attr("enctype")||f.attr("encoding")||o;w.setAttribute("target",p),u&&!/post/i.test(u)||w.setAttribute("method","POST"),i!=d.url&&w.setAttribute("action",d.url),d.skipEncodingOverride||u&&!/post/i.test(u)||f.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),d.timeout&&(j=setTimeout(function(){T=!0,s(D)},d.timeout));var l=[];try{if(d.extraData)for(var m in d.extraData)d.extraData.hasOwnProperty(m)&&(e.isPlainObject(d.extraData[m])&&d.extraData[m].hasOwnProperty("name")&&d.extraData[m].hasOwnProperty("value")?l.push(e('<input type="hidden" name="'+d.extraData[m].name+'">').val(d.extraData[m].value).appendTo(w)[0]):l.push(e('<input type="hidden" name="'+m+'">').val(d.extraData[m]).appendTo(w)[0]));d.iframeTarget||v.appendTo("body"),g.attachEvent?g.attachEvent("onload",s):g.addEventListener("load",s,!1),setTimeout(t,15);try{w.submit()}catch(h){var x=document.createElement("form").submit;x.apply(w)}}finally{w.setAttribute("action",i),w.setAttribute("enctype",c),r?w.setAttribute("target",r):f.removeAttr("target"),e(l).remove()}}function s(t){if(!x.aborted&&!F){if(M=n(g),M||(a("cannot access response document"),t=k),t===D&&x)return x.abort("timeout"),void S.reject(x,"timeout");if(t==k&&x)return x.abort("server abort"),void S.reject(x,"error","server abort");if(M&&M.location.href!=d.iframeSrc||T){g.detachEvent?g.detachEvent("onload",s):g.removeEventListener("load",s,!1);var r,i="success";try{if(T)throw"timeout";var o="xml"==d.dataType||M.XMLDocument||e.isXMLDoc(M);if(a("isXml="+o),!o&&window.opera&&(null===M.body||!M.body.innerHTML)&&--O)return a("requeing onLoad callback, DOM not available"),void setTimeout(s,250);var u=M.body?M.body:M.documentElement;x.responseText=u?u.innerHTML:null,x.responseXML=M.XMLDocument?M.XMLDocument:M,o&&(d.dataType="xml"),x.getResponseHeader=function(e){var t={"content-type":d.dataType};return t[e.toLowerCase()]},u&&(x.status=Number(u.getAttribute("status"))||x.status,x.statusText=u.getAttribute("statusText")||x.statusText);var c=(d.dataType||"").toLowerCase(),l=/(json|script|text)/.test(c);if(l||d.textarea){var f=M.getElementsByTagName("textarea")[0];if(f)x.responseText=f.value,x.status=Number(f.getAttribute("status"))||x.status,x.statusText=f.getAttribute("statusText")||x.statusText;else if(l){var p=M.getElementsByTagName("pre")[0],h=M.getElementsByTagName("body")[0];p?x.responseText=p.textContent?p.textContent:p.innerText:h&&(x.responseText=h.textContent?h.textContent:h.innerText)}}else"xml"==c&&!x.responseXML&&x.responseText&&(x.responseXML=X(x.responseText));try{E=_(x,c,d)}catch(y){i="parsererror",x.error=r=y||i}}catch(y){a("error caught: ",y),i="error",x.error=r=y||i}x.aborted&&(a("upload aborted"),i=null),x.status&&(i=x.status>=200&&x.status<300||304===x.status?"success":"error"),"success"===i?(d.success&&d.success.call(d.context,E,"success",x),S.resolve(x.responseText,"success",x),m&&e.event.trigger("ajaxSuccess",[x,d])):i&&(void 0===r&&(r=x.statusText),d.error&&d.error.call(d.context,x,i,r),S.reject(x,"error",r),m&&e.event.trigger("ajaxError",[x,d,r])),m&&e.event.trigger("ajaxComplete",[x,d]),m&&!--e.active&&e.event.trigger("ajaxStop"),d.complete&&d.complete.call(d.context,x,i),F=!0,d.timeout&&clearTimeout(j),setTimeout(function(){d.iframeTarget?v.attr("src",d.iframeSrc):v.remove(),x.responseXML=null},100)}}}var c,l,d,m,p,v,g,x,y,b,T,j,w=f[0],S=e.Deferred();if(S.abort=function(e){x.abort(e)},r)for(l=0;l<h.length;l++)c=e(h[l]),i?c.prop("disabled",!1):c.removeAttr("disabled");if(d=e.extend(!0,{},e.ajaxSettings,t),d.context=d.context||d,p="jqFormIO"+(new Date).getTime(),d.iframeTarget?(v=e(d.iframeTarget),b=v.attr2("name"),b?p=b:v.attr2("name",p)):(v=e('<iframe name="'+p+'" src="'+d.iframeSrc+'" />'),v.css({position:"absolute",top:"-1000px",left:"-1000px"})),g=v[0],x={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var r="timeout"===t?"timeout":"aborted";a("aborting upload... "+r),this.aborted=1;try{g.contentWindow.document.execCommand&&g.contentWindow.document.execCommand("Stop")}catch(n){}v.attr("src",d.iframeSrc),x.error=r,d.error&&d.error.call(d.context,x,r,t),m&&e.event.trigger("ajaxError",[x,d,r]),d.complete&&d.complete.call(d.context,x,r)}},m=d.global,m&&0===e.active++&&e.event.trigger("ajaxStart"),m&&e.event.trigger("ajaxSend",[x,d]),d.beforeSend&&d.beforeSend.call(d.context,x,d)===!1)return d.global&&e.active--,S.reject(),S;if(x.aborted)return S.reject(),S;y=w.clk,y&&(b=y.name,b&&!y.disabled&&(d.extraData=d.extraData||{},d.extraData[b]=y.value,"image"==y.type&&(d.extraData[b+".x"]=w.clk_x,d.extraData[b+".y"]=w.clk_y)));var D=1,k=2,A=e("meta[name=csrf-token]").attr("content"),L=e("meta[name=csrf-param]").attr("content");L&&A&&(d.extraData=d.extraData||{},d.extraData[L]=A),d.forceSync?o():setTimeout(o,10);var E,M,F,O=50,X=e.parseXML||function(e,t){return window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!=t.documentElement.nodeName?t:null},C=e.parseJSON||function(e){return window.eval("("+e+")")},_=function(t,r,a){var n=t.getResponseHeader("content-type")||"",i="xml"===r||!r&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),a&&a.dataFilter&&(o=a.dataFilter(o,r)),"string"==typeof o&&("json"===r||!r&&n.indexOf("json")>=0?o=C(o):("script"===r||!r&&n.indexOf("javascript")>=0)&&e.globalEval(o)),o};return S}if(!this.length)return a("ajaxSubmit: skipping submit process - no element selected"),this;var u,c,l,f=this;"function"==typeof t?t={success:t}:void 0===t&&(t={}),u=t.type||this.attr2("method"),c=t.url||this.attr2("action"),l="string"==typeof c?e.trim(c):"",l=l||window.location.href||"",l&&(l=(l.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:l,success:e.ajaxSettings.success,type:u||e.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var d={};if(this.trigger("form-pre-serialize",[this,t,d]),d.veto)return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&t.beforeSerialize(this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var m=t.traditional;void 0===m&&(m=e.ajaxSettings.traditional);var p,h=[],v=this.formToArray(t.semantic,h);if(t.data&&(t.extraData=t.data,p=e.param(t.data,m)),t.beforeSubmit&&t.beforeSubmit(v,this,t)===!1)return a("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[v,this,t,d]),d.veto)return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var g=e.param(v,m);p&&(g=g?g+"&"+p:p),"GET"==t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+g,t.data=null):t.data=g;var x=[];if(t.resetForm&&x.push(function(){f.resetForm()}),t.clearForm&&x.push(function(){f.clearForm(t.includeHidden)}),!t.dataType&&t.target){var y=t.success||function(){};x.push(function(r){var a=t.replaceTarget?"replaceWith":"html";e(t.target)[a](r).each(y,arguments)})}else t.success&&x.push(t.success);if(t.success=function(e,r,a){for(var n=t.context||this,i=0,o=x.length;o>i;i++)x[i].apply(n,[e,r,a||f,f])},t.error){var b=t.error;t.error=function(e,r,a){var n=t.context||this;b.apply(n,[e,r,a,f])}}if(t.complete){var T=t.complete;t.complete=function(e,r){var a=t.context||this;T.apply(a,[e,r,f])}}var j=e("input[type=file]:enabled",this).filter(function(){return""!==e(this).val()}),w=j.length>0,S="multipart/form-data",D=f.attr("enctype")==S||f.attr("encoding")==S,k=n.fileapi&&n.formdata;a("fileAPI :"+k);var A,L=(w||D)&&!k;t.iframe!==!1&&(t.iframe||L)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){A=s(v)}):A=s(v):A=(w||D)&&k?o(v):e.ajax(t),f.removeData("jqxhr").data("jqxhr",A);for(var E=0;E<h.length;E++)h[E]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n){if(n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var i={s:this.selector,c:this.context};return!e.isReady&&i.s?(a("DOM not ready, queuing ajaxForm"),e(function(){e(i.s,i.c).ajaxForm(n)}),this):(a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,r).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,r),this):this.ajaxFormUnbind().bind("submit.form-plugin",n,t).bind("click.form-plugin",n,r)},e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,r){var a=[];if(0===this.length)return a;var i,o=this[0],s=this.attr("id"),u=t?o.getElementsByTagName("*"):o.elements;if(u&&!/MSIE [678]/.test(navigator.userAgent)&&(u=e(u).get()),s&&(i=e(':input[form="'+s+'"]').get(),i.length&&(u=(u||[]).concat(i))),!u||!u.length)return a;var c,l,f,d,m,p,h;for(c=0,p=u.length;p>c;c++)if(m=u[c],f=m.name,f&&!m.disabled)if(t&&o.clk&&"image"==m.type)o.clk==m&&(a.push({name:f,value:e(m).val(),type:m.type}),a.push({name:f+".x",value:o.clk_x},{name:f+".y",value:o.clk_y}));else if(d=e.fieldValue(m,!0),d&&d.constructor==Array)for(r&&r.push(m),l=0,h=d.length;h>l;l++)a.push({name:f,value:d[l]});else if(n.fileapi&&"file"==m.type){r&&r.push(m);var v=m.files;if(v.length)for(l=0;l<v.length;l++)a.push({name:f,value:v[l],type:m.type});else a.push({name:f,value:"",type:m.type})}else null!==d&&"undefined"!=typeof d&&(r&&r.push(m),a.push({name:f,value:d,type:m.type,required:m.required}));if(!t&&o.clk){var g=e(o.clk),x=g[0];f=x.name,f&&!x.disabled&&"image"==x.type&&(a.push({name:f,value:g.val()}),a.push({name:f+".x",value:o.clk_x},{name:f+".y",value:o.clk_y}))}return a},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var r=[];return this.each(function(){var a=this.name;if(a){var n=e.fieldValue(this,t);if(n&&n.constructor==Array)for(var i=0,o=n.length;o>i;i++)r.push({name:a,value:n[i]});else null!==n&&"undefined"!=typeof n&&r.push({name:this.name,value:n})}}),e.param(r)},e.fn.fieldValue=function(t){for(var r=[],a=0,n=this.length;n>a;a++){var i=this[a],o=e.fieldValue(i,t);null===o||"undefined"==typeof o||o.constructor==Array&&!o.length||(o.constructor==Array?e.merge(r,o):r.push(o))}return r},e.fieldValue=function(t,r){var a=t.name,n=t.type,i=t.tagName.toLowerCase();if(void 0===r&&(r=!0),r&&(!a||t.disabled||"reset"==n||"button"==n||("checkbox"==n||"radio"==n)&&!t.checked||("submit"==n||"image"==n)&&t.form&&t.form.clk!=t||"select"==i&&-1==t.selectedIndex))return null;if("select"==i){var o=t.selectedIndex;if(0>o)return null;for(var s=[],u=t.options,c="select-one"==n,l=c?o+1:u.length,f=c?o:0;l>f;f++){var d=u[f];if(d.selected){var m=d.value;if(m||(m=d.attributes&&d.attributes.value&&!d.attributes.value.specified?d.text:d.value),c)return m;s.push(m)}}return s}return e(t).val()},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var r=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var a=this.type,n=this.tagName.toLowerCase();r.test(a)||"textarea"==n?this.value="":"checkbox"==a||"radio"==a?this.checked=!1:"select"==n?this.selectedIndex=-1:"file"==a?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(t===!0&&/hidden/.test(a)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var r=this.type;if("checkbox"==r||"radio"==r)this.checked=t;else if("option"==this.tagName.toLowerCase()){var a=e(this).parent("select");t&&a[0]&&"select-one"==a[0].type&&a.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1});
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