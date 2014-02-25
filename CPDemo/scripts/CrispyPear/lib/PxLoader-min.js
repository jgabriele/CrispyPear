function PxLoader(c){c=c||{};if(c.statusInterval==null){c.statusInterval=5000}if(c.loggingDelay==null){c.loggingDelay=20*1000}if(c.noProgressTimeout==null){c.noProgressTimeout=Infinity}var f=[],a=[],m,b=+new Date;var i={QUEUED:0,WAITING:1,LOADED:2,ERROR:3,TIMEOUT:4};var j=function(n){if(n==null){return[]}if(Array.isArray(n)){return n}return[n]};this.add=function(n){n.tags=j(n.tags);if(n.priority==null){n.priority=Infinity}f.push({resource:n,state:i.QUEUED})};this.addProgressListener=function(o,n){a.push({callback:o,tags:j(n)})};this.addCompletionListener=function(o,n){a.push({tags:j(n),callback:function(p){if(p.completedCount===p.totalCount){o()}}})};var h=function(n){n=j(n);var o=function(t){var u=t.resource,s=Infinity;for(var r=0,p=u.tags.length;r<p;r++){var q=n.indexOf(u.tags[r]);if(q>=0&&q<s){s=q}}return s};return function(q,p){var s=o(q),r=o(p);if(s<r){return -1}if(s>r){return 1}if(q.priority<p.priority){return -1}if(q.priority>p.priority){return 1}}};this.start=function(o){m=+new Date;var p=h(o);f.sort(p);for(var q=0,n=f.length;q<n;q++){var r=f[q];r.status=i.WAITING;r.resource.start(this)}setTimeout(d,100)};var d=function(){var r=false,s=(+new Date)-b,o=(s>=c.noProgressTimeout),p=(s>=c.loggingDelay);for(var q=0,n=f.length;q<n;q++){var t=f[q];if(t.status!==i.WAITING){continue}t.resource.checkStatus();if(t.status===i.WAITING){if(o){t.resource.onTimeout()}else{r=true}}}if(p&&r){e()}if(r){setTimeout(d,c.statusInterval)}};this.isBusy=function(){for(var o=0,n=f.length;o<n;o++){if(f[o].status===i.QUEUED||f[o].status===i.WAITING){return true}}return false};var l=function(p,o){for(var q=0,n=p.length;q<n;q++){if(o.indexOf(p[q])>=0){return true}}return false};var k=function(p,v){var u=null;for(var q=0,t=f.length;q<t;q++){if(f[q].resource===p){u=f[q];break}}if(u==null||u.status!==i.WAITING){return}u.status=v;b=+new Date;var n=p.tags.length;for(var q=0,s=a.length;q<s;q++){var o=a[q],r;if(o.tags.length===0){r=true}else{r=l(p.tags,o.tags)}if(r){g(u,o)}}};this.onLoad=function(n){k(n,i.LOADED)};this.onError=function(n){k(n,i.ERROR)};this.onTimeout=function(n){k(n,i.TIMEOUT)};var g=function(o,u){var r=0,t=0;for(var q=0,n=f.length;q<n;q++){var s=f[q],p;if(u.tags.length===0){p=true}else{p=l(s.resource.tags,u.tags)}if(p){t++;if(s.status===i.LOADED||s.status===i.ERROR||s.status===i.TIMEOUT){r++}}}u.callback({resource:o.resource,loaded:(o.status===i.LOADED),error:(o.status===i.ERROR),timeout:(o.status===i.TIMEOUT),completedCount:r,totalCount:t})};var e=this.log=function(q){if(!window.console){return}var p=Math.round((+new Date-m)/1000);window.console.log("PxLoader elapsed: "+p+" sec");for(var o=0,n=f.length;o<n;o++){var s=f[o];if(!q&&s.status!==i.WAITING){continue}var r="PxLoader: #"+o+" "+s.resource.getName();switch(s.status){case i.QUEUED:r+=" (Not Started)";break;case i.WAITING:r+=" (Waiting)";break;case i.LOADED:r+=" (Loaded)";break;case i.ERROR:r+=" (Error)";break;case i.TIMEOUT:r+=" (Timeout)";break}if(s.resource.tags.length>0){r+=" Tags: ["+s.resource.tags.join(",")+"]"}window.console.log(r)}}}if(!Array.isArray){Array.isArray=function(a){return Object.prototype.toString.call(a)=="[object Array]"}}if(!Array.prototype.indexOf){Array.prototype.indexOf=function(c){if(this==null){throw new TypeError()}var d=Object(this);var a=d.length>>>0;if(a===0){return -1}var e=0;if(arguments.length>0){e=Number(arguments[1]);if(e!=e){e=0}else{if(e!=0&&e!=Infinity&&e!=-Infinity){e=(e>0||-1)*Math.floor(Math.abs(e))}}}if(e>=a){return -1}var b=e>=0?e:Math.max(a-Math.abs(e),0);for(;b<a;b++){if(b in d&&d[b]===c){return b}}return -1}}function PxLoaderImage(a,i,f){var h=this,g=null;this.img=new Image();this.tags=i;this.priority=f;var b=function(){if(h.img.readyState=="complete"){c();g.onLoad(h)}};var e=function(){c();g.onLoad(h)};var d=function(){c();g.onError(h)};var c=function(){h.unbind("load",e);h.unbind("readystatechange",b);h.unbind("error",d)};this.start=function(j){g=j;h.bind("load",e);h.bind("readystatechange",b);h.bind("error",d);h.img.src=a};this.checkStatus=function(){if(h.img.complete){c();g.onLoad(h)}};this.onTimeout=function(){c();if(h.img.complete){g.onLoad(h)}else{g.onTimeout(h)}};this.getName=function(){return a};this.bind=function(j,k){if(h.img.addEventListener){h.img.addEventListener(j,k,false)}else{if(h.img.attachEvent){h.img.attachEvent("on"+j,k)}}};this.unbind=function(j,k){if(h.img.removeEventListener){h.img.removeEventListener(j,k)}else{if(h.img.detachEvent){h.img.detachEvent("on"+j,k)}}}}PxLoader.prototype.addImage=function(c,b,d){var a=new PxLoaderImage(c,b,d);this.add(a);return a.img};function PxLoaderSound(f,d,c,e){var b=this,a=null;this.tags=c;this.priority=e;this.sound=soundManager.createSound({id:f,url:d,autoLoad:false,onload:function(){a.onLoad(b)},onsuspend:function(){a.onTimeout(b)},whileloading:function(){var h=this["bytesLoaded"],g=this["bytesTotal"];if(h>0&&(h===g)){a.onLoad(b)}}});this.start=function(h){a=h;var g=navigator.userAgent.match(/(ipad|iphone|ipod)/i);if(g){a.onTimeout(b)}else{this.sound.load()}};this.checkStatus=function(){switch(b.sound.readyState){case 0:case 1:break;case 2:a.onError(b);break;case 3:a.onLoad(b);break}};this.onTimeout=function(){a.onTimeout(b)};this.getName=function(){return d}}PxLoader.prototype.addSound=function(e,b,a,c){var d=new PxLoaderSound(e,b,a,c);this.add(d);return d.sound};