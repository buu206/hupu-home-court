/* HUPU HOME COURT — orchestration, local community interactions and magnetic cursor. */
(() => {
  'use strict';
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const D = window.HUPU_DATA;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = !!window.gsap && !!window.ScrollTrigger;
  const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = (key,fallback={}) => {try { const value=JSON.parse(localStorage.getItem(key));return value&&typeof value==='object'&&!Array.isArray(value)?value:fallback; } catch {return fallback;}};
  const save = (key,value) => {try {localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
  const ratings = read('hupu-court-ratings-v2');
  const discussions = read('hupu-court-replies-v2');
  const reactions = read('hupu-court-reactions-v2');
  let lenis, selectedMatch=null, topicFilter='全部', topicOffset=0, toastTimer;
  const team = id => D.teams.find(t=>t.id===id);
  let refreshFrame=0;
  const refresh = () => {if(hasGSAP&&!refreshFrame)refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;ScrollTrigger.refresh();});};
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800);}

  // Buttons stay in the current document; dialogs are scroll-isolated.
  const dialog=$('#detail-dialog');
  function openDialog(content){$('#dialog-content').innerHTML=content;dialog.showModal();if(document.body.classList.contains('magnetic-cursor'))dialog.append($('.cursor'));document.body.classList.add('dialog-open');lenis?.stop();dialog.scrollTop=0;}
  function closeDialog(){dialog.close();}
  dialog.addEventListener('close',()=>{document.body.append($('.cursor'));document.body.classList.remove('dialog-open');lenis?.start();});
  $('.dialog-close').addEventListener('click',closeDialog);
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();});

  function setFilter(container,attribute,value){$$("button",container).forEach(b=>{const active=b.dataset[attribute]===value;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});}
  function renderJerseys(conference='all') {
    const teams=D.teams.filter(t=>conference==='all'||t.conference===conference);
    const columns=Array.from({length:Math.min(4,teams.length)},()=>[]);
    teams.forEach((t,i)=>columns[i%columns.length].push(t));
    $('#jersey-grid').innerHTML=columns.map((items,i)=>`<div class="jersey-column" data-column="${i}">${items.map(t=>`
      <button class="jersey-card" data-team="${t.id}" aria-label="查看${t.cn}球衣与球队档案">
        <span class="archive-back" aria-hidden="true"></span>
        <span class="archive-tab mono">${t.conference==='west'?'WEST':'EAST'} / THE ARCHIVE</span>
        <div class="jersey-folder">
          <div class="jersey-top"><span>${String(D.teams.indexOf(t)+1).padStart(2,'0')} / 16</span><img src="assets/teams/${t.id}.svg" alt="${t.cn}队徽" loading="lazy"></div>
          <img class="jersey-product" src="assets/jerseys/${t.id}.jpg" alt="${t.cn} ${t.player} ${t.number}号真实球衣" loading="lazy">
          <img class="jersey-action" src="assets/photos/${t.id}.jpg" alt="${t.cn}赛场照片" loading="lazy">
          <span class="jersey-shadow"></span>
          <div class="jersey-bottom"><div><h3>${t.short}</h3><small>${t.tag}</small></div></div>
          <span class="card-shine"></span>
        </div>
        <svg class="archive-outline" viewBox="0 0 320 390" preserveAspectRatio="none" aria-hidden="true"><path d="M14 3.5H306Q317 3.5 317 14.5V332Q317 344 306 344H242Q228 344 222 356L209 376Q203 386.5 190 386.5H14Q3 386.5 3 375V14.5Q3 3.5 14 3.5Z"/></svg>
        <span class="archive-number mono">NO. ${t.number} <i>↗</i></span>
      </button>`).join('')}</div>`).join('');
    $$('.jersey-card').forEach(el=>{el.addEventListener('click',()=>openTeam(el.dataset.team));addTilt(el,3);});
    if(hasGSAP&&!reduced)gsap.fromTo('.jersey-card',{opacity:0,y:35},{opacity:1,y:0,duration:.65,stagger:.035,overwrite:true,clearProps:'transform'});
    refresh();
  }
  function openTeam(id){const t=team(id);openDialog(`<article class="team-detail"><div class="detail-image"><img src="assets/jerseys/${id}.jpg" alt="${t.cn}真实球衣摄影"></div><div class="detail-copy"><img src="assets/teams/${id}.svg" alt="${t.cn}队徽"><span class="mono red">THE JERSEY ARCHIVE / ${t.conference==='west'?'WESTERN':'EASTERN'} CONFERENCE</span><h2 id="dialog-title">${t.name}</h2><span class="serif">${t.quote}</span><p>${t.story}</p><div class="team-detail-info"><span><b>${t.number}</b>${t.player}</span><span><b>${id.toUpperCase()}</b>${t.city}</span></div><button class="button button-red" id="team-discussion">进入篮球讨论 <span>↗</span></button><p class="demo-note">历史球衣与赛场档案 · 课堂概念展示</p></div></article>`);$('#team-discussion').addEventListener('click',()=>{closeDialog();topicFilter='篮球';setFilter($('#topic-filters'),'topic',topicFilter);renderTopics();goTo('#hot');});}
  $('#jersey-filters').addEventListener('click',e=>{const b=e.target.closest('button[data-conference]');if(!b)return;setFilter($('#jersey-filters'),'conference',b.dataset.conference);renderJerseys(b.dataset.conference);});

  function renderTopics(){let topics=D.topics.filter(t=>topicFilter==='全部'||t.category===topicFilter);if(topics.length)topics=[...topics.slice(topicOffset%topics.length),...topics.slice(0,topicOffset%topics.length)];$('#hot-grid').innerHTML=topics.map((t,i)=>`<button class="topic-card" data-topic-id="${t.id}" aria-label="打开讨论：${t.title}"><div class="topic-image"><img src="${t.image}" alt="${t.category}讨论配图" loading="lazy"></div><div class="topic-category"><span>${t.category} / ${String(i+1).padStart(2,'0')}</span><span>${t.en}</span></div><h3>${t.title}</h3><div class="topic-meta"><span>↗ ${t.heat} 热度</span><span>${t.replies} 条讨论</span></div></button>`).join('');
    $$('.topic-card').forEach(b=>b.addEventListener('click',()=>openTopic(b.dataset.topicId)));if(hasGSAP&&!reduced)gsap.fromTo('.topic-card',{y:22,opacity:0},{y:0,opacity:1,stagger:.045,duration:.55,overwrite:true});refresh();}
  $('#topic-filters').addEventListener('click',e=>{const b=e.target.closest('[data-topic]');if(!b)return;topicFilter=b.dataset.topic;topicOffset=0;setFilter($('#topic-filters'),'topic',topicFilter);renderTopics();});
  $('#refresh-topics').addEventListener('click',()=>{topicOffset++;renderTopics();toast('已切换热点顺序');});
  function openTopic(id){const t=D.topics.find(t=>t.id===id)||D.topics[0];const localReplies=Array.isArray(discussions[t.id])?discussions[t.id]:[];const liked=!!reactions[t.id];openDialog(`<article class="discussion"><span class="mono">${t.en} / ${t.category}</span><h2 id="dialog-title">${t.title}</h2><p class="discussion-intro">${t.description}</p><img class="discussion-image" src="${t.image}" alt="${t.category}话题配图"><div class="discussion-actions"><button id="like-topic" class="${liked?'active':''}" aria-pressed="${liked}">${liked?'♥ 已推荐':'♡ 推荐这条讨论'}</button><button id="copy-topic">复制话题标题 ↗</button></div><div class="reply-list" id="reply-list">${t.comments.map((c,i)=>replyHTML('JR '+String(2316+i*142),c)).join('')}${localReplies.map(r=>replyHTML('我 · 本地回复',r)).join('')}</div><form class="reply-form" id="reply-form"><input id="reply-text" aria-label="你的讨论内容" placeholder="说说你的看法…" maxlength="280" required autocomplete="off"><button type="submit">发表回复 ↗</button></form><p class="demo-note">课堂演示讨论。推荐和回复仅保存在此浏览器，不会公开发布。</p></article>`);
    $('#like-topic').addEventListener('click',e=>{reactions[t.id]=!reactions[t.id];save('hupu-court-reactions-v2',reactions);e.currentTarget.classList.toggle('active',reactions[t.id]);e.currentTarget.setAttribute('aria-pressed',String(reactions[t.id]));e.currentTarget.textContent=reactions[t.id]?'♥ 已推荐':'♡ 推荐这条讨论';});
    $('#copy-topic').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(t.title);toast('话题标题已复制');}catch{toast('浏览器不支持复制，请手动选择话题标题');}});
    $('#reply-form').addEventListener('submit',e=>{e.preventDefault();const input=$('#reply-text');const value=input.value.trim();if(!value){input.focus();return;}discussions[t.id]=[...(Array.isArray(discussions[t.id])?discussions[t.id]:[]),value].slice(-30);const persisted=save('hupu-court-replies-v2',discussions);$('#reply-list').insertAdjacentHTML('beforeend',replyHTML('我 · 本地回复',value));input.value='';toast(persisted?'回复已保存在本地':'回复已添加，本次会话有效');});}
  function replyHTML(name,text){return `<div class="reply"><span class="reply-avatar">JR</span><div><span class="reply-name">${escape(name)}</span><p>${escape(text)}</p></div></div>`;}
  const socialMap={court:'court',curry:'curry',king:'king',bos:'king',life:'life'};$$('.fan-photo').forEach(b=>b.addEventListener('click',()=>openTopic(socialMap[b.dataset.social])));

  // Match-scoped storage prevents one game's rating from overwriting another.
  function renderMatches(){$('#match-grid').innerHTML=D.matches.map(m=>`<button class="match-card" data-match="${m.id}" aria-expanded="false" aria-controls="players-panel"><div class="match-card-top"><span>${m.label}</span><span>${m.date}</span></div><div class="match-teams"><img src="assets/teams/${m.home}.svg" alt="${team(m.home).cn}"><span>${m.score[0]}<i>:</i>${m.score[1]}</span><img src="assets/teams/${m.away}.svg" alt="${team(m.away).cn}"></div><div class="match-names"><span>${team(m.home).cn}</span><span>${team(m.away).cn}</span></div><div class="match-card-bottom"><span>为本场球员评分</span><span>↗</span></div></button>`).join('');$$('.match-card').forEach(b=>{b.addEventListener('click',()=>openMatch(b.dataset.match));addTilt(b,3);});}
  function validRating(key){const n=Number(ratings[key]);return Number.isInteger(n)&&n>=1&&n<=5?n:0;}
  function openMatch(id){selectedMatch=D.matches.find(m=>m.id===id);$$('.match-card').forEach(b=>{const active=b.dataset.match===id;b.classList.toggle('selected',active);b.setAttribute('aria-expanded',String(active));});const panel=$('#players-panel');panel.hidden=false;$('#selected-game').textContent=`${team(selectedMatch.home).cn} × ${team(selectedMatch.away).cn}`;
    $('#player-grid').innerHTML=selectedMatch.players.map(pid=>{const p=D.players[pid];const key=`${id}:${pid}`;const value=validRating(key);return `<article class="player-card" data-player="${pid}" data-rating="${value}" style="--team-color:${p.color}"><span class="player-number" aria-hidden="true">${p.no}</span><div class="rating-stars" role="group" aria-label="为${p.name}评分">${[1,2,3,4,5].map(n=>`<button type="button" data-star="${n}" class="${n<=value?'lit':''}" aria-label="为${p.name}评${n}星" aria-pressed="${n===value}" title="${n}星 / ${n*2}分">★</button>`).join('')}</div><div class="player-status ${value?'rated':''}" aria-live="polite">${value?`✓ 已评分 ${value} 星 · ${value*2}.0 分`:'悬停亮星 · 点击评分'}</div><img class="player-photo" src="assets/${p.photo}.png" alt="${p.name}官方头像"><div class="player-info"><h4 class="player-en">${p.en}</h4><span class="community-rating">${p.score}<small>JR 演示评分</small></span><p>${p.name} / NO.${p.no}</p><div class="player-stats">${p.stats.map((n,i)=>`<span>${n}<small>${['得分','篮板','助攻'][i]}</small></span>`).join('')}</div><button class="edit-rating" type="button">${value?'修改评分 ↗':'点击上方星星评分 ↑'}</button></div><span class="card-shine"></span></article>`;}).join('');
    $$('.player-card').forEach(card=>{const stars=$('.rating-stars',card);const buttons=$$('button[data-star]',card);const reset=()=>{const active=document.activeElement;previewStars(card,stars.contains(active)&&active.dataset.star?Number(active.dataset.star):Number(card.dataset.rating));};stars.addEventListener('pointermove',e=>{const first=buttons[0].getBoundingClientRect(),last=buttons[4].getBoundingClientRect();const n=Math.max(1,Math.min(5,Math.ceil((e.clientX-first.left)/(last.right-first.left)*5)));previewStars(card,n);});stars.addEventListener('pointerleave',reset);buttons.forEach(b=>{b.addEventListener('pointerenter',()=>previewStars(card,Number(b.dataset.star)));b.addEventListener('focus',()=>previewStars(card,Number(b.dataset.star)));b.addEventListener('blur',reset);b.addEventListener('click',e=>ratePlayer(card,Number(b.dataset.star),e));b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const index=buttons.indexOf(b);buttons[Math.max(0,Math.min(4,index+(e.key==='ArrowRight'?1:-1)))].focus();}});});$('.edit-rating',card).addEventListener('click',()=>{stars.classList.add('editing');buttons[Math.max(0,Number(card.dataset.rating)-1)].focus();toast('选择新的星数，点击即可改分');});addTilt(card,5);});
    updateRatingProgress();refresh();if(hasGSAP&&!reduced){gsap.fromTo(panel,{opacity:0,y:25},{opacity:1,y:0,duration:.45});gsap.fromTo('.player-card',{y:65,rotationY:-12,rotationZ:i=>(i-1.5)*3,opacity:0},{y:0,rotationY:0,rotationZ:0,opacity:1,duration:.8,stagger:.07,ease:'power3.out',clearProps:'transform'});}requestAnimationFrame(()=>{goTo('#players-panel',110);});}
  function previewStars(card,n){$$('[data-star]',card).forEach(b=>b.classList.toggle('lit',Number(b.dataset.star)<=n));}
  function ratePlayer(card,n,event){const key=`${selectedMatch.id}:${card.dataset.player}`;const old=validRating(key);ratings[key]=n;const persisted=save('hupu-court-ratings-v2',ratings);card.dataset.rating=n;previewStars(card,n);$$('[data-star]',card).forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.star)===n)));const status=$('.player-status',card);status.textContent=`✓ 已评分 ${n} 星 · ${n*2}.0 分`;status.classList.add('rated');$('.edit-rating',card).textContent='修改评分 ↗';card.classList.remove('confirmed');void card.offsetWidth;card.classList.add('confirmed');setTimeout(()=>card.classList.remove('confirmed'),750);updateRatingProgress();const r=$('.rating-stars',card).getBoundingClientRect();burst(event.clientX||r.left+r.width/2,event.clientY||r.top+r.height/2);toast(`${old?'评分已修改':'评分已确认'}：${D.players[card.dataset.player].name} ${n} 星${persisted?'':'（本次会话有效）'}`);}
  function updateRatingProgress(){const count=selectedMatch.players.filter(id=>validRating(`${selectedMatch.id}:${id}`)).length;$('#rating-progress').textContent=`已评 ${count} / ${selectedMatch.players.length}${count===selectedMatch.players.length?' · 本场评分完成 ✓':''}`;}
  $('.close-panel').addEventListener('click',()=>{$('#players-panel').hidden=true;$$('.match-card').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-expanded','false');});selectedMatch=null;refresh();goTo('#games');});

  // Twenty visual culture marks, real SVGs where supplied; others use wordmarks.
  const logoIds=new Set(['nike','adidas','puma','underarmour','jordan','newbalance','redbull','sony','samsung','xiaomi','playstation','spotify','bilibili','beats','logitech','twitch']);
  function renderPartners(){$('#partner-grid').innerHTML=D.partners.map(p=>`<button class="partner-logo" aria-label="查看${p.name}文化灵感" data-partner="${p.id}">${logoIds.has(p.id)?`<img src="assets/partners/${p.id}.svg" alt="${p.name}" loading="lazy">`:`<span class="partner-wordmark ${p.style||''}">${p.name}</span>`}<small>探索灵感 ↗</small></button>`).join('');$$('.partner-logo').forEach(b=>{const p=D.partners.find(p=>p.id===b.dataset.partner);$('img',b)?.addEventListener('error',e=>{e.target.replaceWith(Object.assign(document.createElement('span'),{className:'partner-wordmark',textContent:p.name}));});b.addEventListener('click',()=>openDialog(`<article class="discussion"><span class="mono red">CULTURE & CONNECTIONS / CONCEPT WALL</span><h2 id="dialog-title">${p.name}</h2><p class="discussion-intro">从运动装备、赛场转播到日常数码，体育文化与我们的生活时刻相连。这一格记录 ${p.name} 带来的视觉灵感。</p><img class="discussion-image" src="assets/basketball.jpg" alt="篮球文化灵感"><p class="demo-note">本墙为课堂视觉研究，不代表虎扑与所展示品牌存在实际合作、授权或商业关系。</p><a href="#hot" class="button button-red" id="partner-talk">聊聊你的装备 <span>↗</span></a></article>`));});}
  $('#dialog-content').addEventListener('click',e=>{if(e.target.closest('#partner-talk')){e.preventDefault();closeDialog();topicFilter='数码';setFilter($('#topic-filters'),'topic',topicFilter);renderTopics();goTo('#hot');}});

  function goTo(target,offset=85){const el=typeof target==='string'?$(target):target;if(!el)return;if(lenis)lenis.scrollTo(el,{offset:-offset,duration:1.15});else window.scrollTo({top:el.getBoundingClientRect().top+scrollY-offset,behavior:reduced?'instant':'smooth'});}
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const target=a.getAttribute('href');if(!$(target))return;e.preventDefault();goTo(target,target==='#home'?0:85);$('.header').classList.remove('menu-open');$('.menu-toggle').setAttribute('aria-expanded','false');});
  $('.menu-toggle').addEventListener('click',()=>{const active=$('.header').classList.toggle('menu-open');$('.menu-toggle').setAttribute('aria-expanded',String(active));});

  function addTilt(el,amount){if(!fine||reduced)return;let frame=0;el.addEventListener('pointermove',e=>{if(frame)return;const cx=e.clientX,cy=e.clientY;frame=requestAnimationFrame(()=>{frame=0;const r=el.getBoundingClientRect();const x=(cx-r.left)/r.width,y=(cy-r.top)/r.height;el.style.setProperty('--mx',`${x*100}%`);el.style.setProperty('--my',`${y*100}%`);if(hasGSAP)gsap.to(el,{rotationX:(.5-y)*amount,rotationY:(x-.5)*amount,y:-4,duration:.4,overwrite:'auto',transformPerspective:1000});});});el.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);frame=0;if(hasGSAP)gsap.to(el,{rotationX:0,rotationY:0,y:0,duration:.7,overwrite:'auto',clearProps:'transform'});});}

  // A short-lived particle canvas: no permanent render loop or external audio.
  const pc=$('#particle-canvas'),ctx=pc.getContext('2d');let particles=[],particleFrame=0;
  function sizeParticles(){pc.width=innerWidth;pc.height=innerHeight;}sizeParticles();
  function burst(x,y){if(reduced)return;for(let i=0;i<40;i++){const a=Math.random()*Math.PI*2,s=2+Math.random()*6;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,life:1,size:2+Math.random()*4,color:i%3?'#ffcf67':'#ed263a'});}if(!particleFrame)particleFrame=requestAnimationFrame(drawParticles);}
  function drawParticles(){ctx.clearRect(0,0,pc.width,pc.height);particles=particles.filter(p=>p.life>0);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.life-=.022;ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*5);ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);ctx.restore();});ctx.globalAlpha=1;particleFrame=particles.length?requestAnimationFrame(drawParticles):0;}

  // Codrops Custom Cursors Demo 4: eight smoothed noisy segments, 30 → 75px,
  // lerped following and a magnetic centre. SVG replaces Paper's full-screen
  // canvas; SimplexNoise and the interaction geometry follow the reference.
  function initMagneticCursor() {
    const media=matchMedia('(min-width:1000px) and (hover:hover) and (pointer:fine)');
    if(reduced)return;
    const cursor=$('.cursor'),path=$('.cursor-ring'),label=$('.cursor-label');
    const noises=Array.from({length:8},()=>window.SimplexNoise?new SimplexNoise():null);
    const mouse={x:innerWidth/2,y:innerHeight/2};
    const state={x:mouse.x,y:mouse.y,r:15,noise:0};
    let target=null,visible=false,frame=0,previous=0,dirty=false;
    const selectors='a,button,[role="button"],.player-card';
    function hover(element) {
      const next=element instanceof Element?element.closest(selectors):null;
      if(next===target)return;
      target=next;
      const card=target?.matches('.jersey-card,.topic-card,.fan-photo,.partner-logo,.player-card,.match-card');
      const star=target?.hasAttribute('data-star');
      cursor.classList.toggle('active',!!target);
      cursor.classList.toggle('is-card',!!card);
      cursor.classList.toggle('is-star',!!star);
      cursor.dataset.mode=star?'rating':card?'card':target?'magnetic':'follow';
      cursor.dataset.target=target?.className||'';
      label.textContent=star?'':card?(target.matches('.player-card,.match-card')?'评分':'查看'):'';
    }
    function smoothPath(points) {
      let d=`M${points[0][0]},${points[0][1]}`;
      for(let i=0;i<8;i++) {
        const p0=points[(i+7)%8],p1=points[i],p2=points[(i+1)%8],p3=points[(i+2)%8];
        d+=`C${p1[0]+(p2[0]-p0[0])/6},${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6},${p2[1]-(p3[1]-p1[1])/6} ${p2[0]},${p2[1]}`;
      }
      return d+'Z';
    }
    function render(time) {
      frame=0;
      if(!media.matches||!visible||document.hidden)return;
      const dt=Math.min(2,(time-previous)/16.667||1);previous=time;
      if(dirty){hover(document.elementFromPoint(mouse.x,mouse.y));dirty=false;}
      let x=mouse.x,y=mouse.y,r=15;
      if(target?.isConnected) {
        const box=target.getBoundingClientRect();
        if(mouse.x<box.left||mouse.x>box.right||mouse.y<box.top||mouse.y>box.bottom)hover(null);
        else {
          x=box.left+box.width/2+(mouse.x-box.left-box.width/2)*.08;
          y=box.top+box.height/2+(mouse.y-box.top-box.height/2)*.08;
          r=target.hasAttribute('data-star')?23:target.matches('.player-card,.jersey-card,.topic-card,.fan-photo,.match-card')?47:37.5;
        }
      }
      const follow=1-Math.pow(.8,dt),grow=1-Math.pow(.84,dt);
      state.x+=(x-state.x)*follow;state.y+=(y-state.y)*follow;
      state.r+=(r-state.r)*grow;state.noise+=((target?4:0)-state.noise)*grow;
      const points=Array.from({length:8},(_,i)=>{
        const angle=i*Math.PI/4;
        const nx=noises[i]?.noise2D(time/2500,0)??Math.sin(time/900+i*2);
        const ny=noises[i]?.noise2D(time/2500,1)??Math.cos(time/1100+i*3);
        return [80+Math.cos(angle)*state.r+nx*state.noise,80+Math.sin(angle)*state.r+ny*state.noise];
      });
      cursor.style.transform=`translate3d(${state.x}px,${state.y}px,0)`;
      path.setAttribute('d',smoothPath(points));
      frame=requestAnimationFrame(render);
    }
    function start(){if(!frame&&media.matches&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
    function stop(){cancelAnimationFrame(frame);frame=0;cursor.style.opacity='0';}
    function configure(){document.body.classList.toggle('magnetic-cursor',media.matches);if(media.matches)start();else stop();}
    document.addEventListener('pointermove',e=>{
      if(e.pointerType==='touch'||!media.matches)return;
      mouse.x=e.clientX;mouse.y=e.clientY;
      if(!visible){state.x=mouse.x;state.y=mouse.y;visible=true;}
      hover(e.target);cursor.style.opacity='1';start();
    },{passive:true});
    document.addEventListener('pointerout',e=>{if(!e.relatedTarget){visible=false;hover(null);stop();}});
    document.addEventListener('pointerdown',()=>cursor.classList.add('pressed'));
    document.addEventListener('pointerup',()=>cursor.classList.remove('pressed'));
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
    document.addEventListener('scroll',()=>{dirty=true;},{passive:true,capture:true});
    media.addEventListener('change',configure);configure();
  }

  function initHorizontalStory() {
    const stage=$('.moments-stage'),track=$('.memory-wall');
    const distance=()=>Math.max(0,track.scrollWidth-stage.clientWidth);
    const story=gsap.timeline({scrollTrigger:{
      id:'horizontal-moments',trigger:'.moments',start:'top top',end:()=>`+=${distance()}`,
      pin:stage,scrub:1.2,anticipatePin:1,invalidateOnRefresh:true,
      onUpdate:self=>{stage.dataset.progress=self.progress.toFixed(3);$('.story-counter').textContent=`${String(Math.min(8,1+Math.floor(self.progress*8))).padStart(2,'0')} / 08`;}
    }});
    story.to(track,{x:()=>-distance(),duration:1,ease:'none'},0)
      .to('.moments-intro',{x:()=>-innerWidth*.85,opacity:0,duration:.28,ease:'none'},0)
      .to(stage,{backgroundColor:'#bcb8a5',duration:.28,ease:'none'},0)
      .to(stage,{backgroundColor:'#8c3934',color:'#efeee5',duration:.32,ease:'none'},.28)
      .to(stage,{backgroundColor:'#26261f',duration:.4,ease:'none'},.6)
      .fromTo('.story-progress-track i',{scaleX:0},{scaleX:1,duration:1,ease:'none'},0);
    $$('.memory').forEach((el,i)=>story.fromTo(el,
      {y:i%2?80:-55,rotation:Number(el.dataset.turn)-3,scale:i%3===0?.94:1.03},
      {y:i%2?-65:65,rotation:Number(el.dataset.turn)+3,scale:i%3===0?1.05:.96,duration:1,ease:'none'},0));
    story.fromTo('.memory-quote',{y:50,rotation:3},{y:-50,rotation:-2,duration:1,ease:'none'},0);
  }

  function initMotion(){if(hasGSAP)gsap.registerPlugin(ScrollTrigger);if(window.Lenis&&!reduced){lenis=new Lenis({duration:1.15,smoothWheel:true,wheelMultiplier:.9,anchors:false});lenis.on('scroll',()=>{if(hasGSAP)ScrollTrigger.update();});if(hasGSAP){gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}else{const loop=t=>{lenis.raf(t);requestAnimationFrame(loop);};requestAnimationFrame(loop);}}
    initMagneticCursor();
    if(hasGSAP){
      const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{
        const hero=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:()=>`+=${innerHeight*2.2}`,pin:'.hero-stage',scrub:1.1,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{$('.hero').dataset.scene=self.progress<.3?'portrait':self.progress<.65?'merge':'identity';$('.portrait-parallax').style.setProperty('--portrait-dim',String(1-self.progress*.65));$('.hero-scene').innerHTML=`0${self.progress<.3?1:self.progress<.65?2:3} <i>/</i> 03`;}}});
        hero.to('.portrait-scroll',{scale:.4,yPercent:-9,opacity:.22,duration:.7,ease:'power2.inOut'},0)
          .to('.hero-home',{xPercent:-30,y:-70,opacity:0,duration:.45},0)
          .to('.hero-court',{xPercent:30,y:70,opacity:0,duration:.45},0)
          .to('.hero-left,.next-game,.hero-script,.hero-topline,.hero-bottom',{opacity:0,y:-30,duration:.25},0)
          .to('.portrait-scroll',{opacity:0,scale:.32,duration:.35},.65)
          .fromTo('.brand-reveal',{autoAlpha:0,scale:1.6,rotation:-5},{autoAlpha:1,scale:1,rotation:0,duration:.45,ease:'power3.out'},.45)
          .fromTo('.nba-lockup',{x:-130,rotation:-18},{x:0,rotation:0,duration:.5,ease:'power3.out'},.5)
          .fromTo('.hupu-lockup',{x:130,rotation:15},{x:0,rotation:0,duration:.5,ease:'power3.out'},.5)
          .fromTo('.collab-x',{scale:0,rotation:90},{scale:1,rotation:0,duration:.3},.65)
          .to('.brand-reveal',{y:-30,duration:.25},1.1);
        mm.add('(min-width:1000px) and (prefers-reduced-motion:no-preference)',initHorizontalStory);
        $$('.reveal').forEach(el=>gsap.fromTo(el,{y:65,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 91%',once:true}}));
        gsap.fromTo('.match-card',{y:120,rotationX:18,rotationZ:i=>(i-1)*7,opacity:0},{y:0,rotationX:0,rotationZ:0,opacity:1,duration:1,stagger:.15,ease:'power3.out',clearProps:'transform',scrollTrigger:{trigger:'.match-grid',start:'top 87%',once:true}});
        gsap.fromTo('#social-fan',{y:160,scale:.8,opacity:.5},{y:0,scale:1,opacity:1,scrollTrigger:{trigger:'.social',start:'top 70%',end:'bottom 100%',scrub:1}});
        gsap.fromTo('.partner-script',{x:-150},{x:150,scrollTrigger:{trigger:'.partners',start:'top bottom',end:'bottom top',scrub:1}});
        gsap.to('.hero-contours',{rotation:8,scale:1.15,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:2}});
      });
      $$('.stat [data-count]').forEach(el=>{const value={n:0},decimals=Number(el.dataset.decimals||0);gsap.to(value,{n:Number(el.dataset.count),duration:2.2,ease:'power2.out',onUpdate:()=>el.textContent=value.n.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals}),scrollTrigger:{trigger:el,start:'top 95%',once:true}});});
    }else{$$('[data-count]').forEach(el=>el.textContent=Number(el.dataset.count).toLocaleString());}
    if(reduced){$('.brand-reveal').style.display='none';$$('[data-count]').forEach(el=>el.textContent=Number(el.dataset.count).toLocaleString());}
    const header=$('.header'),progress=$('.page-progress');let scrollFrame=0;const update=()=>{scrollFrame=0;header.classList.toggle('scrolled',scrollY>50);const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?scrollY/total:0})`;};addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(update);},{passive:true});update();
    if(fine&&!reduced){
      const portrait=$('.portrait-parallax');
      $('.hero-stage').addEventListener('pointermove',e=>{
        if(!hasGSAP)return;
        const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
        gsap.to(portrait,{x:x*12,y:y*8,duration:1,overwrite:'auto'});
        gsap.to('.hero-script',{x:-x*25,y:-y*12,duration:1,overwrite:'auto'});
      });
      $('.hero-stage').addEventListener('pointerleave',()=>{if(hasGSAP)gsap.to(portrait,{x:0,y:0,duration:1});});
    }
    const video=$('.split-panel video');new IntersectionObserver(entries=>{const active=entries[0].isIntersecting;if(active&&!reduced){if(!video.src)video.src=video.dataset.src;video.play().catch(()=>{});}else video.pause();},{threshold:.12}).observe(video);
    addEventListener('resize',()=>{sizeParticles();refresh();},{passive:true});document.fonts.ready.then(refresh);$$('img').forEach(img=>{if(!img.complete)img.addEventListener('load',refresh,{once:true});});refresh();
  }

  // Critical assets only: lazy photo archives never block the opening.
  document.body.classList.add('loading');renderJerseys();renderTopics();renderMatches();renderPartners();initMotion();
  const loader=$('#preloader'),number=$('.load-number'),bar=$('.load-track i');let entered=false,count=0,settled=0;const started=performance.now();
  const critical=['assets/hero-portrait.webp','assets/nba.svg','assets/hupu-logo-red.svg'];critical.forEach(src=>{const img=new Image();img.onload=img.onerror=()=>settled++;img.src=src;});
  function enter(){if(entered)return;entered=true;document.body.classList.remove('loading');number.innerHTML='100<span>%</span>';bar.style.width='100%';lenis?.start();if(hasGSAP&&!reduced){gsap.to(loader,{yPercent:-105,duration:1,ease:'power4.inOut',onComplete:()=>loader.remove()});if(scrollY<100){gsap.fromTo('.hero-home',{y:100,opacity:0},{y:0,opacity:1,duration:1.2,delay:.35,clearProps:'transform,opacity'});gsap.fromTo('.portrait-parallax',{scale:1.1,opacity:0},{scale:1,opacity:1,duration:1.3,delay:.35,clearProps:'transform,opacity'});}}else loader.remove();refresh();}
  lenis?.stop();$('#skip-loader').addEventListener('click',enter);function tick(now){if(entered)return;const elapsed=now-started,target=Math.min(100,settled/critical.length*70+Math.min(30,elapsed/50));count=Math.min(target,count+1.7);number.innerHTML=`${String(Math.floor(count)).padStart(2,'0')}<span>%</span>`;bar.style.width=`${count}%`;if((count>=99.5&&elapsed>1500)||elapsed>4500)enter();else requestAnimationFrame(tick);}requestAnimationFrame(tick);setTimeout(enter,5000);
})();
