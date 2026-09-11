document.addEventListener('DOMContentLoaded', () => {
 const toggle=document.getElementById('navToggleBtn'),nav=document.getElementById('mainNav');if(!toggle||!nav)return;
 function close(){nav.classList.remove('nav-open');toggle.setAttribute('aria-expanded','false');}
 toggle.addEventListener('click',()=>{const open=nav.classList.toggle('nav-open');toggle.setAttribute('aria-expanded',String(open));});
 document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('nav-open')){close();toggle.focus();}});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));matchMedia('(min-width:1101px)').addEventListener('change',close);
});

document.addEventListener('DOMContentLoaded', () => {
 document.querySelectorAll('details.nav-more').forEach((d) => {
  document.addEventListener('click', (e) => { if (!d.contains(e.target)) d.removeAttribute('open'); });
  d.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => d.removeAttribute('open')));
 });
});
