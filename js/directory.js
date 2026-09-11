document.addEventListener('DOMContentLoaded',()=>{
 const list=document.getElementById('standDirectory');if(!list)return;
 const search=document.getElementById('standSearch'),state=document.getElementById('standState'),status=document.getElementById('directoryStatus'),more=document.getElementById('showMoreStands'),near=document.getElementById('findNearMe');
 let cards=[],limit=24,position=null,ready=false;

 function distance(a,b,c,d){const rad=Math.PI/180,x=(c-a)*rad,y=(d-b)*rad;return 3958.8*2*Math.asin(Math.sqrt(Math.sin(x/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin(y/2)**2));}

 function buildCard(s){
  const art=document.createElement('article');
  art.className='stand-card';
  art.dataset.lat=s.lat;art.dataset.lng=s.lng;art.dataset.search=s.search;art.dataset.state=s.state;
  const h2=document.createElement('h2');h2.textContent=s.h2;art.appendChild(h2);
  const addr=document.createElement('address');addr.innerHTML=s.addr;art.appendChild(addr);
  const distP=document.createElement('p');distP.className='stand-distance';
  if(Number.isFinite(s._distance))distP.textContent=`${s._distance.toFixed(1)} miles away (straight-line distance)`;
  art.appendChild(distP);
  const details=document.createElement('details');
  const summary=document.createElement('summary');summary.textContent='Weekly hours & contact';details.appendChild(summary);
  const hoursDiv=document.createElement('div');hoursDiv.className='stand-hours';hoursDiv.innerHTML=s.hours;details.appendChild(hoursDiv);
  art.appendChild(details);
  const a1=document.createElement('a');a1.href=s.official;a1.textContent='Official stand details ↗';art.appendChild(a1);
  art.appendChild(document.createTextNode(' · '));
  const a2=document.createElement('a');a2.href=s.maps;a2.textContent='Map & directions ↗';art.appendChild(a2);
  return art;
 }

 function render(){
  if(!ready)return;
  const q=search.value.trim().toLowerCase();
  let found=cards.filter(c=>(!state.value||c.state===state.value)&&(!q||c.search.includes(q)));
  if(position)found=found.slice().sort((a,b)=>(a._distance??Infinity)-(b._distance??Infinity));
  const visible=found.slice(0,limit);
  list.replaceChildren(...visible.map(buildCard));
  status.textContent=`Showing ${Math.min(limit,found.length)} of ${found.length} matching stands${position?' · nearest first':''}.`;
  more.hidden=found.length<=limit;
 }

 search.addEventListener('input',()=>{limit=24;render();});
 state.addEventListener('change',()=>{limit=24;render();});
 more.addEventListener('click',()=>{limit+=24;render();});

 function locate(){
  const note=document.getElementById('nearMeStatus');if(!navigator.geolocation){note.textContent='Location is unavailable in this browser. Search by city, state or ZIP instead.';return;}
  near.disabled=true;note.textContent='Waiting for location permission…';
  navigator.geolocation.getCurrentPosition(p=>{
   position=p.coords;search.value='';state.value='';limit=24;
   cards.forEach(c=>{const lat=Number(c.lat),lng=Number(c.lng);c._distance=(c.lat&&c.lng)?distance(position.latitude,position.longitude,lat,lng):Infinity;});
   near.disabled=false;note.textContent='Sorted by distance. Your coordinates stay in this browser; they are not sent to this website.';render();
  },e=>{near.disabled=false;note.textContent=e.code===1?'Location permission was declined. You can still search by city, state or ZIP.':'Could not get your location. Try again or search by city, state or ZIP.';},{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
 }
 near.addEventListener('click',locate);

 fetch('data/stands.json').then(r=>r.json()).then(data=>{
  cards=data;ready=true;render();
  if(new URLSearchParams(location.search).get('near')==='1')locate();
 }).catch(()=>{status.textContent='The stand directory could not load. Refresh the page, or use the official 7 Brew location finder linked above.';});
});
