(()=>{"use strict";var e={919:()=>{function e(t,n=null){return new Promise((o=>{t.addEventListener("transitionend",(async s=>{n?(s.propertyName===n||await e(t,n),o()):o()}),{once:!0})}))}async function t(t){await e(t,"opacity"),t.classList.add("fully-hidden")}const n=document.querySelector(".reg-login-form"),o=document.querySelector(".centre-modal-wrapper"),s=new class{wrapper;#e;#t;constructor(e){this.wrapper=e,this.#e=e.querySelector(".centre-modal"),this.#t=this.#e.querySelector(".close")}init(){const e=[this.#t,this.wrapper];for(let t of e)t.addEventListener("click",(()=>this.hide()));this.#e.addEventListener("click",(e=>e.stopPropagation()))}show(){var e;(e=this.wrapper).classList.remove("fully-hidden"),setTimeout((()=>e.classList.remove("transparent")),10)}hide(){!async function(e){!function(e){e.classList.add("transparent")}(e),await t(e)}(this.wrapper)}}(o);s.init(),n.addEventListener("submit",(e=>{e.preventDefault(),async function(e){const t=e.currentTarget,n=new FormData(t),o=Object.fromEntries(n.entries()),r=await fetch(t.action,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),a=await r.json();"success"===a.status?(console.log(`redirecting to ${a.redirectTo}`),window.location.assign(a.redirectTo)):s.show()}(e)}))}},t={};function n(o){var s=t[o];if(void 0!==s)return s.exports;var r=t[o]={exports:{}};return e[o](r,r.exports,n),r.exports}(()=>{let e;n(919);const t=document.querySelector(".full-address"),o=document.querySelectorAll(".loc-detail");window.onload=function(){const t=document.querySelector(".loc-input");e=new google.maps.places.Autocomplete(t)}(),e.addListener("place_changed",(function(){const n=e.getPlace();if("address_components"in n){const e=function(e,t=!0){const n={formattedAddress:e.formatted_address,fullAddress:e.address_components,googlePlaceId:e.place_id},o=n.lat=e.geometry.location;[n.lat,n.lng]=t?[o.lat(),o.lng()]:[o.lat,o.lng];let[s,r]=[!1,!1];for(let e of n.fullAddress){const t=e.types.includes("country"),o=e.types.includes("political");t&&!s&&(n.countryShort=e.short_name,n.countryLong=e.long_name,s=!0),o&&!r&&(n.placeName=e.long_name,r=!0)}return n}(n);!function(e){o.forEach((e=>e.value=""));for(let n in e)if("fullAddress"===n){t.innerHTML="";for(let o=0;o<e[n].length;o++){const s=document.createElement("input");s.classList.add("fully-hidden"),s.value=e[n][o].long_name,s.setAttribute("name",`fullAddress${o}`),t.appendChild(s)}}else document.querySelector(`[name="${n}"]`).value=e[n]}(e)}}))})()})();