document.addEventListener('DOMContentLoaded', () => {
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.drink-stage').forEach(stage => {
  const cards = [...stage.querySelectorAll('.orbit-drink')], pause = stage.querySelector('[data-orbit="pause"]');
  let current = 0, paused = preference.matches, hovering = false, focused = false;
  function show(delta) {current = (current + delta + cards.length) % cards.length; cards.forEach((card,i) => {const position = (i-current+cards.length)%cards.length;card.dataset.position=position;card.tabIndex=position===0?0:-1;card.setAttribute('aria-hidden',position===0?'false':'true');});}
  function label(){pause.textContent=paused?'Play rotation':'Pause rotation';pause.setAttribute('aria-label',pause.textContent);}
  stage.querySelector('[data-orbit="prev"]').addEventListener('click',()=>show(-1));stage.querySelector('[data-orbit="next"]').addEventListener('click',()=>show(1));
  pause.addEventListener('click',()=>{paused=!paused;label();});stage.addEventListener('mouseenter',()=>hovering=true);stage.addEventListener('mouseleave',()=>hovering=false);stage.addEventListener('focusin',()=>focused=true);stage.addEventListener('focusout',e=>focused=stage.contains(e.relatedTarget));preference.addEventListener('change',()=>{paused=preference.matches;label();});
  setInterval(()=>{if(!paused&&!hovering&&!focused&&!document.hidden)show(1);},4800);label();
 });
 document.querySelectorAll('.product-turntable').forEach(figure=>{const button=figure.querySelector('.photo-motion-toggle');let paused=preference.matches;function sync(){figure.classList.toggle('motion-paused',paused);button.textContent=paused?'Play rotation':'Pause rotation';button.setAttribute('aria-label',button.textContent);}button.addEventListener('click',()=>{paused=!paused;sync();});preference.addEventListener('change',()=>{paused=preference.matches;sync();});sync();});
});
