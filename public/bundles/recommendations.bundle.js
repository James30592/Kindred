(()=>{"use strict";var e={733:(e,t,s)=>{s.d(t,{Ji:()=>n,U6:()=>a,Yi:()=>c,_5:()=>r,tA:()=>u,xS:()=>o});var i=s(922);function n(e){e.classList.remove("fully-hidden"),setTimeout((()=>e.classList.remove("transparent")),10)}async function r(e){n(e),await async function(e){await(0,i.hk)(e,"opacity")}(e)}function a(e){e.classList.add("transparent")}async function o(e){await(0,i.hk)(e,"opacity"),e.classList.add("fully-hidden")}async function c(e){a(e),await o(e)}function u(e,t){return new Promise((async s=>{await c(e),await r(t),s()}))}},300:(e,t,s)=>{var i=s(733);class n{#e;#t;constructor(e){this.#e=e.querySelector(".pop-btn"),this.#t=e.querySelector(".pop-btn-content")}init(){this.#s(this.#e,this.#t)}#s(e,t){e.addEventListener("click",(()=>{this.#i(e,t)}),{once:!0})}async#i(e,t){await(0,i._5)(t),window.addEventListener("click",(async()=>{await(0,i.Yi)(t),this.#s(e,t)}),{once:!0})}}document.querySelectorAll(".pop-btn-container").forEach((e=>{new n(e).init()}))},922:(e,t,s)=>{function i(e,t,s){const i=e.findIndex((e=>s(e,t)));i>-1?e.splice(i,1,t):e.push(t)}function n(e,t=null){return new Promise((s=>{e.addEventListener("transitionend",(async i=>{t?(i.propertyName===t||await n(e,t),s()):s()}),{once:!0})}))}s.d(t,{cT:()=>i,hk:()=>n})}},t={};function s(i){var n=t[i];if(void 0!==n)return n.exports;var r=t[i]={exports:{}};return e[i](r,r.exports,s),r.exports}s.d=(e,t)=>{for(var i in t)s.o(t,i)&&!s.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e=s(733);class t{mainDiv;ratePanel;rateBtn;skipBtn;scoreSlider;scoreSliderInput;currQuestionText;prevAnsDiv;prevAnsVal;loader;details;constructor(e){this.mainDiv=e.querySelector(".answer-panel"),this.ratePanel=this.mainDiv.querySelector(".rate-panel"),this.rateBtn=this.mainDiv.querySelector(".rate-btn"),this.skipBtn=this.mainDiv.querySelector(".skip-btn"),this.scoreSlider=this.mainDiv.querySelector(".score-slider"),this.scoreSliderInput=this.scoreSlider.querySelector("input"),this.currQuestionText=this.mainDiv.querySelector(".curr-question"),this.prevAnsDiv=this.mainDiv.querySelector(".prev-ans-info"),this.prevAnsVal=this.mainDiv.querySelector(".prev-ans-val"),this.loader=this.mainDiv.querySelector(".loader"),this.details=this.mainDiv.querySelector(".details")}displayCurrQ(e,t){this.#n(e),this.currQuestionText.innerHTML=e.currQText,this.prevAnsVal.innerText="";const s=this.#r(e,t);this.scoreSliderInput.value=s,this.scoreSliderInput.dispatchEvent(new Event("input"))}async showLoader(){this.loader.classList.remove("fully-hidden"),this.details.classList.add("fully-hidden"),this.details.classList.add("transparent")}async hideLoader(){this.loader.classList.add("fully-hidden"),this.details.classList.remove("fully-hidden"),setTimeout((()=>this.details.classList.remove("transparent")),10)}#n(e){e.endOfQueue?this.ratePanel.classList.add("hidden"):this.ratePanel.classList.remove("hidden")}#r(e,t){let s=5;return t&&e.currQAns?(this.prevAnsDiv.classList.remove("hidden"),this.prevAnsVal.innerText="Skipped",e.currQAns.skip||(s=e.currQAns.answerVal,this.prevAnsVal.innerText=s)):this.prevAnsDiv.classList.add("hidden"),s}}class i extends EventTarget{mainDiv;answerUiPanel;questionsQueue;btn;constructor(e,s=null){super(),this.mainDiv=e,this.btn=s,this.answerUiPanel=new t(e)}init(){this.answerUiPanel.rateBtn.addEventListener("click",(e=>{this.answerQuestion(e)})),this.answerUiPanel.skipBtn.addEventListener("click",(e=>{this.answerQuestion(e)}))}setRecentAnswers(e){this.questionsQueue.setRecentAnswers(e)}_showCurrQ(e=!0){const t=this.questionsQueue.getCurrQInfo();this.answerUiPanel.displayCurrQ(t,e)}getAnswerObj(e,t){const s=e.currentTarget===this.answerUiPanel.skipBtn,i=s?null:Number(this.answerUiPanel.scoreSliderInput.value),n=this._getQuestionDetails(t),r={questionId:t._id,skip:s,questionDetails:n};return s||(r.answerVal=i),r}_getQuestionDetails(e){const t={},s=["_id","apiPageNum","alreadyInDb","currAns"];for(let i in e)s.includes(i)||(t[i]=e[i]);return t}activate(){this.btn&&this.btn.classList.add("active-q-mode"),(0,e.Ji)(this.mainDiv)}deactivate(){this.btn&&this.btn.classList.remove("active-q-mode"),(0,e.U6)(this.mainDiv)}}function n(e,t,s){return s?[t,s]:[e.categoryTypeName??e.categoryType,e.categoryName??e.category]}function r(e,t,s,i){let n;switch(i){case"Films":case"TV":n={imgPath:e?.posterPath?`https://image.tmdb.org/t/p/w185/${e.posterPath}`:null,qDisplayText:`${e?.title} (${a(e?.releaseDate)})`,qSourceDisplayText:`${e?.title}`,imgPlaceHolderTxt:`${e?.title}`};break;case"Music":n={imgPath:e?.image,qDisplayText:`${e?.trackName} - ${e?.artist} (${e?.album} - ${new Date(e?.releaseDate).getFullYear()})`,qSourceDisplayText:`${e?.trackName} - ${e?.artist}`,imgPlaceHolderTxt:`${e?.trackName}`};break;case"Video Games":n={imgPath:e?.image?`https://images.igdb.com/igdb/image/upload/t_cover_big/${e.image}.jpg`:null,qDisplayText:`${e?.title} (${a(e?.releaseDate)}) (${e.platforms})`,qSourceDisplayText:`${e?.title}`,imgPlaceHolderTxt:`${e?.title}`};break;case"Books":n={imgPath:e?.image?`https://covers.openlibrary.org/b/id/${e.image}-M.jpg`:null,qDisplayText:`${e?.title} (${e?.author})`,qSourceDisplayText:`${e?.title}`,imgPlaceHolderTxt:`${e?.title}`};break;default:n={imgPath:null,qDisplayText:e?.text,qSourceDisplayText:e?.shortText,imgPlaceHolderTxt:e?.shortText??e.text}}return n[t]}function a(e){return e?new Date(e).getFullYear():"Unknown"}function o(e,t,s){const i=document.createElement("div"),n=r(e,"imgPath",0,s);if(n){const t=document.createElement("img");t.setAttribute("src",n),t.setAttribute("loading","lazy"),t.setAttribute("alt",e?.title),i.appendChild(t)}else{const t=document.createElement("div");t.classList.add("placeholder-img");const n=document.createElement("span"),a=r(e,"imgPlaceHolderTxt",0,s);n.innerText=a,t.appendChild(n),i.appendChild(t)}if(e.previewUrl){const t=document.createElement("audio");t.setAttribute("controls","true"),t.setAttribute("src",e.previewUrl),i.appendChild(t)}return i}class c{_queue=[];#a=0;#o;#c;constructor(e,t,s){this._queue=e.querySelector(".queue-imgs"),this.#o=t,this.#c=s,this._queue.addEventListener("transitionend",(e=>{this.#u(e)}))}#u(e){"left"===e.propertyName&&(this.#a--,this._deleteDomQ(0),this._queue.classList.remove("queue-imgs-transitioning"),this.#a>0&&setTimeout((()=>this.#d()),0))}addToQueue(e){for(let t of e){const[e,s]=n(t,this.#o,this.#c),i=o(t,0,s);i.setAttribute("data-id",t._id),this._queue.appendChild(i)}}removeQueueItem(e,t){this._queue.hasChildNodes()&&(0===e&&t?(this.#a++,this.#d()):this._deleteDomQ(e))}_deleteDomQ(e){this._queue.classList.contains("queue-imgs-transitioning")&&e>0&&e++,this._queue.removeChild(this._queue.children[e])}#d(){this._queue.classList.add("queue-imgs-transitioning")}resetQueue(){this._queue.innerText=""}}class u{_categoryTypeName;_categoryName;queue=[];queueType;_domQueue;_queuePrevQs=[];constructor(e,t=null,s=null){this._categoryTypeName=t,this._categoryName=s,this._domQueue=new c(e,t,s)}getCurrQInfo(){let e,t,s=!1;if(0===this.queue.length)e=this._getEndQueueMsg(),s=!0;else{const s=this.queue[0],[i,a]=n(s,this._categoryTypeName,this._categoryName);e=r(s,"qDisplayText",0,a),t=s.currAns}return{endOfQueue:s,currQText:e,currQAns:t}}_getEndQueueMsg(){return this.endQueueMsg}removeQueueItem(e,t){const s=this.queue[e];return this.queue.splice(e,1),this._domQueue.removeQueueItem(e,t),s}_addToQueue(e){this.queue=this.queue.concat(e),this._domQueue.addToQueue(e)}_resetQueue(){this.queue=[],this._domQueue.resetQueue(),this._queuePrevQs=[]}savePrevQ(e){this._queuePrevQs.push(e)}}class d extends c{removeQueueItem(e,t){this._queue.hasChildNodes()&&0===e&&this._deleteDomQ(e)}}class l extends u{constructor(e,t=null,s=null){super(e,t,s),this._domQueue=new d(e,t,s)}update(e){this._resetQueue(),this._addToQueue([e])}}class h{wrapper;#l;#h;constructor(e){this.wrapper=e,this.#l=e.querySelector(".centre-modal"),this.#h=this.#l.querySelector(".close")}init(){const e=[this.#h,this.wrapper];for(let t of e)t.addEventListener("click",(()=>this.hide()));this.#l.addEventListener("click",(e=>e.stopPropagation()))}show(){(0,e.Ji)(this.wrapper)}hide(){(0,e.Yi)(this.wrapper)}}class p extends i{name="single";_qSource;_answerUiModal;constructor(e,t,s=null){super(e,s),this.questionsQueue=new l(e),this._qSource=t;const i=e.querySelector(".centre-modal-wrapper");this._answerUiModal=new h(i)}init(){super.init(),this._qSource.addEventListener("answerSingleQ",(e=>{this._handleClickSingleQ(e)})),this._answerUiModal.init()}answerQuestion(e){const t=this.questionsQueue.removeQueueItem(0,!0),s=this.getAnswerObj(e,t);return this.dispatchEvent(new CustomEvent("answeredQ",{detail:{answerObj:s}})),this._answerUiModal.hide(),s}_handleClickSingleQ(e){const t=e.detail.question,s=this._makeQuestion(t);this.questionsQueue.update(s),this._answerUiModal.show(),this._showCurrQ()}}class m extends EventTarget{_listDiv;_contentDiv;_qDivClass;constructor(e){super(),this._listDiv=e,this._contentDiv=e.querySelector(".content")}_createQDiv(e){const[t,s]=n(e,this._categoryTypeName,this._categoryName),i=o(e.questionDetails,0,s);i.classList.add(this._qDivClass);const r=this._createQTextElem(e,t,s),a=this._createtQScoreElem(e);this._setupQImg(e,i);const c={qSourceItem:i,qText:r,qScore:a,catTypeName:t,catName:s};return this._addToQDiv(c),i}_handleRateBtnClick(e,t){this.dispatchEvent(new CustomEvent("answerSingleQ",{detail:{question:t}}))}_buildContentDiv(e){for(let t of e){const e=this._createQDiv(t);this._contentDiv.appendChild(e)}}_createQTextElem(e,t,s){const i=document.createElement("p");return i.innerText=r(e.questionDetails,"qSourceDisplayText",0,s),i.classList.add("q-text"),i}_createtQScoreElem(e){const t=document.createElement("p");return t.innerText=this._getScoreText(e),t.classList.add("user-score"),t}_setupQImg(e,t){const s=t.querySelector("img")??t.querySelector(".placeholder-img");s.addEventListener("click",(t=>{this._handleRateBtnClick(t,e)}));const i=document.createElement("div");i.classList.add("q-source-img-wrapper"),i.appendChild(s),t.insertBefore(i,t.children[0]);const n=document.createElement("div");n.classList.add("q-source-item-hover");const r=document.createElement("span");r.innerText=this._getHoverText(),r.classList.add("q-source-hover-txt"),n.appendChild(r),i.appendChild(n)}}class y{catTypes={};constructor(e=null,t=null){e&&(this.catTypes=e.catTypes),t&&this.#p(t)}#p(e){for(let t of e)for(let e of t.categories){const s={isRecommendable:e.isRecommendable};this.checkAndAddCategoryWithType(t.name,e.name,s)}}checkAndAddCategoryWithType(e,t,s=null){const i=this._doesCategoryOrTypeExist(e,t);"nor"===i?this._addTypeAndCategory(e,t,s):"typeOnly"===i&&this._addCategory(e,t,s)}cloneWithData(e,t){const s=new y,i=this.getAllCategories();for(let n of i){const i=n.categoryType,r=n.category,a=e(i,r,t);s.checkAndAddCategoryWithType(i,r,a)}return s}getAllCategories(e=!1){const t=[];for(let s in this.catTypes)for(let i in this.catTypes[s]?.categories){const n={categoryType:s,category:i};if(e){const e=this.catTypes[s].categories[i];for(let t in e)n[t]=e[t]}t.push(n)}return t}_doesCategoryOrTypeExist(e,t){return e in this.catTypes?t in(this.catTypes.categoryTypeName?.categories??[])?"typeAndCat":"typeOnly":"nor"}_addTypeAndCategory(e,t,s){this.catTypes[e]={categories:{}},this._addCategory(e,t,s)}_addCategory(e,t,s){this.catTypes[e].categories[t]=null,s&&this._setData(e,t,s)}_setData(e,t,s){this.catTypes[e].categories[t]={};for(let i in s)this.catTypes[e].categories[t][i]=s[i]}}class g{#m;categoryInfo;constructor(e){this.#m=e}getSelectedCategoryInfo(){let e=new y;return this.#m.forEach((function(t){if(t.checked){const s=t.getAttribute("name").split(".");e.checkAndAddCategoryWithType(s[0],s[1])}})),this.categoryInfo=e,this.categoryInfo}getNumSelected(){return Array.from(this.#m).reduce(((e,t)=>e+t.checked),0)}}const w={_rebuildContentDiv(e){this._clearContentDiv(),this._buildContentDiv(e)},_clearContentDiv(){this._contentDiv.replaceChildren()},_showLoader(){return(0,e.tA)(this._contentDiv,this._loader)},_hideLoader(){return(0,e.tA)(this._loader,this._contentDiv)},async handleUpdateBtnClick(){const e=this._showLoader(),t=await this._getUpdatedSourceData();await e,this._rebuildContentDiv(t),this._hideLoader()},validateHandleUpdate(e,t){this._validateSelections()?(e.scrollIntoView({behavior:"smooth"}),this.handleUpdateBtnClick()):alert(t)}};class v extends m{#y=null;#g;#w;#v;_loader;_qDivClass="rec-item";static#_='At least one category must be selected from each of the "Recommend for" and "Based on" groups.';static#q=["You're one of a kind!","We couldn't find anyone similar enough to you for the selected categories. Try a different selection or answer more questions."];static#T=["No recommendations!","Your Kindred spirits for the categories selected have nothing to recommend you that you haven't rated already! Try a different selection."];constructor(e){super(e),this._loader=e.querySelector(".loader");const t=document.querySelector(".recommendations-for"),s=document.querySelector(".based-on"),i=t.querySelectorAll(".category-checkbox"),n=s.querySelectorAll(".category-checkbox");this.#g=new g(i),this.#w=new g(n),this.#v=document.querySelector(".get-recs-btn"),this.#v.addEventListener("click",(()=>{this.validateHandleUpdate(this._listDiv,v.#_)}))}_buildContentDiv(e){e.numKindred>0?e.recommendList.length>0?super._buildContentDiv(e.recommendList):this.#Q(v.#T):this.#Q(v.#q)}#Q(e){const t=document.createElement("div"),s=document.createElement("h5"),i=document.createElement("p");s.innerText=e[0],i.innerText=e[1],t.appendChild(s),t.appendChild(i),t.classList.add("no-recs-msg"),this._contentDiv.appendChild(t)}_validateSelections(){const e=this.#g.getNumSelected(),t=this.#w.getNumSelected();return e>0&&t>0}_addToQDiv(e){e.qSourceItem.appendChild(e.qText),e.qSourceItem.insertBefore(e.qScore,e.qSourceItem.children[0]);const t=document.createElement("p"),s=document.createElement("p");return t.classList.add("rec-cat-type"),s.classList.add("rec-cat"),[t.innerText,s.innerText]=[e.catTypeName,e.catName],e.qSourceItem.appendChild(t),e.qSourceItem.appendChild(s),e.qSourceItem}async getRecs(){const e={recommendationsFor:this.#g.getSelectedCategoryInfo(),basedOn:this.#w.getSelectedCategoryInfo()},t=await fetch("/recommendations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});return await t.json()}_handleRateBtnClick(e,t){this.#y=e.currentTarget.parentNode.parentNode,super._handleRateBtnClick(e,t)}removeAnsweredQ(){this._contentDiv.removeChild(this.#y)}_getScoreText(e){return e.rating.strength.toFixed(1)}async#f(){return this.dispatchEvent(new CustomEvent("getRecsClick")),await new Promise((e=>{this.addEventListener("postAnswersComplete",e(),{once:!0})})),await this.getRecs()}async _getUpdatedSourceData(){return await this.#f()}_getHoverText(){return"Rate it!"}}Object.assign(v.prototype,w);var _=s(922);class q extends i{queueInputPanel;async answerQuestion(e){const t=this.questionsQueue.removeQueueItem(0,!0);this.questionsQueue.savePrevQ(t._id);const s=this.getAnswerObj(e,t);this.dispatchEvent(new CustomEvent("answeredQ",{detail:{answerObj:s}})),this._showCurrQ(),await this.questionsQueue.update()&&this.questionsQueue.checkForOutdatedQs(!0)}_showCurrQ(){const e=this.queueInputPanel?.includeAlreadyAnsweredCheckbox.checked;super._showCurrQ(e)}async activate(){super.activate()}async updateQueueAndShowFirst(e=!1){this.answerUiPanel.showLoader(),await this.updateQueue(e),this.answerUiPanel.hideLoader(),this._showCurrQ()}async updateQueue(e){await this.questionsQueue.update(e),this.questionsQueue.checkForOutdatedQs()}}class T{#C=!1;questionsModes;qModeSwitcher;currQuestionMode;categoryTypeName;categoryName;notYetPostedAnswers=[];allRecentAnswers=[];static#S=6e5;constructor(e,t=[],s=null,i=null){this.questionsModes=e,this.qModeSwitcher=t,this.categoryTypeName=s,this.categoryName=i}init(){for(let e of this.questionsModes)e.init();window.addEventListener("beforeunload",(()=>{this._postAnswers(!0)})),setInterval((()=>{this._postAnswers(!1)}),T.#S);for(let e of this.questionsModes)e.addEventListener("answeredQ",(e=>{const t=e.detail.answerObj;this._handleNewAnswer(t)}));this.#A()}#A(){for(let e of this.qModeSwitcher){const t=e.btn,s=e.mode;t.addEventListener("click",(async()=>{this.#C||this.currQuestionMode===s||(this.#C=!0,await this.switchQMode(s),this.#C=!1)}))}}_handleNewAnswer(e){this._updateAnsArrayWithAns(this.notYetPostedAnswers,e),this._updateAnsArrayWithAns(this.allRecentAnswers,e),this._setRecentAnswers()}removeQmode(){this.currQuestionMode.deactivate()}async setQMode(e){this.currQuestionMode=e,await this.currQuestionMode.activate(),this._setRecentAnswers(),this.currQuestionMode instanceof q&&await this.currQuestionMode.updateQueueAndShowFirst()}_setRecentAnswers(){"recs"!==this.currQuestionMode?.name&&this.currQuestionMode.setRecentAnswers(this.allRecentAnswers)}_updateAnsArrayWithAns(e,t){(0,_.cT)(e,t,((e,t)=>e.questionId===t.questionId))}async switchQMode(t){this.removeQmode(),await(0,e.xS)(this.currQuestionMode.mainDiv),await this.setQMode(t)}resetAnswers(){this.notYetPostedAnswers=[]}clearRecentlyPostedAnswers(e){for(let s of e){const e=t(s,this.allRecentAnswers);e>-1&&this.allRecentAnswers.splice(e,1)}function t(e,t){return t.findIndex((t=>{let s=!0;const i=["questionId","skip","answerVal"];for(let n in t)if(i.includes(n)&&(s=t[n]===e[n],!s))break;return s}))}}async _postAnswers(e=!1){if(0===this.notYetPostedAnswers.length)return;const[t,s]=this.#D(),i={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"answers",data:s})};e&&(i.keepalive=!0),this.resetAnswers(),await fetch(t,i),this.clearRecentlyPostedAnswers(s)}#D(){let e,t;return this.categoryName?(e=`/questions/${this.categoryTypeName}/${this.categoryName}`,t=this.notYetPostedAnswers.slice()):(e="/questions/mixed-categories",t=this.#x(this.notYetPostedAnswers)),[e,t]}#x(e){const t=[];for(let i of e){const e=i.questionDetails.categoryTypeName,n=i.questionDetails.categoryName,r=t.findIndex((t=>{const s=t.catType===e,i=t.cat===n;return s&&i})),a=s(i);if(r>-1)t[r].answers.push(a);else{const s={catType:e,cat:n,answers:[a]};t.push(s)}}function s(e){return delete e.questionDetails.categoryName,delete e.questionDetails.categoryTypeName,e}return t}}s(300);const Q=document.querySelector(".single-answer-mode"),f=document.querySelector(".recommendations-list"),C=new v(f),S=new class extends p{name="recs";answerQuestion(e){super.answerQuestion(e).skip||this._qSource.removeAnsweredQ()}_makeQuestion(e){const t={_id:e.questionId,categoryTypeName:e.categoryType,categoryName:e.category};for(let s in e.questionDetails)t[s]=e.questionDetails[s];return t}}(Q,C),A=new class extends T{setQMode(e){super.setQMode(e),this.currQuestionMode._qSource.addEventListener("getRecsClick",(async()=>{this._postAnswers()}))}async _postAnswers(e=!1){super._postAnswers(e),this.currQuestionMode._qSource.dispatchEvent(new CustomEvent("postAnswersComplete"))}}([S]);A.init(),window.onload=async()=>{await A.setQMode(S)}})()})();