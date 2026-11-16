const bp=()=>{};var Zu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wl=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let i=r.charCodeAt(n);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(i=65536+((i&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Rp=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const i=r[t++];if(i<128)e[n++]=String.fromCharCode(i);else if(i>191&&i<224){const s=r[t++];e[n++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=r[t++],a=r[t++],u=r[t++],c=((i&7)<<18|(s&63)<<12|(a&63)<<6|u&63)-65536;e[n++]=String.fromCharCode(55296+(c>>10)),e[n++]=String.fromCharCode(56320+(c&1023))}else{const s=r[t++],a=r[t++];e[n++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Hl={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let i=0;i<r.length;i+=3){const s=r[i],a=i+1<r.length,u=a?r[i+1]:0,c=i+2<r.length,d=c?r[i+2]:0,p=s>>2,m=(s&3)<<4|u>>4;let w=(u&15)<<2|d>>6,S=d&63;c||(S=64,a||(w=64)),n.push(t[p],t[m],t[w],t[S])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(Wl(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):Rp(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let i=0;i<r.length;){const s=t[r.charAt(i++)],u=i<r.length?t[r.charAt(i)]:0;++i;const d=i<r.length?t[r.charAt(i)]:64;++i;const m=i<r.length?t[r.charAt(i)]:64;if(++i,s==null||u==null||d==null||m==null)throw new Sp;const w=s<<2|u>>4;if(n.push(w),d!==64){const S=u<<4&240|d>>2;if(n.push(S),m!==64){const V=d<<6&192|m;n.push(V)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Sp extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Pp=function(r){const e=Wl(r);return Hl.encodeByteArray(e,!0)},Ql=function(r){return Pp(r).replace(/\./g,"")},Xl=function(r){try{return Hl.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jl(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cp=()=>Jl().__FIREBASE_DEFAULTS__,Vp=()=>{if(typeof process>"u"||typeof Zu>"u")return;const r=Zu.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Dp=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Xl(r[1]);return e&&JSON.parse(e)},oa=()=>{try{return bp()||Cp()||Vp()||Dp()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},kp=()=>{var r;return(r=oa())===null||r===void 0?void 0:r.config},Np=r=>{var e;return(e=oa())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Es(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Op(r){return(await fetch(r,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ye(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Mp(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ye())}function Yl(){var r;const e=(r=oa())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Lp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Fp(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function Up(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Bp(){const r=ye();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function Zl(){return!Yl()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function eh(){return!Yl()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function th(){try{return typeof indexedDB=="object"}catch{return!1}}function jp(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qp="FirebaseError";class ot extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=qp,Object.setPrototypeOf(this,ot.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Jr.prototype.create)}}class Jr{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?zp(s,n):"Error",u=`${this.serviceName}: ${a} (${i}).`;return new ot(i,u,n)}}function zp(r,e){return r.replace($p,(t,n)=>{const i=e[n];return i!=null?String(i):`<${n}?>`})}const $p=/\{\$([^}]+)}/g;function Or(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const i of t){if(!n.includes(i))return!1;const s=r[i],a=e[i];if(ec(s)&&ec(a)){if(!Or(s,a))return!1}else if(s!==a)return!1}for(const i of n)if(!t.includes(i))return!1;return!0}function ec(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nh(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function yr(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[i,s]=n.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function Ir(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function Kp(r,e){const t=new Gp(r,e);return t.subscribe.bind(t)}class Gp{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let i;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");Wp(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:n},i.next===void 0&&(i.next=mo),i.error===void 0&&(i.error=mo),i.complete===void 0&&(i.complete=mo);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Wp(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function mo(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Me(r){return r&&r._delegate?r._delegate:r}class Zt{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hp{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new xp;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&n.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Xp(e))try{this.getOrInitializeService({instanceIdentifier:Ft})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});n.resolve(s)}catch{}}}}clearInstance(e=Ft){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ft){return this.instances.has(e)}getOptions(e=Ft){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[s,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(s);n===u&&a.resolve(i)}return i}onInit(e,t){var n;const i=this.normalizeInstanceIdentifier(t),s=(n=this.onInitCallbacks.get(i))!==null&&n!==void 0?n:new Set;s.add(e),this.onInitCallbacks.set(i,s);const a=this.instances.get(i);return a&&e(a,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Qp(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=Ft){return this.component?this.component.multipleInstances?e:Ft:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Qp(r){return r===Ft?void 0:r}function Xp(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jp{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Hp(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var G;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(G||(G={}));const Yp={debug:G.DEBUG,verbose:G.VERBOSE,info:G.INFO,warn:G.WARN,error:G.ERROR,silent:G.SILENT},Zp=G.INFO,em={[G.DEBUG]:"log",[G.VERBOSE]:"log",[G.INFO]:"info",[G.WARN]:"warn",[G.ERROR]:"error"},tm=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),i=em[e];if(i)console[i](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class aa{constructor(e){this.name=e,this._logLevel=Zp,this._logHandler=tm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in G))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Yp[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,G.DEBUG,...e),this._logHandler(this,G.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,G.VERBOSE,...e),this._logHandler(this,G.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,G.INFO,...e),this._logHandler(this,G.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,G.WARN,...e),this._logHandler(this,G.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,G.ERROR,...e),this._logHandler(this,G.ERROR,...e)}}const nm=(r,e)=>e.some(t=>r instanceof t);let tc,nc;function rm(){return tc||(tc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function im(){return nc||(nc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const rh=new WeakMap,Po=new WeakMap,ih=new WeakMap,go=new WeakMap,ua=new WeakMap;function sm(r){const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("success",s),r.removeEventListener("error",a)},s=()=>{t(yt(r.result)),i()},a=()=>{n(r.error),i()};r.addEventListener("success",s),r.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&rh.set(t,r)}).catch(()=>{}),ua.set(e,r),e}function om(r){if(Po.has(r))return;const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("complete",s),r.removeEventListener("error",a),r.removeEventListener("abort",a)},s=()=>{t(),i()},a=()=>{n(r.error||new DOMException("AbortError","AbortError")),i()};r.addEventListener("complete",s),r.addEventListener("error",a),r.addEventListener("abort",a)});Po.set(r,e)}let Co={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Po.get(r);if(e==="objectStoreNames")return r.objectStoreNames||ih.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return yt(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function am(r){Co=r(Co)}function um(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(_o(this),e,...t);return ih.set(n,e.sort?e.sort():[e]),yt(n)}:im().includes(r)?function(...e){return r.apply(_o(this),e),yt(rh.get(this))}:function(...e){return yt(r.apply(_o(this),e))}}function cm(r){return typeof r=="function"?um(r):(r instanceof IDBTransaction&&om(r),nm(r,rm())?new Proxy(r,Co):r)}function yt(r){if(r instanceof IDBRequest)return sm(r);if(go.has(r))return go.get(r);const e=cm(r);return e!==r&&(go.set(r,e),ua.set(e,r)),e}const _o=r=>ua.get(r);function lm(r,e,{blocked:t,upgrade:n,blocking:i,terminated:s}={}){const a=indexedDB.open(r,e),u=yt(a);return n&&a.addEventListener("upgradeneeded",c=>{n(yt(a.result),c.oldVersion,c.newVersion,yt(a.transaction),c)}),t&&a.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),u.then(c=>{s&&c.addEventListener("close",()=>s()),i&&c.addEventListener("versionchange",d=>i(d.oldVersion,d.newVersion,d))}).catch(()=>{}),u}const hm=["get","getKey","getAll","getAllKeys","count"],dm=["put","add","delete","clear"],yo=new Map;function rc(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(yo.get(e))return yo.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,i=dm.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(i||hm.includes(t)))return;const s=async function(a,...u){const c=this.transaction(a,i?"readwrite":"readonly");let d=c.store;return n&&(d=d.index(u.shift())),(await Promise.all([d[t](...u),i&&c.done]))[0]};return yo.set(e,s),s}am(r=>({...r,get:(e,t,n)=>rc(e,t)||r.get(e,t,n),has:(e,t)=>!!rc(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fm{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(pm(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function pm(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Vo="@firebase/app",ic="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rt=new aa("@firebase/app"),mm="@firebase/app-compat",gm="@firebase/analytics-compat",_m="@firebase/analytics",ym="@firebase/app-check-compat",Im="@firebase/app-check",Em="@firebase/auth",vm="@firebase/auth-compat",Tm="@firebase/database",wm="@firebase/data-connect",Am="@firebase/database-compat",bm="@firebase/functions",Rm="@firebase/functions-compat",Sm="@firebase/installations",Pm="@firebase/installations-compat",Cm="@firebase/messaging",Vm="@firebase/messaging-compat",Dm="@firebase/performance",km="@firebase/performance-compat",Nm="@firebase/remote-config",xm="@firebase/remote-config-compat",Om="@firebase/storage",Mm="@firebase/storage-compat",Lm="@firebase/firestore",Fm="@firebase/ai",Um="@firebase/firestore-compat",Bm="firebase",jm="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qm="[DEFAULT]",zm={[Vo]:"fire-core",[mm]:"fire-core-compat",[_m]:"fire-analytics",[gm]:"fire-analytics-compat",[Im]:"fire-app-check",[ym]:"fire-app-check-compat",[Em]:"fire-auth",[vm]:"fire-auth-compat",[Tm]:"fire-rtdb",[wm]:"fire-data-connect",[Am]:"fire-rtdb-compat",[bm]:"fire-fn",[Rm]:"fire-fn-compat",[Sm]:"fire-iid",[Pm]:"fire-iid-compat",[Cm]:"fire-fcm",[Vm]:"fire-fcm-compat",[Dm]:"fire-perf",[km]:"fire-perf-compat",[Nm]:"fire-rc",[xm]:"fire-rc-compat",[Om]:"fire-gcs",[Mm]:"fire-gcs-compat",[Lm]:"fire-fst",[Um]:"fire-fst-compat",[Fm]:"fire-vertex","fire-js":"fire-js",[Bm]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Do=new Map,$m=new Map,ko=new Map;function sc(r,e){try{r.container.addComponent(e)}catch(t){rt.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Vn(r){const e=r.name;if(ko.has(e))return rt.debug(`There were multiple attempts to register component ${e}.`),!1;ko.set(e,r);for(const t of Do.values())sc(t,r);for(const t of $m.values())sc(t,r);return!0}function sh(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Ge(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Km={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Wt=new Jr("app","Firebase",Km);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gm{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Zt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Wt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vs=jm;function Wm(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n=Object.assign({name:qm,automaticDataCollectionEnabled:!0},e),i=n.name;if(typeof i!="string"||!i)throw Wt.create("bad-app-name",{appName:String(i)});if(t||(t=kp()),!t)throw Wt.create("no-options");const s=Do.get(i);if(s){if(Or(t,s.options)&&Or(n,s.config))return s;throw Wt.create("duplicate-app",{appName:i})}const a=new Jp(i);for(const c of ko.values())a.addComponent(c);const u=new Gm(t,n,a);return Do.set(i,u),u}function It(r,e,t){var n;let i=(n=zm[r])!==null&&n!==void 0?n:r;t&&(i+=`-${t}`);const s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const u=[`Unable to register library "${i}" with version "${e}":`];s&&u.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&u.push("and"),a&&u.push(`version name "${e}" contains illegal characters (whitespace or "/")`),rt.warn(u.join(" "));return}Vn(new Zt(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hm="firebase-heartbeat-database",Qm=1,Mr="firebase-heartbeat-store";let Io=null;function oh(){return Io||(Io=lm(Hm,Qm,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(Mr)}catch(t){console.warn(t)}}}}).catch(r=>{throw Wt.create("idb-open",{originalErrorMessage:r.message})})),Io}async function Xm(r){try{const t=(await oh()).transaction(Mr),n=await t.objectStore(Mr).get(ah(r));return await t.done,n}catch(e){if(e instanceof ot)rt.warn(e.message);else{const t=Wt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});rt.warn(t.message)}}}async function oc(r,e){try{const n=(await oh()).transaction(Mr,"readwrite");await n.objectStore(Mr).put(e,ah(r)),await n.done}catch(t){if(t instanceof ot)rt.warn(t.message);else{const n=Wt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});rt.warn(n.message)}}}function ah(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jm=1024,Ym=30;class Zm{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new tg(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=ac();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Ym){const a=ng(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){rt.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ac(),{heartbeatsToSend:n,unsentEntries:i}=eg(this._heartbeatsCache.heartbeats),s=Ql(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return rt.warn(t),""}}}function ac(){return new Date().toISOString().substring(0,10)}function eg(r,e=Jm){const t=[];let n=r.slice();for(const i of r){const s=t.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),uc(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),uc(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class tg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return th()?jp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Xm(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return oc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return oc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function uc(r){return Ql(JSON.stringify({version:2,heartbeats:r})).length}function ng(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rg(r){Vn(new Zt("platform-logger",e=>new fm(e),"PRIVATE")),Vn(new Zt("heartbeat",e=>new Zm(e),"PRIVATE")),It(Vo,ic,r),It(Vo,ic,"esm2017"),It("fire-js","")}rg("");var ig="firebase",sg="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */It(ig,sg,"app");function uh(r,e){var t={};for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&e.indexOf(n)<0&&(t[n]=r[n]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(r);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(r,n[i])&&(t[n[i]]=r[n[i]]);return t}function ch(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const og=ch,lh=new Jr("auth","Firebase",ch());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hi=new aa("@firebase/auth");function ag(r,...e){Hi.logLevel<=G.WARN&&Hi.warn(`Auth (${vs}): ${r}`,...e)}function Oi(r,...e){Hi.logLevel<=G.ERROR&&Hi.error(`Auth (${vs}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dn(r,...e){throw la(r,...e)}function ca(r,...e){return la(r,...e)}function hh(r,e,t){const n=Object.assign(Object.assign({},og()),{[e]:t});return new Jr("auth","Firebase",n).create(e,{appName:r.name})}function Ht(r){return hh(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function la(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return lh.create(r,...e)}function X(r,e,...t){if(!r)throw la(e,...t)}function tt(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Oi(e),new Error(e)}function Qi(r,e){r||tt(e)}function ug(){return cc()==="http:"||cc()==="https:"}function cc(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cg(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ug()||Fp()||"connection"in navigator)?navigator.onLine:!0}function lg(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{constructor(e,t){this.shortDelay=e,this.longDelay=t,Qi(t>e,"Short delay should be less than long delay!"),this.isMobile=Mp()||Up()}get(){return cg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hg(r,e){Qi(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dh{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;tt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;tt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;tt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dg={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fg=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],pg=new Yr(3e4,6e4);function Ct(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function Vt(r,e,t,n,i={}){return fh(r,i,async()=>{let s={},a={};n&&(e==="GET"?a=n:s={body:JSON.stringify(n)});const u=nh(Object.assign({key:r.config.apiKey},a)).slice(1),c=await r._getAdditionalHeaders();c["Content-Type"]="application/json",r.languageCode&&(c["X-Firebase-Locale"]=r.languageCode);const d=Object.assign({method:e,headers:c},s);return Lp()||(d.referrerPolicy="no-referrer"),r.emulatorConfig&&Es(r.emulatorConfig.host)&&(d.credentials="include"),dh.fetch()(await ph(r,r.config.apiHost,t,u),d)})}async function fh(r,e,t){r._canInitEmulator=!1;const n=Object.assign(Object.assign({},dg),e);try{const i=new gg(r),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Si(r,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const u=s.ok?a.errorMessage:a.error.message,[c,d]=u.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Si(r,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw Si(r,"email-already-in-use",a);if(c==="USER_DISABLED")throw Si(r,"user-disabled",a);const p=n[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw hh(r,p,d);Dn(r,p)}}catch(i){if(i instanceof ot)throw i;Dn(r,"network-request-failed",{message:String(i)})}}async function Ts(r,e,t,n,i={}){const s=await Vt(r,e,t,n,i);return"mfaPendingCredential"in s&&Dn(r,"multi-factor-auth-required",{_serverResponse:s}),s}async function ph(r,e,t,n){const i=`${e}${t}?${n}`,s=r,a=s.config.emulator?hg(r.config,i):`${r.config.apiScheme}://${i}`;return fg.includes(t)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function mg(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class gg{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(ca(this.auth,"network-request-failed")),pg.get())})}}function Si(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const i=ca(r,e,n);return i.customData._tokenResponse=t,i}function lc(r){return r!==void 0&&r.enterprise!==void 0}class _g{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return mg(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function yg(r,e){return Vt(r,"GET","/v2/recaptchaConfig",Ct(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ig(r,e){return Vt(r,"POST","/v1/accounts:delete",e)}async function Xi(r,e){return Vt(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function br(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Eg(r,e=!1){const t=Me(r),n=await t.getIdToken(e),i=mh(n);X(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:n,authTime:br(Eo(i.auth_time)),issuedAtTime:br(Eo(i.iat)),expirationTime:br(Eo(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Eo(r){return Number(r)*1e3}function mh(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return Oi("JWT malformed, contained fewer than 3 sections"),null;try{const i=Xl(t);return i?JSON.parse(i):(Oi("Failed to decode base64 JWT payload"),null)}catch(i){return Oi("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function hc(r){const e=mh(r);return X(e,"internal-error"),X(typeof e.exp<"u","internal-error"),X(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function No(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof ot&&vg(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function vg({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tg{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xo{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=br(this.lastLoginAt),this.creationTime=br(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ji(r){var e;const t=r.auth,n=await r.getIdToken(),i=await No(r,Xi(t,{idToken:n}));X(i==null?void 0:i.users.length,t,"internal-error");const s=i.users[0];r._notifyReloadListener(s);const a=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?gh(s.providerUserInfo):[],u=Ag(r.providerData,a),c=r.isAnonymous,d=!(r.email&&s.passwordHash)&&!(u!=null&&u.length),p=c?d:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:u,metadata:new xo(s.createdAt,s.lastLoginAt),isAnonymous:p};Object.assign(r,m)}async function wg(r){const e=Me(r);await Ji(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Ag(r,e){return[...r.filter(n=>!e.some(i=>i.providerId===n.providerId)),...e]}function gh(r){return r.map(e=>{var{providerId:t}=e,n=uh(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bg(r,e){const t=await fh(r,{},async()=>{const n=nh({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=r.config,a=await ph(r,i,"/v1/token",`key=${s}`),u=await r._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:u,body:n};return r.emulatorConfig&&Es(r.emulatorConfig.host)&&(c.credentials="include"),dh.fetch()(a,c)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Rg(r,e){return Vt(r,"POST","/v2/accounts:revokeToken",Ct(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){X(e.idToken,"internal-error"),X(typeof e.idToken<"u","internal-error"),X(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):hc(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){X(e.length!==0,"internal-error");const t=hc(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(X(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:i,expiresIn:s}=await bg(e,t);this.updateTokensAndExpiration(n,i,Number(s))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:i,expirationTime:s}=t,a=new Rn;return n&&(X(typeof n=="string","internal-error",{appName:e}),a.refreshToken=n),i&&(X(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(X(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Rn,this.toJSON())}_performRefresh(){return tt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dt(r,e){X(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class $e{constructor(e){var{uid:t,auth:n,stsTokenManager:i}=e,s=uh(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Tg(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new xo(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await No(this,this.stsTokenManager.getToken(this.auth,e));return X(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Eg(this,e)}reload(){return wg(this)}_assign(e){this!==e&&(X(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new $e(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){X(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Ji(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ge(this.auth.app))return Promise.reject(Ht(this.auth));const e=await this.getIdToken();return await No(this,Ig(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,i,s,a,u,c,d,p;const m=(n=t.displayName)!==null&&n!==void 0?n:void 0,w=(i=t.email)!==null&&i!==void 0?i:void 0,S=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,V=(a=t.photoURL)!==null&&a!==void 0?a:void 0,N=(u=t.tenantId)!==null&&u!==void 0?u:void 0,D=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,z=(d=t.createdAt)!==null&&d!==void 0?d:void 0,B=(p=t.lastLoginAt)!==null&&p!==void 0?p:void 0,{uid:F,emailVerified:H,isAnonymous:Z,providerData:K,stsTokenManager:I}=t;X(F&&I,e,"internal-error");const g=Rn.fromJSON(this.name,I);X(typeof F=="string",e,"internal-error"),dt(m,e.name),dt(w,e.name),X(typeof H=="boolean",e,"internal-error"),X(typeof Z=="boolean",e,"internal-error"),dt(S,e.name),dt(V,e.name),dt(N,e.name),dt(D,e.name),dt(z,e.name),dt(B,e.name);const y=new $e({uid:F,auth:e,email:w,emailVerified:H,displayName:m,isAnonymous:Z,photoURL:V,phoneNumber:S,tenantId:N,stsTokenManager:g,createdAt:z,lastLoginAt:B});return K&&Array.isArray(K)&&(y.providerData=K.map(E=>Object.assign({},E))),D&&(y._redirectEventId=D),y}static async _fromIdTokenResponse(e,t,n=!1){const i=new Rn;i.updateFromServerResponse(t);const s=new $e({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:n});return await Ji(s),s}static async _fromGetAccountInfoResponse(e,t,n){const i=t.users[0];X(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?gh(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),u=new Rn;u.updateFromIdToken(n);const c=new $e({uid:i.localId,auth:e,stsTokenManager:u,isAnonymous:a}),d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new xo(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dc=new Map;function Kt(r){Qi(r instanceof Function,"Expected a class definition");let e=dc.get(r);return e?(Qi(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,dc.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _h{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}_h.type="NONE";const fc=_h;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vo(r,e,t){return`firebase:${r}:${e}:${t}`}class Sn{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:i,name:s}=this.auth;this.fullUserKey=vo(this.userKey,i.apiKey,s),this.fullPersistenceKey=vo("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Xi(this.auth,{idToken:e}).catch(()=>{});return t?$e._fromGetAccountInfoResponse(this.auth,t,e):null}return $e._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Sn(Kt(fc),e,n);const i=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let s=i[0]||Kt(fc);const a=vo(n,e.config.apiKey,e.name);let u=null;for(const d of t)try{const p=await d._get(a);if(p){let m;if(typeof p=="string"){const w=await Xi(e,{idToken:p}).catch(()=>{});if(!w)break;m=await $e._fromGetAccountInfoResponse(e,w,p)}else m=$e._fromJSON(e,p);d!==s&&(u=m),s=d;break}}catch{}const c=i.filter(d=>d._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new Sn(s,e,n):(s=c[0],u&&await s._set(a,u.toJSON()),await Promise.all(t.map(async d=>{if(d!==s)try{await d._remove(a)}catch{}})),new Sn(s,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pc(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(yh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Sg(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Eh(e))return"Blackberry";if(vh(e))return"Webos";if(Pg(e))return"Safari";if((e.includes("chrome/")||Cg(e))&&!e.includes("edge/"))return"Chrome";if(Ih(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function Sg(r=ye()){return/firefox\//i.test(r)}function Pg(r=ye()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Cg(r=ye()){return/crios\//i.test(r)}function yh(r=ye()){return/iemobile/i.test(r)}function Ih(r=ye()){return/android/i.test(r)}function Eh(r=ye()){return/blackberry/i.test(r)}function vh(r=ye()){return/webos/i.test(r)}function Vg(r=ye()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function Dg(){return Bp()&&document.documentMode===10}function kg(r=ye()){return Vg(r)||Ih(r)||vh(r)||Eh(r)||/windows phone/i.test(r)||yh(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Th(r,e=[]){let t;switch(r){case"Browser":t=pc(ye());break;case"Worker":t=`${pc(ye())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${vs}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ng{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=s=>new Promise((a,u)=>{try{const c=e(s);a(c)}catch(c){u(c)}});n.onAbort=t,this.queue.push(n);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xg(r,e={}){return Vt(r,"GET","/v2/passwordPolicy",Ct(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Og=6;class Mg{constructor(e){var t,n,i,s;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:Og,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(n=e.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,i,s,a,u;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(n=c.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(i=c.containsLowercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(s=c.containsUppercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(u=c.containsNonAlphanumericCharacter)!==null&&u!==void 0?u:!0),c}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let i=0;i<e.length;i++)n=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lg{constructor(e,t,n,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new mc(this),this.idTokenSubscription=new mc(this),this.beforeStateQueue=new Ng(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=lh,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Kt(t)),this._initializationPromise=this.queue(async()=>{var n,i,s;if(!this._deleted&&(this.persistenceManager=await Sn.create(this,e),(n=this._resolvePersistenceManagerAvailable)===null||n===void 0||n.call(this),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Xi(this,{idToken:e}),n=await $e._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Ge(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(u,u))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let i=n,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,u=i==null?void 0:i._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===u)&&(c!=null&&c.user)&&(i=c.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(a){i=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return X(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ji(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=lg()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ge(this.app))return Promise.reject(Ht(this));const t=e?Me(e):null;return t&&X(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&X(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ge(this.app)?Promise.reject(Ht(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ge(this.app)?Promise.reject(Ht(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Kt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await xg(this),t=new Mg(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Jr("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await Rg(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Kt(e)||this._popupRedirectResolver;X(t,this,"argument-error"),this.redirectPersistenceManager=await Sn.create(this,[Kt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let a=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(X(u,this,"internal-error"),u.then(()=>{a||s(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,n,i);return()=>{a=!0,c()}}else{const c=e.addObserver(t);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return X(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Th(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;if(Ge(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&ag(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Kn(r){return Me(r)}class mc{constructor(e){this.auth=e,this.observer=null,this.addObserver=Kp(t=>this.observer=t)}get next(){return X(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ha={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Fg(r){ha=r}function Ug(r){return ha.loadJS(r)}function Bg(){return ha.recaptchaEnterpriseScript}class jg{constructor(){this.enterprise=new qg}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class qg{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const zg="recaptcha-enterprise",wh="NO_RECAPTCHA";class $g{constructor(e){this.type=zg,this.auth=Kn(e)}async verify(e="verify",t=!1){async function n(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,u)=>{yg(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)u(new Error("recaptcha Enterprise site key undefined"));else{const d=new _g(c);return s.tenantId==null?s._agentRecaptchaConfig=d:s._tenantRecaptchaConfigs[s.tenantId]=d,a(d.siteKey)}}).catch(c=>{u(c)})})}function i(s,a,u){const c=window.grecaptcha;lc(c)?c.enterprise.ready(()=>{c.enterprise.execute(s,{action:e}).then(d=>{a(d)}).catch(()=>{a(wh)})}):u(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new jg().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{n(this.auth).then(u=>{if(!t&&lc(window.grecaptcha))i(u,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Bg();c.length!==0&&(c+=u),Ug(c).then(()=>{i(u,s,a)}).catch(d=>{a(d)})}}).catch(u=>{a(u)})})}}async function gc(r,e,t,n=!1,i=!1){const s=new $g(r);let a;if(i)a=wh;else try{a=await s.verify(t)}catch{a=await s.verify(t,!0)}const u=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in u){const c=u.phoneEnrollmentInfo.phoneNumber,d=u.phoneEnrollmentInfo.recaptchaToken;Object.assign(u,{phoneEnrollmentInfo:{phoneNumber:c,recaptchaToken:d,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in u){const c=u.phoneSignInInfo.recaptchaToken;Object.assign(u,{phoneSignInInfo:{recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return u}return n?Object.assign(u,{captchaResp:a}):Object.assign(u,{captchaResponse:a}),Object.assign(u,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(u,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),u}async function Yi(r,e,t,n,i){var s;if(!((s=r._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await gc(r,e,t,t==="getOobCode");return n(r,a)}else return n(r,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const u=await gc(r,e,t,t==="getOobCode");return n(r,u)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kg(r,e){const t=sh(r,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(Or(s,e??{}))return i;Dn(i,"already-initialized")}return t.initialize({options:e})}function Gg(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(Kt);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wg{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return tt("not implemented")}_getIdTokenResponse(e){return tt("not implemented")}_linkToIdToken(e,t){return tt("not implemented")}_getReauthenticationResolver(e){return tt("not implemented")}}async function Hg(r,e){return Vt(r,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qg(r,e){return Ts(r,"POST","/v1/accounts:signInWithPassword",Ct(r,e))}async function Xg(r,e){return Vt(r,"POST","/v1/accounts:sendOobCode",Ct(r,e))}async function Jg(r,e){return Xg(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yg(r,e){return Ts(r,"POST","/v1/accounts:signInWithEmailLink",Ct(r,e))}async function Zg(r,e){return Ts(r,"POST","/v1/accounts:signInWithEmailLink",Ct(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr extends Wg{constructor(e,t,n,i=null){super("password",n),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new Lr(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new Lr(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Yi(e,t,"signInWithPassword",Qg);case"emailLink":return Yg(e,{email:this._email,oobCode:this._password});default:Dn(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Yi(e,n,"signUpPassword",Hg);case"emailLink":return Zg(e,{idToken:t,email:this._email,oobCode:this._password});default:Dn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e_(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function t_(r){const e=yr(Ir(r)).link,t=e?yr(Ir(e)).deep_link_id:null,n=yr(Ir(r)).deep_link_id;return(n?yr(Ir(n)).link:null)||n||t||e||r}class da{constructor(e){var t,n,i,s,a,u;const c=yr(Ir(e)),d=(t=c.apiKey)!==null&&t!==void 0?t:null,p=(n=c.oobCode)!==null&&n!==void 0?n:null,m=e_((i=c.mode)!==null&&i!==void 0?i:null);X(d&&p&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=p,this.continueUrl=(s=c.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(a=c.lang)!==null&&a!==void 0?a:null,this.tenantId=(u=c.tenantId)!==null&&u!==void 0?u:null}static parseLink(e){const t=t_(e);try{return new da(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gn{constructor(){this.providerId=Gn.PROVIDER_ID}static credential(e,t){return Lr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=da.parseLink(t);return X(n,"argument-error"),Lr._fromEmailAndCode(e,n.code,n.tenantId)}}Gn.PROVIDER_ID="password";Gn.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Gn.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function n_(r,e){return Ts(r,"POST","/v1/accounts:signUp",Ct(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,i=!1){const s=await $e._fromIdTokenResponse(e,n,i),a=_c(n);return new Fr({user:s,providerId:a,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const i=_c(n);return new Fr({user:e,providerId:i,_tokenResponse:n,operationType:t})}}function _c(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi extends ot{constructor(e,t,n,i){var s;super(t.code,t.message),this.operationType=n,this.user=i,Object.setPrototypeOf(this,Zi.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,i){return new Zi(e,t,n,i)}}function r_(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Zi._fromErrorAndOperation(r,s,e,n):s})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function i_(r,e,t=!1){if(Ge(r.app))return Promise.reject(Ht(r));const n="signIn",i=await r_(r,n,e),s=await Fr._fromIdTokenResponse(r,n,i);return t||await r._updateCurrentUser(s.user),s}async function s_(r,e){return i_(Kn(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ah(r){const e=Kn(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function o_(r,e,t){const n=Kn(r);await Yi(n,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Jg)}async function a_(r,e,t){if(Ge(r.app))return Promise.reject(Ht(r));const n=Kn(r),a=await Yi(n,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",n_).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Ah(r),c}),u=await Fr._fromIdTokenResponse(n,"signIn",a);return await n._updateCurrentUser(u.user),u}function u_(r,e,t){return Ge(r.app)?Promise.reject(Ht(r)):s_(Me(r),Gn.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Ah(r),n})}function c_(r,e,t,n){return Me(r).onAuthStateChanged(e,t,n)}function l_(r){return Me(r).signOut()}const es="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(es,"1"),this.storage.removeItem(es),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const h_=1e3,d_=10;class Rh extends bh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=kg(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),i=this.localCache[t];n!==i&&e(t,i,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,u,c)=>{this.notifyListeners(a,c)});return}const n=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(n);!t&&this.localCache[n]===a||this.notifyListeners(n,a)},s=this.storage.getItem(n);Dg()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,d_):i()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},h_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Rh.type="LOCAL";const f_=Rh;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_ extends bh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}p_.type="SESSION";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m_(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ws{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const n=new ws(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:i,data:s}=t.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:i});const u=Array.from(a).map(async d=>d(t.origin,s)),c=await m_(u);t.ports[0].postMessage({status:"done",eventId:n,eventType:i,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ws.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g_(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class __{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((u,c)=>{const d=g_("",20);i.port1.start();const p=setTimeout(()=>{c(new Error("unsupported_event"))},n);a={messageChannel:i,onMessage(m){const w=m;if(w.data.eventId===d)switch(w.data.status){case"ack":clearTimeout(p),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),u(w.data.response);break;default:clearTimeout(p),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yc(){return window}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sh(){return typeof yc().WorkerGlobalScope<"u"&&typeof yc().importScripts=="function"}async function y_(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function I_(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function E_(){return Sh()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ph="firebaseLocalStorageDb",v_=1,ts="firebaseLocalStorage",Ch="fbase_key";class Zr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function As(r,e){return r.transaction([ts],e?"readwrite":"readonly").objectStore(ts)}function T_(){const r=indexedDB.deleteDatabase(Ph);return new Zr(r).toPromise()}function Oo(){const r=indexedDB.open(Ph,v_);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(ts,{keyPath:Ch})}catch(i){t(i)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(ts)?e(n):(n.close(),await T_(),e(await Oo()))})})}async function Ic(r,e,t){const n=As(r,!0).put({[Ch]:e,value:t});return new Zr(n).toPromise()}async function w_(r,e){const t=As(r,!1).get(e),n=await new Zr(t).toPromise();return n===void 0?null:n.value}function Ec(r,e){const t=As(r,!0).delete(e);return new Zr(t).toPromise()}const A_=800,b_=3;class Vh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Oo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>b_)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Sh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ws._getInstance(E_()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await y_(),!this.activeServiceWorker)return;this.sender=new __(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&!((e=n[0])===null||e===void 0)&&e.fulfilled&&!((t=n[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||I_()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Oo();return await Ic(e,es,"1"),await Ec(e,es),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Ic(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>w_(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Ec(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=As(i,!1).getAll();return new Zr(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)n.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!n.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),A_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Vh.type="LOCAL";const R_=Vh;new Yr(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Yr(2e3,1e4);/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Yr(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Yr(5e3,15e3);var vc="@firebase/auth",Tc="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){X(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P_(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function C_(r){Vn(new Zt("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:u}=n.options;X(a&&!a.includes(":"),"invalid-api-key",{appName:n.name});const c={apiKey:a,authDomain:u,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Th(r)},d=new Lg(n,i,s,c);return Gg(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Vn(new Zt("auth-internal",e=>{const t=Kn(e.getProvider("auth").getImmediate());return(n=>new S_(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),It(vc,Tc,P_(r)),It(vc,Tc,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V_=300;Np("authIdTokenMaxAge");function D_(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}Fg({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=i=>{const s=ca("internal-error");s.customData=i,t(s)},n.type="text/javascript",n.charset="UTF-8",D_().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});C_("Browser");var wc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Et,Dh;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,g){function y(){}y.prototype=g.prototype,I.D=g.prototype,I.prototype=new y,I.prototype.constructor=I,I.C=function(E,v,b){for(var _=Array(arguments.length-2),Ye=2;Ye<arguments.length;Ye++)_[Ye-2]=arguments[Ye];return g.prototype[v].apply(E,_)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(n,t),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(I,g,y){y||(y=0);var E=Array(16);if(typeof g=="string")for(var v=0;16>v;++v)E[v]=g.charCodeAt(y++)|g.charCodeAt(y++)<<8|g.charCodeAt(y++)<<16|g.charCodeAt(y++)<<24;else for(v=0;16>v;++v)E[v]=g[y++]|g[y++]<<8|g[y++]<<16|g[y++]<<24;g=I.g[0],y=I.g[1],v=I.g[2];var b=I.g[3],_=g+(b^y&(v^b))+E[0]+3614090360&4294967295;g=y+(_<<7&4294967295|_>>>25),_=b+(v^g&(y^v))+E[1]+3905402710&4294967295,b=g+(_<<12&4294967295|_>>>20),_=v+(y^b&(g^y))+E[2]+606105819&4294967295,v=b+(_<<17&4294967295|_>>>15),_=y+(g^v&(b^g))+E[3]+3250441966&4294967295,y=v+(_<<22&4294967295|_>>>10),_=g+(b^y&(v^b))+E[4]+4118548399&4294967295,g=y+(_<<7&4294967295|_>>>25),_=b+(v^g&(y^v))+E[5]+1200080426&4294967295,b=g+(_<<12&4294967295|_>>>20),_=v+(y^b&(g^y))+E[6]+2821735955&4294967295,v=b+(_<<17&4294967295|_>>>15),_=y+(g^v&(b^g))+E[7]+4249261313&4294967295,y=v+(_<<22&4294967295|_>>>10),_=g+(b^y&(v^b))+E[8]+1770035416&4294967295,g=y+(_<<7&4294967295|_>>>25),_=b+(v^g&(y^v))+E[9]+2336552879&4294967295,b=g+(_<<12&4294967295|_>>>20),_=v+(y^b&(g^y))+E[10]+4294925233&4294967295,v=b+(_<<17&4294967295|_>>>15),_=y+(g^v&(b^g))+E[11]+2304563134&4294967295,y=v+(_<<22&4294967295|_>>>10),_=g+(b^y&(v^b))+E[12]+1804603682&4294967295,g=y+(_<<7&4294967295|_>>>25),_=b+(v^g&(y^v))+E[13]+4254626195&4294967295,b=g+(_<<12&4294967295|_>>>20),_=v+(y^b&(g^y))+E[14]+2792965006&4294967295,v=b+(_<<17&4294967295|_>>>15),_=y+(g^v&(b^g))+E[15]+1236535329&4294967295,y=v+(_<<22&4294967295|_>>>10),_=g+(v^b&(y^v))+E[1]+4129170786&4294967295,g=y+(_<<5&4294967295|_>>>27),_=b+(y^v&(g^y))+E[6]+3225465664&4294967295,b=g+(_<<9&4294967295|_>>>23),_=v+(g^y&(b^g))+E[11]+643717713&4294967295,v=b+(_<<14&4294967295|_>>>18),_=y+(b^g&(v^b))+E[0]+3921069994&4294967295,y=v+(_<<20&4294967295|_>>>12),_=g+(v^b&(y^v))+E[5]+3593408605&4294967295,g=y+(_<<5&4294967295|_>>>27),_=b+(y^v&(g^y))+E[10]+38016083&4294967295,b=g+(_<<9&4294967295|_>>>23),_=v+(g^y&(b^g))+E[15]+3634488961&4294967295,v=b+(_<<14&4294967295|_>>>18),_=y+(b^g&(v^b))+E[4]+3889429448&4294967295,y=v+(_<<20&4294967295|_>>>12),_=g+(v^b&(y^v))+E[9]+568446438&4294967295,g=y+(_<<5&4294967295|_>>>27),_=b+(y^v&(g^y))+E[14]+3275163606&4294967295,b=g+(_<<9&4294967295|_>>>23),_=v+(g^y&(b^g))+E[3]+4107603335&4294967295,v=b+(_<<14&4294967295|_>>>18),_=y+(b^g&(v^b))+E[8]+1163531501&4294967295,y=v+(_<<20&4294967295|_>>>12),_=g+(v^b&(y^v))+E[13]+2850285829&4294967295,g=y+(_<<5&4294967295|_>>>27),_=b+(y^v&(g^y))+E[2]+4243563512&4294967295,b=g+(_<<9&4294967295|_>>>23),_=v+(g^y&(b^g))+E[7]+1735328473&4294967295,v=b+(_<<14&4294967295|_>>>18),_=y+(b^g&(v^b))+E[12]+2368359562&4294967295,y=v+(_<<20&4294967295|_>>>12),_=g+(y^v^b)+E[5]+4294588738&4294967295,g=y+(_<<4&4294967295|_>>>28),_=b+(g^y^v)+E[8]+2272392833&4294967295,b=g+(_<<11&4294967295|_>>>21),_=v+(b^g^y)+E[11]+1839030562&4294967295,v=b+(_<<16&4294967295|_>>>16),_=y+(v^b^g)+E[14]+4259657740&4294967295,y=v+(_<<23&4294967295|_>>>9),_=g+(y^v^b)+E[1]+2763975236&4294967295,g=y+(_<<4&4294967295|_>>>28),_=b+(g^y^v)+E[4]+1272893353&4294967295,b=g+(_<<11&4294967295|_>>>21),_=v+(b^g^y)+E[7]+4139469664&4294967295,v=b+(_<<16&4294967295|_>>>16),_=y+(v^b^g)+E[10]+3200236656&4294967295,y=v+(_<<23&4294967295|_>>>9),_=g+(y^v^b)+E[13]+681279174&4294967295,g=y+(_<<4&4294967295|_>>>28),_=b+(g^y^v)+E[0]+3936430074&4294967295,b=g+(_<<11&4294967295|_>>>21),_=v+(b^g^y)+E[3]+3572445317&4294967295,v=b+(_<<16&4294967295|_>>>16),_=y+(v^b^g)+E[6]+76029189&4294967295,y=v+(_<<23&4294967295|_>>>9),_=g+(y^v^b)+E[9]+3654602809&4294967295,g=y+(_<<4&4294967295|_>>>28),_=b+(g^y^v)+E[12]+3873151461&4294967295,b=g+(_<<11&4294967295|_>>>21),_=v+(b^g^y)+E[15]+530742520&4294967295,v=b+(_<<16&4294967295|_>>>16),_=y+(v^b^g)+E[2]+3299628645&4294967295,y=v+(_<<23&4294967295|_>>>9),_=g+(v^(y|~b))+E[0]+4096336452&4294967295,g=y+(_<<6&4294967295|_>>>26),_=b+(y^(g|~v))+E[7]+1126891415&4294967295,b=g+(_<<10&4294967295|_>>>22),_=v+(g^(b|~y))+E[14]+2878612391&4294967295,v=b+(_<<15&4294967295|_>>>17),_=y+(b^(v|~g))+E[5]+4237533241&4294967295,y=v+(_<<21&4294967295|_>>>11),_=g+(v^(y|~b))+E[12]+1700485571&4294967295,g=y+(_<<6&4294967295|_>>>26),_=b+(y^(g|~v))+E[3]+2399980690&4294967295,b=g+(_<<10&4294967295|_>>>22),_=v+(g^(b|~y))+E[10]+4293915773&4294967295,v=b+(_<<15&4294967295|_>>>17),_=y+(b^(v|~g))+E[1]+2240044497&4294967295,y=v+(_<<21&4294967295|_>>>11),_=g+(v^(y|~b))+E[8]+1873313359&4294967295,g=y+(_<<6&4294967295|_>>>26),_=b+(y^(g|~v))+E[15]+4264355552&4294967295,b=g+(_<<10&4294967295|_>>>22),_=v+(g^(b|~y))+E[6]+2734768916&4294967295,v=b+(_<<15&4294967295|_>>>17),_=y+(b^(v|~g))+E[13]+1309151649&4294967295,y=v+(_<<21&4294967295|_>>>11),_=g+(v^(y|~b))+E[4]+4149444226&4294967295,g=y+(_<<6&4294967295|_>>>26),_=b+(y^(g|~v))+E[11]+3174756917&4294967295,b=g+(_<<10&4294967295|_>>>22),_=v+(g^(b|~y))+E[2]+718787259&4294967295,v=b+(_<<15&4294967295|_>>>17),_=y+(b^(v|~g))+E[9]+3951481745&4294967295,I.g[0]=I.g[0]+g&4294967295,I.g[1]=I.g[1]+(v+(_<<21&4294967295|_>>>11))&4294967295,I.g[2]=I.g[2]+v&4294967295,I.g[3]=I.g[3]+b&4294967295}n.prototype.u=function(I,g){g===void 0&&(g=I.length);for(var y=g-this.blockSize,E=this.B,v=this.h,b=0;b<g;){if(v==0)for(;b<=y;)i(this,I,b),b+=this.blockSize;if(typeof I=="string"){for(;b<g;)if(E[v++]=I.charCodeAt(b++),v==this.blockSize){i(this,E),v=0;break}}else for(;b<g;)if(E[v++]=I[b++],v==this.blockSize){i(this,E),v=0;break}}this.h=v,this.o+=g},n.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var g=1;g<I.length-8;++g)I[g]=0;var y=8*this.o;for(g=I.length-8;g<I.length;++g)I[g]=y&255,y/=256;for(this.u(I),I=Array(16),g=y=0;4>g;++g)for(var E=0;32>E;E+=8)I[y++]=this.g[g]>>>E&255;return I};function s(I,g){var y=u;return Object.prototype.hasOwnProperty.call(y,I)?y[I]:y[I]=g(I)}function a(I,g){this.h=g;for(var y=[],E=!0,v=I.length-1;0<=v;v--){var b=I[v]|0;E&&b==g||(y[v]=b,E=!1)}this.g=y}var u={};function c(I){return-128<=I&&128>I?s(I,function(g){return new a([g|0],0>g?-1:0)}):new a([I|0],0>I?-1:0)}function d(I){if(isNaN(I)||!isFinite(I))return m;if(0>I)return D(d(-I));for(var g=[],y=1,E=0;I>=y;E++)g[E]=I/y|0,y*=4294967296;return new a(g,0)}function p(I,g){if(I.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(I.charAt(0)=="-")return D(p(I.substring(1),g));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(g,8)),E=m,v=0;v<I.length;v+=8){var b=Math.min(8,I.length-v),_=parseInt(I.substring(v,v+b),g);8>b?(b=d(Math.pow(g,b)),E=E.j(b).add(d(_))):(E=E.j(y),E=E.add(d(_)))}return E}var m=c(0),w=c(1),S=c(16777216);r=a.prototype,r.m=function(){if(N(this))return-D(this).m();for(var I=0,g=1,y=0;y<this.g.length;y++){var E=this.i(y);I+=(0<=E?E:4294967296+E)*g,g*=4294967296}return I},r.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(V(this))return"0";if(N(this))return"-"+D(this).toString(I);for(var g=d(Math.pow(I,6)),y=this,E="";;){var v=H(y,g).g;y=z(y,v.j(g));var b=((0<y.g.length?y.g[0]:y.h)>>>0).toString(I);if(y=v,V(y))return b+E;for(;6>b.length;)b="0"+b;E=b+E}},r.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function V(I){if(I.h!=0)return!1;for(var g=0;g<I.g.length;g++)if(I.g[g]!=0)return!1;return!0}function N(I){return I.h==-1}r.l=function(I){return I=z(this,I),N(I)?-1:V(I)?0:1};function D(I){for(var g=I.g.length,y=[],E=0;E<g;E++)y[E]=~I.g[E];return new a(y,~I.h).add(w)}r.abs=function(){return N(this)?D(this):this},r.add=function(I){for(var g=Math.max(this.g.length,I.g.length),y=[],E=0,v=0;v<=g;v++){var b=E+(this.i(v)&65535)+(I.i(v)&65535),_=(b>>>16)+(this.i(v)>>>16)+(I.i(v)>>>16);E=_>>>16,b&=65535,_&=65535,y[v]=_<<16|b}return new a(y,y[y.length-1]&-2147483648?-1:0)};function z(I,g){return I.add(D(g))}r.j=function(I){if(V(this)||V(I))return m;if(N(this))return N(I)?D(this).j(D(I)):D(D(this).j(I));if(N(I))return D(this.j(D(I)));if(0>this.l(S)&&0>I.l(S))return d(this.m()*I.m());for(var g=this.g.length+I.g.length,y=[],E=0;E<2*g;E++)y[E]=0;for(E=0;E<this.g.length;E++)for(var v=0;v<I.g.length;v++){var b=this.i(E)>>>16,_=this.i(E)&65535,Ye=I.i(v)>>>16,Xn=I.i(v)&65535;y[2*E+2*v]+=_*Xn,B(y,2*E+2*v),y[2*E+2*v+1]+=b*Xn,B(y,2*E+2*v+1),y[2*E+2*v+1]+=_*Ye,B(y,2*E+2*v+1),y[2*E+2*v+2]+=b*Ye,B(y,2*E+2*v+2)}for(E=0;E<g;E++)y[E]=y[2*E+1]<<16|y[2*E];for(E=g;E<2*g;E++)y[E]=0;return new a(y,0)};function B(I,g){for(;(I[g]&65535)!=I[g];)I[g+1]+=I[g]>>>16,I[g]&=65535,g++}function F(I,g){this.g=I,this.h=g}function H(I,g){if(V(g))throw Error("division by zero");if(V(I))return new F(m,m);if(N(I))return g=H(D(I),g),new F(D(g.g),D(g.h));if(N(g))return g=H(I,D(g)),new F(D(g.g),g.h);if(30<I.g.length){if(N(I)||N(g))throw Error("slowDivide_ only works with positive integers.");for(var y=w,E=g;0>=E.l(I);)y=Z(y),E=Z(E);var v=K(y,1),b=K(E,1);for(E=K(E,2),y=K(y,2);!V(E);){var _=b.add(E);0>=_.l(I)&&(v=v.add(y),b=_),E=K(E,1),y=K(y,1)}return g=z(I,v.j(g)),new F(v,g)}for(v=m;0<=I.l(g);){for(y=Math.max(1,Math.floor(I.m()/g.m())),E=Math.ceil(Math.log(y)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),b=d(y),_=b.j(g);N(_)||0<_.l(I);)y-=E,b=d(y),_=b.j(g);V(b)&&(b=w),v=v.add(b),I=z(I,_)}return new F(v,I)}r.A=function(I){return H(this,I).h},r.and=function(I){for(var g=Math.max(this.g.length,I.g.length),y=[],E=0;E<g;E++)y[E]=this.i(E)&I.i(E);return new a(y,this.h&I.h)},r.or=function(I){for(var g=Math.max(this.g.length,I.g.length),y=[],E=0;E<g;E++)y[E]=this.i(E)|I.i(E);return new a(y,this.h|I.h)},r.xor=function(I){for(var g=Math.max(this.g.length,I.g.length),y=[],E=0;E<g;E++)y[E]=this.i(E)^I.i(E);return new a(y,this.h^I.h)};function Z(I){for(var g=I.g.length+1,y=[],E=0;E<g;E++)y[E]=I.i(E)<<1|I.i(E-1)>>>31;return new a(y,I.h)}function K(I,g){var y=g>>5;g%=32;for(var E=I.g.length-y,v=[],b=0;b<E;b++)v[b]=0<g?I.i(b+y)>>>g|I.i(b+y+1)<<32-g:I.i(b+y);return new a(v,I.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,Dh=n,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=p,Et=a}).apply(typeof wc<"u"?wc:typeof self<"u"?self:typeof window<"u"?window:{});var Pi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var kh,Er,Nh,Mi,Mo,xh,Oh,Mh;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,l,h){return o==Array.prototype||o==Object.prototype||(o[l]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Pi=="object"&&Pi];for(var l=0;l<o.length;++l){var h=o[l];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var n=t(this);function i(o,l){if(l)e:{var h=n;o=o.split(".");for(var f=0;f<o.length-1;f++){var A=o[f];if(!(A in h))break e;h=h[A]}o=o[o.length-1],f=h[o],l=l(f),l!=f&&l!=null&&e(h,o,{configurable:!0,writable:!0,value:l})}}function s(o,l){o instanceof String&&(o+="");var h=0,f=!1,A={next:function(){if(!f&&h<o.length){var R=h++;return{value:l(R,o[R]),done:!1}}return f=!0,{done:!0,value:void 0}}};return A[Symbol.iterator]=function(){return A},A}i("Array.prototype.values",function(o){return o||function(){return s(this,function(l,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},u=this||self;function c(o){var l=typeof o;return l=l!="object"?l:o?Array.isArray(o)?"array":l:"null",l=="array"||l=="object"&&typeof o.length=="number"}function d(o){var l=typeof o;return l=="object"&&o!=null||l=="function"}function p(o,l,h){return o.call.apply(o.bind,arguments)}function m(o,l,h){if(!o)throw Error();if(2<arguments.length){var f=Array.prototype.slice.call(arguments,2);return function(){var A=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(A,f),o.apply(l,A)}}return function(){return o.apply(l,arguments)}}function w(o,l,h){return w=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?p:m,w.apply(null,arguments)}function S(o,l){var h=Array.prototype.slice.call(arguments,1);return function(){var f=h.slice();return f.push.apply(f,arguments),o.apply(this,f)}}function V(o,l){function h(){}h.prototype=l.prototype,o.aa=l.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(f,A,R){for(var k=Array(arguments.length-2),re=2;re<arguments.length;re++)k[re-2]=arguments[re];return l.prototype[A].apply(f,k)}}function N(o){const l=o.length;if(0<l){const h=Array(l);for(let f=0;f<l;f++)h[f]=o[f];return h}return[]}function D(o,l){for(let h=1;h<arguments.length;h++){const f=arguments[h];if(c(f)){const A=o.length||0,R=f.length||0;o.length=A+R;for(let k=0;k<R;k++)o[A+k]=f[k]}else o.push(f)}}class z{constructor(l,h){this.i=l,this.j=h,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function B(o){return/^[\s\xa0]*$/.test(o)}function F(){var o=u.navigator;return o&&(o=o.userAgent)?o:""}function H(o){return H[" "](o),o}H[" "]=function(){};var Z=F().indexOf("Gecko")!=-1&&!(F().toLowerCase().indexOf("webkit")!=-1&&F().indexOf("Edge")==-1)&&!(F().indexOf("Trident")!=-1||F().indexOf("MSIE")!=-1)&&F().indexOf("Edge")==-1;function K(o,l,h){for(const f in o)l.call(h,o[f],f,o)}function I(o,l){for(const h in o)l.call(void 0,o[h],h,o)}function g(o){const l={};for(const h in o)l[h]=o[h];return l}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(o,l){let h,f;for(let A=1;A<arguments.length;A++){f=arguments[A];for(h in f)o[h]=f[h];for(let R=0;R<y.length;R++)h=y[R],Object.prototype.hasOwnProperty.call(f,h)&&(o[h]=f[h])}}function v(o){var l=1;o=o.split(":");const h=[];for(;0<l&&o.length;)h.push(o.shift()),l--;return o.length&&h.push(o.join(":")),h}function b(o){u.setTimeout(()=>{throw o},0)}function _(){var o=$s;let l=null;return o.g&&(l=o.g,o.g=o.g.next,o.g||(o.h=null),l.next=null),l}class Ye{constructor(){this.h=this.g=null}add(l,h){const f=Xn.get();f.set(l,h),this.h?this.h.next=f:this.g=f,this.h=f}}var Xn=new z(()=>new $f,o=>o.reset());class $f{constructor(){this.next=this.g=this.h=null}set(l,h){this.h=l,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let Jn,Yn=!1,$s=new Ye,Za=()=>{const o=u.Promise.resolve(void 0);Jn=()=>{o.then(Kf)}};var Kf=()=>{for(var o;o=_();){try{o.h.call(o.g)}catch(h){b(h)}var l=Xn;l.j(o),100>l.h&&(l.h++,o.next=l.g,l.g=o)}Yn=!1};function ut(){this.s=this.s,this.C=this.C}ut.prototype.s=!1,ut.prototype.ma=function(){this.s||(this.s=!0,this.N())},ut.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Ie(o,l){this.type=o,this.g=this.target=l,this.defaultPrevented=!1}Ie.prototype.h=function(){this.defaultPrevented=!0};var Gf=(function(){if(!u.addEventListener||!Object.defineProperty)return!1;var o=!1,l=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};u.addEventListener("test",h,l),u.removeEventListener("test",h,l)}catch{}return o})();function Zn(o,l){if(Ie.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,f=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=l,l=o.relatedTarget){if(Z){e:{try{H(l.nodeName);var A=!0;break e}catch{}A=!1}A||(l=null)}}else h=="mouseover"?l=o.fromElement:h=="mouseout"&&(l=o.toElement);this.relatedTarget=l,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:Wf[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&Zn.aa.h.call(this)}}V(Zn,Ie);var Wf={2:"touch",3:"pen",4:"mouse"};Zn.prototype.h=function(){Zn.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var ui="closure_listenable_"+(1e6*Math.random()|0),Hf=0;function Qf(o,l,h,f,A){this.listener=o,this.proxy=null,this.src=l,this.type=h,this.capture=!!f,this.ha=A,this.key=++Hf,this.da=this.fa=!1}function ci(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function li(o){this.src=o,this.g={},this.h=0}li.prototype.add=function(o,l,h,f,A){var R=o.toString();o=this.g[R],o||(o=this.g[R]=[],this.h++);var k=Gs(o,l,f,A);return-1<k?(l=o[k],h||(l.fa=!1)):(l=new Qf(l,this.src,R,!!f,A),l.fa=h,o.push(l)),l};function Ks(o,l){var h=l.type;if(h in o.g){var f=o.g[h],A=Array.prototype.indexOf.call(f,l,void 0),R;(R=0<=A)&&Array.prototype.splice.call(f,A,1),R&&(ci(l),o.g[h].length==0&&(delete o.g[h],o.h--))}}function Gs(o,l,h,f){for(var A=0;A<o.length;++A){var R=o[A];if(!R.da&&R.listener==l&&R.capture==!!h&&R.ha==f)return A}return-1}var Ws="closure_lm_"+(1e6*Math.random()|0),Hs={};function eu(o,l,h,f,A){if(Array.isArray(l)){for(var R=0;R<l.length;R++)eu(o,l[R],h,f,A);return null}return h=ru(h),o&&o[ui]?o.K(l,h,d(f)?!!f.capture:!1,A):Xf(o,l,h,!1,f,A)}function Xf(o,l,h,f,A,R){if(!l)throw Error("Invalid event type");var k=d(A)?!!A.capture:!!A,re=Xs(o);if(re||(o[Ws]=re=new li(o)),h=re.add(l,h,f,k,R),h.proxy)return h;if(f=Jf(),h.proxy=f,f.src=o,f.listener=h,o.addEventListener)Gf||(A=k),A===void 0&&(A=!1),o.addEventListener(l.toString(),f,A);else if(o.attachEvent)o.attachEvent(nu(l.toString()),f);else if(o.addListener&&o.removeListener)o.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Jf(){function o(h){return l.call(o.src,o.listener,h)}const l=Yf;return o}function tu(o,l,h,f,A){if(Array.isArray(l))for(var R=0;R<l.length;R++)tu(o,l[R],h,f,A);else f=d(f)?!!f.capture:!!f,h=ru(h),o&&o[ui]?(o=o.i,l=String(l).toString(),l in o.g&&(R=o.g[l],h=Gs(R,h,f,A),-1<h&&(ci(R[h]),Array.prototype.splice.call(R,h,1),R.length==0&&(delete o.g[l],o.h--)))):o&&(o=Xs(o))&&(l=o.g[l.toString()],o=-1,l&&(o=Gs(l,h,f,A)),(h=-1<o?l[o]:null)&&Qs(h))}function Qs(o){if(typeof o!="number"&&o&&!o.da){var l=o.src;if(l&&l[ui])Ks(l.i,o);else{var h=o.type,f=o.proxy;l.removeEventListener?l.removeEventListener(h,f,o.capture):l.detachEvent?l.detachEvent(nu(h),f):l.addListener&&l.removeListener&&l.removeListener(f),(h=Xs(l))?(Ks(h,o),h.h==0&&(h.src=null,l[Ws]=null)):ci(o)}}}function nu(o){return o in Hs?Hs[o]:Hs[o]="on"+o}function Yf(o,l){if(o.da)o=!0;else{l=new Zn(l,this);var h=o.listener,f=o.ha||o.src;o.fa&&Qs(o),o=h.call(f,l)}return o}function Xs(o){return o=o[Ws],o instanceof li?o:null}var Js="__closure_events_fn_"+(1e9*Math.random()>>>0);function ru(o){return typeof o=="function"?o:(o[Js]||(o[Js]=function(l){return o.handleEvent(l)}),o[Js])}function Ee(){ut.call(this),this.i=new li(this),this.M=this,this.F=null}V(Ee,ut),Ee.prototype[ui]=!0,Ee.prototype.removeEventListener=function(o,l,h,f){tu(this,o,l,h,f)};function Re(o,l){var h,f=o.F;if(f)for(h=[];f;f=f.F)h.push(f);if(o=o.M,f=l.type||l,typeof l=="string")l=new Ie(l,o);else if(l instanceof Ie)l.target=l.target||o;else{var A=l;l=new Ie(f,o),E(l,A)}if(A=!0,h)for(var R=h.length-1;0<=R;R--){var k=l.g=h[R];A=hi(k,f,!0,l)&&A}if(k=l.g=o,A=hi(k,f,!0,l)&&A,A=hi(k,f,!1,l)&&A,h)for(R=0;R<h.length;R++)k=l.g=h[R],A=hi(k,f,!1,l)&&A}Ee.prototype.N=function(){if(Ee.aa.N.call(this),this.i){var o=this.i,l;for(l in o.g){for(var h=o.g[l],f=0;f<h.length;f++)ci(h[f]);delete o.g[l],o.h--}}this.F=null},Ee.prototype.K=function(o,l,h,f){return this.i.add(String(o),l,!1,h,f)},Ee.prototype.L=function(o,l,h,f){return this.i.add(String(o),l,!0,h,f)};function hi(o,l,h,f){if(l=o.i.g[String(l)],!l)return!0;l=l.concat();for(var A=!0,R=0;R<l.length;++R){var k=l[R];if(k&&!k.da&&k.capture==h){var re=k.listener,ge=k.ha||k.src;k.fa&&Ks(o.i,k),A=re.call(ge,f)!==!1&&A}}return A&&!f.defaultPrevented}function iu(o,l,h){if(typeof o=="function")h&&(o=w(o,h));else if(o&&typeof o.handleEvent=="function")o=w(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:u.setTimeout(o,l||0)}function su(o){o.g=iu(()=>{o.g=null,o.i&&(o.i=!1,su(o))},o.l);const l=o.h;o.h=null,o.m.apply(null,l)}class Zf extends ut{constructor(l,h){super(),this.m=l,this.l=h,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:su(this)}N(){super.N(),this.g&&(u.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function er(o){ut.call(this),this.h=o,this.g={}}V(er,ut);var ou=[];function au(o){K(o.g,function(l,h){this.g.hasOwnProperty(h)&&Qs(l)},o),o.g={}}er.prototype.N=function(){er.aa.N.call(this),au(this)},er.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ys=u.JSON.stringify,ep=u.JSON.parse,tp=class{stringify(o){return u.JSON.stringify(o,void 0)}parse(o){return u.JSON.parse(o,void 0)}};function Zs(){}Zs.prototype.h=null;function uu(o){return o.h||(o.h=o.i())}function cu(){}var tr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function eo(){Ie.call(this,"d")}V(eo,Ie);function to(){Ie.call(this,"c")}V(to,Ie);var Nt={},lu=null;function di(){return lu=lu||new Ee}Nt.La="serverreachability";function hu(o){Ie.call(this,Nt.La,o)}V(hu,Ie);function nr(o){const l=di();Re(l,new hu(l))}Nt.STAT_EVENT="statevent";function du(o,l){Ie.call(this,Nt.STAT_EVENT,o),this.stat=l}V(du,Ie);function Se(o){const l=di();Re(l,new du(l,o))}Nt.Ma="timingevent";function fu(o,l){Ie.call(this,Nt.Ma,o),this.size=l}V(fu,Ie);function rr(o,l){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return u.setTimeout(function(){o()},l)}function ir(){this.g=!0}ir.prototype.xa=function(){this.g=!1};function np(o,l,h,f,A,R){o.info(function(){if(o.g)if(R)for(var k="",re=R.split("&"),ge=0;ge<re.length;ge++){var J=re[ge].split("=");if(1<J.length){var ve=J[0];J=J[1];var Te=ve.split("_");k=2<=Te.length&&Te[1]=="type"?k+(ve+"="+J+"&"):k+(ve+"=redacted&")}}else k=null;else k=R;return"XMLHTTP REQ ("+f+") [attempt "+A+"]: "+l+`
`+h+`
`+k})}function rp(o,l,h,f,A,R,k){o.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+A+"]: "+l+`
`+h+`
`+R+" "+k})}function hn(o,l,h,f){o.info(function(){return"XMLHTTP TEXT ("+l+"): "+sp(o,h)+(f?" "+f:"")})}function ip(o,l){o.info(function(){return"TIMEOUT: "+l})}ir.prototype.info=function(){};function sp(o,l){if(!o.g)return l;if(!l)return null;try{var h=JSON.parse(l);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var f=h[o];if(!(2>f.length)){var A=f[1];if(Array.isArray(A)&&!(1>A.length)){var R=A[0];if(R!="noop"&&R!="stop"&&R!="close")for(var k=1;k<A.length;k++)A[k]=""}}}}return Ys(h)}catch{return l}}var fi={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},pu={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},no;function pi(){}V(pi,Zs),pi.prototype.g=function(){return new XMLHttpRequest},pi.prototype.i=function(){return{}},no=new pi;function ct(o,l,h,f){this.j=o,this.i=l,this.l=h,this.R=f||1,this.U=new er(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new mu}function mu(){this.i=null,this.g="",this.h=!1}var gu={},ro={};function io(o,l,h){o.L=1,o.v=yi(Ze(l)),o.m=h,o.P=!0,_u(o,null)}function _u(o,l){o.F=Date.now(),mi(o),o.A=Ze(o.v);var h=o.A,f=o.R;Array.isArray(f)||(f=[String(f)]),Du(h.i,"t",f),o.C=0,h=o.j.J,o.h=new mu,o.g=Qu(o.j,h?l:null,!o.m),0<o.O&&(o.M=new Zf(w(o.Y,o,o.g),o.O)),l=o.U,h=o.g,f=o.ca;var A="readystatechange";Array.isArray(A)||(A&&(ou[0]=A.toString()),A=ou);for(var R=0;R<A.length;R++){var k=eu(h,A[R],f||l.handleEvent,!1,l.h||l);if(!k)break;l.g[k.key]=k}l=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,l)):(o.u="GET",o.g.ea(o.A,o.u,null,l)),nr(),np(o.i,o.u,o.A,o.l,o.R,o.m)}ct.prototype.ca=function(o){o=o.target;const l=this.M;l&&et(o)==3?l.j():this.Y(o)},ct.prototype.Y=function(o){try{if(o==this.g)e:{const Te=et(this.g);var l=this.g.Ba();const pn=this.g.Z();if(!(3>Te)&&(Te!=3||this.g&&(this.h.h||this.g.oa()||Fu(this.g)))){this.J||Te!=4||l==7||(l==8||0>=pn?nr(3):nr(2)),so(this);var h=this.g.Z();this.X=h;t:if(yu(this)){var f=Fu(this.g);o="";var A=f.length,R=et(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){xt(this),sr(this);var k="";break t}this.h.i=new u.TextDecoder}for(l=0;l<A;l++)this.h.h=!0,o+=this.h.i.decode(f[l],{stream:!(R&&l==A-1)});f.length=0,this.h.g+=o,this.C=0,k=this.h.g}else k=this.g.oa();if(this.o=h==200,rp(this.i,this.u,this.A,this.l,this.R,Te,h),this.o){if(this.T&&!this.K){t:{if(this.g){var re,ge=this.g;if((re=ge.g?ge.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!B(re)){var J=re;break t}}J=null}if(h=J)hn(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,oo(this,h);else{this.o=!1,this.s=3,Se(12),xt(this),sr(this);break e}}if(this.P){h=!0;let qe;for(;!this.J&&this.C<k.length;)if(qe=op(this,k),qe==ro){Te==4&&(this.s=4,Se(14),h=!1),hn(this.i,this.l,null,"[Incomplete Response]");break}else if(qe==gu){this.s=4,Se(15),hn(this.i,this.l,k,"[Invalid Chunk]"),h=!1;break}else hn(this.i,this.l,qe,null),oo(this,qe);if(yu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Te!=4||k.length!=0||this.h.h||(this.s=1,Se(16),h=!1),this.o=this.o&&h,!h)hn(this.i,this.l,k,"[Invalid Chunked Response]"),xt(this),sr(this);else if(0<k.length&&!this.W){this.W=!0;var ve=this.j;ve.g==this&&ve.ba&&!ve.M&&(ve.j.info("Great, no buffering proxy detected. Bytes received: "+k.length),fo(ve),ve.M=!0,Se(11))}}else hn(this.i,this.l,k,null),oo(this,k);Te==4&&xt(this),this.o&&!this.J&&(Te==4?Ku(this.j,this):(this.o=!1,mi(this)))}else wp(this.g),h==400&&0<k.indexOf("Unknown SID")?(this.s=3,Se(12)):(this.s=0,Se(13)),xt(this),sr(this)}}}catch{}finally{}};function yu(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function op(o,l){var h=o.C,f=l.indexOf(`
`,h);return f==-1?ro:(h=Number(l.substring(h,f)),isNaN(h)?gu:(f+=1,f+h>l.length?ro:(l=l.slice(f,f+h),o.C=f+h,l)))}ct.prototype.cancel=function(){this.J=!0,xt(this)};function mi(o){o.S=Date.now()+o.I,Iu(o,o.I)}function Iu(o,l){if(o.B!=null)throw Error("WatchDog timer not null");o.B=rr(w(o.ba,o),l)}function so(o){o.B&&(u.clearTimeout(o.B),o.B=null)}ct.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(ip(this.i,this.A),this.L!=2&&(nr(),Se(17)),xt(this),this.s=2,sr(this)):Iu(this,this.S-o)};function sr(o){o.j.G==0||o.J||Ku(o.j,o)}function xt(o){so(o);var l=o.M;l&&typeof l.ma=="function"&&l.ma(),o.M=null,au(o.U),o.g&&(l=o.g,o.g=null,l.abort(),l.ma())}function oo(o,l){try{var h=o.j;if(h.G!=0&&(h.g==o||ao(h.h,o))){if(!o.K&&ao(h.h,o)&&h.G==3){try{var f=h.Da.g.parse(l)}catch{f=null}if(Array.isArray(f)&&f.length==3){var A=f;if(A[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)Ai(h),Ti(h);else break e;ho(h),Se(18)}}else h.za=A[1],0<h.za-h.T&&37500>A[2]&&h.F&&h.v==0&&!h.C&&(h.C=rr(w(h.Za,h),6e3));if(1>=Tu(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Mt(h,11)}else if((o.K||h.g==o)&&Ai(h),!B(l))for(A=h.Da.g.parse(l),l=0;l<A.length;l++){let J=A[l];if(h.T=J[0],J=J[1],h.G==2)if(J[0]=="c"){h.K=J[1],h.ia=J[2];const ve=J[3];ve!=null&&(h.la=ve,h.j.info("VER="+h.la));const Te=J[4];Te!=null&&(h.Aa=Te,h.j.info("SVER="+h.Aa));const pn=J[5];pn!=null&&typeof pn=="number"&&0<pn&&(f=1.5*pn,h.L=f,h.j.info("backChannelRequestTimeoutMs_="+f)),f=h;const qe=o.g;if(qe){const Ri=qe.g?qe.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ri){var R=f.h;R.g||Ri.indexOf("spdy")==-1&&Ri.indexOf("quic")==-1&&Ri.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(uo(R,R.h),R.h=null))}if(f.D){const po=qe.g?qe.g.getResponseHeader("X-HTTP-Session-Id"):null;po&&(f.ya=po,ie(f.I,f.D,po))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),f=h;var k=o;if(f.qa=Hu(f,f.J?f.ia:null,f.W),k.K){wu(f.h,k);var re=k,ge=f.L;ge&&(re.I=ge),re.B&&(so(re),mi(re)),f.g=k}else zu(f);0<h.i.length&&wi(h)}else J[0]!="stop"&&J[0]!="close"||Mt(h,7);else h.G==3&&(J[0]=="stop"||J[0]=="close"?J[0]=="stop"?Mt(h,7):lo(h):J[0]!="noop"&&h.l&&h.l.ta(J),h.v=0)}}nr(4)}catch{}}var ap=class{constructor(o,l){this.g=o,this.map=l}};function Eu(o){this.l=o||10,u.PerformanceNavigationTiming?(o=u.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(u.chrome&&u.chrome.loadTimes&&u.chrome.loadTimes()&&u.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function vu(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Tu(o){return o.h?1:o.g?o.g.size:0}function ao(o,l){return o.h?o.h==l:o.g?o.g.has(l):!1}function uo(o,l){o.g?o.g.add(l):o.h=l}function wu(o,l){o.h&&o.h==l?o.h=null:o.g&&o.g.has(l)&&o.g.delete(l)}Eu.prototype.cancel=function(){if(this.i=Au(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Au(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let l=o.i;for(const h of o.g.values())l=l.concat(h.D);return l}return N(o.i)}function up(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var l=[],h=o.length,f=0;f<h;f++)l.push(o[f]);return l}l=[],h=0;for(f in o)l[h++]=o[f];return l}function cp(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var l=[];o=o.length;for(var h=0;h<o;h++)l.push(h);return l}l=[],h=0;for(const f in o)l[h++]=f;return l}}}function bu(o,l){if(o.forEach&&typeof o.forEach=="function")o.forEach(l,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,l,void 0);else for(var h=cp(o),f=up(o),A=f.length,R=0;R<A;R++)l.call(void 0,f[R],h&&h[R],o)}var Ru=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function lp(o,l){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var f=o[h].indexOf("="),A=null;if(0<=f){var R=o[h].substring(0,f);A=o[h].substring(f+1)}else R=o[h];l(R,A?decodeURIComponent(A.replace(/\+/g," ")):"")}}}function Ot(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Ot){this.h=o.h,gi(this,o.j),this.o=o.o,this.g=o.g,_i(this,o.s),this.l=o.l;var l=o.i,h=new ur;h.i=l.i,l.g&&(h.g=new Map(l.g),h.h=l.h),Su(this,h),this.m=o.m}else o&&(l=String(o).match(Ru))?(this.h=!1,gi(this,l[1]||"",!0),this.o=or(l[2]||""),this.g=or(l[3]||"",!0),_i(this,l[4]),this.l=or(l[5]||"",!0),Su(this,l[6]||"",!0),this.m=or(l[7]||"")):(this.h=!1,this.i=new ur(null,this.h))}Ot.prototype.toString=function(){var o=[],l=this.j;l&&o.push(ar(l,Pu,!0),":");var h=this.g;return(h||l=="file")&&(o.push("//"),(l=this.o)&&o.push(ar(l,Pu,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(ar(h,h.charAt(0)=="/"?fp:dp,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",ar(h,mp)),o.join("")};function Ze(o){return new Ot(o)}function gi(o,l,h){o.j=h?or(l,!0):l,o.j&&(o.j=o.j.replace(/:$/,""))}function _i(o,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);o.s=l}else o.s=null}function Su(o,l,h){l instanceof ur?(o.i=l,gp(o.i,o.h)):(h||(l=ar(l,pp)),o.i=new ur(l,o.h))}function ie(o,l,h){o.i.set(l,h)}function yi(o){return ie(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function or(o,l){return o?l?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function ar(o,l,h){return typeof o=="string"?(o=encodeURI(o).replace(l,hp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function hp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Pu=/[#\/\?@]/g,dp=/[#\?:]/g,fp=/[#\?]/g,pp=/[#\?@]/g,mp=/#/g;function ur(o,l){this.h=this.g=null,this.i=o||null,this.j=!!l}function lt(o){o.g||(o.g=new Map,o.h=0,o.i&&lp(o.i,function(l,h){o.add(decodeURIComponent(l.replace(/\+/g," ")),h)}))}r=ur.prototype,r.add=function(o,l){lt(this),this.i=null,o=dn(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(l),this.h+=1,this};function Cu(o,l){lt(o),l=dn(o,l),o.g.has(l)&&(o.i=null,o.h-=o.g.get(l).length,o.g.delete(l))}function Vu(o,l){return lt(o),l=dn(o,l),o.g.has(l)}r.forEach=function(o,l){lt(this),this.g.forEach(function(h,f){h.forEach(function(A){o.call(l,A,f,this)},this)},this)},r.na=function(){lt(this);const o=Array.from(this.g.values()),l=Array.from(this.g.keys()),h=[];for(let f=0;f<l.length;f++){const A=o[f];for(let R=0;R<A.length;R++)h.push(l[f])}return h},r.V=function(o){lt(this);let l=[];if(typeof o=="string")Vu(this,o)&&(l=l.concat(this.g.get(dn(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)l=l.concat(o[h])}return l},r.set=function(o,l){return lt(this),this.i=null,o=dn(this,o),Vu(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[l]),this.h+=1,this},r.get=function(o,l){return o?(o=this.V(o),0<o.length?String(o[0]):l):l};function Du(o,l,h){Cu(o,l),0<h.length&&(o.i=null,o.g.set(dn(o,l),N(h)),o.h+=h.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],l=Array.from(this.g.keys());for(var h=0;h<l.length;h++){var f=l[h];const R=encodeURIComponent(String(f)),k=this.V(f);for(f=0;f<k.length;f++){var A=R;k[f]!==""&&(A+="="+encodeURIComponent(String(k[f]))),o.push(A)}}return this.i=o.join("&")};function dn(o,l){return l=String(l),o.j&&(l=l.toLowerCase()),l}function gp(o,l){l&&!o.j&&(lt(o),o.i=null,o.g.forEach(function(h,f){var A=f.toLowerCase();f!=A&&(Cu(this,f),Du(this,A,h))},o)),o.j=l}function _p(o,l){const h=new ir;if(u.Image){const f=new Image;f.onload=S(ht,h,"TestLoadImage: loaded",!0,l,f),f.onerror=S(ht,h,"TestLoadImage: error",!1,l,f),f.onabort=S(ht,h,"TestLoadImage: abort",!1,l,f),f.ontimeout=S(ht,h,"TestLoadImage: timeout",!1,l,f),u.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=o}else l(!1)}function yp(o,l){const h=new ir,f=new AbortController,A=setTimeout(()=>{f.abort(),ht(h,"TestPingServer: timeout",!1,l)},1e4);fetch(o,{signal:f.signal}).then(R=>{clearTimeout(A),R.ok?ht(h,"TestPingServer: ok",!0,l):ht(h,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(A),ht(h,"TestPingServer: error",!1,l)})}function ht(o,l,h,f,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),f(h)}catch{}}function Ip(){this.g=new tp}function Ep(o,l,h){const f=h||"";try{bu(o,function(A,R){let k=A;d(A)&&(k=Ys(A)),l.push(f+R+"="+encodeURIComponent(k))})}catch(A){throw l.push(f+"type="+encodeURIComponent("_badmap")),A}}function Ii(o){this.l=o.Ub||null,this.j=o.eb||!1}V(Ii,Zs),Ii.prototype.g=function(){return new Ei(this.l,this.j)},Ii.prototype.i=(function(o){return function(){return o}})({});function Ei(o,l){Ee.call(this),this.D=o,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}V(Ei,Ee),r=Ei.prototype,r.open=function(o,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=l,this.readyState=1,lr(this)},r.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(l.body=o),(this.D||u).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,cr(this)),this.readyState=0},r.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,lr(this)),this.g&&(this.readyState=3,lr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof u.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;ku(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function ku(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}r.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var l=o.value?o.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!o.done}))&&(this.response=this.responseText+=l)}o.done?cr(this):lr(this),this.readyState==3&&ku(this)}},r.Ra=function(o){this.g&&(this.response=this.responseText=o,cr(this))},r.Qa=function(o){this.g&&(this.response=o,cr(this))},r.ga=function(){this.g&&cr(this)};function cr(o){o.readyState=4,o.l=null,o.j=null,o.v=null,lr(o)}r.setRequestHeader=function(o,l){this.u.append(o,l)},r.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],l=this.h.entries();for(var h=l.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=l.next();return o.join(`\r
`)};function lr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Ei.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Nu(o){let l="";return K(o,function(h,f){l+=f,l+=":",l+=h,l+=`\r
`}),l}function co(o,l,h){e:{for(f in h){var f=!1;break e}f=!0}f||(h=Nu(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):ie(o,l,h))}function ue(o){Ee.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}V(ue,Ee);var vp=/^https?$/i,Tp=["POST","PUT"];r=ue.prototype,r.Ha=function(o){this.J=o},r.ea=function(o,l,h,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);l=l?l.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():no.g(),this.v=this.o?uu(this.o):uu(no),this.g.onreadystatechange=w(this.Ea,this);try{this.B=!0,this.g.open(l,String(o),!0),this.B=!1}catch(R){xu(this,R);return}if(o=h||"",h=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var A in f)h.set(A,f[A]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const R of f.keys())h.set(R,f.get(R));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(h.keys()).find(R=>R.toLowerCase()=="content-type"),A=u.FormData&&o instanceof u.FormData,!(0<=Array.prototype.indexOf.call(Tp,l,void 0))||f||A||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,k]of h)this.g.setRequestHeader(R,k);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Lu(this),this.u=!0,this.g.send(o),this.u=!1}catch(R){xu(this,R)}};function xu(o,l){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=l,o.m=5,Ou(o),vi(o)}function Ou(o){o.A||(o.A=!0,Re(o,"complete"),Re(o,"error"))}r.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Re(this,"complete"),Re(this,"abort"),vi(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),vi(this,!0)),ue.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?Mu(this):this.bb())},r.bb=function(){Mu(this)};function Mu(o){if(o.h&&typeof a<"u"&&(!o.v[1]||et(o)!=4||o.Z()!=2)){if(o.u&&et(o)==4)iu(o.Ea,0,o);else if(Re(o,"readystatechange"),et(o)==4){o.h=!1;try{const k=o.Z();e:switch(k){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var h;if(!(h=l)){var f;if(f=k===0){var A=String(o.D).match(Ru)[1]||null;!A&&u.self&&u.self.location&&(A=u.self.location.protocol.slice(0,-1)),f=!vp.test(A?A.toLowerCase():"")}h=f}if(h)Re(o,"complete"),Re(o,"success");else{o.m=6;try{var R=2<et(o)?o.g.statusText:""}catch{R=""}o.l=R+" ["+o.Z()+"]",Ou(o)}}finally{vi(o)}}}}function vi(o,l){if(o.g){Lu(o);const h=o.g,f=o.v[0]?()=>{}:null;o.g=null,o.v=null,l||Re(o,"ready");try{h.onreadystatechange=f}catch{}}}function Lu(o){o.I&&(u.clearTimeout(o.I),o.I=null)}r.isActive=function(){return!!this.g};function et(o){return o.g?o.g.readyState:0}r.Z=function(){try{return 2<et(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(o){if(this.g){var l=this.g.responseText;return o&&l.indexOf(o)==0&&(l=l.substring(o.length)),ep(l)}};function Fu(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function wp(o){const l={};o=(o.g&&2<=et(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<o.length;f++){if(B(o[f]))continue;var h=v(o[f]);const A=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const R=l[A]||[];l[A]=R,R.push(h)}I(l,function(f){return f.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function hr(o,l,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||l}function Uu(o){this.Aa=0,this.i=[],this.j=new ir,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=hr("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=hr("baseRetryDelayMs",5e3,o),this.cb=hr("retryDelaySeedMs",1e4,o),this.Wa=hr("forwardChannelMaxRetries",2,o),this.wa=hr("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Eu(o&&o.concurrentRequestLimit),this.Da=new Ip,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=Uu.prototype,r.la=8,r.G=1,r.connect=function(o,l,h,f){Se(0),this.W=o,this.H=l||{},h&&f!==void 0&&(this.H.OSID=h,this.H.OAID=f),this.F=this.X,this.I=Hu(this,null,this.W),wi(this)};function lo(o){if(Bu(o),o.G==3){var l=o.U++,h=Ze(o.I);if(ie(h,"SID",o.K),ie(h,"RID",l),ie(h,"TYPE","terminate"),dr(o,h),l=new ct(o,o.j,l),l.L=2,l.v=yi(Ze(h)),h=!1,u.navigator&&u.navigator.sendBeacon)try{h=u.navigator.sendBeacon(l.v.toString(),"")}catch{}!h&&u.Image&&(new Image().src=l.v,h=!0),h||(l.g=Qu(l.j,null),l.g.ea(l.v)),l.F=Date.now(),mi(l)}Wu(o)}function Ti(o){o.g&&(fo(o),o.g.cancel(),o.g=null)}function Bu(o){Ti(o),o.u&&(u.clearTimeout(o.u),o.u=null),Ai(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&u.clearTimeout(o.s),o.s=null)}function wi(o){if(!vu(o.h)&&!o.s){o.s=!0;var l=o.Ga;Jn||Za(),Yn||(Jn(),Yn=!0),$s.add(l,o),o.B=0}}function Ap(o,l){return Tu(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=l.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=rr(w(o.Ga,o,l),Gu(o,o.B)),o.B++,!0)}r.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const A=new ct(this,this.j,o);let R=this.o;if(this.S&&(R?(R=g(R),E(R,this.S)):R=this.S),this.m!==null||this.O||(A.H=R,R=null),this.P)e:{for(var l=0,h=0;h<this.i.length;h++){t:{var f=this.i[h];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(l+=f,4096<l){l=h;break e}if(l===4096||h===this.i.length-1){l=h+1;break e}}l=1e3}else l=1e3;l=qu(this,A,l),h=Ze(this.I),ie(h,"RID",o),ie(h,"CVER",22),this.D&&ie(h,"X-HTTP-Session-Id",this.D),dr(this,h),R&&(this.O?l="headers="+encodeURIComponent(String(Nu(R)))+"&"+l:this.m&&co(h,this.m,R)),uo(this.h,A),this.Ua&&ie(h,"TYPE","init"),this.P?(ie(h,"$req",l),ie(h,"SID","null"),A.T=!0,io(A,h,null)):io(A,h,l),this.G=2}}else this.G==3&&(o?ju(this,o):this.i.length==0||vu(this.h)||ju(this))};function ju(o,l){var h;l?h=l.l:h=o.U++;const f=Ze(o.I);ie(f,"SID",o.K),ie(f,"RID",h),ie(f,"AID",o.T),dr(o,f),o.m&&o.o&&co(f,o.m,o.o),h=new ct(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),l&&(o.i=l.D.concat(o.i)),l=qu(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),uo(o.h,h),io(h,f,l)}function dr(o,l){o.H&&K(o.H,function(h,f){ie(l,f,h)}),o.l&&bu({},function(h,f){ie(l,f,h)})}function qu(o,l,h){h=Math.min(o.i.length,h);var f=o.l?w(o.l.Na,o.l,o):null;e:{var A=o.i;let R=-1;for(;;){const k=["count="+h];R==-1?0<h?(R=A[0].g,k.push("ofs="+R)):R=0:k.push("ofs="+R);let re=!0;for(let ge=0;ge<h;ge++){let J=A[ge].g;const ve=A[ge].map;if(J-=R,0>J)R=Math.max(0,A[ge].g-100),re=!1;else try{Ep(ve,k,"req"+J+"_")}catch{f&&f(ve)}}if(re){f=k.join("&");break e}}}return o=o.i.splice(0,h),l.D=o,f}function zu(o){if(!o.g&&!o.u){o.Y=1;var l=o.Fa;Jn||Za(),Yn||(Jn(),Yn=!0),$s.add(l,o),o.v=0}}function ho(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=rr(w(o.Fa,o),Gu(o,o.v)),o.v++,!0)}r.Fa=function(){if(this.u=null,$u(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=rr(w(this.ab,this),o)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Se(10),Ti(this),$u(this))};function fo(o){o.A!=null&&(u.clearTimeout(o.A),o.A=null)}function $u(o){o.g=new ct(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var l=Ze(o.qa);ie(l,"RID","rpc"),ie(l,"SID",o.K),ie(l,"AID",o.T),ie(l,"CI",o.F?"0":"1"),!o.F&&o.ja&&ie(l,"TO",o.ja),ie(l,"TYPE","xmlhttp"),dr(o,l),o.m&&o.o&&co(l,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=yi(Ze(l)),h.m=null,h.P=!0,_u(h,o)}r.Za=function(){this.C!=null&&(this.C=null,Ti(this),ho(this),Se(19))};function Ai(o){o.C!=null&&(u.clearTimeout(o.C),o.C=null)}function Ku(o,l){var h=null;if(o.g==l){Ai(o),fo(o),o.g=null;var f=2}else if(ao(o.h,l))h=l.D,wu(o.h,l),f=1;else return;if(o.G!=0){if(l.o)if(f==1){h=l.m?l.m.length:0,l=Date.now()-l.F;var A=o.B;f=di(),Re(f,new fu(f,h)),wi(o)}else zu(o);else if(A=l.s,A==3||A==0&&0<l.X||!(f==1&&Ap(o,l)||f==2&&ho(o)))switch(h&&0<h.length&&(l=o.h,l.i=l.i.concat(h)),A){case 1:Mt(o,5);break;case 4:Mt(o,10);break;case 3:Mt(o,6);break;default:Mt(o,2)}}}function Gu(o,l){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*l}function Mt(o,l){if(o.j.info("Error code "+l),l==2){var h=w(o.fb,o),f=o.Xa;const A=!f;f=new Ot(f||"//www.google.com/images/cleardot.gif"),u.location&&u.location.protocol=="http"||gi(f,"https"),yi(f),A?_p(f.toString(),h):yp(f.toString(),h)}else Se(2);o.G=0,o.l&&o.l.sa(l),Wu(o),Bu(o)}r.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Se(2)):(this.j.info("Failed to ping google.com"),Se(1))};function Wu(o){if(o.G=0,o.ka=[],o.l){const l=Au(o.h);(l.length!=0||o.i.length!=0)&&(D(o.ka,l),D(o.ka,o.i),o.h.i.length=0,N(o.i),o.i.length=0),o.l.ra()}}function Hu(o,l,h){var f=h instanceof Ot?Ze(h):new Ot(h);if(f.g!="")l&&(f.g=l+"."+f.g),_i(f,f.s);else{var A=u.location;f=A.protocol,l=l?l+"."+A.hostname:A.hostname,A=+A.port;var R=new Ot(null);f&&gi(R,f),l&&(R.g=l),A&&_i(R,A),h&&(R.l=h),f=R}return h=o.D,l=o.ya,h&&l&&ie(f,h,l),ie(f,"VER",o.la),dr(o,f),f}function Qu(o,l,h){if(l&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=o.Ca&&!o.pa?new ue(new Ii({eb:h})):new ue(o.pa),l.Ha(o.J),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Xu(){}r=Xu.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function bi(){}bi.prototype.g=function(o,l){return new ke(o,l)};function ke(o,l){Ee.call(this),this.g=new Uu(l),this.l=o,this.h=l&&l.messageUrlParams||null,o=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(o?o["X-WebChannel-Content-Type"]=l.messageContentType:o={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(o?o["X-WebChannel-Client-Profile"]=l.va:o={"X-WebChannel-Client-Profile":l.va}),this.g.S=o,(o=l&&l.Sb)&&!B(o)&&(this.g.m=o),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!B(l)&&(this.g.D=l,o=this.h,o!==null&&l in o&&(o=this.h,l in o&&delete o[l])),this.j=new fn(this)}V(ke,Ee),ke.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ke.prototype.close=function(){lo(this.g)},ke.prototype.o=function(o){var l=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=Ys(o),o=h);l.i.push(new ap(l.Ya++,o)),l.G==3&&wi(l)},ke.prototype.N=function(){this.g.l=null,delete this.j,lo(this.g),delete this.g,ke.aa.N.call(this)};function Ju(o){eo.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var l=o.__sm__;if(l){e:{for(const h in l){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,l=l!==null&&o in l?l[o]:void 0),this.data=l}else this.data=o}V(Ju,eo);function Yu(){to.call(this),this.status=1}V(Yu,to);function fn(o){this.g=o}V(fn,Xu),fn.prototype.ua=function(){Re(this.g,"a")},fn.prototype.ta=function(o){Re(this.g,new Ju(o))},fn.prototype.sa=function(o){Re(this.g,new Yu)},fn.prototype.ra=function(){Re(this.g,"b")},bi.prototype.createWebChannel=bi.prototype.g,ke.prototype.send=ke.prototype.o,ke.prototype.open=ke.prototype.m,ke.prototype.close=ke.prototype.close,Mh=function(){return new bi},Oh=function(){return di()},xh=Nt,Mo={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},fi.NO_ERROR=0,fi.TIMEOUT=8,fi.HTTP_ERROR=6,Mi=fi,pu.COMPLETE="complete",Nh=pu,cu.EventType=tr,tr.OPEN="a",tr.CLOSE="b",tr.ERROR="c",tr.MESSAGE="d",Ee.prototype.listen=Ee.prototype.K,Er=cu,ue.prototype.listenOnce=ue.prototype.L,ue.prototype.getLastError=ue.prototype.Ka,ue.prototype.getLastErrorCode=ue.prototype.Ba,ue.prototype.getStatus=ue.prototype.Z,ue.prototype.getResponseJson=ue.prototype.Oa,ue.prototype.getResponseText=ue.prototype.oa,ue.prototype.send=ue.prototype.ea,ue.prototype.setWithCredentials=ue.prototype.Ha,kh=ue}).apply(typeof Pi<"u"?Pi:typeof self<"u"?self:typeof window<"u"?window:{});const Ac="@firebase/firestore",bc="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Pe.UNAUTHENTICATED=new Pe(null),Pe.GOOGLE_CREDENTIALS=new Pe("google-credentials-uid"),Pe.FIRST_PARTY=new Pe("first-party-uid"),Pe.MOCK_USER=new Pe("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wn="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en=new aa("@firebase/firestore");function vn(){return en.logLevel}function C(r,...e){if(en.logLevel<=G.DEBUG){const t=e.map(fa);en.debug(`Firestore (${Wn}): ${r}`,...t)}}function Ce(r,...e){if(en.logLevel<=G.ERROR){const t=e.map(fa);en.error(`Firestore (${Wn}): ${r}`,...t)}}function At(r,...e){if(en.logLevel<=G.WARN){const t=e.map(fa);en.warn(`Firestore (${Wn}): ${r}`,...t)}}function fa(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,Lh(r,n,t)}function Lh(r,e,t){let n=`FIRESTORE (${Wn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw Ce(n),new Error(n)}function L(r,e,t,n){let i="Unexpected state";typeof t=="string"?i=t:n=t,r||Lh(e,i,n)}function q(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class O extends ot{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k_{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class N_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Pe.UNAUTHENTICATED)))}shutdown(){}}class x_{constructor(e){this.t=e,this.currentUser=Pe.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){L(this.o===void 0,42304);let n=this.i;const i=c=>this.i!==n?(n=this.i,t(c)):Promise.resolve();let s=new vt;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new vt,e.enqueueRetryable((()=>i(this.currentUser)))};const a=()=>{const c=s;e.enqueueRetryable((async()=>{await c.promise,await i(this.currentUser)}))},u=c=>{C("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((c=>u(c))),setTimeout((()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?u(c):(C("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new vt)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.i!==e?(C("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(L(typeof n.accessToken=="string",31837,{l:n}),new k_(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return L(e===null||typeof e=="string",2055,{h:e}),new Pe(e)}}class O_{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=Pe.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class M_{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new O_(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Pe.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Rc{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class L_{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ge(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){L(this.o===void 0,3512);const n=s=>{s.error!=null&&C("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const a=s.token!==this.m;return this.m=s.token,C("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable((()=>n(s)))};const i=s=>{C("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((s=>i(s))),setTimeout((()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?i(s):C("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Rc(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(L(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Rc(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F_(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fh(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pa{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const i=F_(40);for(let s=0;s<i.length;++s)n.length<20&&i[s]<t&&(n+=e.charAt(i[s]%62))}return n}}function j(r,e){return r<e?-1:r>e?1:0}function Lo(r,e){let t=0;for(;t<r.length&&t<e.length;){const n=r.codePointAt(t),i=e.codePointAt(t);if(n!==i){if(n<128&&i<128)return j(n,i);{const s=Fh(),a=U_(s.encode(Sc(r,t)),s.encode(Sc(e,t)));return a!==0?a:j(n,i)}}t+=n>65535?2:1}return j(r.length,e.length)}function Sc(r,e){return r.codePointAt(e)>65535?r.substring(e,e+2):r.substring(e,e+1)}function U_(r,e){for(let t=0;t<r.length&&t<e.length;++t)if(r[t]!==e[t])return j(r[t],e[t]);return j(r.length,e.length)}function kn(r,e,t){return r.length===e.length&&r.every(((n,i)=>t(n,e[i])))}function Uh(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pc="__name__";class Ke{constructor(e,t,n){t===void 0?t=0:t>e.length&&M(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&M(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return Ke.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ke?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let i=0;i<n;i++){const s=Ke.compareSegments(e.get(i),t.get(i));if(s!==0)return s}return j(e.length,t.length)}static compareSegments(e,t){const n=Ke.isNumericId(e),i=Ke.isNumericId(t);return n&&!i?-1:!n&&i?1:n&&i?Ke.extractNumericId(e).compare(Ke.extractNumericId(t)):Lo(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Et.fromString(e.substring(4,e.length-2))}}class Y extends Ke{construct(e,t,n){return new Y(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new O(P.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((i=>i.length>0)))}return new Y(t)}static emptyPath(){return new Y([])}}const B_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ae extends Ke{construct(e,t,n){return new ae(e,t,n)}static isValidIdentifier(e){return B_.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ae.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Pc}static keyField(){return new ae([Pc])}static fromServerFormat(e){const t=[];let n="",i=0;const s=()=>{if(n.length===0)throw new O(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let a=!1;for(;i<e.length;){const u=e[i];if(u==="\\"){if(i+1===e.length)throw new O(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[i+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new O(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=c,i+=2}else u==="`"?(a=!a,i++):u!=="."||a?(n+=u,i++):(s(),i++)}if(s(),a)throw new O(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ae(t)}static emptyPath(){return new ae([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x{constructor(e){this.path=e}static fromPath(e){return new x(Y.fromString(e))}static fromName(e){return new x(Y.fromString(e).popFirst(5))}static empty(){return new x(Y.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Y.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Y.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new x(new Y(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bh(r,e,t){if(!t)throw new O(P.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function j_(r,e,t,n){if(e===!0&&n===!0)throw new O(P.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Cc(r){if(!x.isDocumentKey(r))throw new O(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Vc(r){if(x.isDocumentKey(r))throw new O(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function jh(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function ma(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":M(12329,{type:typeof r})}function Rr(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new O(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=ma(r);throw new O(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(r,e){const t={typeString:r};return e&&(t.value=e),t}function ei(r,e){if(!jh(r))throw new O(P.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const i=e[n].typeString,s="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const a=r[n];if(i&&typeof a!==i){t=`JSON field '${n}' must be a ${i}.`;break}if(s!==void 0&&a!==s.value){t=`Expected '${n}' field to equal '${s.value}'`;break}}if(t)throw new O(P.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dc=-62135596800,kc=1e6;class ee{static now(){return ee.fromMillis(Date.now())}static fromDate(e){return ee.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*kc);return new ee(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new O(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new O(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Dc)throw new O(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new O(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/kc}_compareTo(e){return this.seconds===e.seconds?j(this.nanoseconds,e.nanoseconds):j(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ee._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ei(e,ee._jsonSchema))return new ee(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Dc;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ee._jsonSchemaVersion="firestore/timestamp/1.0",ee._jsonSchema={type:he("string",ee._jsonSchemaVersion),seconds:he("number"),nanoseconds:he("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{static fromTimestamp(e){return new U(e)}static min(){return new U(new ee(0,0))}static max(){return new U(new ee(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ur=-1;class ns{constructor(e,t,n,i){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=i}}function Fo(r){return r.fields.find((e=>e.kind===2))}function Ut(r){return r.fields.filter((e=>e.kind!==2))}ns.UNKNOWN_ID=-1;class Li{constructor(e,t){this.fieldPath=e,this.kind=t}}class Br{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Br(0,Le.min())}}function q_(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,i=U.fromTimestamp(n===1e9?new ee(t+1,0):new ee(t,n));return new Le(i,x.empty(),e)}function qh(r){return new Le(r.readTime,r.key,Ur)}class Le{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Le(U.min(),x.empty(),Ur)}static max(){return new Le(U.max(),x.empty(),Ur)}}function ga(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=x.comparator(r.documentKey,e.documentKey),t!==0?t:j(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zh="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class $h{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function un(r){if(r.code!==P.FAILED_PRECONDITION||r.message!==zh)throw r;C("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&M(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new T(((n,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(n,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(n,i)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof T?t:T.resolve(t)}catch(t){return T.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):T.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):T.reject(t)}static resolve(e){return new T(((t,n)=>{t(e)}))}static reject(e){return new T(((t,n)=>{n(e)}))}static waitFor(e){return new T(((t,n)=>{let i=0,s=0,a=!1;e.forEach((u=>{++i,u.next((()=>{++s,a&&s===i&&t()}),(c=>n(c)))})),a=!0,s===i&&t()}))}static or(e){let t=T.resolve(!1);for(const n of e)t=t.next((i=>i?T.resolve(i):n()));return t}static forEach(e,t){const n=[];return e.forEach(((i,s)=>{n.push(t.call(this,i,s))})),this.waitFor(n)}static mapArray(e,t){return new T(((n,i)=>{const s=e.length,a=new Array(s);let u=0;for(let c=0;c<s;c++){const d=c;t(e[d]).next((p=>{a[d]=p,++u,u===s&&n(a)}),(p=>i(p)))}}))}static doWhile(e,t){return new T(((n,i)=>{const s=()=>{e()===!0?t().next((()=>{s()}),i):n()};s()}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ne="SimpleDb";class bs{static open(e,t,n,i){try{return new bs(t,e.transaction(i,n))}catch(s){throw new Sr(t,s)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new vt,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Sr(e,t.error)):this.S.resolve()},this.transaction.onerror=n=>{const i=_a(n.target.error);this.S.reject(new Sr(e,i))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(C(Ne,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}v(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new $_(t)}}class Tt{static delete(e){return C(Ne,"Removing database:",e),jt(Jl().indexedDB.deleteDatabase(e)).toPromise()}static C(){if(!th())return!1;if(Tt.F())return!0;const e=ye(),t=Tt.M(e),n=0<t&&t<10,i=Kh(e),s=0<i&&i<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||s)}static F(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)===null||e===void 0?void 0:e.O)==="YES"}static N(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.B=n,this.L=null,Tt.M(ye())===12.2&&Ce("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async k(e){return this.db||(C(Ne,"Opening database:",this.name),this.db=await new Promise(((t,n)=>{const i=indexedDB.open(this.name,this.version);i.onsuccess=s=>{const a=s.target.result;t(a)},i.onblocked=()=>{n(new Sr(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},i.onerror=s=>{const a=s.target.error;a.name==="VersionError"?n(new O(P.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):a.name==="InvalidStateError"?n(new O(P.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+a)):n(new Sr(e,a))},i.onupgradeneeded=s=>{C(Ne,'Database "'+this.name+'" requires upgrade from version:',s.oldVersion);const a=s.target.result;if(this.L!==null&&this.L!==s.oldVersion)throw new Error(`refusing to open IndexedDB database due to potential corruption of the IndexedDB database data; this corruption could be caused by clicking the "clear site data" button in a web browser; try reloading the web page to re-initialize the IndexedDB database: lastClosedDbVersion=${this.L}, event.oldVersion=${s.oldVersion}, event.newVersion=${s.newVersion}, db.version=${a.version}`);this.B.q(a,i.transaction,s.oldVersion,this.version).next((()=>{C(Ne,"Database upgrade to version "+this.version+" complete")}))}})),this.db.addEventListener("close",(t=>{const n=t.target;this.L=n.version}),{passive:!0})),this.db.addEventListener("versionchange",(t=>{var n;t.newVersion===null&&(At('Received "versionchange" event with newVersion===null; notifying the registered DatabaseDeletedListener, if any'),(n=this.databaseDeletedListener)===null||n===void 0||n.call(this))}),{passive:!0}),this.db}setDatabaseDeletedListener(e){if(this.databaseDeletedListener)throw new Error("setDatabaseDeletedListener() may only be called once, and it has already been called");this.databaseDeletedListener=e}async runTransaction(e,t,n,i){const s=t==="readonly";let a=0;for(;;){++a;try{this.db=await this.k(e);const u=bs.open(this.db,e,s?"readonly":"readwrite",n),c=i(u).next((d=>(u.v(),d))).catch((d=>(u.abort(d),T.reject(d)))).toPromise();return c.catch((()=>{})),await u.D,c}catch(u){const c=u,d=c.name!=="FirebaseError"&&a<3;if(C(Ne,"Transaction failed with error:",c.message,"Retrying:",d),this.close(),!d)return Promise.reject(c)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Kh(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class z_{constructor(e){this.$=e,this.U=!1,this.K=null}get isDone(){return this.U}get W(){return this.K}set cursor(e){this.$=e}done(){this.U=!0}G(e){this.K=e}delete(){return jt(this.$.delete())}}class Sr extends O{constructor(e,t){super(P.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Dt(r){return r.name==="IndexedDbTransactionError"}class $_{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(C(Ne,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(C(Ne,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),jt(n)}add(e){return C(Ne,"ADD",this.store.name,e,e),jt(this.store.add(e))}get(e){return jt(this.store.get(e)).next((t=>(t===void 0&&(t=null),C(Ne,"GET",this.store.name,e,t),t)))}delete(e){return C(Ne,"DELETE",this.store.name,e),jt(this.store.delete(e))}count(){return C(Ne,"COUNT",this.store.name),jt(this.store.count())}j(e,t){const n=this.options(e,t),i=n.index?this.store.index(n.index):this.store;if(typeof i.getAll=="function"){const s=i.getAll(n.range);return new T(((a,u)=>{s.onerror=c=>{u(c.target.error)},s.onsuccess=c=>{a(c.target.result)}}))}{const s=this.cursor(n),a=[];return this.J(s,((u,c)=>{a.push(c)})).next((()=>a))}}H(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new T(((i,s)=>{n.onerror=a=>{s(a.target.error)},n.onsuccess=a=>{i(a.target.result)}}))}Y(e,t){C(Ne,"DELETE ALL",this.store.name);const n=this.options(e,t);n.Z=!1;const i=this.cursor(n);return this.J(i,((s,a,u)=>u.delete()))}X(e,t){let n;t?n=e:(n={},t=e);const i=this.cursor(n);return this.J(i,t)}ee(e){const t=this.cursor({});return new T(((n,i)=>{t.onerror=s=>{const a=_a(s.target.error);i(a)},t.onsuccess=s=>{const a=s.target.result;a?e(a.primaryKey,a.value).next((u=>{u?a.continue():n()})):n()}}))}J(e,t){const n=[];return new T(((i,s)=>{e.onerror=a=>{s(a.target.error)},e.onsuccess=a=>{const u=a.target.result;if(!u)return void i();const c=new z_(u),d=t(u.primaryKey,u.value,c);if(d instanceof T){const p=d.catch((m=>(c.done(),T.reject(m))));n.push(p)}c.isDone?i():c.W===null?u.continue():u.continue(c.W)}})).next((()=>T.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.Z?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function jt(r){return new T(((e,t)=>{r.onsuccess=n=>{const i=n.target.result;e(i)},r.onerror=n=>{const i=_a(n.target.error);t(i)}}))}let Nc=!1;function _a(r){const e=Tt.M(ye());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new O("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Nc||(Nc=!0,setTimeout((()=>{throw n}),0)),n}}return r}const Pr="IndexBackfiller";class K_{constructor(e,t){this.asyncQueue=e,this.te=t,this.task=null}start(){this.ne(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}ne(e){C(Pr,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const t=await this.te.re();C(Pr,`Documents written: ${t}`)}catch(t){Dt(t)?C(Pr,"Ignoring IndexedDB error during index backfill: ",t):await un(t)}await this.ne(6e4)}))}}class G_{constructor(e,t){this.localStore=e,this.persistence=t}async re(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.ie(t,e)))}ie(e,t){const n=new Set;let i=t,s=!0;return T.doWhile((()=>s===!0&&i>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((a=>{if(a!==null&&!n.has(a))return C(Pr,`Processing collection: ${a}`),this.se(e,a,i).next((u=>{i-=u,n.add(a)}));s=!1})))).next((()=>t-i))}se(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((i=>this.localStore.localDocuments.getNextDocuments(e,t,i,n).next((s=>{const a=s.changes;return this.localStore.indexManager.updateIndexEntries(e,a).next((()=>this.oe(i,s))).next((u=>(C(Pr,`Updating offset: ${u}`),this.localStore.indexManager.updateCollectionGroup(e,t,u)))).next((()=>a.size))}))))}oe(e,t){let n=e;return t.changes.forEach(((i,s)=>{const a=qh(s);ga(a,n)>0&&(n=a)})),new Le(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this._e(n),this.ae=n=>t.writeSequenceNumber(n))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Ue.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qt=-1;function Rs(r){return r==null}function jr(r){return r===0&&1/r==-1/0}function W_(r){return typeof r=="number"&&Number.isInteger(r)&&!jr(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rs="";function be(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=xc(e)),e=H_(r.get(t),e);return xc(e)}function H_(r,e){let t=e;const n=r.length;for(let i=0;i<n;i++){const s=r.charAt(i);switch(s){case"\0":t+="";break;case rs:t+="";break;default:t+=s}}return t}function xc(r){return r+rs+""}function We(r){const e=r.length;if(L(e>=2,64408,{path:r}),e===2)return L(r.charAt(0)===rs&&r.charAt(1)==="",56145,{path:r}),Y.emptyPath();const t=e-2,n=[];let i="";for(let s=0;s<e;){const a=r.indexOf(rs,s);switch((a<0||a>t)&&M(50515,{path:r}),r.charAt(a+1)){case"":const u=r.substring(s,a);let c;i.length===0?c=u:(i+=u,c=i,i=""),n.push(c);break;case"":i+=r.substring(s,a),i+="\0";break;case"":i+=r.substring(s,a+1);break;default:M(61167,{path:r})}s=a+2}return new Y(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bt="remoteDocuments",ti="owner",mn="owner",qr="mutationQueues",Q_="userId",ze="mutations",Oc="batchId",Gt="userMutationsIndex",Mc=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fi(r,e){return[r,be(e)]}function Gh(r,e,t){return[r,be(e),t]}const X_={},Nn="documentMutations",is="remoteDocumentsV14",J_=["prefixPath","collectionGroup","readTime","documentId"],Ui="documentKeyIndex",Y_=["prefixPath","collectionGroup","documentId"],Wh="collectionGroupIndex",Z_=["collectionGroup","readTime","prefixPath","documentId"],zr="remoteDocumentGlobal",Uo="remoteDocumentGlobalKey",xn="targets",Hh="queryTargetsIndex",ey=["canonicalId","targetId"],On="targetDocuments",ty=["targetId","path"],ya="documentTargetsIndex",ny=["path","targetId"],ss="targetGlobalKey",Xt="targetGlobal",$r="collectionParents",ry=["collectionId","parent"],Mn="clientMetadata",iy="clientId",Ss="bundles",sy="bundleId",Ps="namedQueries",oy="name",Ia="indexConfiguration",ay="indexId",Bo="collectionGroupIndex",uy="collectionGroup",Cr="indexState",cy=["indexId","uid"],Qh="sequenceNumberIndex",ly=["uid","sequenceNumber"],Vr="indexEntries",hy=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Xh="documentKeyIndex",dy=["indexId","uid","orderedDocumentKey"],Cs="documentOverlays",fy=["userId","collectionPath","documentId"],jo="collectionPathOverlayIndex",py=["userId","collectionPath","largestBatchId"],Jh="collectionGroupOverlayIndex",my=["userId","collectionGroup","largestBatchId"],Ea="globals",gy="name",Yh=[qr,ze,Nn,Bt,xn,ti,Xt,On,Mn,zr,$r,Ss,Ps],_y=[...Yh,Cs],Zh=[qr,ze,Nn,is,xn,ti,Xt,On,Mn,zr,$r,Ss,Ps,Cs],ed=Zh,va=[...ed,Ia,Cr,Vr],yy=va,td=[...va,Ea],Iy=td;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qo extends $h{constructor(e,t){super(),this.ce=e,this.currentSequenceNumber=t}}function pe(r,e){const t=q(r);return Tt.N(t.ce,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lc(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function cn(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function nd(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(e,t){this.comparator=e,this.root=t||_e.EMPTY}insert(e,t){return new oe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,_e.BLACK,null,null))}remove(e){return new oe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,_e.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const i=this.comparator(e,n.key);if(i===0)return t+n.left.size;i<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ci(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ci(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ci(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ci(this.root,e,this.comparator,!0)}}class Ci{constructor(e,t,n,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?n(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class _e{constructor(e,t,n,i,s){this.key=e,this.value=t,this.color=n??_e.RED,this.left=i??_e.EMPTY,this.right=s??_e.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,i,s){return new _e(e??this.key,t??this.value,n??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let i=this;const s=n(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,n),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,n)),i.fixUp()}removeMin(){if(this.left.isEmpty())return _e.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return _e.EMPTY;n=i.right.min(),i=i.copy(n.key,n.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,_e.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,_e.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw M(43730,{key:this.key,value:this.value});if(this.right.isRed())throw M(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw M(27949);return e+(this.isRed()?0:1)}}_e.EMPTY=null,_e.RED=!0,_e.BLACK=!1;_e.EMPTY=new class{constructor(){this.size=0}get key(){throw M(57766)}get value(){throw M(16141)}get color(){throw M(16727)}get left(){throw M(29726)}get right(){throw M(36894)}copy(e,t,n,i,s){return this}insert(e,t,n){return new _e(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(e){this.comparator=e,this.data=new oe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const i=n.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Fc(this.data.getIterator())}getIteratorFrom(e){return new Fc(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof te)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new te(this.comparator);return t.data=e,t}}class Fc{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function gn(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e){this.fields=e,e.sort(ae.comparator)}static empty(){return new Be([])}unionWith(e){let t=new te(ae.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Be(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return kn(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rd extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new rd("Invalid base64 string: "+s):s}})(e);return new de(t)}static fromUint8Array(e){const t=(function(i){let s="";for(let a=0;a<i.length;++a)s+=String.fromCharCode(i[a]);return s})(e);return new de(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let i=0;i<t.length;i++)n[i]=t.charCodeAt(i);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return j(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}de.EMPTY_BYTE_STRING=new de("");const Ey=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function it(r){if(L(!!r,39018),typeof r=="string"){let e=0;const t=Ey.exec(r);if(L(!!t,46558,{timestamp:r}),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:se(r.seconds),nanos:se(r.nanos)}}function se(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function st(r){return typeof r=="string"?de.fromBase64String(r):de.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const id="server_timestamp",sd="__type__",od="__previous_value__",ad="__local_write_time__";function Ta(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[sd])===null||t===void 0?void 0:t.stringValue)===id}function Vs(r){const e=r.mapValue.fields[od];return Ta(e)?Vs(e):e}function Kr(r){const e=it(r.mapValue.fields[ad].timestampValue);return new ee(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vy{constructor(e,t,n,i,s,a,u,c,d,p){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=i,this.ssl=s,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=c,this.useFetchStreams=d,this.isUsingEmulator=p}}const os="(default)";class tn{constructor(e,t){this.projectId=e,this.database=t||os}static empty(){return new tn("","")}get isDefaultDatabase(){return this.database===os}isEqual(e){return e instanceof tn&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wa="__type__",ud="__max__",_t={mapValue:{fields:{__type__:{stringValue:ud}}}},Aa="__vector__",Ln="value",Bi={nullValue:"NULL_VALUE"};function bt(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Ta(r)?4:cd(r)?9007199254740991:Ds(r)?10:11:M(28295,{value:r})}function Je(r,e){if(r===e)return!0;const t=bt(r);if(t!==bt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Kr(r).isEqual(Kr(e));case 3:return(function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const a=it(i.timestampValue),u=it(s.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(i,s){return st(i.bytesValue).isEqual(st(s.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(i,s){return se(i.geoPointValue.latitude)===se(s.geoPointValue.latitude)&&se(i.geoPointValue.longitude)===se(s.geoPointValue.longitude)})(r,e);case 2:return(function(i,s){if("integerValue"in i&&"integerValue"in s)return se(i.integerValue)===se(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const a=se(i.doubleValue),u=se(s.doubleValue);return a===u?jr(a)===jr(u):isNaN(a)&&isNaN(u)}return!1})(r,e);case 9:return kn(r.arrayValue.values||[],e.arrayValue.values||[],Je);case 10:case 11:return(function(i,s){const a=i.mapValue.fields||{},u=s.mapValue.fields||{};if(Lc(a)!==Lc(u))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(u[c]===void 0||!Je(a[c],u[c])))return!1;return!0})(r,e);default:return M(52216,{left:r})}}function Gr(r,e){return(r.values||[]).find((t=>Je(t,e)))!==void 0}function Rt(r,e){if(r===e)return 0;const t=bt(r),n=bt(e);if(t!==n)return j(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return j(r.booleanValue,e.booleanValue);case 2:return(function(s,a){const u=se(s.integerValue||s.doubleValue),c=se(a.integerValue||a.doubleValue);return u<c?-1:u>c?1:u===c?0:isNaN(u)?isNaN(c)?0:-1:1})(r,e);case 3:return Uc(r.timestampValue,e.timestampValue);case 4:return Uc(Kr(r),Kr(e));case 5:return Lo(r.stringValue,e.stringValue);case 6:return(function(s,a){const u=st(s),c=st(a);return u.compareTo(c)})(r.bytesValue,e.bytesValue);case 7:return(function(s,a){const u=s.split("/"),c=a.split("/");for(let d=0;d<u.length&&d<c.length;d++){const p=j(u[d],c[d]);if(p!==0)return p}return j(u.length,c.length)})(r.referenceValue,e.referenceValue);case 8:return(function(s,a){const u=j(se(s.latitude),se(a.latitude));return u!==0?u:j(se(s.longitude),se(a.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return Bc(r.arrayValue,e.arrayValue);case 10:return(function(s,a){var u,c,d,p;const m=s.fields||{},w=a.fields||{},S=(u=m[Ln])===null||u===void 0?void 0:u.arrayValue,V=(c=w[Ln])===null||c===void 0?void 0:c.arrayValue,N=j(((d=S==null?void 0:S.values)===null||d===void 0?void 0:d.length)||0,((p=V==null?void 0:V.values)===null||p===void 0?void 0:p.length)||0);return N!==0?N:Bc(S,V)})(r.mapValue,e.mapValue);case 11:return(function(s,a){if(s===_t.mapValue&&a===_t.mapValue)return 0;if(s===_t.mapValue)return 1;if(a===_t.mapValue)return-1;const u=s.fields||{},c=Object.keys(u),d=a.fields||{},p=Object.keys(d);c.sort(),p.sort();for(let m=0;m<c.length&&m<p.length;++m){const w=Lo(c[m],p[m]);if(w!==0)return w;const S=Rt(u[c[m]],d[p[m]]);if(S!==0)return S}return j(c.length,p.length)})(r.mapValue,e.mapValue);default:throw M(23264,{le:t})}}function Uc(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return j(r,e);const t=it(r),n=it(e),i=j(t.seconds,n.seconds);return i!==0?i:j(t.nanos,n.nanos)}function Bc(r,e){const t=r.values||[],n=e.values||[];for(let i=0;i<t.length&&i<n.length;++i){const s=Rt(t[i],n[i]);if(s)return s}return j(t.length,n.length)}function Fn(r){return zo(r)}function zo(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=it(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return st(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return x.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",i=!0;for(const s of t.values||[])i?i=!1:n+=",",n+=zo(s);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const a of n)s?s=!1:i+=",",i+=`${a}:${zo(t.fields[a])}`;return i+"}"})(r.mapValue):M(61005,{value:r})}function ji(r){switch(bt(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Vs(r);return e?16+ji(e):16;case 5:return 2*r.stringValue.length;case 6:return st(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((i,s)=>i+ji(s)),0)})(r.arrayValue);case 10:case 11:return(function(n){let i=0;return cn(n.fields,((s,a)=>{i+=s.length+ji(a)})),i})(r.mapValue);default:throw M(13486,{value:r})}}function ba(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function $o(r){return!!r&&"integerValue"in r}function Wr(r){return!!r&&"arrayValue"in r}function jc(r){return!!r&&"nullValue"in r}function qc(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function qi(r){return!!r&&"mapValue"in r}function Ds(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[wa])===null||t===void 0?void 0:t.stringValue)===Aa}function Dr(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return cn(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=Dr(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Dr(r.arrayValue.values[t]);return e}return Object.assign({},r)}function cd(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===ud}const ld={mapValue:{fields:{[wa]:{stringValue:Aa},[Ln]:{arrayValue:{}}}}};function Ty(r){return"nullValue"in r?Bi:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?ba(tn.empty(),x.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?Ds(r)?ld:{mapValue:{}}:M(35942,{value:r})}function wy(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?ba(tn.empty(),x.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?ld:"mapValue"in r?Ds(r)?{mapValue:{}}:_t:M(61959,{value:r})}function zc(r,e){const t=Rt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function $c(r,e){const t=Rt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e){this.value=e}static empty(){return new De({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!qi(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Dr(t)}setAll(e){let t=ae.emptyPath(),n={},i=[];e.forEach(((a,u)=>{if(!t.isImmediateParentOf(u)){const c=this.getFieldsMap(t);this.applyChanges(c,n,i),n={},i=[],t=u.popLast()}a?n[u.lastSegment()]=Dr(a):i.push(u.lastSegment())}));const s=this.getFieldsMap(t);this.applyChanges(s,n,i)}delete(e){const t=this.field(e.popLast());qi(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Je(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let i=t.mapValue.fields[e.get(n)];qi(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,n){cn(t,((i,s)=>e[i]=s));for(const i of n)delete e[i]}clone(){return new De(Dr(this.value))}}function hd(r){const e=[];return cn(r.fields,((t,n)=>{const i=new ae([t]);if(qi(n)){const s=hd(n.mapValue).fields;if(s.length===0)e.push(i);else for(const a of s)e.push(i.child(a))}else e.push(i)})),new Be(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e,t,n,i,s,a,u){this.key=e,this.documentType=t,this.version=n,this.readTime=i,this.createTime=s,this.data=a,this.documentState=u}static newInvalidDocument(e){return new ce(e,0,U.min(),U.min(),U.min(),De.empty(),0)}static newFoundDocument(e,t,n,i){return new ce(e,1,t,U.min(),n,i,0)}static newNoDocument(e,t){return new ce(e,2,t,U.min(),U.min(),De.empty(),0)}static newUnknownDocument(e,t){return new ce(e,3,t,U.min(),U.min(),De.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(U.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=De.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=De.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=U.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ce&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ce(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Un{constructor(e,t){this.position=e,this.inclusive=t}}function Kc(r,e,t){let n=0;for(let i=0;i<r.position.length;i++){const s=e[i],a=r.position[i];if(s.field.isKeyField()?n=x.comparator(x.fromName(a.referenceValue),t.key):n=Rt(a,t.data.field(s.field)),s.dir==="desc"&&(n*=-1),n!==0)break}return n}function Gc(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!Je(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class as{constructor(e,t="asc"){this.field=e,this.dir=t}}function Ay(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dd{}class W extends dd{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new by(e,t,n):t==="array-contains"?new Py(e,n):t==="in"?new yd(e,n):t==="not-in"?new Cy(e,n):t==="array-contains-any"?new Vy(e,n):new W(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new Ry(e,n):new Sy(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Rt(t,this.value)):t!==null&&bt(this.value)===bt(t)&&this.matchesComparison(Rt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return M(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ne extends dd{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new ne(e,t)}matches(e){return Bn(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function Bn(r){return r.op==="and"}function Ko(r){return r.op==="or"}function Ra(r){return fd(r)&&Bn(r)}function fd(r){for(const e of r.filters)if(e instanceof ne)return!1;return!0}function Go(r){if(r instanceof W)return r.field.canonicalString()+r.op.toString()+Fn(r.value);if(Ra(r))return r.filters.map((e=>Go(e))).join(",");{const e=r.filters.map((t=>Go(t))).join(",");return`${r.op}(${e})`}}function pd(r,e){return r instanceof W?(function(n,i){return i instanceof W&&n.op===i.op&&n.field.isEqual(i.field)&&Je(n.value,i.value)})(r,e):r instanceof ne?(function(n,i){return i instanceof ne&&n.op===i.op&&n.filters.length===i.filters.length?n.filters.reduce(((s,a,u)=>s&&pd(a,i.filters[u])),!0):!1})(r,e):void M(19439)}function md(r,e){const t=r.filters.concat(e);return ne.create(t,r.op)}function gd(r){return r instanceof W?(function(t){return`${t.field.canonicalString()} ${t.op} ${Fn(t.value)}`})(r):r instanceof ne?(function(t){return t.op.toString()+" {"+t.getFilters().map(gd).join(" ,")+"}"})(r):"Filter"}class by extends W{constructor(e,t,n){super(e,t,n),this.key=x.fromName(n.referenceValue)}matches(e){const t=x.comparator(e.key,this.key);return this.matchesComparison(t)}}class Ry extends W{constructor(e,t){super(e,"in",t),this.keys=_d("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class Sy extends W{constructor(e,t){super(e,"not-in",t),this.keys=_d("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function _d(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((n=>x.fromName(n.referenceValue)))}class Py extends W{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Wr(t)&&Gr(t.arrayValue,this.value)}}class yd extends W{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Gr(this.value.arrayValue,t)}}class Cy extends W{constructor(e,t){super(e,"not-in",t)}matches(e){if(Gr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Gr(this.value.arrayValue,t)}}class Vy extends W{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Wr(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>Gr(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dy{constructor(e,t=null,n=[],i=[],s=null,a=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=i,this.limit=s,this.startAt=a,this.endAt=u,this.Pe=null}}function Wo(r,e=null,t=[],n=[],i=null,s=null,a=null){return new Dy(r,e,t,n,i,s,a)}function nn(r){const e=q(r);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>Go(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(s){return s.field.canonicalString()+s.dir})(n))).join(","),Rs(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>Fn(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>Fn(n))).join(",")),e.Pe=t}return e.Pe}function ni(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!Ay(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!pd(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!Gc(r.startAt,e.startAt)&&Gc(r.endAt,e.endAt)}function us(r){return x.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function cs(r,e){return r.filters.filter((t=>t instanceof W&&t.field.isEqual(e)))}function Wc(r,e,t){let n=Bi,i=!0;for(const s of cs(r,e)){let a=Bi,u=!0;switch(s.op){case"<":case"<=":a=Ty(s.value);break;case"==":case"in":case">=":a=s.value;break;case">":a=s.value,u=!1;break;case"!=":case"not-in":a=Bi}zc({value:n,inclusive:i},{value:a,inclusive:u})<0&&(n=a,i=u)}if(t!==null){for(let s=0;s<r.orderBy.length;++s)if(r.orderBy[s].field.isEqual(e)){const a=t.position[s];zc({value:n,inclusive:i},{value:a,inclusive:t.inclusive})<0&&(n=a,i=t.inclusive);break}}return{value:n,inclusive:i}}function Hc(r,e,t){let n=_t,i=!0;for(const s of cs(r,e)){let a=_t,u=!0;switch(s.op){case">=":case">":a=wy(s.value),u=!1;break;case"==":case"in":case"<=":a=s.value;break;case"<":a=s.value,u=!1;break;case"!=":case"not-in":a=_t}$c({value:n,inclusive:i},{value:a,inclusive:u})>0&&(n=a,i=u)}if(t!==null){for(let s=0;s<r.orderBy.length;++s)if(r.orderBy[s].field.isEqual(e)){const a=t.position[s];$c({value:n,inclusive:i},{value:a,inclusive:t.inclusive})>0&&(n=a,i=t.inclusive);break}}return{value:n,inclusive:i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ks{constructor(e,t=null,n=[],i=[],s=null,a="F",u=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=i,this.limit=s,this.limitType=a,this.startAt=u,this.endAt=c,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function ky(r,e,t,n,i,s,a,u){return new ks(r,e,t,n,i,s,a,u)}function Ns(r){return new ks(r)}function Qc(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function Ny(r){return r.collectionGroup!==null}function kr(r){const e=q(r);if(e.Te===null){e.Te=[];const t=new Set;for(const s of e.explicitOrderBy)e.Te.push(s),t.add(s.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new te(ae.comparator);return a.filters.forEach((c=>{c.getFlattenedFilters().forEach((d=>{d.isInequality()&&(u=u.add(d.field))}))})),u})(e).forEach((s=>{t.has(s.canonicalString())||s.isKeyField()||e.Te.push(new as(s,n))})),t.has(ae.keyField().canonicalString())||e.Te.push(new as(ae.keyField(),n))}return e.Te}function je(r){const e=q(r);return e.Ie||(e.Ie=xy(e,kr(r))),e.Ie}function xy(r,e){if(r.limitType==="F")return Wo(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((i=>{const s=i.dir==="desc"?"asc":"desc";return new as(i.field,s)}));const t=r.endAt?new Un(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Un(r.startAt.position,r.startAt.inclusive):null;return Wo(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function Ho(r,e,t){return new ks(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function xs(r,e){return ni(je(r),je(e))&&r.limitType===e.limitType}function Id(r){return`${nn(je(r))}|lt:${r.limitType}`}function Tn(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((i=>gd(i))).join(", ")}]`),Rs(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((i=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(i))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((i=>Fn(i))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((i=>Fn(i))).join(",")),`Target(${n})`})(je(r))}; limitType=${r.limitType})`}function ri(r,e){return e.isFoundDocument()&&(function(n,i){const s=i.key.path;return n.collectionGroup!==null?i.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(s):x.isDocumentKey(n.path)?n.path.isEqual(s):n.path.isImmediateParentOf(s)})(r,e)&&(function(n,i){for(const s of kr(n))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0})(r,e)&&(function(n,i){for(const s of n.filters)if(!s.matches(i))return!1;return!0})(r,e)&&(function(n,i){return!(n.startAt&&!(function(a,u,c){const d=Kc(a,u,c);return a.inclusive?d<=0:d<0})(n.startAt,kr(n),i)||n.endAt&&!(function(a,u,c){const d=Kc(a,u,c);return a.inclusive?d>=0:d>0})(n.endAt,kr(n),i))})(r,e)}function Oy(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Ed(r){return(e,t)=>{let n=!1;for(const i of kr(r)){const s=My(i,e,t);if(s!==0)return s;n=n||i.field.isKeyField()}return 0}}function My(r,e,t){const n=r.field.isKeyField()?x.comparator(e.key,t.key):(function(s,a,u){const c=a.data.field(s),d=u.data.field(s);return c!==null&&d!==null?Rt(c,d):M(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return M(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[i,s]of n)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),i=this.inner[n];if(i===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let i=0;i<n.length;i++)if(this.equalsFn(n[i][0],e))return n.length===1?delete this.inner[t]:n.splice(i,1),this.innerSize--,!0;return!1}forEach(e){cn(this.inner,((t,n)=>{for(const[i,s]of n)e(i,s)}))}isEmpty(){return nd(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ly=new oe(x.comparator);function xe(){return Ly}const vd=new oe(x.comparator);function vr(...r){let e=vd;for(const t of r)e=e.insert(t.key,t);return e}function Td(r){let e=vd;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function He(){return Nr()}function wd(){return Nr()}function Nr(){return new at((r=>r.toString()),((r,e)=>r.isEqual(e)))}const Fy=new oe(x.comparator),Uy=new te(x.comparator);function $(...r){let e=Uy;for(const t of r)e=e.add(t);return e}const By=new te(j);function jy(){return By}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sa(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:jr(e)?"-0":e}}function Ad(r){return{integerValue:""+r}}function qy(r,e){return W_(e)?Ad(e):Sa(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(){this._=void 0}}function zy(r,e,t){return r instanceof Hr?(function(i,s){const a={fields:{[sd]:{stringValue:id},[ad]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Ta(s)&&(s=Vs(s)),s&&(a.fields[od]=s),{mapValue:a}})(t,e):r instanceof jn?Rd(r,e):r instanceof qn?Sd(r,e):(function(i,s){const a=bd(i,s),u=Xc(a)+Xc(i.Ee);return $o(a)&&$o(i.Ee)?Ad(u):Sa(i.serializer,u)})(r,e)}function $y(r,e,t){return r instanceof jn?Rd(r,e):r instanceof qn?Sd(r,e):t}function bd(r,e){return r instanceof Qr?(function(n){return $o(n)||(function(s){return!!s&&"doubleValue"in s})(n)})(e)?e:{integerValue:0}:null}class Hr extends Os{}class jn extends Os{constructor(e){super(),this.elements=e}}function Rd(r,e){const t=Pd(e);for(const n of r.elements)t.some((i=>Je(i,n)))||t.push(n);return{arrayValue:{values:t}}}class qn extends Os{constructor(e){super(),this.elements=e}}function Sd(r,e){let t=Pd(e);for(const n of r.elements)t=t.filter((i=>!Je(i,n)));return{arrayValue:{values:t}}}class Qr extends Os{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function Xc(r){return se(r.integerValue||r.doubleValue)}function Pd(r){return Wr(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{constructor(e,t){this.field=e,this.transform=t}}function Gy(r,e){return r.field.isEqual(e.field)&&(function(n,i){return n instanceof jn&&i instanceof jn||n instanceof qn&&i instanceof qn?kn(n.elements,i.elements,Je):n instanceof Qr&&i instanceof Qr?Je(n.Ee,i.Ee):n instanceof Hr&&i instanceof Hr})(r.transform,e.transform)}class Wy{constructor(e,t){this.version=e,this.transformResults=t}}class Oe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Oe}static exists(e){return new Oe(void 0,e)}static updateTime(e){return new Oe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function zi(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Ms{}function Cd(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new Pa(r.key,Oe.none()):new Hn(r.key,r.data,Oe.none());{const t=r.data,n=De.empty();let i=new te(ae.comparator);for(let s of e.fields)if(!i.has(s)){let a=t.field(s);a===null&&s.length>1&&(s=s.popLast(),a=t.field(s)),a===null?n.delete(s):n.set(s,a),i=i.add(s)}return new kt(r.key,n,new Be(i.toArray()),Oe.none())}}function Hy(r,e,t){r instanceof Hn?(function(i,s,a){const u=i.value.clone(),c=Yc(i.fieldTransforms,s,a.transformResults);u.setAll(c),s.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(r,e,t):r instanceof kt?(function(i,s,a){if(!zi(i.precondition,s))return void s.convertToUnknownDocument(a.version);const u=Yc(i.fieldTransforms,s,a.transformResults),c=s.data;c.setAll(Vd(i)),c.setAll(u),s.convertToFoundDocument(a.version,c).setHasCommittedMutations()})(r,e,t):(function(i,s,a){s.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function xr(r,e,t,n){return r instanceof Hn?(function(s,a,u,c){if(!zi(s.precondition,a))return u;const d=s.value.clone(),p=Zc(s.fieldTransforms,c,a);return d.setAll(p),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null})(r,e,t,n):r instanceof kt?(function(s,a,u,c){if(!zi(s.precondition,a))return u;const d=Zc(s.fieldTransforms,c,a),p=a.data;return p.setAll(Vd(s)),p.setAll(d),a.convertToFoundDocument(a.version,p).setHasLocalMutations(),u===null?null:u.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map((m=>m.field)))})(r,e,t,n):(function(s,a,u){return zi(s.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u})(r,e,t)}function Qy(r,e){let t=null;for(const n of r.fieldTransforms){const i=e.data.field(n.field),s=bd(n.transform,i||null);s!=null&&(t===null&&(t=De.empty()),t.set(n.field,s))}return t||null}function Jc(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,i){return n===void 0&&i===void 0||!(!n||!i)&&kn(n,i,((s,a)=>Gy(s,a)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Hn extends Ms{constructor(e,t,n,i=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class kt extends Ms{constructor(e,t,n,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function Vd(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function Yc(r,e,t){const n=new Map;L(r.length===t.length,32656,{Ae:t.length,Re:r.length});for(let i=0;i<t.length;i++){const s=r[i],a=s.transform,u=e.data.field(s.field);n.set(s.field,$y(a,u,t[i]))}return n}function Zc(r,e,t){const n=new Map;for(const i of r){const s=i.transform,a=t.data.field(i.field);n.set(i.field,zy(s,a,e))}return n}class Pa extends Ms{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Dd extends Ms{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ca{constructor(e,t,n,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=i}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&Hy(s,e,n[i])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=xr(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=xr(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=wd();return this.mutations.forEach((i=>{const s=e.get(i.key),a=s.overlayedDocument;let u=this.applyToLocalView(a,s.mutatedFields);u=t.has(i.key)?null:u;const c=Cd(a,u);c!==null&&n.set(i.key,c),a.isValidDocument()||a.convertToNoDocument(U.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),$())}isEqual(e){return this.batchId===e.batchId&&kn(this.mutations,e.mutations,((t,n)=>Jc(t,n)))&&kn(this.baseMutations,e.baseMutations,((t,n)=>Jc(t,n)))}}class Va{constructor(e,t,n,i){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=i}static from(e,t,n){L(e.mutations.length===n.length,58842,{Ve:e.mutations.length,me:n.length});let i=(function(){return Fy})();const s=e.mutations;for(let a=0;a<s.length;a++)i=i.insert(s[a].key,n[a].version);return new Va(e,t,n,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Da{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xy{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var le,Q;function Jy(r){switch(r){case P.OK:return M(64938);case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return M(15467,{code:r})}}function kd(r){if(r===void 0)return Ce("GRPC error has no .code"),P.UNKNOWN;switch(r){case le.OK:return P.OK;case le.CANCELLED:return P.CANCELLED;case le.UNKNOWN:return P.UNKNOWN;case le.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case le.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case le.INTERNAL:return P.INTERNAL;case le.UNAVAILABLE:return P.UNAVAILABLE;case le.UNAUTHENTICATED:return P.UNAUTHENTICATED;case le.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case le.NOT_FOUND:return P.NOT_FOUND;case le.ALREADY_EXISTS:return P.ALREADY_EXISTS;case le.PERMISSION_DENIED:return P.PERMISSION_DENIED;case le.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case le.ABORTED:return P.ABORTED;case le.OUT_OF_RANGE:return P.OUT_OF_RANGE;case le.UNIMPLEMENTED:return P.UNIMPLEMENTED;case le.DATA_LOSS:return P.DATA_LOSS;default:return M(39323,{code:r})}}(Q=le||(le={}))[Q.OK=0]="OK",Q[Q.CANCELLED=1]="CANCELLED",Q[Q.UNKNOWN=2]="UNKNOWN",Q[Q.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Q[Q.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Q[Q.NOT_FOUND=5]="NOT_FOUND",Q[Q.ALREADY_EXISTS=6]="ALREADY_EXISTS",Q[Q.PERMISSION_DENIED=7]="PERMISSION_DENIED",Q[Q.UNAUTHENTICATED=16]="UNAUTHENTICATED",Q[Q.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Q[Q.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Q[Q.ABORTED=10]="ABORTED",Q[Q.OUT_OF_RANGE=11]="OUT_OF_RANGE",Q[Q.UNIMPLEMENTED=12]="UNIMPLEMENTED",Q[Q.INTERNAL=13]="INTERNAL",Q[Q.UNAVAILABLE=14]="UNAVAILABLE",Q[Q.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yy=new Et([4294967295,4294967295],0);function el(r){const e=Fh().encode(r),t=new Dh;return t.update(e),new Uint8Array(t.digest())}function tl(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Et([t,n],0),new Et([i,s],0)]}class ka{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Tr(`Invalid padding: ${t}`);if(n<0)throw new Tr(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Tr(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Tr(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=Et.fromNumber(this.fe)}pe(e,t,n){let i=e.add(t.multiply(Et.fromNumber(n)));return i.compare(Yy)===1&&(i=new Et([i.getBits(0),i.getBits(1)],0)),i.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=el(e),[n,i]=tl(t);for(let s=0;s<this.hashCount;s++){const a=this.pe(n,i,s);if(!this.ye(a))return!1}return!0}static create(e,t,n){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),a=new ka(s,i,t);return n.forEach((u=>a.insert(u))),a}insert(e){if(this.fe===0)return;const t=el(e),[n,i]=tl(t);for(let s=0;s<this.hashCount;s++){const a=this.pe(n,i,s);this.we(a)}}we(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Tr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ls{constructor(e,t,n,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const i=new Map;return i.set(e,ii.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new Ls(U.min(),i,new oe(j),xe(),$())}}class ii{constructor(e,t,n,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new ii(n,t,$(),$(),$())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(e,t,n,i){this.Se=e,this.removedTargetIds=t,this.key=n,this.be=i}}class Nd{constructor(e,t){this.targetId=e,this.De=t}}class xd{constructor(e,t,n=de.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=i}}class nl{constructor(){this.ve=0,this.Ce=rl(),this.Fe=de.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=$(),t=$(),n=$();return this.Ce.forEach(((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:n=n.add(i);break;default:M(38017,{changeType:s})}})),new ii(this.Fe,this.Me,e,t,n)}ke(){this.xe=!1,this.Ce=rl()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,L(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class Zy{constructor(e){this.We=e,this.Ge=new Map,this.ze=xe(),this.je=Vi(),this.Je=Vi(),this.He=new oe(j)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const n=this.tt(t);switch(e.state){case 0:this.nt(t)&&n.Be(e.resumeToken);break;case 1:n.Ue(),n.Oe||n.ke(),n.Be(e.resumeToken);break;case 2:n.Ue(),n.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(n.Ke(),n.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),n.Be(e.resumeToken));break;default:M(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((n,i)=>{this.nt(i)&&t(i)}))}it(e){const t=e.targetId,n=e.De.count,i=this.st(t);if(i){const s=i.target;if(us(s))if(n===0){const a=new x(s.path);this.Xe(t,a,ce.newNoDocument(a,U.min()))}else L(n===1,20013,{expectedCount:n});else{const a=this.ot(t);if(a!==n){const u=this._t(e),c=u?this.ut(u,e,a):1;if(c!==0){this.rt(t);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,d)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:i=0},hashCount:s=0}=t;let a,u;try{a=st(n).toUint8Array()}catch(c){if(c instanceof rd)return At("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{u=new ka(a,i,s)}catch(c){return At(c instanceof Tr?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return u.fe===0?null:u}ut(e,t,n){return t.De.count===n-this.ht(e,t.targetId)?0:2}ht(e,t){const n=this.We.getRemoteKeysForTarget(t);let i=0;return n.forEach((s=>{const a=this.We.lt(),u=`projects/${a.projectId}/databases/${a.database}/documents/${s.path.canonicalString()}`;e.mightContain(u)||(this.Xe(t,s,null),i++)})),i}Pt(e){const t=new Map;this.Ge.forEach(((s,a)=>{const u=this.st(a);if(u){if(s.current&&us(u.target)){const c=new x(u.target.path);this.Tt(c).has(a)||this.It(a,c)||this.Xe(a,c,ce.newNoDocument(c,e))}s.Ne&&(t.set(a,s.Le()),s.ke())}}));let n=$();this.Je.forEach(((s,a)=>{let u=!0;a.forEachWhile((c=>{const d=this.st(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)})),u&&(n=n.add(s))})),this.ze.forEach(((s,a)=>a.setReadTime(e)));const i=new Ls(e,t,this.He,this.ze,n);return this.ze=xe(),this.je=Vi(),this.Je=Vi(),this.He=new oe(j),i}Ze(e,t){if(!this.nt(e))return;const n=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,n),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,n){if(!this.nt(e))return;const i=this.tt(e);this.It(e,t)?i.qe(t,1):i.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),n&&(this.ze=this.ze.insert(t,n))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new nl,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new te(j),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new te(j),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||C("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new nl),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function Vi(){return new oe(x.comparator)}function rl(){return new oe(x.comparator)}const eI={asc:"ASCENDING",desc:"DESCENDING"},tI={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},nI={and:"AND",or:"OR"};class rI{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Qo(r,e){return r.useProto3Json||Rs(e)?e:{value:e}}function zn(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Od(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function iI(r,e){return zn(r,e.toTimestamp())}function Ve(r){return L(!!r,49232),U.fromTimestamp((function(t){const n=it(t);return new ee(n.seconds,n.nanos)})(r))}function Na(r,e){return Xo(r,e).canonicalString()}function Xo(r,e){const t=(function(i){return new Y(["projects",i.projectId,"databases",i.database])})(r).child("documents");return e===void 0?t:t.child(e)}function Md(r){const e=Y.fromString(r);return L(Kd(e),10190,{key:e.toString()}),e}function ls(r,e){return Na(r.databaseId,e.path)}function Jt(r,e){const t=Md(e);if(t.get(1)!==r.databaseId.projectId)throw new O(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new O(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new x(Ud(t))}function Ld(r,e){return Na(r.databaseId,e)}function Fd(r){const e=Md(r);return e.length===4?Y.emptyPath():Ud(e)}function Jo(r){return new Y(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function Ud(r){return L(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function il(r,e,t){return{name:ls(r,e),fields:t.value.mapValue.fields}}function sI(r,e,t){const n=Jt(r,e.name),i=Ve(e.updateTime),s=e.createTime?Ve(e.createTime):U.min(),a=new De({mapValue:{fields:e.fields}}),u=ce.newFoundDocument(n,i,s,a);return t&&u.setHasCommittedMutations(),t?u.setHasCommittedMutations():u}function oI(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:M(39313,{state:d})})(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=(function(d,p){return d.useProto3Json?(L(p===void 0||typeof p=="string",58123),de.fromBase64String(p||"")):(L(p===void 0||p instanceof Buffer||p instanceof Uint8Array,16193),de.fromUint8Array(p||new Uint8Array))})(r,e.targetChange.resumeToken),a=e.targetChange.cause,u=a&&(function(d){const p=d.code===void 0?P.UNKNOWN:kd(d.code);return new O(p,d.message||"")})(a);t=new xd(n,i,s,u||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const i=Jt(r,n.document.name),s=Ve(n.document.updateTime),a=n.document.createTime?Ve(n.document.createTime):U.min(),u=new De({mapValue:{fields:n.document.fields}}),c=ce.newFoundDocument(i,s,a,u),d=n.targetIds||[],p=n.removedTargetIds||[];t=new $i(d,p,c.key,c)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const i=Jt(r,n.document),s=n.readTime?Ve(n.readTime):U.min(),a=ce.newNoDocument(i,s),u=n.removedTargetIds||[];t=new $i([],u,a.key,a)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const i=Jt(r,n.document),s=n.removedTargetIds||[];t=new $i([],s,i,null)}else{if(!("filter"in e))return M(11601,{At:e});{e.filter;const n=e.filter;n.targetId;const{count:i=0,unchangedNames:s}=n,a=new Xy(i,s),u=n.targetId;t=new Nd(u,a)}}return t}function hs(r,e){let t;if(e instanceof Hn)t={update:il(r,e.key,e.value)};else if(e instanceof Pa)t={delete:ls(r,e.key)};else if(e instanceof kt)t={update:il(r,e.key,e.data),updateMask:dI(e.fieldMask)};else{if(!(e instanceof Dd))return M(16599,{Rt:e.type});t={verify:ls(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(s,a){const u=a.transform;if(u instanceof Hr)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof jn)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof qn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof Qr)return{fieldPath:a.field.canonicalString(),increment:u.Ee};throw M(20930,{transform:a.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(i,s){return s.updateTime!==void 0?{updateTime:iI(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:M(27497)})(r,e.precondition)),t}function Yo(r,e){const t=e.currentDocument?(function(s){return s.updateTime!==void 0?Oe.updateTime(Ve(s.updateTime)):s.exists!==void 0?Oe.exists(s.exists):Oe.none()})(e.currentDocument):Oe.none(),n=e.updateTransforms?e.updateTransforms.map((i=>(function(a,u){let c=null;if("setToServerValue"in u)L(u.setToServerValue==="REQUEST_TIME",16630,{proto:u}),c=new Hr;else if("appendMissingElements"in u){const p=u.appendMissingElements.values||[];c=new jn(p)}else if("removeAllFromArray"in u){const p=u.removeAllFromArray.values||[];c=new qn(p)}else"increment"in u?c=new Qr(a,u.increment):M(16584,{proto:u});const d=ae.fromServerFormat(u.fieldPath);return new Ky(d,c)})(r,i))):[];if(e.update){e.update.name;const i=Jt(r,e.update.name),s=new De({mapValue:{fields:e.update.fields}});if(e.updateMask){const a=(function(c){const d=c.fieldPaths||[];return new Be(d.map((p=>ae.fromServerFormat(p))))})(e.updateMask);return new kt(i,s,a,t,n)}return new Hn(i,s,t,n)}if(e.delete){const i=Jt(r,e.delete);return new Pa(i,t)}if(e.verify){const i=Jt(r,e.verify);return new Dd(i,t)}return M(1463,{proto:e})}function aI(r,e){return r&&r.length>0?(L(e!==void 0,14353),r.map((t=>(function(i,s){let a=i.updateTime?Ve(i.updateTime):Ve(s);return a.isEqual(U.min())&&(a=Ve(s)),new Wy(a,i.transformResults||[])})(t,e)))):[]}function Bd(r,e){return{documents:[Ld(r,e.path)]}}function jd(r,e){const t={structuredQuery:{}},n=e.path;let i;e.collectionGroup!==null?(i=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Ld(r,i);const s=(function(d){if(d.length!==0)return $d(ne.create(d,"and"))})(e.filters);s&&(t.structuredQuery.where=s);const a=(function(d){if(d.length!==0)return d.map((p=>(function(w){return{field:wn(w.field),direction:cI(w.dir)}})(p)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const u=Qo(r,e.limit);return u!==null&&(t.structuredQuery.limit=u),e.startAt&&(t.structuredQuery.startAt=(function(d){return{before:d.inclusive,values:d.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(d){return{before:!d.inclusive,values:d.position}})(e.endAt)),{Vt:t,parent:i}}function qd(r){let e=Fd(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let i=null;if(n>0){L(n===1,65062);const p=t.from[0];p.allDescendants?i=p.collectionId:e=e.child(p.collectionId)}let s=[];t.where&&(s=(function(m){const w=zd(m);return w instanceof ne&&Ra(w)?w.getFilters():[w]})(t.where));let a=[];t.orderBy&&(a=(function(m){return m.map((w=>(function(V){return new as(An(V.field),(function(D){switch(D){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(V.direction))})(w)))})(t.orderBy));let u=null;t.limit&&(u=(function(m){let w;return w=typeof m=="object"?m.value:m,Rs(w)?null:w})(t.limit));let c=null;t.startAt&&(c=(function(m){const w=!!m.before,S=m.values||[];return new Un(S,w)})(t.startAt));let d=null;return t.endAt&&(d=(function(m){const w=!m.before,S=m.values||[];return new Un(S,w)})(t.endAt)),ky(e,i,a,s,u,"F",c,d)}function uI(r,e){const t=(function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M(28987,{purpose:i})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function zd(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=An(t.unaryFilter.field);return W.create(n,"==",{doubleValue:NaN});case"IS_NULL":const i=An(t.unaryFilter.field);return W.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=An(t.unaryFilter.field);return W.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=An(t.unaryFilter.field);return W.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return M(61313);default:return M(60726)}})(r):r.fieldFilter!==void 0?(function(t){return W.create(An(t.fieldFilter.field),(function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return M(58110);default:return M(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return ne.create(t.compositeFilter.filters.map((n=>zd(n))),(function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return M(1026)}})(t.compositeFilter.op))})(r):M(30097,{filter:r})}function cI(r){return eI[r]}function lI(r){return tI[r]}function hI(r){return nI[r]}function wn(r){return{fieldPath:r.canonicalString()}}function An(r){return ae.fromServerFormat(r.fieldPath)}function $d(r){return r instanceof W?(function(t){if(t.op==="=="){if(qc(t.value))return{unaryFilter:{field:wn(t.field),op:"IS_NAN"}};if(jc(t.value))return{unaryFilter:{field:wn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(qc(t.value))return{unaryFilter:{field:wn(t.field),op:"IS_NOT_NAN"}};if(jc(t.value))return{unaryFilter:{field:wn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:wn(t.field),op:lI(t.op),value:t.value}}})(r):r instanceof ne?(function(t){const n=t.getFilters().map((i=>$d(i)));return n.length===1?n[0]:{compositeFilter:{op:hI(t.op),filters:n}}})(r):M(54877,{filter:r})}function dI(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Kd(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e,t,n,i,s=U.min(),a=U.min(),u=de.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=u,this.expectedCount=c}withSequenceNumber(e){return new nt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new nt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new nt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new nt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd{constructor(e){this.gt=e}}function fI(r,e){let t;if(e.document)t=sI(r.gt,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=x.fromSegments(e.noDocument.path),i=sn(e.noDocument.readTime);t=ce.newNoDocument(n,i),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return M(56709);{const n=x.fromSegments(e.unknownDocument.path),i=sn(e.unknownDocument.version);t=ce.newUnknownDocument(n,i)}}return e.readTime&&t.setReadTime((function(i){const s=new ee(i[0],i[1]);return U.fromTimestamp(s)})(e.readTime)),t}function sl(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:ds(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=(function(s,a){return{name:ls(s,a.key),fields:a.data.value.mapValue.fields,updateTime:zn(s,a.version.toTimestamp()),createTime:zn(s,a.createTime.toTimestamp())}})(r.gt,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:rn(e.version)};else{if(!e.isUnknownDocument())return M(57904,{document:e});n.unknownDocument={path:t.path.toArray(),version:rn(e.version)}}return n}function ds(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function rn(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function sn(r){const e=new ee(r.seconds,r.nanoseconds);return U.fromTimestamp(e)}function qt(r,e){const t=(e.baseMutations||[]).map((s=>Yo(r.gt,s)));for(let s=0;s<e.mutations.length-1;++s){const a=e.mutations[s];if(s+1<e.mutations.length&&e.mutations[s+1].transform!==void 0){const u=e.mutations[s+1];a.updateTransforms=u.transform.fieldTransforms,e.mutations.splice(s+1,1),++s}}const n=e.mutations.map((s=>Yo(r.gt,s))),i=ee.fromMillis(e.localWriteTimeMs);return new Ca(e.batchId,i,t,n)}function wr(r){const e=sn(r.readTime),t=r.lastLimboFreeSnapshotVersion!==void 0?sn(r.lastLimboFreeSnapshotVersion):U.min();let n;return n=(function(s){return s.documents!==void 0})(r.query)?(function(s){const a=s.documents.length;return L(a===1,1966,{count:a}),je(Ns(Fd(s.documents[0])))})(r.query):(function(s){return je(qd(s))})(r.query),new nt(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,e,t,de.fromBase64String(r.resumeToken))}function Wd(r,e){const t=rn(e.snapshotVersion),n=rn(e.lastLimboFreeSnapshotVersion);let i;i=us(e.target)?Bd(r.gt,e.target):jd(r.gt,e.target).Vt;const s=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:nn(e.target),readTime:t,resumeToken:s,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:i}}function Hd(r){const e=qd({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Ho(e,e.limit,"L"):e}function To(r,e){return new Da(e.largestBatchId,Yo(r.gt,e.overlayMutation))}function ol(r,e){const t=e.path.lastSegment();return[r,be(e.path.popLast()),t]}function al(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:rn(n.readTime),documentKey:be(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pI{getBundleMetadata(e,t){return ul(e).get(t).next((n=>{if(n)return(function(s){return{id:s.bundleId,createTime:sn(s.createTime),version:s.version}})(n)}))}saveBundleMetadata(e,t){return ul(e).put((function(i){return{bundleId:i.id,createTime:rn(Ve(i.createTime)),version:i.version}})(t))}getNamedQuery(e,t){return cl(e).get(t).next((n=>{if(n)return(function(s){return{name:s.name,query:Hd(s.bundledQuery),readTime:sn(s.readTime)}})(n)}))}saveNamedQuery(e,t){return cl(e).put((function(i){return{name:i.name,readTime:rn(Ve(i.readTime)),bundledQuery:i.bundledQuery}})(t))}}function ul(r){return pe(r,Ss)}function cl(r){return pe(r,Ps)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(e,t){this.serializer=e,this.userId=t}static yt(e,t){const n=t.uid||"";return new Fs(e,n)}getOverlay(e,t){return fr(e).get(ol(this.userId,t)).next((n=>n?To(this.serializer,n):null))}getOverlays(e,t){const n=He();return T.forEach(t,(i=>this.getOverlay(e,i).next((s=>{s!==null&&n.set(i,s)})))).next((()=>n))}saveOverlays(e,t,n){const i=[];return n.forEach(((s,a)=>{const u=new Da(t,a);i.push(this.wt(e,u))})),T.waitFor(i)}removeOverlaysForBatchId(e,t,n){const i=new Set;t.forEach((a=>i.add(be(a.getCollectionPath()))));const s=[];return i.forEach((a=>{const u=IDBKeyRange.bound([this.userId,a,n],[this.userId,a,n+1],!1,!0);s.push(fr(e).Y(jo,u))})),T.waitFor(s)}getOverlaysForCollection(e,t,n){const i=He(),s=be(t),a=IDBKeyRange.bound([this.userId,s,n],[this.userId,s,Number.POSITIVE_INFINITY],!0);return fr(e).j(jo,a).next((u=>{for(const c of u){const d=To(this.serializer,c);i.set(d.getKey(),d)}return i}))}getOverlaysForCollectionGroup(e,t,n,i){const s=He();let a;const u=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return fr(e).X({index:Jh,range:u},((c,d,p)=>{const m=To(this.serializer,d);s.size()<i||m.largestBatchId===a?(s.set(m.getKey(),m),a=m.largestBatchId):p.done()})).next((()=>s))}wt(e,t){return fr(e).put((function(i,s,a){const[u,c,d]=ol(s,a.mutation.key);return{userId:s,collectionPath:c,documentId:d,collectionGroup:a.mutation.key.getCollectionGroup(),largestBatchId:a.largestBatchId,overlayMutation:hs(i.gt,a.mutation)}})(this.serializer,this.userId,t))}}function fr(r){return pe(r,Cs)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mI{St(e){return pe(e,Ea)}getSessionToken(e){return this.St(e).get("sessionToken").next((t=>{const n=t==null?void 0:t.value;return n?de.fromUint8Array(n):de.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.St(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(){}bt(e,t){this.Dt(e,t),t.vt()}Dt(e,t){if("nullValue"in e)this.Ct(t,5);else if("booleanValue"in e)this.Ct(t,10),t.Ft(e.booleanValue?1:0);else if("integerValue"in e)this.Ct(t,15),t.Ft(se(e.integerValue));else if("doubleValue"in e){const n=se(e.doubleValue);isNaN(n)?this.Ct(t,13):(this.Ct(t,15),jr(n)?t.Ft(0):t.Ft(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ct(t,20),typeof n=="string"&&(n=it(n)),t.Mt(`${n.seconds||""}`),t.Ft(n.nanos||0)}else if("stringValue"in e)this.xt(e.stringValue,t),this.Ot(t);else if("bytesValue"in e)this.Ct(t,30),t.Nt(st(e.bytesValue)),this.Ot(t);else if("referenceValue"in e)this.Bt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Ct(t,45),t.Ft(n.latitude||0),t.Ft(n.longitude||0)}else"mapValue"in e?cd(e)?this.Ct(t,Number.MAX_SAFE_INTEGER):Ds(e)?this.Lt(e.mapValue,t):(this.kt(e.mapValue,t),this.Ot(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Ot(t)):M(19022,{Qt:e})}xt(e,t){this.Ct(t,25),this.$t(e,t)}$t(e,t){t.Mt(e)}kt(e,t){const n=e.fields||{};this.Ct(t,55);for(const i of Object.keys(n))this.xt(i,t),this.Dt(n[i],t)}Lt(e,t){var n,i;const s=e.fields||{};this.Ct(t,53);const a=Ln,u=((i=(n=s[a].arrayValue)===null||n===void 0?void 0:n.values)===null||i===void 0?void 0:i.length)||0;this.Ct(t,15),t.Ft(se(u)),this.xt(a,t),this.Dt(s[a],t)}qt(e,t){const n=e.values||[];this.Ct(t,50);for(const i of n)this.Dt(i,t)}Bt(e,t){this.Ct(t,37),x.fromName(e).path.forEach((n=>{this.Ct(t,60),this.$t(n,t)}))}Ct(e,t){e.Ft(t)}Ot(e){e.Ft(2)}}zt.Ut=new zt;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _n=255;function gI(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function ll(r){const e=64-(function(n){let i=0;for(let s=0;s<8;++s){const a=gI(255&n[s]);if(i+=a,a!==8)break}return i})(r);return Math.ceil(e/8)}class _I{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Kt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Wt(n.value),n=t.next();this.Gt()}zt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.jt(n.value),n=t.next();this.Jt()}Ht(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Wt(n);else if(n<2048)this.Wt(960|n>>>6),this.Wt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Wt(480|n>>>12),this.Wt(128|63&n>>>6),this.Wt(128|63&n);else{const i=t.codePointAt(0);this.Wt(240|i>>>18),this.Wt(128|63&i>>>12),this.Wt(128|63&i>>>6),this.Wt(128|63&i)}}this.Gt()}Yt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.jt(n);else if(n<2048)this.jt(960|n>>>6),this.jt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.jt(480|n>>>12),this.jt(128|63&n>>>6),this.jt(128|63&n);else{const i=t.codePointAt(0);this.jt(240|i>>>18),this.jt(128|63&i>>>12),this.jt(128|63&i>>>6),this.jt(128|63&i)}}this.Jt()}Zt(e){const t=this.Xt(e),n=ll(t);this.en(1+n),this.buffer[this.position++]=255&n;for(let i=t.length-n;i<t.length;++i)this.buffer[this.position++]=255&t[i]}tn(e){const t=this.Xt(e),n=ll(t);this.en(1+n),this.buffer[this.position++]=~(255&n);for(let i=t.length-n;i<t.length;++i)this.buffer[this.position++]=~(255&t[i])}nn(){this.rn(_n),this.rn(255)}sn(){this._n(_n),this._n(255)}reset(){this.position=0}seed(e){this.en(e.length),this.buffer.set(e,this.position),this.position+=e.length}an(){return this.buffer.slice(0,this.position)}Xt(e){const t=(function(s){const a=new DataView(new ArrayBuffer(8));return a.setFloat64(0,s,!1),new Uint8Array(a.buffer)})(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let i=1;i<t.length;++i)t[i]^=n?255:0;return t}Wt(e){const t=255&e;t===0?(this.rn(0),this.rn(255)):t===_n?(this.rn(_n),this.rn(0)):this.rn(t)}jt(e){const t=255&e;t===0?(this._n(0),this._n(255)):t===_n?(this._n(_n),this._n(0)):this._n(e)}Gt(){this.rn(0),this.rn(1)}Jt(){this._n(0),this._n(1)}rn(e){this.en(1),this.buffer[this.position++]=e}_n(e){this.en(1),this.buffer[this.position++]=~e}en(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const i=new Uint8Array(n);i.set(this.buffer),this.buffer=i}}class yI{constructor(e){this.un=e}Nt(e){this.un.Kt(e)}Mt(e){this.un.Ht(e)}Ft(e){this.un.Zt(e)}vt(){this.un.nn()}}class II{constructor(e){this.un=e}Nt(e){this.un.zt(e)}Mt(e){this.un.Yt(e)}Ft(e){this.un.tn(e)}vt(){this.un.sn()}}class pr{constructor(){this.un=new _I,this.cn=new yI(this.un),this.ln=new II(this.un)}seed(e){this.un.seed(e)}hn(e){return e===0?this.cn:this.ln}an(){return this.un.an()}reset(){this.un.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(e,t,n,i){this.Pn=e,this.Tn=t,this.In=n,this.dn=i}En(){const e=this.dn.length,t=e===0||this.dn[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.dn,0),t!==e?n.set([0],this.dn.length):++n[n.length-1],new $t(this.Pn,this.Tn,this.In,n)}An(e,t,n){return{indexId:this.Pn,uid:e,arrayValue:Ki(this.In),directionalValue:Ki(this.dn),orderedDocumentKey:Ki(t),documentKey:n.path.toArray()}}Rn(e,t,n){const i=this.An(e,t,n);return[i.indexId,i.uid,i.arrayValue,i.directionalValue,i.orderedDocumentKey,i.documentKey]}}function ft(r,e){let t=r.Pn-e.Pn;return t!==0?t:(t=hl(r.In,e.In),t!==0?t:(t=hl(r.dn,e.dn),t!==0?t:x.comparator(r.Tn,e.Tn)))}function hl(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}function Ki(r){return eh()?(function(t){let n="";for(let i=0;i<t.length;i++)n+=String.fromCharCode(t[i]);return n})(r):r}function dl(r){return typeof r!="string"?r:(function(t){const n=new Uint8Array(t.length);for(let i=0;i<t.length;i++)n[i]=t.charCodeAt(i);return n})(r)}class fl{constructor(e){this.Vn=new te(((t,n)=>ae.comparator(t.field,n.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.mn=e.orderBy,this.fn=[];for(const t of e.filters){const n=t;n.isInequality()?this.Vn=this.Vn.add(n):this.fn.push(n)}}get gn(){return this.Vn.size>1}pn(e){if(L(e.collectionGroup===this.collectionId,49279),this.gn)return!1;const t=Fo(e);if(t!==void 0&&!this.yn(t))return!1;const n=Ut(e);let i=new Set,s=0,a=0;for(;s<n.length&&this.yn(n[s]);++s)i=i.add(n[s].fieldPath.canonicalString());if(s===n.length)return!0;if(this.Vn.size>0){const u=this.Vn.getIterator().getNext();if(!i.has(u.field.canonicalString())){const c=n[s];if(!this.wn(u,c)||!this.Sn(this.mn[a++],c))return!1}++s}for(;s<n.length;++s){const u=n[s];if(a>=this.mn.length||!this.Sn(this.mn[a++],u))return!1}return!0}bn(){if(this.gn)return null;let e=new te(ae.comparator);const t=[];for(const n of this.fn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new Li(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new Li(n.field,0))}for(const n of this.mn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new Li(n.field,n.dir==="asc"?0:1)));return new ns(ns.UNKNOWN_ID,this.collectionId,t,Br.empty())}yn(e){for(const t of this.fn)if(this.wn(t,e))return!0;return!1}wn(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}Sn(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qd(r){var e,t;if(L(r instanceof W||r instanceof ne,20012),r instanceof W){if(r instanceof yd){const i=((t=(e=r.value.arrayValue)===null||e===void 0?void 0:e.values)===null||t===void 0?void 0:t.map((s=>W.create(r.field,"==",s))))||[];return ne.create(i,"or")}return r}const n=r.filters.map((i=>Qd(i)));return ne.create(n,r.op)}function EI(r){if(r.getFilters().length===0)return[];const e=ta(Qd(r));return L(Xd(e),7391),Zo(e)||ea(e)?[e]:e.getFilters()}function Zo(r){return r instanceof W}function ea(r){return r instanceof ne&&Ra(r)}function Xd(r){return Zo(r)||ea(r)||(function(t){if(t instanceof ne&&Ko(t)){for(const n of t.getFilters())if(!Zo(n)&&!ea(n))return!1;return!0}return!1})(r)}function ta(r){if(L(r instanceof W||r instanceof ne,34018),r instanceof W)return r;if(r.filters.length===1)return ta(r.filters[0]);const e=r.filters.map((n=>ta(n)));let t=ne.create(e,r.op);return t=fs(t),Xd(t)?t:(L(t instanceof ne,64498),L(Bn(t),40251),L(t.filters.length>1,57927),t.filters.reduce(((n,i)=>xa(n,i))))}function xa(r,e){let t;return L(r instanceof W||r instanceof ne,38388),L(e instanceof W||e instanceof ne,25473),t=r instanceof W?e instanceof W?(function(i,s){return ne.create([i,s],"and")})(r,e):pl(r,e):e instanceof W?pl(e,r):(function(i,s){if(L(i.filters.length>0&&s.filters.length>0,48005),Bn(i)&&Bn(s))return md(i,s.getFilters());const a=Ko(i)?i:s,u=Ko(i)?s:i,c=a.filters.map((d=>xa(d,u)));return ne.create(c,"or")})(r,e),fs(t)}function pl(r,e){if(Bn(e))return md(e,r.getFilters());{const t=e.filters.map((n=>xa(r,n)));return ne.create(t,"or")}}function fs(r){if(L(r instanceof W||r instanceof ne,11850),r instanceof W)return r;const e=r.getFilters();if(e.length===1)return fs(e[0]);if(fd(r))return r;const t=e.map((i=>fs(i))),n=[];return t.forEach((i=>{i instanceof W?n.push(i):i instanceof ne&&(i.op===r.op?n.push(...i.filters):n.push(i))})),n.length===1?n[0]:ne.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vI{constructor(){this.Dn=new Oa}addToCollectionParentIndex(e,t){return this.Dn.add(t),T.resolve()}getCollectionParents(e,t){return T.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return T.resolve()}deleteFieldIndex(e,t){return T.resolve()}deleteAllFieldIndexes(e){return T.resolve()}createTargetIndexes(e,t){return T.resolve()}getDocumentsMatchingTarget(e,t){return T.resolve(null)}getIndexType(e,t){return T.resolve(0)}getFieldIndexes(e,t){return T.resolve([])}getNextCollectionGroupToUpdate(e){return T.resolve(null)}getMinOffset(e,t){return T.resolve(Le.min())}getMinOffsetFromCollectionGroup(e,t){return T.resolve(Le.min())}updateCollectionGroup(e,t,n){return T.resolve()}updateIndexEntries(e,t){return T.resolve()}}class Oa{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t]||new te(Y.comparator),s=!i.has(n);return this.index[t]=i.add(n),s}has(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t];return i&&i.has(n)}getEntries(e){return(this.index[e]||new te(Y.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ml="IndexedDbIndexManager",Di=new Uint8Array(0);class TI{constructor(e,t){this.databaseId=t,this.vn=new Oa,this.Cn=new at((n=>nn(n)),((n,i)=>ni(n,i))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.vn.has(t)){const n=t.lastSegment(),i=t.popLast();e.addOnCommittedListener((()=>{this.vn.add(t)}));const s={collectionId:n,parent:be(i)};return gl(e).put(s)}return T.resolve()}getCollectionParents(e,t){const n=[],i=IDBKeyRange.bound([t,""],[Uh(t),""],!1,!0);return gl(e).j(i).next((s=>{for(const a of s){if(a.collectionId!==t)break;n.push(We(a.parent))}return n}))}addFieldIndex(e,t){const n=mr(e),i=(function(u){return{indexId:u.indexId,collectionGroup:u.collectionGroup,fields:u.fields.map((c=>[c.fieldPath.canonicalString(),c.kind]))}})(t);delete i.indexId;const s=n.add(i);if(t.indexState){const a=In(e);return s.next((u=>{a.put(al(u,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return s.next()}deleteFieldIndex(e,t){const n=mr(e),i=In(e),s=yn(e);return n.delete(t.indexId).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=mr(e),n=yn(e),i=In(e);return t.Y().next((()=>n.Y())).next((()=>i.Y()))}createTargetIndexes(e,t){return T.forEach(this.Fn(t),(n=>this.getIndexType(e,n).next((i=>{if(i===0||i===1){const s=new fl(n).bn();if(s!=null)return this.addFieldIndex(e,s)}}))))}getDocumentsMatchingTarget(e,t){const n=yn(e);let i=!0;const s=new Map;return T.forEach(this.Fn(t),(a=>this.Mn(e,a).next((u=>{i&&(i=!!u),s.set(a,u)})))).next((()=>{if(i){let a=$();const u=[];return T.forEach(s,((c,d)=>{C(ml,`Using index ${(function(F){return`id=${F.indexId}|cg=${F.collectionGroup}|f=${F.fields.map((H=>`${H.fieldPath}:${H.kind}`)).join(",")}`})(c)} to execute ${nn(t)}`);const p=(function(F,H){const Z=Fo(H);if(Z===void 0)return null;for(const K of cs(F,Z.fieldPath))switch(K.op){case"array-contains-any":return K.value.arrayValue.values||[];case"array-contains":return[K.value]}return null})(d,c),m=(function(F,H){const Z=new Map;for(const K of Ut(H))for(const I of cs(F,K.fieldPath))switch(I.op){case"==":case"in":Z.set(K.fieldPath.canonicalString(),I.value);break;case"not-in":case"!=":return Z.set(K.fieldPath.canonicalString(),I.value),Array.from(Z.values())}return null})(d,c),w=(function(F,H){const Z=[];let K=!0;for(const I of Ut(H)){const g=I.kind===0?Wc(F,I.fieldPath,F.startAt):Hc(F,I.fieldPath,F.startAt);Z.push(g.value),K&&(K=g.inclusive)}return new Un(Z,K)})(d,c),S=(function(F,H){const Z=[];let K=!0;for(const I of Ut(H)){const g=I.kind===0?Hc(F,I.fieldPath,F.endAt):Wc(F,I.fieldPath,F.endAt);Z.push(g.value),K&&(K=g.inclusive)}return new Un(Z,K)})(d,c),V=this.xn(c,d,w),N=this.xn(c,d,S),D=this.On(c,d,m),z=this.Nn(c.indexId,p,V,w.inclusive,N,S.inclusive,D);return T.forEach(z,(B=>n.H(B,t.limit).next((F=>{F.forEach((H=>{const Z=x.fromSegments(H.documentKey);a.has(Z)||(a=a.add(Z),u.push(Z))}))}))))})).next((()=>u))}return T.resolve(null)}))}Fn(e){let t=this.Cn.get(e);return t||(e.filters.length===0?t=[e]:t=EI(ne.create(e.filters,"and")).map((n=>Wo(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt))),this.Cn.set(e,t),t)}Nn(e,t,n,i,s,a,u){const c=(t!=null?t.length:1)*Math.max(n.length,s.length),d=c/(t!=null?t.length:1),p=[];for(let m=0;m<c;++m){const w=t?this.Bn(t[m/d]):Di,S=this.Ln(e,w,n[m%d],i),V=this.kn(e,w,s[m%d],a),N=u.map((D=>this.Ln(e,w,D,!0)));p.push(...this.createRange(S,V,N))}return p}Ln(e,t,n,i){const s=new $t(e,x.empty(),t,n);return i?s:s.En()}kn(e,t,n,i){const s=new $t(e,x.empty(),t,n);return i?s.En():s}Mn(e,t){const n=new fl(t),i=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,i).next((s=>{let a=null;for(const u of s)n.pn(u)&&(!a||u.fields.length>a.fields.length)&&(a=u);return a}))}getIndexType(e,t){let n=2;const i=this.Fn(t);return T.forEach(i,(s=>this.Mn(e,s).next((a=>{a?n!==0&&a.fields.length<(function(c){let d=new te(ae.comparator),p=!1;for(const m of c.filters)for(const w of m.getFlattenedFilters())w.field.isKeyField()||(w.op==="array-contains"||w.op==="array-contains-any"?p=!0:d=d.add(w.field));for(const m of c.orderBy)m.field.isKeyField()||(d=d.add(m.field));return d.size+(p?1:0)})(s)&&(n=1):n=0})))).next((()=>(function(a){return a.limit!==null})(t)&&i.length>1&&n===2?1:n))}qn(e,t){const n=new pr;for(const i of Ut(e)){const s=t.data.field(i.fieldPath);if(s==null)return null;const a=n.hn(i.kind);zt.Ut.bt(s,a)}return n.an()}Bn(e){const t=new pr;return zt.Ut.bt(e,t.hn(0)),t.an()}Qn(e,t){const n=new pr;return zt.Ut.bt(ba(this.databaseId,t),n.hn((function(s){const a=Ut(s);return a.length===0?0:a[a.length-1].kind})(e))),n.an()}On(e,t,n){if(n===null)return[];let i=[];i.push(new pr);let s=0;for(const a of Ut(e)){const u=n[s++];for(const c of i)if(this.$n(t,a.fieldPath)&&Wr(u))i=this.Un(i,a,u);else{const d=c.hn(a.kind);zt.Ut.bt(u,d)}}return this.Kn(i)}xn(e,t,n){return this.On(e,t,n.position)}Kn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].an();return t}Un(e,t,n){const i=[...e],s=[];for(const a of n.arrayValue.values||[])for(const u of i){const c=new pr;c.seed(u.an()),zt.Ut.bt(a,c.hn(t.kind)),s.push(c)}return s}$n(e,t){return!!e.filters.find((n=>n instanceof W&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(e,t){const n=mr(e),i=In(e);return(t?n.j(Bo,IDBKeyRange.bound(t,t)):n.j()).next((s=>{const a=[];return T.forEach(s,(u=>i.get([u.indexId,this.uid]).next((c=>{a.push((function(p,m){const w=m?new Br(m.sequenceNumber,new Le(sn(m.readTime),new x(We(m.documentKey)),m.largestBatchId)):Br.empty(),S=p.fields.map((([V,N])=>new Li(ae.fromServerFormat(V),N)));return new ns(p.indexId,p.collectionGroup,S,w)})(u,c))})))).next((()=>a))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((n,i)=>{const s=n.indexState.sequenceNumber-i.indexState.sequenceNumber;return s!==0?s:j(n.collectionGroup,i.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,n){const i=mr(e),s=In(e);return this.Wn(e).next((a=>i.j(Bo,IDBKeyRange.bound(t,t)).next((u=>T.forEach(u,(c=>s.put(al(c.indexId,this.uid,a,n))))))))}updateIndexEntries(e,t){const n=new Map;return T.forEach(t,((i,s)=>{const a=n.get(i.collectionGroup);return(a?T.resolve(a):this.getFieldIndexes(e,i.collectionGroup)).next((u=>(n.set(i.collectionGroup,u),T.forEach(u,(c=>this.Gn(e,i,c).next((d=>{const p=this.zn(s,c);return d.isEqual(p)?T.resolve():this.jn(e,s,c,d,p)})))))))}))}Jn(e,t,n,i){return yn(e).put(i.An(this.uid,this.Qn(n,t.key),t.key))}Hn(e,t,n,i){return yn(e).delete(i.Rn(this.uid,this.Qn(n,t.key),t.key))}Gn(e,t,n){const i=yn(e);let s=new te(ft);return i.X({index:Xh,range:IDBKeyRange.only([n.indexId,this.uid,Ki(this.Qn(n,t))])},((a,u)=>{s=s.add(new $t(n.indexId,t,dl(u.arrayValue),dl(u.directionalValue)))})).next((()=>s))}zn(e,t){let n=new te(ft);const i=this.qn(t,e);if(i==null)return n;const s=Fo(t);if(s!=null){const a=e.data.field(s.fieldPath);if(Wr(a))for(const u of a.arrayValue.values||[])n=n.add(new $t(t.indexId,e.key,this.Bn(u),i))}else n=n.add(new $t(t.indexId,e.key,Di,i));return n}jn(e,t,n,i,s){C(ml,"Updating index entries for document '%s'",t.key);const a=[];return(function(c,d,p,m,w){const S=c.getIterator(),V=d.getIterator();let N=gn(S),D=gn(V);for(;N||D;){let z=!1,B=!1;if(N&&D){const F=p(N,D);F<0?B=!0:F>0&&(z=!0)}else N!=null?B=!0:z=!0;z?(m(D),D=gn(V)):B?(w(N),N=gn(S)):(N=gn(S),D=gn(V))}})(i,s,ft,(u=>{a.push(this.Jn(e,t,n,u))}),(u=>{a.push(this.Hn(e,t,n,u))})),T.waitFor(a)}Wn(e){let t=1;return In(e).X({index:Qh,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,i,s)=>{s.done(),t=i.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((a,u)=>ft(a,u))).filter(((a,u,c)=>!u||ft(a,c[u-1])!==0));const i=[];i.push(e);for(const a of n){const u=ft(a,e),c=ft(a,t);if(u===0)i[0]=e.En();else if(u>0&&c<0)i.push(a),i.push(a.En());else if(c>0)break}i.push(t);const s=[];for(let a=0;a<i.length;a+=2){if(this.Yn(i[a],i[a+1]))return[];const u=i[a].Rn(this.uid,Di,x.empty()),c=i[a+1].Rn(this.uid,Di,x.empty());s.push(IDBKeyRange.bound(u,c))}return s}Yn(e,t){return ft(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(_l)}getMinOffset(e,t){return T.mapArray(this.Fn(t),(n=>this.Mn(e,n).next((i=>i||M(44426))))).next(_l)}}function gl(r){return pe(r,$r)}function yn(r){return pe(r,Vr)}function mr(r){return pe(r,Ia)}function In(r){return pe(r,Cr)}function _l(r){L(r.length!==0,28825);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const i=r[n].indexState.offset;ga(i,e)<0&&(e=i),t<i.largestBatchId&&(t=i.largestBatchId)}return new Le(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yl={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Jd=41943040;class Ae{static withCacheSize(e){return new Ae(e,Ae.DEFAULT_COLLECTION_PERCENTILE,Ae.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yd(r,e,t){const n=r.store(ze),i=r.store(Nn),s=[],a=IDBKeyRange.only(t.batchId);let u=0;const c=n.X({range:a},((p,m,w)=>(u++,w.delete())));s.push(c.next((()=>{L(u===1,47070,{batchId:t.batchId})})));const d=[];for(const p of t.mutations){const m=Gh(e,p.key.path,t.batchId);s.push(i.delete(m)),d.push(p.key)}return T.waitFor(s).next((()=>d))}function ps(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw M(14731);e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ae.DEFAULT_COLLECTION_PERCENTILE=10,Ae.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ae.DEFAULT=new Ae(Jd,Ae.DEFAULT_COLLECTION_PERCENTILE,Ae.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ae.DISABLED=new Ae(-1,0,0);class Us{constructor(e,t,n,i){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=i,this.Zn={}}static yt(e,t,n,i){L(e.uid!=="",64387);const s=e.isAuthenticated()?e.uid:"";return new Us(s,t,n,i)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return pt(e).X({index:Gt,range:n},((i,s,a)=>{t=!1,a.done()})).next((()=>t))}addMutationBatch(e,t,n,i){const s=bn(e),a=pt(e);return a.add({}).next((u=>{L(typeof u=="number",49019);const c=new Ca(u,t,n,i),d=(function(S,V,N){const D=N.baseMutations.map((B=>hs(S.gt,B))),z=N.mutations.map((B=>hs(S.gt,B)));return{userId:V,batchId:N.batchId,localWriteTimeMs:N.localWriteTime.toMillis(),baseMutations:D,mutations:z}})(this.serializer,this.userId,c),p=[];let m=new te(((w,S)=>j(w.canonicalString(),S.canonicalString())));for(const w of i){const S=Gh(this.userId,w.key.path,u);m=m.add(w.key.path.popLast()),p.push(a.put(d)),p.push(s.put(S,X_))}return m.forEach((w=>{p.push(this.indexManager.addToCollectionParentIndex(e,w))})),e.addOnCommittedListener((()=>{this.Zn[u]=c.keys()})),T.waitFor(p).next((()=>c))}))}lookupMutationBatch(e,t){return pt(e).get(t).next((n=>n?(L(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:t}),qt(this.serializer,n)):null))}Xn(e,t){return this.Zn[t]?T.resolve(this.Zn[t]):this.lookupMutationBatch(e,t).next((n=>{if(n){const i=n.keys();return this.Zn[t]=i,i}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,i=IDBKeyRange.lowerBound([this.userId,n]);let s=null;return pt(e).X({index:Gt,range:i},((a,u,c)=>{u.userId===this.userId&&(L(u.batchId>=n,47524,{er:n}),s=qt(this.serializer,u)),c.done()})).next((()=>s))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=Qt;return pt(e).X({index:Gt,range:t,reverse:!0},((i,s,a)=>{n=s.batchId,a.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,Qt],[this.userId,Number.POSITIVE_INFINITY]);return pt(e).j(Gt,t).next((n=>n.map((i=>qt(this.serializer,i)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=Fi(this.userId,t.path),i=IDBKeyRange.lowerBound(n),s=[];return bn(e).X({range:i},((a,u,c)=>{const[d,p,m]=a,w=We(p);if(d===this.userId&&t.path.isEqual(w))return pt(e).get(m).next((S=>{if(!S)throw M(61480,{tr:a,batchId:m});L(S.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:S.userId,batchId:m}),s.push(qt(this.serializer,S))}));c.done()})).next((()=>s))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new te(j);const i=[];return t.forEach((s=>{const a=Fi(this.userId,s.path),u=IDBKeyRange.lowerBound(a),c=bn(e).X({range:u},((d,p,m)=>{const[w,S,V]=d,N=We(S);w===this.userId&&s.path.isEqual(N)?n=n.add(V):m.done()}));i.push(c)})),T.waitFor(i).next((()=>this.nr(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,i=n.length+1,s=Fi(this.userId,n),a=IDBKeyRange.lowerBound(s);let u=new te(j);return bn(e).X({range:a},((c,d,p)=>{const[m,w,S]=c,V=We(w);m===this.userId&&n.isPrefixOf(V)?V.length===i&&(u=u.add(S)):p.done()})).next((()=>this.nr(e,u)))}nr(e,t){const n=[],i=[];return t.forEach((s=>{i.push(pt(e).get(s).next((a=>{if(a===null)throw M(35274,{batchId:s});L(a.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:a.userId,batchId:s}),n.push(qt(this.serializer,a))})))})),T.waitFor(i).next((()=>n))}removeMutationBatch(e,t){return Yd(e.ce,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.rr(t.batchId)})),T.forEach(n,(i=>this.referenceDelegate.markPotentiallyOrphaned(e,i))))))}rr(e){delete this.Zn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return T.resolve();const n=IDBKeyRange.lowerBound((function(a){return[a]})(this.userId)),i=[];return bn(e).X({range:n},((s,a,u)=>{if(s[0]===this.userId){const c=We(s[1]);i.push(c)}else u.done()})).next((()=>{L(i.length===0,56720,{ir:i.map((s=>s.canonicalString()))})}))}))}containsKey(e,t){return Zd(e,this.userId,t)}sr(e){return ef(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:Qt,lastStreamToken:""}))}}function Zd(r,e,t){const n=Fi(e,t.path),i=n[1],s=IDBKeyRange.lowerBound(n);let a=!1;return bn(r).X({range:s,Z:!0},((u,c,d)=>{const[p,m,w]=u;p===e&&m===i&&(a=!0),d.done()})).next((()=>a))}function pt(r){return pe(r,ze)}function bn(r){return pe(r,Nn)}function ef(r){return pe(r,qr)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new on(0)}static ur(){return new on(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wI{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.cr(e).next((t=>{const n=new on(t.highestTargetId);return t.highestTargetId=n.next(),this.lr(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.cr(e).next((t=>U.fromTimestamp(new ee(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.cr(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.cr(e).next((i=>(i.highestListenSequenceNumber=t,n&&(i.lastRemoteSnapshotVersion=n.toTimestamp()),t>i.highestListenSequenceNumber&&(i.highestListenSequenceNumber=t),this.lr(e,i))))}addTargetData(e,t){return this.hr(e,t).next((()=>this.cr(e).next((n=>(n.targetCount+=1,this.Pr(t,n),this.lr(e,n))))))}updateTargetData(e,t){return this.hr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>En(e).delete(t.targetId))).next((()=>this.cr(e))).next((n=>(L(n.targetCount>0,8065),n.targetCount-=1,this.lr(e,n))))}removeTargets(e,t,n){let i=0;const s=[];return En(e).X(((a,u)=>{const c=wr(u);c.sequenceNumber<=t&&n.get(c.targetId)===null&&(i++,s.push(this.removeTargetData(e,c)))})).next((()=>T.waitFor(s))).next((()=>i))}forEachTarget(e,t){return En(e).X(((n,i)=>{const s=wr(i);t(s)}))}cr(e){return Il(e).get(ss).next((t=>(L(t!==null,2888),t)))}lr(e,t){return Il(e).put(ss,t)}hr(e,t){return En(e).put(Wd(this.serializer,t))}Pr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.cr(e).next((t=>t.targetCount))}getTargetData(e,t){const n=nn(t),i=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let s=null;return En(e).X({range:i,index:Hh},((a,u,c)=>{const d=wr(u);ni(t,d.target)&&(s=d,c.done())})).next((()=>s))}addMatchingKeys(e,t,n){const i=[],s=gt(e);return t.forEach((a=>{const u=be(a.path);i.push(s.put({targetId:n,path:u})),i.push(this.referenceDelegate.addReference(e,n,a))})),T.waitFor(i)}removeMatchingKeys(e,t,n){const i=gt(e);return T.forEach(t,(s=>{const a=be(s.path);return T.waitFor([i.delete([n,a]),this.referenceDelegate.removeReference(e,n,s)])}))}removeMatchingKeysForTargetId(e,t){const n=gt(e),i=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(i)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),i=gt(e);let s=$();return i.X({range:n,Z:!0},((a,u,c)=>{const d=We(a[1]),p=new x(d);s=s.add(p)})).next((()=>s))}containsKey(e,t){const n=be(t.path),i=IDBKeyRange.bound([n],[Uh(n)],!1,!0);let s=0;return gt(e).X({index:ya,Z:!0,range:i},(([a,u],c,d)=>{a!==0&&(s++,d.done())})).next((()=>s>0))}Et(e,t){return En(e).get(t).next((n=>n?wr(n):null))}}function En(r){return pe(r,xn)}function Il(r){return pe(r,Xt)}function gt(r){return pe(r,On)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const El="LruGarbageCollector",tf=1048576;function vl([r,e],[t,n]){const i=j(r,t);return i===0?j(e,n):i}class AI{constructor(e){this.Tr=e,this.buffer=new te(vl),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();vl(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class nf{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){C(El,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Dt(t)?C(El,"Ignoring IndexedDB error during garbage collection: ",t):await un(t)}await this.Rr(3e5)}))}}class bI{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return T.resolve(Ue.ue);const n=new AI(t);return this.Vr.forEachTarget(e,(i=>n.Er(i.sequenceNumber))).next((()=>this.Vr.gr(e,(i=>n.Er(i))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(C("LruGarbageCollector","Garbage collection skipped; disabled"),T.resolve(yl)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(C("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),yl):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let n,i,s,a,u,c,d;const p=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((m=>(m>this.params.maximumSequenceNumbersToCollect?(C("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),i=this.params.maximumSequenceNumbersToCollect):i=m,a=Date.now(),this.nthSequenceNumber(e,i)))).next((m=>(n=m,u=Date.now(),this.removeTargets(e,n,t)))).next((m=>(s=m,c=Date.now(),this.removeOrphanedDocuments(e,n)))).next((m=>(d=Date.now(),vn()<=G.DEBUG&&C("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-p}ms
	Determined least recently used ${i} in `+(u-a)+`ms
	Removed ${s} targets in `+(c-u)+`ms
	Removed ${m} documents in `+(d-c)+`ms
Total Duration: ${d-p}ms`),T.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:m}))))}}function rf(r,e){return new bI(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RI{constructor(e,t){this.db=e,this.garbageCollector=rf(this,t)}mr(e){const t=this.yr(e);return this.db.getTargetCache().getTargetCount(e).next((n=>t.next((i=>n+i))))}yr(e){let t=0;return this.gr(e,(n=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}gr(e,t){return this.wr(e,((n,i)=>t(i)))}addReference(e,t,n){return ki(e,n)}removeReference(e,t,n){return ki(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return ki(e,t)}Sr(e,t){return(function(i,s){let a=!1;return ef(i).ee((u=>Zd(i,u,s).next((c=>(c&&(a=!0),T.resolve(!c)))))).next((()=>a))})(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),i=[];let s=0;return this.wr(e,((a,u)=>{if(u<=t){const c=this.Sr(e,a).next((d=>{if(!d)return s++,n.getEntry(e,a).next((()=>(n.removeEntry(a,U.min()),gt(e).delete((function(m){return[0,be(m.path)]})(a)))))}));i.push(c)}})).next((()=>T.waitFor(i))).next((()=>n.apply(e))).next((()=>s))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return ki(e,t)}wr(e,t){const n=gt(e);let i,s=Ue.ue;return n.X({index:ya},(([a,u],{path:c,sequenceNumber:d})=>{a===0?(s!==Ue.ue&&t(new x(We(i)),s),s=d,i=c):s=Ue.ue})).next((()=>{s!==Ue.ue&&t(new x(We(i)),s)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function ki(r,e){return gt(r).put((function(n,i){return{targetId:0,path:be(n.path),sequenceNumber:i}})(e,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sf{constructor(){this.changes=new at((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ce.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?T.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SI{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Lt(e).put(n)}removeEntry(e,t,n){return Lt(e).delete((function(s,a){const u=s.path.toArray();return[u.slice(0,u.length-2),u[u.length-2],ds(a),u[u.length-1]]})(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.br(e,n))))}getEntry(e,t){let n=ce.newInvalidDocument(t);return Lt(e).X({index:Ui,range:IDBKeyRange.only(gr(t))},((i,s)=>{n=this.Dr(t,s)})).next((()=>n))}vr(e,t){let n={size:0,document:ce.newInvalidDocument(t)};return Lt(e).X({index:Ui,range:IDBKeyRange.only(gr(t))},((i,s)=>{n={document:this.Dr(t,s),size:ps(s)}})).next((()=>n))}getEntries(e,t){let n=xe();return this.Cr(e,t,((i,s)=>{const a=this.Dr(i,s);n=n.insert(i,a)})).next((()=>n))}Fr(e,t){let n=xe(),i=new oe(x.comparator);return this.Cr(e,t,((s,a)=>{const u=this.Dr(s,a);n=n.insert(s,u),i=i.insert(s,ps(a))})).next((()=>({documents:n,Mr:i})))}Cr(e,t,n){if(t.isEmpty())return T.resolve();let i=new te(Al);t.forEach((c=>i=i.add(c)));const s=IDBKeyRange.bound(gr(i.first()),gr(i.last())),a=i.getIterator();let u=a.getNext();return Lt(e).X({index:Ui,range:s},((c,d,p)=>{const m=x.fromSegments([...d.prefixPath,d.collectionGroup,d.documentId]);for(;u&&Al(u,m)<0;)n(u,null),u=a.getNext();u&&u.isEqual(m)&&(n(u,d),u=a.hasNext()?a.getNext():null),u?p.G(gr(u)):p.done()})).next((()=>{for(;u;)n(u,null),u=a.hasNext()?a.getNext():null}))}getDocumentsMatchingQuery(e,t,n,i,s){const a=t.path,u=[a.popLast().toArray(),a.lastSegment(),ds(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],c=[a.popLast().toArray(),a.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Lt(e).j(IDBKeyRange.bound(u,c,!0)).next((d=>{s==null||s.incrementDocumentReadCount(d.length);let p=xe();for(const m of d){const w=this.Dr(x.fromSegments(m.prefixPath.concat(m.collectionGroup,m.documentId)),m);w.isFoundDocument()&&(ri(t,w)||i.has(w.key))&&(p=p.insert(w.key,w))}return p}))}getAllFromCollectionGroup(e,t,n,i){let s=xe();const a=wl(t,n),u=wl(t,Le.max());return Lt(e).X({index:Wh,range:IDBKeyRange.bound(a,u,!0)},((c,d,p)=>{const m=this.Dr(x.fromSegments(d.prefixPath.concat(d.collectionGroup,d.documentId)),d);s=s.insert(m.key,m),s.size===i&&p.done()})).next((()=>s))}newChangeBuffer(e){return new PI(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return Tl(e).get(Uo).next((t=>(L(!!t,20021),t)))}br(e,t){return Tl(e).put(Uo,t)}Dr(e,t){if(t){const n=fI(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(U.min())))return n}return ce.newInvalidDocument(e)}}function of(r){return new SI(r)}class PI extends sf{constructor(e,t){super(),this.Or=e,this.trackRemovals=t,this.Nr=new at((n=>n.toString()),((n,i)=>n.isEqual(i)))}applyChanges(e){const t=[];let n=0,i=new te(((s,a)=>j(s.canonicalString(),a.canonicalString())));return this.changes.forEach(((s,a)=>{const u=this.Nr.get(s);if(t.push(this.Or.removeEntry(e,s,u.readTime)),a.isValidDocument()){const c=sl(this.Or.serializer,a);i=i.add(s.path.popLast());const d=ps(c);n+=d-u.size,t.push(this.Or.addEntry(e,s,c))}else if(n-=u.size,this.trackRemovals){const c=sl(this.Or.serializer,a.convertToNoDocument(U.min()));t.push(this.Or.addEntry(e,s,c))}})),i.forEach((s=>{t.push(this.Or.indexManager.addToCollectionParentIndex(e,s))})),t.push(this.Or.updateMetadata(e,n)),T.waitFor(t)}getFromCache(e,t){return this.Or.vr(e,t).next((n=>(this.Nr.set(t,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(e,t){return this.Or.Fr(e,t).next((({documents:n,Mr:i})=>(i.forEach(((s,a)=>{this.Nr.set(s,{size:a,readTime:n.get(s).readTime})})),n)))}}function Tl(r){return pe(r,zr)}function Lt(r){return pe(r,is)}function gr(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function wl(r,e){const t=e.documentKey.path.toArray();return[r,ds(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function Al(r,e){const t=r.path.toArray(),n=e.path.toArray();let i=0;for(let s=0;s<t.length-2&&s<n.length-2;++s)if(i=j(t[s],n[s]),i)return i;return i=j(t.length,n.length),i||(i=j(t[t.length-2],n[n.length-2]),i||j(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CI{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class af{constructor(e,t,n,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=i}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((i=>(n=i,this.remoteDocumentCache.getEntry(e,t)))).next((i=>(n!==null&&xr(n.mutation,i,Be.empty(),ee.now()),i)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,$()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=$()){const i=He();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,n).next((s=>{let a=vr();return s.forEach(((u,c)=>{a=a.insert(u,c.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const n=He();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,$())))}populateOverlays(e,t,n){const i=[];return n.forEach((s=>{t.has(s)||i.push(s)})),this.documentOverlayCache.getOverlays(e,i).next((s=>{s.forEach(((a,u)=>{t.set(a,u)}))}))}computeViews(e,t,n,i){let s=xe();const a=Nr(),u=(function(){return Nr()})();return t.forEach(((c,d)=>{const p=n.get(d.key);i.has(d.key)&&(p===void 0||p.mutation instanceof kt)?s=s.insert(d.key,d):p!==void 0?(a.set(d.key,p.mutation.getFieldMask()),xr(p.mutation,d,p.mutation.getFieldMask(),ee.now())):a.set(d.key,Be.empty())})),this.recalculateAndSaveOverlays(e,s).next((c=>(c.forEach(((d,p)=>a.set(d,p))),t.forEach(((d,p)=>{var m;return u.set(d,new CI(p,(m=a.get(d))!==null&&m!==void 0?m:null))})),u)))}recalculateAndSaveOverlays(e,t){const n=Nr();let i=new oe(((a,u)=>a-u)),s=$();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const u of a)u.keys().forEach((c=>{const d=t.get(c);if(d===null)return;let p=n.get(c)||Be.empty();p=u.applyToLocalView(d,p),n.set(c,p);const m=(i.get(u.batchId)||$()).add(c);i=i.insert(u.batchId,m)}))})).next((()=>{const a=[],u=i.getReverseIterator();for(;u.hasNext();){const c=u.getNext(),d=c.key,p=c.value,m=wd();p.forEach((w=>{if(!s.has(w)){const S=Cd(t.get(w),n.get(w));S!==null&&m.set(w,S),s=s.add(w)}})),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return T.waitFor(a)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,i){return(function(a){return x.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Ny(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,i):this.getDocumentsMatchingCollectionQuery(e,t,n,i)}getNextDocuments(e,t,n,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,i).next((s=>{const a=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,i-s.size):T.resolve(He());let u=Ur,c=s;return a.next((d=>T.forEach(d,((p,m)=>(u<m.largestBatchId&&(u=m.largestBatchId),s.get(p)?T.resolve():this.remoteDocumentCache.getEntry(e,p).next((w=>{c=c.insert(p,w)}))))).next((()=>this.populateOverlays(e,d,s))).next((()=>this.computeViews(e,c,d,$()))).next((p=>({batchId:u,changes:Td(p)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new x(t)).next((n=>{let i=vr();return n.isFoundDocument()&&(i=i.insert(n.key,n)),i}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,i){const s=t.collectionGroup;let a=vr();return this.indexManager.getCollectionParents(e,s).next((u=>T.forEach(u,(c=>{const d=(function(m,w){return new ks(w,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)})(t,c.child(s));return this.getDocumentsMatchingCollectionQuery(e,d,n,i).next((p=>{p.forEach(((m,w)=>{a=a.insert(m,w)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,n,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((a=>(s=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,s,i)))).next((a=>{s.forEach(((c,d)=>{const p=d.getKey();a.get(p)===null&&(a=a.insert(p,ce.newInvalidDocument(p)))}));let u=vr();return a.forEach(((c,d)=>{const p=s.get(c);p!==void 0&&xr(p.mutation,d,Be.empty(),ee.now()),ri(t,d)&&(u=u.insert(c,d))})),u}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VI{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return T.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(i){return{id:i.id,version:i.version,createTime:Ve(i.createTime)}})(t)),T.resolve()}getNamedQuery(e,t){return T.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(i){return{name:i.name,query:Hd(i.bundledQuery),readTime:Ve(i.readTime)}})(t)),T.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DI{constructor(){this.overlays=new oe(x.comparator),this.kr=new Map}getOverlay(e,t){return T.resolve(this.overlays.get(t))}getOverlays(e,t){const n=He();return T.forEach(t,(i=>this.getOverlay(e,i).next((s=>{s!==null&&n.set(i,s)})))).next((()=>n))}saveOverlays(e,t,n){return n.forEach(((i,s)=>{this.wt(e,t,s)})),T.resolve()}removeOverlaysForBatchId(e,t,n){const i=this.kr.get(n);return i!==void 0&&(i.forEach((s=>this.overlays=this.overlays.remove(s))),this.kr.delete(n)),T.resolve()}getOverlaysForCollection(e,t,n){const i=He(),s=t.length+1,a=new x(t.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const c=u.getNext().value,d=c.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===s&&c.largestBatchId>n&&i.set(c.getKey(),c)}return T.resolve(i)}getOverlaysForCollectionGroup(e,t,n,i){let s=new oe(((d,p)=>d-p));const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>n){let p=s.get(d.largestBatchId);p===null&&(p=He(),s=s.insert(d.largestBatchId,p)),p.set(d.getKey(),d)}}const u=He(),c=s.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach(((d,p)=>u.set(d,p))),!(u.size()>=i)););return T.resolve(u)}wt(e,t,n){const i=this.overlays.get(n.key);if(i!==null){const a=this.kr.get(i.largestBatchId).delete(n.key);this.kr.set(i.largestBatchId,a)}this.overlays=this.overlays.insert(n.key,new Da(t,n));let s=this.kr.get(t);s===void 0&&(s=$(),this.kr.set(t,s)),this.kr.set(t,s.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kI{constructor(){this.sessionToken=de.EMPTY_BYTE_STRING}getSessionToken(e){return T.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,T.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ma{constructor(){this.qr=new te(me.Qr),this.$r=new te(me.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const n=new me(e,t);this.qr=this.qr.add(n),this.$r=this.$r.add(n)}Kr(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.Wr(new me(e,t))}Gr(e,t){e.forEach((n=>this.removeReference(n,t)))}zr(e){const t=new x(new Y([])),n=new me(t,e),i=new me(t,e+1),s=[];return this.$r.forEachInRange([n,i],(a=>{this.Wr(a),s.push(a.key)})),s}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new x(new Y([])),n=new me(t,e),i=new me(t,e+1);let s=$();return this.$r.forEachInRange([n,i],(a=>{s=s.add(a.key)})),s}containsKey(e){const t=new me(e,0),n=this.qr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class me{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return x.comparator(e.key,t.key)||j(e.Hr,t.Hr)}static Ur(e,t){return j(e.Hr,t.Hr)||x.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NI{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new te(me.Qr)}checkEmpty(e){return T.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,i){const s=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Ca(s,t,n,i);this.mutationQueue.push(a);for(const u of i)this.Yr=this.Yr.add(new me(u.key,s)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return T.resolve(a)}lookupMutationBatch(e,t){return T.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,i=this.Xr(n),s=i<0?0:i;return T.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return T.resolve(this.mutationQueue.length===0?Qt:this.er-1)}getAllMutationBatches(e){return T.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new me(t,0),i=new me(t,Number.POSITIVE_INFINITY),s=[];return this.Yr.forEachInRange([n,i],(a=>{const u=this.Zr(a.Hr);s.push(u)})),T.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new te(j);return t.forEach((i=>{const s=new me(i,0),a=new me(i,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([s,a],(u=>{n=n.add(u.Hr)}))})),T.resolve(this.ei(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,i=n.length+1;let s=n;x.isDocumentKey(s)||(s=s.child(""));const a=new me(new x(s),0);let u=new te(j);return this.Yr.forEachWhile((c=>{const d=c.key.path;return!!n.isPrefixOf(d)&&(d.length===i&&(u=u.add(c.Hr)),!0)}),a),T.resolve(this.ei(u))}ei(e){const t=[];return e.forEach((n=>{const i=this.Zr(n);i!==null&&t.push(i)})),t}removeMutationBatch(e,t){L(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Yr;return T.forEach(t.mutations,(i=>{const s=new me(i.key,t.batchId);return n=n.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)})).next((()=>{this.Yr=n}))}rr(e){}containsKey(e,t){const n=new me(t,0),i=this.Yr.firstAfterOrEqual(n);return T.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,T.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xI{constructor(e){this.ni=e,this.docs=(function(){return new oe(x.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,i=this.docs.get(n),s=i?i.size:0,a=this.ni(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:a}),this.size+=a-s,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return T.resolve(n?n.document.mutableCopy():ce.newInvalidDocument(t))}getEntries(e,t){let n=xe();return t.forEach((i=>{const s=this.docs.get(i);n=n.insert(i,s?s.document.mutableCopy():ce.newInvalidDocument(i))})),T.resolve(n)}getDocumentsMatchingQuery(e,t,n,i){let s=xe();const a=t.path,u=new x(a.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(u);for(;c.hasNext();){const{key:d,value:{document:p}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||ga(qh(p),n)<=0||(i.has(p.key)||ri(t,p))&&(s=s.insert(p.key,p.mutableCopy()))}return T.resolve(s)}getAllFromCollectionGroup(e,t,n,i){M(9500)}ri(e,t){return T.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new OI(this)}getSize(e){return T.resolve(this.size)}}class OI extends sf{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((n,i)=>{i.isValidDocument()?t.push(this.Or.addEntry(e,i)):this.Or.removeEntry(n)})),T.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MI{constructor(e){this.persistence=e,this.ii=new at((t=>nn(t)),ni),this.lastRemoteSnapshotVersion=U.min(),this.highestTargetId=0,this.si=0,this.oi=new Ma,this.targetCount=0,this._i=on.ar()}forEachTarget(e,t){return this.ii.forEach(((n,i)=>t(i))),T.resolve()}getLastRemoteSnapshotVersion(e){return T.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return T.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),T.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.si&&(this.si=t),T.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new on(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,T.resolve()}updateTargetData(e,t){return this.hr(t),T.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,T.resolve()}removeTargets(e,t,n){let i=0;const s=[];return this.ii.forEach(((a,u)=>{u.sequenceNumber<=t&&n.get(u.targetId)===null&&(this.ii.delete(a),s.push(this.removeMatchingKeysForTargetId(e,u.targetId)),i++)})),T.waitFor(s).next((()=>i))}getTargetCount(e){return T.resolve(this.targetCount)}getTargetData(e,t){const n=this.ii.get(t)||null;return T.resolve(n)}addMatchingKeys(e,t,n){return this.oi.Kr(t,n),T.resolve()}removeMatchingKeys(e,t,n){this.oi.Gr(t,n);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach((a=>{s.push(i.markPotentiallyOrphaned(e,a))})),T.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),T.resolve()}getMatchingKeysForTargetId(e,t){const n=this.oi.Jr(t);return T.resolve(n)}containsKey(e,t){return T.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class La{constructor(e,t){this.ai={},this.overlays={},this.ui=new Ue(0),this.ci=!1,this.ci=!0,this.li=new kI,this.referenceDelegate=e(this),this.hi=new MI(this),this.indexManager=new vI,this.remoteDocumentCache=(function(i){return new xI(i)})((n=>this.referenceDelegate.Pi(n))),this.serializer=new Gd(t),this.Ti=new VI(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new DI,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ai[e.toKey()];return n||(n=new NI(t,this.referenceDelegate),this.ai[e.toKey()]=n),n}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,n){C("MemoryPersistence","Starting transaction:",e);const i=new LI(this.ui.next());return this.referenceDelegate.Ii(),n(i).next((s=>this.referenceDelegate.di(i).next((()=>s)))).toPromise().then((s=>(i.raiseOnCommittedEvent(),s)))}Ei(e,t){return T.or(Object.values(this.ai).map((n=>()=>n.containsKey(e,t))))}}class LI extends $h{constructor(e){super(),this.currentSequenceNumber=e}}class Bs{constructor(e){this.persistence=e,this.Ai=new Ma,this.Ri=null}static Vi(e){return new Bs(e)}get mi(){if(this.Ri)return this.Ri;throw M(60996)}addReference(e,t,n){return this.Ai.addReference(n,t),this.mi.delete(n.toString()),T.resolve()}removeReference(e,t,n){return this.Ai.removeReference(n,t),this.mi.add(n.toString()),T.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),T.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((i=>this.mi.add(i.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((i=>{i.forEach((s=>this.mi.add(s.toString())))})).next((()=>n.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return T.forEach(this.mi,(n=>{const i=x.fromPath(n);return this.fi(e,i).next((s=>{s||t.removeEntry(i,U.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((n=>{n?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return T.or([()=>T.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class ms{constructor(e,t){this.persistence=e,this.gi=new at((n=>be(n.path)),((n,i)=>n.isEqual(i))),this.garbageCollector=rf(this,t)}static Vi(e,t){return new ms(e,t)}Ii(){}di(e){return T.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((i=>n+i))))}yr(e){let t=0;return this.gr(e,(n=>{t++})).next((()=>t))}gr(e,t){return T.forEach(this.gi,((n,i)=>this.Sr(e,n,i).next((s=>s?T.resolve():t(i)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.ri(e,(a=>this.Sr(e,a,t).next((u=>{u||(n++,s.removeEntry(a,U.min()))})))).next((()=>s.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),T.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.gi.set(n,e.currentSequenceNumber),T.resolve()}removeReference(e,t,n){return this.gi.set(n,e.currentSequenceNumber),T.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),T.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ji(e.data.value)),t}Sr(e,t,n){return T.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.gi.get(t);return T.resolve(i!==void 0&&i>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FI{constructor(e){this.serializer=e}q(e,t,n,i){const s=new bs("createOrUpgrade",t);n<1&&i>=1&&((function(c){c.createObjectStore(ti)})(e),(function(c){c.createObjectStore(qr,{keyPath:Q_}),c.createObjectStore(ze,{keyPath:Oc,autoIncrement:!0}).createIndex(Gt,Mc,{unique:!0}),c.createObjectStore(Nn)})(e),bl(e),(function(c){c.createObjectStore(Bt)})(e));let a=T.resolve();return n<3&&i>=3&&(n!==0&&((function(c){c.deleteObjectStore(On),c.deleteObjectStore(xn),c.deleteObjectStore(Xt)})(e),bl(e)),a=a.next((()=>(function(c){const d=c.store(Xt),p={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:U.min().toTimestamp(),targetCount:0};return d.put(ss,p)})(s)))),n<4&&i>=4&&(n!==0&&(a=a.next((()=>(function(c,d){return d.store(ze).j().next((m=>{c.deleteObjectStore(ze),c.createObjectStore(ze,{keyPath:Oc,autoIncrement:!0}).createIndex(Gt,Mc,{unique:!0});const w=d.store(ze),S=m.map((V=>w.put(V)));return T.waitFor(S)}))})(e,s)))),a=a.next((()=>{(function(c){c.createObjectStore(Mn,{keyPath:iy})})(e)}))),n<5&&i>=5&&(a=a.next((()=>this.pi(s)))),n<6&&i>=6&&(a=a.next((()=>((function(c){c.createObjectStore(zr)})(e),this.yi(s))))),n<7&&i>=7&&(a=a.next((()=>this.wi(s)))),n<8&&i>=8&&(a=a.next((()=>this.Si(e,s)))),n<9&&i>=9&&(a=a.next((()=>{(function(c){c.objectStoreNames.contains("remoteDocumentChanges")&&c.deleteObjectStore("remoteDocumentChanges")})(e)}))),n<10&&i>=10&&(a=a.next((()=>this.bi(s)))),n<11&&i>=11&&(a=a.next((()=>{(function(c){c.createObjectStore(Ss,{keyPath:sy})})(e),(function(c){c.createObjectStore(Ps,{keyPath:oy})})(e)}))),n<12&&i>=12&&(a=a.next((()=>{(function(c){const d=c.createObjectStore(Cs,{keyPath:fy});d.createIndex(jo,py,{unique:!1}),d.createIndex(Jh,my,{unique:!1})})(e)}))),n<13&&i>=13&&(a=a.next((()=>(function(c){const d=c.createObjectStore(is,{keyPath:J_});d.createIndex(Ui,Y_),d.createIndex(Wh,Z_)})(e))).next((()=>this.Di(e,s))).next((()=>e.deleteObjectStore(Bt)))),n<14&&i>=14&&(a=a.next((()=>this.Ci(e,s)))),n<15&&i>=15&&(a=a.next((()=>(function(c){c.createObjectStore(Ia,{keyPath:ay,autoIncrement:!0}).createIndex(Bo,uy,{unique:!1}),c.createObjectStore(Cr,{keyPath:cy}).createIndex(Qh,ly,{unique:!1}),c.createObjectStore(Vr,{keyPath:hy}).createIndex(Xh,dy,{unique:!1})})(e)))),n<16&&i>=16&&(a=a.next((()=>{t.objectStore(Cr).clear()})).next((()=>{t.objectStore(Vr).clear()}))),n<17&&i>=17&&(a=a.next((()=>{(function(c){c.createObjectStore(Ea,{keyPath:gy})})(e)}))),n<18&&i>=18&&eh()&&(a=a.next((()=>{t.objectStore(Cr).clear()})).next((()=>{t.objectStore(Vr).clear()}))),a}yi(e){let t=0;return e.store(Bt).X(((n,i)=>{t+=ps(i)})).next((()=>{const n={byteSize:t};return e.store(zr).put(Uo,n)}))}pi(e){const t=e.store(qr),n=e.store(ze);return t.j().next((i=>T.forEach(i,(s=>{const a=IDBKeyRange.bound([s.userId,Qt],[s.userId,s.lastAcknowledgedBatchId]);return n.j(Gt,a).next((u=>T.forEach(u,(c=>{L(c.userId===s.userId,18650,"Cannot process batch from unexpected user",{batchId:c.batchId});const d=qt(this.serializer,c);return Yd(e,s.userId,d).next((()=>{}))}))))}))))}wi(e){const t=e.store(On),n=e.store(Bt);return e.store(Xt).get(ss).next((i=>{const s=[];return n.X(((a,u)=>{const c=new Y(a),d=(function(m){return[0,be(m)]})(c);s.push(t.get(d).next((p=>p?T.resolve():(m=>t.put({targetId:0,path:be(m),sequenceNumber:i.highestListenSequenceNumber}))(c))))})).next((()=>T.waitFor(s)))}))}Si(e,t){e.createObjectStore($r,{keyPath:ry});const n=t.store($r),i=new Oa,s=a=>{if(i.add(a)){const u=a.lastSegment(),c=a.popLast();return n.put({collectionId:u,parent:be(c)})}};return t.store(Bt).X({Z:!0},((a,u)=>{const c=new Y(a);return s(c.popLast())})).next((()=>t.store(Nn).X({Z:!0},(([a,u,c],d)=>{const p=We(u);return s(p.popLast())}))))}bi(e){const t=e.store(xn);return t.X(((n,i)=>{const s=wr(i),a=Wd(this.serializer,s);return t.put(a)}))}Di(e,t){const n=t.store(Bt),i=[];return n.X(((s,a)=>{const u=t.store(is),c=(function(m){return m.document?new x(Y.fromString(m.document.name).popFirst(5)):m.noDocument?x.fromSegments(m.noDocument.path):m.unknownDocument?x.fromSegments(m.unknownDocument.path):M(36783)})(a).path.toArray(),d={prefixPath:c.slice(0,c.length-2),collectionGroup:c[c.length-2],documentId:c[c.length-1],readTime:a.readTime||[0,0],unknownDocument:a.unknownDocument,noDocument:a.noDocument,document:a.document,hasCommittedMutations:!!a.hasCommittedMutations};i.push(u.put(d))})).next((()=>T.waitFor(i)))}Ci(e,t){const n=t.store(ze),i=of(this.serializer),s=new La(Bs.Vi,this.serializer.gt);return n.j().next((a=>{const u=new Map;return a.forEach((c=>{var d;let p=(d=u.get(c.userId))!==null&&d!==void 0?d:$();qt(this.serializer,c).keys().forEach((m=>p=p.add(m))),u.set(c.userId,p)})),T.forEach(u,((c,d)=>{const p=new Pe(d),m=Fs.yt(this.serializer,p),w=s.getIndexManager(p),S=Us.yt(p,this.serializer,w,s.referenceDelegate);return new af(i,S,m,w).recalculateAndSaveOverlaysForDocumentKeys(new qo(t,Ue.ue),c).next()}))}))}}function bl(r){r.createObjectStore(On,{keyPath:ty}).createIndex(ya,ny,{unique:!0}),r.createObjectStore(xn,{keyPath:"targetId"}).createIndex(Hh,ey,{unique:!0}),r.createObjectStore(Xt)}const mt="IndexedDbPersistence",wo=18e5,Ao=5e3,bo="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",UI="main";class Fa{constructor(e,t,n,i,s,a,u,c,d,p,m=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Fi=s,this.window=a,this.document=u,this.Mi=d,this.xi=p,this.Oi=m,this.ui=null,this.ci=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Ni=null,this.inForeground=!1,this.Bi=null,this.Li=null,this.ki=Number.NEGATIVE_INFINITY,this.qi=w=>Promise.resolve(),!Fa.C())throw new O(P.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new RI(this,i),this.Qi=t+UI,this.serializer=new Gd(c),this.$i=new Tt(this.Qi,this.Oi,new FI(this.serializer)),this.li=new mI,this.hi=new wI(this.referenceDelegate,this.serializer),this.remoteDocumentCache=of(this.serializer),this.Ti=new pI,this.window&&this.window.localStorage?this.Ui=this.window.localStorage:(this.Ui=null,p===!1&&Ce(mt,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Ki().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new O(P.FAILED_PRECONDITION,bo);return this.Wi(),this.Gi(),this.zi(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.hi.getHighestSequenceNumber(e)))})).then((e=>{this.ui=new Ue(e,this.Mi)})).then((()=>{this.ci=!0})).catch((e=>(this.$i&&this.$i.close(),Promise.reject(e))))}ji(e){return this.qi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.$i.setDatabaseDeletedListener(e)}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Fi.enqueueAndForget((async()=>{this.started&&await this.Ki()})))}Ki(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>Ni(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.Ji(e).next((t=>{t||(this.isPrimary=!1,this.Fi.enqueueRetryable((()=>this.qi(!1))))}))})).next((()=>this.Hi(e))).next((t=>this.isPrimary&&!t?this.Yi(e).next((()=>!1)):!!t&&this.Zi(e).next((()=>!0)))))).catch((e=>{if(Dt(e))return C(mt,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return C(mt,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.Fi.enqueueRetryable((()=>this.qi(e))),this.isPrimary=e}))}Ji(e){return _r(e).get(mn).next((t=>T.resolve(this.Xi(t))))}es(e){return Ni(e).delete(this.clientId)}async ts(){if(this.isPrimary&&!this.ns(this.ki,wo)){this.ki=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const n=pe(t,Mn);return n.j().next((i=>{const s=this.rs(i,wo),a=i.filter((u=>s.indexOf(u)===-1));return T.forEach(a,(u=>n.delete(u.clientId))).next((()=>a))}))})).catch((()=>[]));if(this.Ui)for(const t of e)this.Ui.removeItem(this.ss(t.clientId))}}zi(){this.Li=this.Fi.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.Ki().then((()=>this.ts())).then((()=>this.zi()))))}Xi(e){return!!e&&e.ownerId===this.clientId}Hi(e){return this.xi?T.resolve(!0):_r(e).get(mn).next((t=>{if(t!==null&&this.ns(t.leaseTimestampMs,Ao)&&!this._s(t.ownerId)){if(this.Xi(t)&&this.networkEnabled)return!0;if(!this.Xi(t)){if(!t.allowTabSynchronization)throw new O(P.FAILED_PRECONDITION,bo);return!1}}return!(!this.networkEnabled||!this.inForeground)||Ni(e).j().next((n=>this.rs(n,Ao).find((i=>{if(this.clientId!==i.clientId){const s=!this.networkEnabled&&i.networkEnabled,a=!this.inForeground&&i.inForeground,u=this.networkEnabled===i.networkEnabled;if(s||a&&u)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&C(mt,`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.ci=!1,this.us(),this.Li&&(this.Li.cancel(),this.Li=null),this.cs(),this.ls(),await this.$i.runTransaction("shutdown","readwrite",[ti,Mn],(e=>{const t=new qo(e,Ue.ue);return this.Yi(t).next((()=>this.es(t)))})),this.$i.close(),this.hs()}rs(e,t){return e.filter((n=>this.ns(n.updateTimeMs,t)&&!this._s(n.clientId)))}Ps(){return this.runTransaction("getActiveClients","readonly",(e=>Ni(e).j().next((t=>this.rs(t,wo).map((n=>n.clientId))))))}get started(){return this.ci}getGlobalsCache(){return this.li}getMutationQueue(e,t){return Us.yt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new TI(e,this.serializer.gt.databaseId)}getDocumentOverlayCache(e){return Fs.yt(this.serializer,e)}getBundleCache(){return this.Ti}runTransaction(e,t,n){C(mt,"Starting transaction:",e);const i=t==="readonly"?"readonly":"readwrite",s=(function(c){return c===18?Iy:c===17?td:c===16?yy:c===15?va:c===14?ed:c===13?Zh:c===12?_y:c===11?Yh:void M(60245)})(this.Oi);let a;return this.$i.runTransaction(e,i,s,(u=>(a=new qo(u,this.ui?this.ui.next():Ue.ue),t==="readwrite-primary"?this.Ji(a).next((c=>!!c||this.Hi(a))).next((c=>{if(!c)throw Ce(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Fi.enqueueRetryable((()=>this.qi(!1))),new O(P.FAILED_PRECONDITION,zh);return n(a)})).next((c=>this.Zi(a).next((()=>c)))):this.Ts(a).next((()=>n(a)))))).then((u=>(a.raiseOnCommittedEvent(),u)))}Ts(e){return _r(e).get(mn).next((t=>{if(t!==null&&this.ns(t.leaseTimestampMs,Ao)&&!this._s(t.ownerId)&&!this.Xi(t)&&!(this.xi||this.allowTabSynchronization&&t.allowTabSynchronization))throw new O(P.FAILED_PRECONDITION,bo)}))}Zi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return _r(e).put(mn,t)}static C(){return Tt.C()}Yi(e){const t=_r(e);return t.get(mn).next((n=>this.Xi(n)?(C(mt,"Releasing primary lease."),t.delete(mn)):T.resolve()))}ns(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(Ce(`Detected an update time that is in the future: ${e} > ${n}`),!1))}Wi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Bi=()=>{this.Fi.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.Ki())))},this.document.addEventListener("visibilitychange",this.Bi),this.inForeground=this.document.visibilityState==="visible")}cs(){this.Bi&&(this.document.removeEventListener("visibilitychange",this.Bi),this.Bi=null)}Gi(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.Ni=()=>{this.us();const t=/(?:Version|Mobile)\/1[456]/;Zl()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.Fi.enterRestrictedMode(!0),this.Fi.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.Ni))}ls(){this.Ni&&(this.window.removeEventListener("pagehide",this.Ni),this.Ni=null)}_s(e){var t;try{const n=((t=this.Ui)===null||t===void 0?void 0:t.getItem(this.ss(e)))!==null;return C(mt,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return Ce(mt,"Failed to get zombied client id.",n),!1}}us(){if(this.Ui)try{this.Ui.setItem(this.ss(this.clientId),String(Date.now()))}catch(e){Ce("Failed to set zombie client id.",e)}}hs(){if(this.Ui)try{this.Ui.removeItem(this.ss(this.clientId))}catch{}}ss(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function _r(r){return pe(r,ti)}function Ni(r){return pe(r,Mn)}function BI(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ua{constructor(e,t,n,i){this.targetId=e,this.fromCache=t,this.Is=n,this.ds=i}static Es(e,t){let n=$(),i=$();for(const s of t.docChanges)switch(s.type){case 0:n=n.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new Ua(e,t.fromCache,n,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jI{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uf{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return Zl()?8:Kh(ye())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,n,i){const s={result:null};return this.ps(e,t).next((a=>{s.result=a})).next((()=>{if(!s.result)return this.ys(e,t,i,n).next((a=>{s.result=a}))})).next((()=>{if(s.result)return;const a=new jI;return this.ws(e,t,a).next((u=>{if(s.result=u,this.Rs)return this.Ss(e,t,a,u.size)}))})).next((()=>s.result))}Ss(e,t,n,i){return n.documentReadCount<this.Vs?(vn()<=G.DEBUG&&C("QueryEngine","SDK will not create cache indexes for query:",Tn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),T.resolve()):(vn()<=G.DEBUG&&C("QueryEngine","Query:",Tn(t),"scans",n.documentReadCount,"local documents and returns",i,"documents as results."),n.documentReadCount>this.fs*i?(vn()<=G.DEBUG&&C("QueryEngine","The SDK decides to create cache indexes for query:",Tn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,je(t))):T.resolve())}ps(e,t){if(Qc(t))return T.resolve(null);let n=je(t);return this.indexManager.getIndexType(e,n).next((i=>i===0?null:(t.limit!==null&&i===1&&(t=Ho(t,null,"F"),n=je(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next((s=>{const a=$(...s);return this.gs.getDocuments(e,a).next((u=>this.indexManager.getMinOffset(e,n).next((c=>{const d=this.bs(t,u);return this.Ds(t,d,a,c.readTime)?this.ps(e,Ho(t,null,"F")):this.vs(e,d,t,c)}))))})))))}ys(e,t,n,i){return Qc(t)||i.isEqual(U.min())?T.resolve(null):this.gs.getDocuments(e,n).next((s=>{const a=this.bs(t,s);return this.Ds(t,a,n,i)?T.resolve(null):(vn()<=G.DEBUG&&C("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),Tn(t)),this.vs(e,a,t,q_(i,Ur)).next((u=>u)))}))}bs(e,t){let n=new te(Ed(e));return t.forEach(((i,s)=>{ri(e,s)&&(n=n.add(s))})),n}Ds(e,t,n,i){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}ws(e,t,n){return vn()<=G.DEBUG&&C("QueryEngine","Using full collection scan to execute query:",Tn(t)),this.gs.getDocumentsMatchingQuery(e,t,Le.min(),n)}vs(e,t,n,i){return this.gs.getDocumentsMatchingQuery(e,n,i).next((s=>(t.forEach((a=>{s=s.insert(a.key,a)})),s)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ba="LocalStore",qI=3e8;class zI{constructor(e,t,n,i){this.persistence=e,this.Cs=t,this.serializer=i,this.Fs=new oe(j),this.Ms=new at((s=>nn(s)),ni),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(n)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new af(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function cf(r,e,t,n){return new zI(r,e,t,n)}async function lf(r,e){const t=q(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let i;return t.mutationQueue.getAllMutationBatches(n).next((s=>(i=s,t.Ns(e),t.mutationQueue.getAllMutationBatches(n)))).next((s=>{const a=[],u=[];let c=$();for(const d of i){a.push(d.batchId);for(const p of d.mutations)c=c.add(p.key)}for(const d of s){u.push(d.batchId);for(const p of d.mutations)c=c.add(p.key)}return t.localDocuments.getDocuments(n,c).next((d=>({Bs:d,removedBatchIds:a,addedBatchIds:u})))}))}))}function $I(r,e){const t=q(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const i=e.batch.keys(),s=t.Os.newChangeBuffer({trackRemovals:!0});return(function(u,c,d,p){const m=d.batch,w=m.keys();let S=T.resolve();return w.forEach((V=>{S=S.next((()=>p.getEntry(c,V))).next((N=>{const D=d.docVersions.get(V);L(D!==null,48541),N.version.compareTo(D)<0&&(m.applyToRemoteDocument(N,d),N.isValidDocument()&&(N.setReadTime(d.commitVersion),p.addEntry(N)))}))})),S.next((()=>u.mutationQueue.removeMutationBatch(c,m)))})(t,n,e,s).next((()=>s.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,i,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(u){let c=$();for(let d=0;d<u.mutationResults.length;++d)u.mutationResults[d].transformResults.length>0&&(c=c.add(u.batch.mutations[d].key));return c})(e)))).next((()=>t.localDocuments.getDocuments(n,i)))}))}function hf(r){const e=q(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function KI(r,e){const t=q(r),n=e.snapshotVersion;let i=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(s=>{const a=t.Os.newChangeBuffer({trackRemovals:!0});i=t.Fs;const u=[];e.targetChanges.forEach(((p,m)=>{const w=i.get(m);if(!w)return;u.push(t.hi.removeMatchingKeys(s,p.removedDocuments,m).next((()=>t.hi.addMatchingKeys(s,p.addedDocuments,m))));let S=w.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(m)!==null?S=S.withResumeToken(de.EMPTY_BYTE_STRING,U.min()).withLastLimboFreeSnapshotVersion(U.min()):p.resumeToken.approximateByteSize()>0&&(S=S.withResumeToken(p.resumeToken,n)),i=i.insert(m,S),(function(N,D,z){return N.resumeToken.approximateByteSize()===0||D.snapshotVersion.toMicroseconds()-N.snapshotVersion.toMicroseconds()>=qI?!0:z.addedDocuments.size+z.modifiedDocuments.size+z.removedDocuments.size>0})(w,S,p)&&u.push(t.hi.updateTargetData(s,S))}));let c=xe(),d=$();if(e.documentUpdates.forEach((p=>{e.resolvedLimboDocuments.has(p)&&u.push(t.persistence.referenceDelegate.updateLimboDocument(s,p))})),u.push(GI(s,a,e.documentUpdates).next((p=>{c=p.Ls,d=p.ks}))),!n.isEqual(U.min())){const p=t.hi.getLastRemoteSnapshotVersion(s).next((m=>t.hi.setTargetsMetadata(s,s.currentSequenceNumber,n)));u.push(p)}return T.waitFor(u).next((()=>a.apply(s))).next((()=>t.localDocuments.getLocalViewOfDocuments(s,c,d))).next((()=>c))})).then((s=>(t.Fs=i,s)))}function GI(r,e,t){let n=$(),i=$();return t.forEach((s=>n=n.add(s))),e.getEntries(r,n).next((s=>{let a=xe();return t.forEach(((u,c)=>{const d=s.get(u);c.isFoundDocument()!==d.isFoundDocument()&&(i=i.add(u)),c.isNoDocument()&&c.version.isEqual(U.min())?(e.removeEntry(u,c.readTime),a=a.insert(u,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),a=a.insert(u,c)):C(Ba,"Ignoring outdated watch update for ",u,". Current version:",d.version," Watch version:",c.version)})),{Ls:a,ks:i}}))}function WI(r,e){const t=q(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=Qt),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function HI(r,e){const t=q(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let i;return t.hi.getTargetData(n,e).next((s=>s?(i=s,T.resolve(i)):t.hi.allocateTargetId(n).next((a=>(i=new nt(e,a,"TargetPurposeListen",n.currentSequenceNumber),t.hi.addTargetData(n,i).next((()=>i)))))))})).then((n=>{const i=t.Fs.get(n.targetId);return(i===null||n.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(n.targetId,n),t.Ms.set(e,n.targetId)),n}))}async function na(r,e,t){const n=q(r),i=n.Fs.get(e),s=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",s,(a=>n.persistence.referenceDelegate.removeTarget(a,i)))}catch(a){if(!Dt(a))throw a;C(Ba,`Failed to update sequence numbers for target ${e}: ${a}`)}n.Fs=n.Fs.remove(e),n.Ms.delete(i.target)}function Rl(r,e,t){const n=q(r);let i=U.min(),s=$();return n.persistence.runTransaction("Execute query","readwrite",(a=>(function(c,d,p){const m=q(c),w=m.Ms.get(p);return w!==void 0?T.resolve(m.Fs.get(w)):m.hi.getTargetData(d,p)})(n,a,je(e)).next((u=>{if(u)return i=u.lastLimboFreeSnapshotVersion,n.hi.getMatchingKeysForTargetId(a,u.targetId).next((c=>{s=c}))})).next((()=>n.Cs.getDocumentsMatchingQuery(a,e,t?i:U.min(),t?s:$()))).next((u=>(QI(n,Oy(e),u),{documents:u,qs:s})))))}function QI(r,e,t){let n=r.xs.get(e)||U.min();t.forEach(((i,s)=>{s.readTime.compareTo(n)>0&&(n=s.readTime)})),r.xs.set(e,n)}class Sl{constructor(){this.activeTargetIds=jy()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class df{constructor(){this.Fo=new Sl,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,n){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Sl,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XI{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pl="ConnectivityMonitor";class Cl{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){C(Pl,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){C(Pl,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xi=null;function ra(){return xi===null?xi=(function(){return 268435456+Math.round(2147483648*Math.random())})():xi++,"0x"+xi.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ro="RestConnection",JI={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class YI{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${n}/databases/${i}`,this.Ko=this.databaseId.database===os?`project_id=${n}`:`project_id=${n}&database_id=${i}`}Wo(e,t,n,i,s){const a=ra(),u=this.Go(e,t.toUriEncodedString());C(Ro,`Sending RPC '${e}' ${a}:`,u,n);const c={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(c,i,s);const{host:d}=new URL(u),p=Es(d);return this.jo(e,u,c,n,p).then((m=>(C(Ro,`Received RPC '${e}' ${a}: `,m),m)),(m=>{throw At(Ro,`RPC '${e}' ${a} failed with error: `,m,"url: ",u,"request:",n),m}))}Jo(e,t,n,i,s,a){return this.Wo(e,t,n,i,s)}zo(e,t,n){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Wn})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((i,s)=>e[s]=i)),n&&n.headers.forEach(((i,s)=>e[s]=i))}Go(e,t){const n=JI[e];return`${this.$o}/v1/${t}:${n}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZI{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const we="WebChannelConnection";class eE extends YI{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,n,i,s){const a=ra();return new Promise(((u,c)=>{const d=new kh;d.setWithCredentials(!0),d.listenOnce(Nh.COMPLETE,(()=>{try{switch(d.getLastErrorCode()){case Mi.NO_ERROR:const m=d.getResponseJson();C(we,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(m)),u(m);break;case Mi.TIMEOUT:C(we,`RPC '${e}' ${a} timed out`),c(new O(P.DEADLINE_EXCEEDED,"Request time out"));break;case Mi.HTTP_ERROR:const w=d.getStatus();if(C(we,`RPC '${e}' ${a} failed with status:`,w,"response text:",d.getResponseText()),w>0){let S=d.getResponseJson();Array.isArray(S)&&(S=S[0]);const V=S==null?void 0:S.error;if(V&&V.status&&V.message){const N=(function(z){const B=z.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(B)>=0?B:P.UNKNOWN})(V.status);c(new O(N,V.message))}else c(new O(P.UNKNOWN,"Server responded with status "+d.getStatus()))}else c(new O(P.UNAVAILABLE,"Connection failed."));break;default:M(9055,{c_:e,streamId:a,l_:d.getLastErrorCode(),h_:d.getLastError()})}}finally{C(we,`RPC '${e}' ${a} completed.`)}}));const p=JSON.stringify(i);C(we,`RPC '${e}' ${a} sending request:`,i),d.send(t,"POST",p,n,15)}))}P_(e,t,n){const i=ra(),s=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Mh(),u=Oh(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.zo(c.initMessageHeaders,t,n),c.encodeInitMessageHeaders=!0;const p=s.join("");C(we,`Creating RPC '${e}' stream ${i}: ${p}`,c);const m=a.createWebChannel(p,c);this.T_(m);let w=!1,S=!1;const V=new ZI({Ho:D=>{S?C(we,`Not sending because RPC '${e}' stream ${i} is closed:`,D):(w||(C(we,`Opening RPC '${e}' stream ${i} transport.`),m.open(),w=!0),C(we,`RPC '${e}' stream ${i} sending:`,D),m.send(D))},Yo:()=>m.close()}),N=(D,z,B)=>{D.listen(z,(F=>{try{B(F)}catch(H){setTimeout((()=>{throw H}),0)}}))};return N(m,Er.EventType.OPEN,(()=>{S||(C(we,`RPC '${e}' stream ${i} transport opened.`),V.s_())})),N(m,Er.EventType.CLOSE,(()=>{S||(S=!0,C(we,`RPC '${e}' stream ${i} transport closed`),V.__(),this.I_(m))})),N(m,Er.EventType.ERROR,(D=>{S||(S=!0,At(we,`RPC '${e}' stream ${i} transport errored. Name:`,D.name,"Message:",D.message),V.__(new O(P.UNAVAILABLE,"The operation could not be completed")))})),N(m,Er.EventType.MESSAGE,(D=>{var z;if(!S){const B=D.data[0];L(!!B,16349);const F=B,H=(F==null?void 0:F.error)||((z=F[0])===null||z===void 0?void 0:z.error);if(H){C(we,`RPC '${e}' stream ${i} received error:`,H);const Z=H.status;let K=(function(y){const E=le[y];if(E!==void 0)return kd(E)})(Z),I=H.message;K===void 0&&(K=P.INTERNAL,I="Unknown error status: "+Z+" with message "+H.message),S=!0,V.__(new O(K,I)),m.close()}else C(we,`RPC '${e}' stream ${i} received:`,B),V.a_(B)}})),N(u,xh.STAT_EVENT,(D=>{D.stat===Mo.PROXY?C(we,`RPC '${e}' stream ${i} detected buffering proxy`):D.stat===Mo.NOPROXY&&C(we,`RPC '${e}' stream ${i} detected no buffering proxy`)})),setTimeout((()=>{V.o_()}),0),V}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tE(){return typeof window<"u"?window:null}function Gi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function js(r){return new rI(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff{constructor(e,t,n=1e3,i=1.5,s=6e4){this.Fi=e,this.timerId=t,this.d_=n,this.E_=i,this.A_=s,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),n=Math.max(0,Date.now()-this.m_),i=Math.max(0,t-n);i>0&&C("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,i,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vl="PersistentStream";class pf{constructor(e,t,n,i,s,a,u,c){this.Fi=e,this.w_=n,this.S_=i,this.connection=s,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=c,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new ff(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(Ce(t.toString()),Ce("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,i])=>{this.b_===t&&this.W_(n,i)}),(n=>{e((()=>{const i=new O(P.UNKNOWN,"Fetching auth token failed: "+n.message);return this.G_(i)}))}))}W_(e,t){const n=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{n((()=>this.listener.Zo()))})),this.stream.e_((()=>{n((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((i=>{n((()=>this.G_(i)))})),this.stream.onMessage((i=>{n((()=>++this.C_==1?this.j_(i):this.onNext(i)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return C(Vl,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(C(Vl,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class nE extends pf{constructor(e,t,n,i,s,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,i,a),this.serializer=s}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=oI(this.serializer,e),n=(function(s){if(!("targetChange"in s))return U.min();const a=s.targetChange;return a.targetIds&&a.targetIds.length?U.min():a.readTime?Ve(a.readTime):U.min()})(e);return this.listener.J_(t,n)}H_(e){const t={};t.database=Jo(this.serializer),t.addTarget=(function(s,a){let u;const c=a.target;if(u=us(c)?{documents:Bd(s,c)}:{query:jd(s,c).Vt},u.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){u.resumeToken=Od(s,a.resumeToken);const d=Qo(s,a.expectedCount);d!==null&&(u.expectedCount=d)}else if(a.snapshotVersion.compareTo(U.min())>0){u.readTime=zn(s,a.snapshotVersion.toTimestamp());const d=Qo(s,a.expectedCount);d!==null&&(u.expectedCount=d)}return u})(this.serializer,e);const n=uI(this.serializer,e);n&&(t.labels=n),this.k_(t)}Y_(e){const t={};t.database=Jo(this.serializer),t.removeTarget=e,this.k_(t)}}class rE extends pf{constructor(e,t,n,i,s,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,i,a),this.serializer=s}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return L(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,L(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){L(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=aI(e.writeResults,e.commitTime),n=Ve(e.commitTime);return this.listener.ta(n,t)}na(){const e={};e.database=Jo(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>hs(this.serializer,n)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iE{}class sE extends iE{constructor(e,t,n,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=i,this.ra=!1}ia(){if(this.ra)throw new O(P.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([s,a])=>this.connection.Wo(e,Xo(t,n),i,s,a))).catch((s=>{throw s.name==="FirebaseError"?(s.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new O(P.UNKNOWN,s.toString())}))}Jo(e,t,n,i,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,u])=>this.connection.Jo(e,Xo(t,n),i,a,u,s))).catch((a=>{throw a.name==="FirebaseError"?(a.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new O(P.UNKNOWN,a.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class oE{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Ce(t),this._a=!1):C("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const an="RemoteStore";class aE{constructor(e,t,n,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=s,this.Ea.xo((a=>{n.enqueueAndForget((async()=>{ln(this)&&(C(an,"Restarting streams for network reachability change."),await(async function(c){const d=q(c);d.Ia.add(4),await si(d),d.Aa.set("Unknown"),d.Ia.delete(4),await qs(d)})(this))}))})),this.Aa=new oE(n,i)}}async function qs(r){if(ln(r))for(const e of r.da)await e(!0)}async function si(r){for(const e of r.da)await e(!1)}function mf(r,e){const t=q(r);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),$a(t)?za(t):Qn(t).x_()&&qa(t,e))}function ja(r,e){const t=q(r),n=Qn(t);t.Ta.delete(e),n.x_()&&gf(t,e),t.Ta.size===0&&(n.x_()?n.B_():ln(t)&&t.Aa.set("Unknown"))}function qa(r,e){if(r.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(U.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Qn(r).H_(e)}function gf(r,e){r.Ra.$e(e),Qn(r).Y_(e)}function za(r){r.Ra=new Zy({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>r.Ta.get(e)||null,lt:()=>r.datastore.serializer.databaseId}),Qn(r).start(),r.Aa.aa()}function $a(r){return ln(r)&&!Qn(r).M_()&&r.Ta.size>0}function ln(r){return q(r).Ia.size===0}function _f(r){r.Ra=void 0}async function uE(r){r.Aa.set("Online")}async function cE(r){r.Ta.forEach(((e,t)=>{qa(r,e)}))}async function lE(r,e){_f(r),$a(r)?(r.Aa.la(e),za(r)):r.Aa.set("Unknown")}async function hE(r,e,t){if(r.Aa.set("Online"),e instanceof xd&&e.state===2&&e.cause)try{await(async function(i,s){const a=s.cause;for(const u of s.targetIds)i.Ta.has(u)&&(await i.remoteSyncer.rejectListen(u,a),i.Ta.delete(u),i.Ra.removeTarget(u))})(r,e)}catch(n){C(an,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await gs(r,n)}else if(e instanceof $i?r.Ra.Ye(e):e instanceof Nd?r.Ra.it(e):r.Ra.et(e),!t.isEqual(U.min()))try{const n=await hf(r.localStore);t.compareTo(n)>=0&&await(function(s,a){const u=s.Ra.Pt(a);return u.targetChanges.forEach(((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const p=s.Ta.get(d);p&&s.Ta.set(d,p.withResumeToken(c.resumeToken,a))}})),u.targetMismatches.forEach(((c,d)=>{const p=s.Ta.get(c);if(!p)return;s.Ta.set(c,p.withResumeToken(de.EMPTY_BYTE_STRING,p.snapshotVersion)),gf(s,c);const m=new nt(p.target,c,d,p.sequenceNumber);qa(s,m)})),s.remoteSyncer.applyRemoteEvent(u)})(r,t)}catch(n){C(an,"Failed to raise snapshot:",n),await gs(r,n)}}async function gs(r,e,t){if(!Dt(e))throw e;r.Ia.add(1),await si(r),r.Aa.set("Offline"),t||(t=()=>hf(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{C(an,"Retrying IndexedDB access"),await t(),r.Ia.delete(1),await qs(r)}))}function yf(r,e){return e().catch((t=>gs(r,t,e)))}async function oi(r){const e=q(r),t=St(e);let n=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Qt;for(;dE(e);)try{const i=await WI(e.localStore,n);if(i===null){e.Pa.length===0&&t.B_();break}n=i.batchId,fE(e,i)}catch(i){await gs(e,i)}If(e)&&Ef(e)}function dE(r){return ln(r)&&r.Pa.length<10}function fE(r,e){r.Pa.push(e);const t=St(r);t.x_()&&t.Z_&&t.X_(e.mutations)}function If(r){return ln(r)&&!St(r).M_()&&r.Pa.length>0}function Ef(r){St(r).start()}async function pE(r){St(r).na()}async function mE(r){const e=St(r);for(const t of r.Pa)e.X_(t.mutations)}async function gE(r,e,t){const n=r.Pa.shift(),i=Va.from(n,e,t);await yf(r,(()=>r.remoteSyncer.applySuccessfulWrite(i))),await oi(r)}async function _E(r,e){e&&St(r).Z_&&await(async function(n,i){if((function(a){return Jy(a)&&a!==P.ABORTED})(i.code)){const s=n.Pa.shift();St(n).N_(),await yf(n,(()=>n.remoteSyncer.rejectFailedWrite(s.batchId,i))),await oi(n)}})(r,e),If(r)&&Ef(r)}async function Dl(r,e){const t=q(r);t.asyncQueue.verifyOperationInProgress(),C(an,"RemoteStore received new credentials");const n=ln(t);t.Ia.add(3),await si(t),n&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await qs(t)}async function yE(r,e){const t=q(r);e?(t.Ia.delete(2),await qs(t)):e||(t.Ia.add(2),await si(t),t.Aa.set("Unknown"))}function Qn(r){return r.Va||(r.Va=(function(t,n,i){const s=q(t);return s.ia(),new nE(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)})(r.datastore,r.asyncQueue,{Zo:uE.bind(null,r),e_:cE.bind(null,r),n_:lE.bind(null,r),J_:hE.bind(null,r)}),r.da.push((async e=>{e?(r.Va.N_(),$a(r)?za(r):r.Aa.set("Unknown")):(await r.Va.stop(),_f(r))}))),r.Va}function St(r){return r.ma||(r.ma=(function(t,n,i){const s=q(t);return s.ia(),new rE(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)})(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),e_:pE.bind(null,r),n_:_E.bind(null,r),ea:mE.bind(null,r),ta:gE.bind(null,r)}),r.da.push((async e=>{e?(r.ma.N_(),await oi(r)):(await r.ma.stop(),r.Pa.length>0&&(C(an,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))}))),r.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ka{constructor(e,t,n,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=i,this.removalCallback=s,this.deferred=new vt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,i,s){const a=Date.now()+n,u=new Ka(e,t,a,i,s);return u.start(n),u}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new O(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Ga(r,e){if(Ce("AsyncQueue",`${e}: ${r}`),Dt(r))return new O(P.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{static emptySet(e){return new Pn(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||x.comparator(t.key,n.key):(t,n)=>x.comparator(t.key,n.key),this.keyedMap=vr(),this.sortedSet=new oe(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Pn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Pn;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kl{constructor(){this.fa=new oe(x.comparator)}track(e){const t=e.doc.key,n=this.fa.get(t);n?e.type!==0&&n.type===3?this.fa=this.fa.insert(t,e):e.type===3&&n.type!==1?this.fa=this.fa.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.fa=this.fa.remove(t):e.type===1&&n.type===2?this.fa=this.fa.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):M(63341,{At:e,ga:n}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,n)=>{e.push(n)})),e}}class $n{constructor(e,t,n,i,s,a,u,c,d){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=i,this.mutatedKeys=s,this.fromCache=a,this.syncStateChanged=u,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,t,n,i,s){const a=[];return t.forEach((u=>{a.push({type:0,doc:u})})),new $n(e,t,Pn.emptySet(t),a,n,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&xs(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==n[i].type||!t[i].doc.isEqual(n[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IE{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class EE{constructor(){this.queries=Nl(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,n){const i=q(t),s=i.queries;i.queries=Nl(),s.forEach(((a,u)=>{for(const c of u.wa)c.onError(n)}))})(this,new O(P.ABORTED,"Firestore shutting down"))}}function Nl(){return new at((r=>Id(r)),xs)}async function vE(r,e){const t=q(r);let n=3;const i=e.query;let s=t.queries.get(i);s?!s.Sa()&&e.ba()&&(n=2):(s=new IE,n=e.ba()?0:1);try{switch(n){case 0:s.ya=await t.onListen(i,!0);break;case 1:s.ya=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(a){const u=Ga(a,`Initialization of query '${Tn(e.query)}' failed`);return void e.onError(u)}t.queries.set(i,s),s.wa.push(e),e.va(t.onlineState),s.ya&&e.Ca(s.ya)&&Wa(t)}async function TE(r,e){const t=q(r),n=e.query;let i=3;const s=t.queries.get(n);if(s){const a=s.wa.indexOf(e);a>=0&&(s.wa.splice(a,1),s.wa.length===0?i=e.ba()?0:1:!s.Sa()&&e.ba()&&(i=2))}switch(i){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function wE(r,e){const t=q(r);let n=!1;for(const i of e){const s=i.query,a=t.queries.get(s);if(a){for(const u of a.wa)u.Ca(i)&&(n=!0);a.ya=i}}n&&Wa(t)}function AE(r,e,t){const n=q(r),i=n.queries.get(e);if(i)for(const s of i.wa)s.onError(t);n.queries.delete(e)}function Wa(r){r.Da.forEach((e=>{e.next()}))}var ia,xl;(xl=ia||(ia={})).Fa="default",xl.Cache="cache";class bE{constructor(e,t,n){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=n||{}}Ca(e){if(!this.options.includeMetadataChanges){const n=[];for(const i of e.docChanges)i.type!==3&&n.push(i);e=new $n(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const n=t!=="Offline";return(!this.options.ka||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=$n.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==ia.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vf{constructor(e){this.key=e}}class Tf{constructor(e){this.key=e}}class RE{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=$(),this.mutatedKeys=$(),this.Xa=Ed(e),this.eu=new Pn(this.Xa)}get tu(){return this.Ha}nu(e,t){const n=t?t.ru:new kl,i=t?t.eu:this.eu;let s=t?t.mutatedKeys:this.mutatedKeys,a=i,u=!1;const c=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,d=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal(((p,m)=>{const w=i.get(p),S=ri(this.query,m)?m:null,V=!!w&&this.mutatedKeys.has(w.key),N=!!S&&(S.hasLocalMutations||this.mutatedKeys.has(S.key)&&S.hasCommittedMutations);let D=!1;w&&S?w.data.isEqual(S.data)?V!==N&&(n.track({type:3,doc:S}),D=!0):this.iu(w,S)||(n.track({type:2,doc:S}),D=!0,(c&&this.Xa(S,c)>0||d&&this.Xa(S,d)<0)&&(u=!0)):!w&&S?(n.track({type:0,doc:S}),D=!0):w&&!S&&(n.track({type:1,doc:w}),D=!0,(c||d)&&(u=!0)),D&&(S?(a=a.add(S),s=N?s.add(p):s.delete(p)):(a=a.delete(p),s=s.delete(p)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const p=this.query.limitType==="F"?a.last():a.first();a=a.delete(p.key),s=s.delete(p.key),n.track({type:1,doc:p})}return{eu:a,ru:n,Ds:u,mutatedKeys:s}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,i){const s=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const a=e.ru.pa();a.sort(((p,m)=>(function(S,V){const N=D=>{switch(D){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M(20277,{At:D})}};return N(S)-N(V)})(p.type,m.type)||this.Xa(p.doc,m.doc))),this.su(n),i=i!=null&&i;const u=t&&!i?this.ou():[],c=this.Za.size===0&&this.current&&!i?1:0,d=c!==this.Ya;return this.Ya=c,a.length!==0||d?{snapshot:new $n(this.query,e.eu,s,a,e.mutatedKeys,c===0,d,!1,!!n&&n.resumeToken.approximateByteSize()>0),_u:u}:{_u:u}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new kl,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=$(),this.eu.forEach((n=>{this.au(n.key)&&(this.Za=this.Za.add(n.key))}));const t=[];return e.forEach((n=>{this.Za.has(n)||t.push(new Tf(n))})),this.Za.forEach((n=>{e.has(n)||t.push(new vf(n))})),t}uu(e){this.Ha=e.qs,this.Za=$();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return $n.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const Ha="SyncEngine";class SE{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class PE{constructor(e){this.key=e,this.lu=!1}}class CE{constructor(e,t,n,i,s,a){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=a,this.hu={},this.Pu=new at((u=>Id(u)),xs),this.Tu=new Map,this.Iu=new Set,this.du=new oe(x.comparator),this.Eu=new Map,this.Au=new Ma,this.Ru={},this.Vu=new Map,this.mu=on.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function VE(r,e,t=!0){const n=Pf(r);let i;const s=n.Pu.get(e);return s?(n.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.cu()):i=await wf(n,e,t,!0),i}async function DE(r,e){const t=Pf(r);await wf(t,e,!0,!1)}async function wf(r,e,t,n){const i=await HI(r.localStore,je(e)),s=i.targetId,a=r.sharedClientState.addLocalQueryTarget(s,t);let u;return n&&(u=await kE(r,e,s,a==="current",i.resumeToken)),r.isPrimaryClient&&t&&mf(r.remoteStore,i),u}async function kE(r,e,t,n,i){r.gu=(m,w,S)=>(async function(N,D,z,B){let F=D.view.nu(z);F.Ds&&(F=await Rl(N.localStore,D.query,!1).then((({documents:I})=>D.view.nu(I,F))));const H=B&&B.targetChanges.get(D.targetId),Z=B&&B.targetMismatches.get(D.targetId)!=null,K=D.view.applyChanges(F,N.isPrimaryClient,H,Z);return Ml(N,D.targetId,K._u),K.snapshot})(r,m,w,S);const s=await Rl(r.localStore,e,!0),a=new RE(e,s.qs),u=a.nu(s.documents),c=ii.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",i),d=a.applyChanges(u,r.isPrimaryClient,c);Ml(r,t,d._u);const p=new SE(e,t,a);return r.Pu.set(e,p),r.Tu.has(t)?r.Tu.get(t).push(e):r.Tu.set(t,[e]),d.snapshot}async function NE(r,e,t){const n=q(r),i=n.Pu.get(e),s=n.Tu.get(i.targetId);if(s.length>1)return n.Tu.set(i.targetId,s.filter((a=>!xs(a,e)))),void n.Pu.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(i.targetId),n.sharedClientState.isActiveQueryTarget(i.targetId)||await na(n.localStore,i.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(i.targetId),t&&ja(n.remoteStore,i.targetId),sa(n,i.targetId)})).catch(un)):(sa(n,i.targetId),await na(n.localStore,i.targetId,!0))}async function xE(r,e){const t=q(r),n=t.Pu.get(e),i=t.Tu.get(n.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),ja(t.remoteStore,n.targetId))}async function OE(r,e,t){const n=Cf(r);try{const i=await(function(a,u){const c=q(a),d=ee.now(),p=u.reduce(((S,V)=>S.add(V.key)),$());let m,w;return c.persistence.runTransaction("Locally write mutations","readwrite",(S=>{let V=xe(),N=$();return c.Os.getEntries(S,p).next((D=>{V=D,V.forEach(((z,B)=>{B.isValidDocument()||(N=N.add(z))}))})).next((()=>c.localDocuments.getOverlayedDocuments(S,V))).next((D=>{m=D;const z=[];for(const B of u){const F=Qy(B,m.get(B.key).overlayedDocument);F!=null&&z.push(new kt(B.key,F,hd(F.value.mapValue),Oe.exists(!0)))}return c.mutationQueue.addMutationBatch(S,d,z,u)})).next((D=>{w=D;const z=D.applyToLocalDocumentSet(m,N);return c.documentOverlayCache.saveOverlays(S,D.batchId,z)}))})).then((()=>({batchId:w.batchId,changes:Td(m)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(i.batchId),(function(a,u,c){let d=a.Ru[a.currentUser.toKey()];d||(d=new oe(j)),d=d.insert(u,c),a.Ru[a.currentUser.toKey()]=d})(n,i.batchId,t),await ai(n,i.changes),await oi(n.remoteStore)}catch(i){const s=Ga(i,"Failed to persist write");t.reject(s)}}async function Af(r,e){const t=q(r);try{const n=await KI(t.localStore,e);e.targetChanges.forEach(((i,s)=>{const a=t.Eu.get(s);a&&(L(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?a.lu=!0:i.modifiedDocuments.size>0?L(a.lu,14607):i.removedDocuments.size>0&&(L(a.lu,42227),a.lu=!1))})),await ai(t,n,e)}catch(n){await un(n)}}function Ol(r,e,t){const n=q(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const i=[];n.Pu.forEach(((s,a)=>{const u=a.view.va(e);u.snapshot&&i.push(u.snapshot)})),(function(a,u){const c=q(a);c.onlineState=u;let d=!1;c.queries.forEach(((p,m)=>{for(const w of m.wa)w.va(u)&&(d=!0)})),d&&Wa(c)})(n.eventManager,e),i.length&&n.hu.J_(i),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function ME(r,e,t){const n=q(r);n.sharedClientState.updateQueryState(e,"rejected",t);const i=n.Eu.get(e),s=i&&i.key;if(s){let a=new oe(x.comparator);a=a.insert(s,ce.newNoDocument(s,U.min()));const u=$().add(s),c=new Ls(U.min(),new Map,new oe(j),a,u);await Af(n,c),n.du=n.du.remove(s),n.Eu.delete(e),Qa(n)}else await na(n.localStore,e,!1).then((()=>sa(n,e,t))).catch(un)}async function LE(r,e){const t=q(r),n=e.batch.batchId;try{const i=await $I(t.localStore,e);Rf(t,n,null),bf(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await ai(t,i)}catch(i){await un(i)}}async function FE(r,e,t){const n=q(r);try{const i=await(function(a,u){const c=q(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",(d=>{let p;return c.mutationQueue.lookupMutationBatch(d,u).next((m=>(L(m!==null,37113),p=m.keys(),c.mutationQueue.removeMutationBatch(d,m)))).next((()=>c.mutationQueue.performConsistencyCheck(d))).next((()=>c.documentOverlayCache.removeOverlaysForBatchId(d,p,u))).next((()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,p))).next((()=>c.localDocuments.getDocuments(d,p)))}))})(n.localStore,e);Rf(n,e,t),bf(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await ai(n,i)}catch(i){await un(i)}}function bf(r,e){(r.Vu.get(e)||[]).forEach((t=>{t.resolve()})),r.Vu.delete(e)}function Rf(r,e,t){const n=q(r);let i=n.Ru[n.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),n.Ru[n.currentUser.toKey()]=i}}function sa(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Tu.get(e))r.Pu.delete(n),t&&r.hu.pu(n,t);r.Tu.delete(e),r.isPrimaryClient&&r.Au.zr(e).forEach((n=>{r.Au.containsKey(n)||Sf(r,n)}))}function Sf(r,e){r.Iu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(ja(r.remoteStore,t),r.du=r.du.remove(e),r.Eu.delete(t),Qa(r))}function Ml(r,e,t){for(const n of t)n instanceof vf?(r.Au.addReference(n.key,e),UE(r,n)):n instanceof Tf?(C(Ha,"Document no longer in limbo: "+n.key),r.Au.removeReference(n.key,e),r.Au.containsKey(n.key)||Sf(r,n.key)):M(19791,{yu:n})}function UE(r,e){const t=e.key,n=t.path.canonicalString();r.du.get(t)||r.Iu.has(n)||(C(Ha,"New document in limbo: "+t),r.Iu.add(n),Qa(r))}function Qa(r){for(;r.Iu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Iu.values().next().value;r.Iu.delete(e);const t=new x(Y.fromString(e)),n=r.mu.next();r.Eu.set(n,new PE(t)),r.du=r.du.insert(t,n),mf(r.remoteStore,new nt(je(Ns(t.path)),n,"TargetPurposeLimboResolution",Ue.ue))}}async function ai(r,e,t){const n=q(r),i=[],s=[],a=[];n.Pu.isEmpty()||(n.Pu.forEach(((u,c)=>{a.push(n.gu(c,e,t).then((d=>{var p;if((d||t)&&n.isPrimaryClient){const m=d?!d.fromCache:(p=t==null?void 0:t.targetChanges.get(c.targetId))===null||p===void 0?void 0:p.current;n.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){i.push(d);const m=Ua.Es(c.targetId,d);s.push(m)}})))})),await Promise.all(a),n.hu.J_(i),await(async function(c,d){const p=q(c);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",(m=>T.forEach(d,(w=>T.forEach(w.Is,(S=>p.persistence.referenceDelegate.addReference(m,w.targetId,S))).next((()=>T.forEach(w.ds,(S=>p.persistence.referenceDelegate.removeReference(m,w.targetId,S)))))))))}catch(m){if(!Dt(m))throw m;C(Ba,"Failed to update sequence numbers: "+m)}for(const m of d){const w=m.targetId;if(!m.fromCache){const S=p.Fs.get(w),V=S.snapshotVersion,N=S.withLastLimboFreeSnapshotVersion(V);p.Fs=p.Fs.insert(w,N)}}})(n.localStore,s))}async function BE(r,e){const t=q(r);if(!t.currentUser.isEqual(e)){C(Ha,"User change. New user:",e.toKey());const n=await lf(t.localStore,e);t.currentUser=e,(function(s,a){s.Vu.forEach((u=>{u.forEach((c=>{c.reject(new O(P.CANCELLED,a))}))})),s.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await ai(t,n.Bs)}}function jE(r,e){const t=q(r),n=t.Eu.get(e);if(n&&n.lu)return $().add(n.key);{let i=$();const s=t.Tu.get(e);if(!s)return i;for(const a of s){const u=t.Pu.get(a);i=i.unionWith(u.view.tu)}return i}}function Pf(r){const e=q(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Af.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=jE.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=ME.bind(null,e),e.hu.J_=wE.bind(null,e.eventManager),e.hu.pu=AE.bind(null,e.eventManager),e}function Cf(r){const e=q(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=LE.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=FE.bind(null,e),e}class Xr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=js(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return cf(this.persistence,new uf,e.initialUser,this.serializer)}Du(e){return new La(Bs.Vi,this.serializer)}bu(e){return new df}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Xr.provider={build:()=>new Xr};class qE extends Xr{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){L(this.persistence.referenceDelegate instanceof ms,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new nf(n,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?Ae.withCacheSize(this.cacheSizeBytes):Ae.DEFAULT;return new La((n=>ms.Vi(n,t)),this.serializer)}}class zE extends Xr{constructor(e,t,n){super(),this.Mu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Mu.initialize(this,e),await Cf(this.Mu.syncEngine),await oi(this.Mu.remoteStore),await this.persistence.ji((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}vu(e){return cf(this.persistence,new uf,e.initialUser,this.serializer)}Cu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new nf(n,e.asyncQueue,t)}Fu(e,t){const n=new G_(t,this.persistence);return new K_(e.asyncQueue,n)}Du(e){const t=BI(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Ae.withCacheSize(this.cacheSizeBytes):Ae.DEFAULT;return new Fa(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,tE(),Gi(),this.serializer,this.sharedClientState,!!this.forceOwnership)}bu(e){return new df}}class _s{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>Ol(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=BE.bind(null,this.syncEngine),await yE(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new EE})()}createDatastore(e){const t=js(e.databaseInfo.databaseId),n=(function(s){return new eE(s)})(e.databaseInfo);return(function(s,a,u,c){return new sE(s,a,u,c)})(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,i,s,a,u){return new aE(n,i,s,a,u)})(this.localStore,this.datastore,e.asyncQueue,(t=>Ol(this.syncEngine,t,0)),(function(){return Cl.C()?new Cl:new XI})())}createSyncEngine(e,t){return(function(i,s,a,u,c,d,p){const m=new CE(i,s,a,u,c,d);return p&&(m.fu=!0),m})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(i){const s=q(i);C(an,"RemoteStore shutting down."),s.Ia.add(5),await si(s),s.Ea.shutdown(),s.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}_s.provider={build:()=>new _s};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $E{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):Ce("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pt="FirestoreClient";class KE{constructor(e,t,n,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=i,this.user=Pe.UNAUTHENTICATED,this.clientId=pa.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(n,(async a=>{C(Pt,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(n,(a=>(C(Pt,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new vt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Ga(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function So(r,e){r.asyncQueue.verifyOperationInProgress(),C(Pt,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async i=>{n.isEqual(i)||(await lf(e.localStore,i),n=i)})),e.persistence.setDatabaseDeletedListener((()=>{At("Terminating Firestore due to IndexedDb database deletion"),r.terminate().then((()=>{C("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((i=>{At("Terminating Firestore due to IndexedDb database deletion failed",i)}))})),r._offlineComponents=e}async function Ll(r,e){r.asyncQueue.verifyOperationInProgress();const t=await GE(r);C(Pt,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>Dl(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,i)=>Dl(e.remoteStore,i))),r._onlineComponents=e}async function GE(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){C(Pt,"Using user provided OfflineComponentProvider");try{await So(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(i){return i.name==="FirebaseError"?i.code===P.FAILED_PRECONDITION||i.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11})(t))throw t;At("Error using user provided cache. Falling back to memory cache: "+t),await So(r,new Xr)}}else C(Pt,"Using default OfflineComponentProvider"),await So(r,new qE(void 0));return r._offlineComponents}async function Vf(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(C(Pt,"Using user provided OnlineComponentProvider"),await Ll(r,r._uninitializedComponentsProvider._online)):(C(Pt,"Using default OnlineComponentProvider"),await Ll(r,new _s))),r._onlineComponents}function WE(r){return Vf(r).then((e=>e.syncEngine))}async function Fl(r){const e=await Vf(r),t=e.eventManager;return t.onListen=VE.bind(null,e.syncEngine),t.onUnlisten=NE.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=DE.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=xE.bind(null,e.syncEngine),t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Df(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ul=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const HE="firestore.googleapis.com",Bl=!0;class jl{constructor(e){var t,n;if(e.host===void 0){if(e.ssl!==void 0)throw new O(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=HE,this.ssl=Bl}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:Bl;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Jd;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<tf)throw new O(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}j_("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Df((n=e.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,i){return n.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Xa{constructor(e,t,n,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new jl({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new O(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new O(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new jl(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new N_;switch(n.type){case"firstParty":return new M_(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new O(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=Ul.get(t);n&&(C("ComponentProvider","Removing Datastore"),Ul.delete(t),n.terminate())})(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new zs(this.firestore,e,this._query)}}class fe{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new wt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new fe(this.firestore,e,this._key)}toJSON(){return{type:fe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(ei(t,fe._jsonSchema))return new fe(e,n||null,new x(Y.fromString(t.referencePath)))}}fe._jsonSchemaVersion="firestore/documentReference/1.0",fe._jsonSchema={type:he("string",fe._jsonSchemaVersion),referencePath:he("string")};class wt extends zs{constructor(e,t,n){super(e,t,Ns(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new fe(this.firestore,null,new x(e))}withConverter(e){return new wt(this.firestore,e,this._path)}}function QE(r,e,...t){if(r=Me(r),Bh("collection","path",e),r instanceof Xa){const n=Y.fromString(e,...t);return Vc(n),new wt(r,null,n)}{if(!(r instanceof fe||r instanceof wt))throw new O(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Y.fromString(e,...t));return Vc(n),new wt(r.firestore,null,n)}}function XE(r,e,...t){if(r=Me(r),arguments.length===1&&(e=pa.newId()),Bh("doc","path",e),r instanceof Xa){const n=Y.fromString(e,...t);return Cc(n),new fe(r,null,new x(n))}{if(!(r instanceof fe||r instanceof wt))throw new O(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Y.fromString(e,...t));return Cc(n),new fe(r.firestore,r instanceof wt?r.converter:null,new x(n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ql="AsyncQueue";class zl{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new ff(this,"async_queue_retry"),this.oc=()=>{const n=Gi();n&&C(ql,"Visibility state changed to "+n.visibilityState),this.F_.y_()},this._c=e;const t=Gi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Gi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new vt;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Dt(e))throw e;C(ql,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((n=>{throw this.tc=n,this.nc=!1,Ce("INTERNAL UNHANDLED ERROR: ",$l(n)),n})).then((n=>(this.nc=!1,n))))));return this._c=t,t}enqueueAfterDelay(e,t,n){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const i=Ka.createAndSchedule(this,e,t,n,(s=>this.lc(s)));return this.ec.push(i),i}ac(){this.tc&&M(47125,{hc:$l(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function $l(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kl(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of n)if(s in i&&typeof i[s]=="function")return!0;return!1})(r,["next","error","complete"])}class ys extends Xa{constructor(e,t,n,i){super(e,t,n,i),this.type="firestore",this._queue=new zl,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new zl(e),this._firestoreClient=void 0,await e}}}function Gl(r,e,t){t||(t=os);const n=sh(r,"firestore");if(n.isInitialized(t)){const i=n.getImmediate({identifier:t}),s=n.getOptions(t);if(Or(s,e))return i;throw new O(P.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new O(P.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<tf)throw new O(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&Es(e.host)&&Op(e.host),n.initialize({options:e,instanceIdentifier:t})}function kf(r){if(r._terminated)throw new O(P.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||JE(r),r._firestoreClient}function JE(r){var e,t,n;const i=r._freezeSettings(),s=(function(u,c,d,p){return new vy(u,c,d,p.host,p.ssl,p.experimentalForceLongPolling,p.experimentalAutoDetectLongPolling,Df(p.experimentalLongPollingOptions),p.useFetchStreams,p.isUsingEmulator)})(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,i);r._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((n=i.localCache)===null||n===void 0)&&n._onlineComponentProvider)&&(r._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),r._firestoreClient=new KE(r._authCredentials,r._appCheckCredentials,r._queue,s,r._componentsProvider&&(function(u){const c=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(c),_online:c}})(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Fe(de.fromBase64String(e))}catch(t){throw new O(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Fe(de.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Fe._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ei(e,Fe._jsonSchema))return Fe.fromBase64String(e.bytes)}}Fe._jsonSchemaVersion="firestore/bytes/1.0",Fe._jsonSchema={type:he("string",Fe._jsonSchemaVersion),bytes:he("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ja{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new O(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ae(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nf{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new O(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new O(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return j(this._lat,e._lat)||j(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Qe._jsonSchemaVersion}}static fromJSON(e){if(ei(e,Qe._jsonSchema))return new Qe(e.latitude,e.longitude)}}Qe._jsonSchemaVersion="firestore/geoPoint/1.0",Qe._jsonSchema={type:he("string",Qe._jsonSchemaVersion),latitude:he("number"),longitude:he("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,i){if(n.length!==i.length)return!1;for(let s=0;s<n.length;++s)if(n[s]!==i[s])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Xe._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ei(e,Xe._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Xe(e.vectorValues);throw new O(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Xe._jsonSchemaVersion="firestore/vectorValue/1.0",Xe._jsonSchema={type:he("string",Xe._jsonSchemaVersion),vectorValues:he("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YE=/^__.*__$/;class ZE{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new kt(e,this.data,this.fieldMask,t,this.fieldTransforms):new Hn(e,this.data,t,this.fieldTransforms)}}function xf(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M(40011,{Ec:r})}}class Ya{constructor(e,t,n,i,s,a){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=i,s===void 0&&this.Ac(),this.fieldTransforms=s||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new Ya(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:n,mc:!1});return i.fc(e),i}gc(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:n,mc:!1});return i.Ac(),i}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return Is(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(xf(this.Ec)&&YE.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class ev{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||js(e)}Dc(e,t,n,i=!1){return new Ya({Ec:e,methodName:t,bc:n,path:ae.emptyPath(),mc:!1,Sc:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function tv(r){const e=r._freezeSettings(),t=js(r._databaseId);return new ev(r._databaseId,!!e.ignoreUndefinedProperties,t)}function nv(r,e,t,n,i,s={}){const a=r.Dc(s.merge||s.mergeFields?2:0,e,t,i);Ff("Data must be an object, but it was:",a,n);const u=Mf(n,a);let c,d;if(s.merge)c=new Be(a.fieldMask),d=a.fieldTransforms;else if(s.mergeFields){const p=[];for(const m of s.mergeFields){const w=rv(e,m,t);if(!a.contains(w))throw new O(P.INVALID_ARGUMENT,`Field '${w}' is specified in your field mask but missing from your input data.`);sv(p,w)||p.push(w)}c=new Be(p),d=a.fieldTransforms.filter((m=>c.covers(m.field)))}else c=null,d=a.fieldTransforms;return new ZE(new De(u),c,d)}function Of(r,e){if(Lf(r=Me(r)))return Ff("Unsupported field value:",e,r),Mf(r,e);if(r instanceof Nf)return(function(n,i){if(!xf(i.Ec))throw i.wc(`${n._methodName}() can only be used with update() and set()`);if(!i.path)throw i.wc(`${n._methodName}() is not currently supported inside arrays`);const s=n._toFieldTransform(i);s&&i.fieldTransforms.push(s)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(n,i){const s=[];let a=0;for(const u of n){let c=Of(u,i.yc(a));c==null&&(c={nullValue:"NULL_VALUE"}),s.push(c),a++}return{arrayValue:{values:s}}})(r,e)}return(function(n,i){if((n=Me(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return qy(i.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const s=ee.fromDate(n);return{timestampValue:zn(i.serializer,s)}}if(n instanceof ee){const s=new ee(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:zn(i.serializer,s)}}if(n instanceof Qe)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Fe)return{bytesValue:Od(i.serializer,n._byteString)};if(n instanceof fe){const s=i.databaseId,a=n.firestore._databaseId;if(!a.isEqual(s))throw i.wc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Na(n.firestore._databaseId||i.databaseId,n._key.path)}}if(n instanceof Xe)return(function(a,u){return{mapValue:{fields:{[wa]:{stringValue:Aa},[Ln]:{arrayValue:{values:a.toArray().map((d=>{if(typeof d!="number")throw u.wc("VectorValues must only contain numeric values.");return Sa(u.serializer,d)}))}}}}}})(n,i);throw i.wc(`Unsupported field value: ${ma(n)}`)})(r,e)}function Mf(r,e){const t={};return nd(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):cn(r,((n,i)=>{const s=Of(i,e.Vc(n));s!=null&&(t[n]=s)})),{mapValue:{fields:t}}}function Lf(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof ee||r instanceof Qe||r instanceof Fe||r instanceof fe||r instanceof Nf||r instanceof Xe)}function Ff(r,e,t){if(!Lf(t)||!jh(t)){const n=ma(t);throw n==="an object"?e.wc(r+" a custom object"):e.wc(r+" "+n)}}function rv(r,e,t){if((e=Me(e))instanceof Ja)return e._internalPath;if(typeof e=="string")return Uf(r,e);throw Is("Field path arguments must be of type string or ",r,!1,void 0,t)}const iv=new RegExp("[~\\*/\\[\\]]");function Uf(r,e,t){if(e.search(iv)>=0)throw Is(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Ja(...e.split("."))._internalPath}catch{throw Is(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Is(r,e,t,n,i){const s=n&&!n.isEmpty(),a=i!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let c="";return(s||a)&&(c+=" (found",s&&(c+=` in field ${n}`),a&&(c+=` in document ${i}`),c+=")"),new O(P.INVALID_ARGUMENT,u+r+c)}function sv(r,e){return r.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bf{constructor(e,t,n,i,s){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new fe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ov(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(jf("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class ov extends Bf{data(){return super.data()}}function jf(r,e){return typeof e=="string"?Uf(r,e):e instanceof Ja?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function av(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new O(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class uv{convertValue(e,t="none"){switch(bt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return se(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(st(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw M(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return cn(e,((i,s)=>{n[i]=this.convertValue(s,t)})),n}convertVectorValue(e){var t,n,i;const s=(i=(n=(t=e.fields)===null||t===void 0?void 0:t[Ln].arrayValue)===null||n===void 0?void 0:n.values)===null||i===void 0?void 0:i.map((a=>se(a.doubleValue)));return new Xe(s)}convertGeoPoint(e){return new Qe(se(e.latitude),se(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Vs(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Kr(e));default:return null}}convertTimestamp(e){const t=it(e);return new ee(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Y.fromString(e);L(Kd(n),9688,{name:e});const i=new tn(n.get(1),n.get(3)),s=new x(n.popFirst(5));return i.isEqual(t)||Ce(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cv(r,e,t){let n;return n=r?r.toFirestore(e):e,n}class Ar{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Yt extends Bf{constructor(e,t,n,i,s,a){super(e,t,n,i,a),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Wi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(jf("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new O(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Yt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Yt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Yt._jsonSchema={type:he("string",Yt._jsonSchemaVersion),bundleSource:he("string","DocumentSnapshot"),bundleName:he("string"),bundle:he("string")};class Wi extends Yt{data(e={}){return super.data(e)}}class Cn{constructor(e,t,n,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Ar(i.hasPendingWrites,i.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new Wi(this._firestore,this._userDataWriter,n.key,n,new Ar(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new O(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(i,s){if(i._snapshot.oldDocs.isEmpty()){let a=0;return i._snapshot.docChanges.map((u=>{const c=new Wi(i._firestore,i._userDataWriter,u.doc.key,u.doc,new Ar(i._snapshot.mutatedKeys.has(u.doc.key),i._snapshot.fromCache),i.query.converter);return u.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}}))}{let a=i._snapshot.oldDocs;return i._snapshot.docChanges.filter((u=>s||u.type!==3)).map((u=>{const c=new Wi(i._firestore,i._userDataWriter,u.doc.key,u.doc,new Ar(i._snapshot.mutatedKeys.has(u.doc.key),i._snapshot.fromCache),i.query.converter);let d=-1,p=-1;return u.type!==0&&(d=a.indexOf(u.doc.key),a=a.delete(u.doc.key)),u.type!==1&&(a=a.add(u.doc),p=a.indexOf(u.doc.key)),{type:lv(u.type),doc:c,oldIndex:d,newIndex:p}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new O(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Cn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=pa.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],i=[];return this.docs.forEach((s=>{s._document!==null&&(t.push(s._document),n.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),i.push(s.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function lv(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M(61501,{type:r})}}Cn._jsonSchemaVersion="firestore/querySnapshot/1.0",Cn._jsonSchema={type:he("string",Cn._jsonSchemaVersion),bundleSource:he("string","QuerySnapshot"),bundleName:he("string"),bundle:he("string")};class qf extends uv{constructor(e){super(),this.firestore=e}convertBytes(e){return new Fe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new fe(this.firestore,null,t)}}function hv(r,e,t){r=Rr(r,fe);const n=Rr(r.firestore,ys),i=cv(r.converter,e);return fv(n,[nv(tv(n),"setDoc",r._key,i,r.converter!==null,t).toMutation(r._key,Oe.none())])}function dv(r,...e){var t,n,i;r=Me(r);let s={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||Kl(e[a])||(s=e[a++]);const u={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(Kl(e[a])){const m=e[a];e[a]=(t=m.next)===null||t===void 0?void 0:t.bind(m),e[a+1]=(n=m.error)===null||n===void 0?void 0:n.bind(m),e[a+2]=(i=m.complete)===null||i===void 0?void 0:i.bind(m)}let c,d,p;if(r instanceof fe)d=Rr(r.firestore,ys),p=Ns(r._key.path),c={next:m=>{e[a]&&e[a](pv(d,r,m))},error:e[a+1],complete:e[a+2]};else{const m=Rr(r,zs);d=Rr(m.firestore,ys),p=m._query;const w=new qf(d);c={next:S=>{e[a]&&e[a](new Cn(d,w,m,S))},error:e[a+1],complete:e[a+2]},av(r._query)}return(function(w,S,V,N){const D=new $E(N),z=new bE(S,D,V);return w.asyncQueue.enqueueAndForget((async()=>vE(await Fl(w),z))),()=>{D.Ou(),w.asyncQueue.enqueueAndForget((async()=>TE(await Fl(w),z)))}})(kf(d),p,u,c)}function fv(r,e){return(function(n,i){const s=new vt;return n.asyncQueue.enqueueAndForget((async()=>OE(await WE(n),i,s))),s.promise})(kf(r),e)}function pv(r,e,t){const n=t.docs.get(e._key),i=new qf(r);return new Yt(r,i,e._key,n,new Ar(t.hasPendingWrites,t.fromCache),e.converter)}class mv{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=zf(),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}function gv(r){return new mv(r)}class _v{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=_s.provider,this._offlineComponentProvider={build:t=>new zE(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}function zf(r){return new _v(void 0)}(function(e,t=!0){(function(i){Wn=i})(vs),Vn(new Zt("firestore",((n,{instanceIdentifier:i,options:s})=>{const a=n.getProvider("app").getImmediate(),u=new ys(new x_(n.getProvider("auth-internal")),new L_(a,n.getProvider("app-check-internal")),(function(d,p){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new O(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new tn(d.options.projectId,p)})(a,i),a);return s=Object.assign({useFetchStreams:t},s),u._setSettings(s),u}),"PUBLIC").setMultipleInstances(!0)),It(Ac,bc,e),It(Ac,bc,"esm2017")})();const yv={apiKey:"AIzaSyCzOKnaWnhZ37HVOe340qcQh16SMFKg3WU",authDomain:"undr-ctrl-9f672.firebaseapp.com",projectId:"undr-ctrl-9f672",storageBucket:"undr-ctrl-9f672.firebasestorage.app",messagingSenderId:"1054307772536",appId:"1:1054307772536:web:cc338da3c7a5e6bf33258d"},Iv=r=>r.replace(/\//g,"~");function vv(){const r=Wm(yv),e=Kg(r,{persistence:[R_,f_]});let t;try{t=Gl(r,{ignoreUndefinedProperties:!0,localCache:gv({tabManager:zf(void 0)})})}catch{t=Gl(r,{ignoreUndefinedProperties:!0})}return{onUser:n=>c_(e,i=>n(i?{uid:i.uid,email:i.email??""}:null)),signIn:async(n,i)=>{await u_(e,n.trim(),i)},signUp:async(n,i)=>{await a_(e,n.trim(),i)},signOut:()=>l_(e),resetPassword:n=>o_(e,n.trim()),remote:n=>({async push(i){const s=await Promise.allSettled(i.map(u=>hv(XE(t,"users",n,"records",Iv(u.key)),u))),a=[];return s.forEach((u,c)=>{var d;if(u.status==="rejected")if((((d=u.reason)==null?void 0:d.code)??"")==="permission-denied")a.push(i[c].key);else throw u.reason}),{rejected:a}},subscribe(i){let s=!0;return dv(QE(t,"users",n,"records"),{includeMetadataChanges:!0},a=>{if(s){if(a.metadata.fromCache)return;s=!1,i(a.docs.map(c=>c.data()));return}const u=a.docChanges().filter(c=>c.type!=="removed"&&!c.doc.metadata.hasPendingWrites).map(c=>c.doc.data());u.length&&i(u)})}})}}export{vv as firebaseBackend};
