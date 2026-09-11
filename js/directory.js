document.addEventListener('DOMContentLoaded',()=>{
 const list=document.getElementById('standDirectory');if(!list)return;
 const cards=[...list.querySelectorAll('.stand-card')],search=document.getElementById('standSearch'),state=document.getElementById('standState'),status=document.getElementById('directoryStatus'),more=document.getElementById('showMoreStands'),near=document.getElementById('findNearMe');
 let limit=24,position=null;
 function distance(a,b,c,d){const rad=Math.PI/180,x=(c-a)*rad,y=(d-b)*rad;return 3958.8*2*Math.asin(Math.sqrt(Math.sin(x/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin(y/2)**2));}
 function render(){
  const q=search.value.trim().toLowerCase();let found=cards.filter(c=>(!state.value||c.dataset.state===state.value)&&(!q||c.dataset.search.includes(q)));
  cards.forEach(c=>c.hidden=true);
  if(position){found.sort((a,b)=>Number(a.dataset.distance)-Number(b.dataset.distance));found.forEach(c=>list.append(c));}
  found.slice(0,limit).forEach(c=>c.hidden=false);status.textContent=`Showing ${Math.min(limit,found.length)} of ${found.length} matching stands${position?' · nearest first':''}.`;more.hidden=found.length<=limit;
 }
 search.addEventListener('input',()=>{limit=24;render();});state.addEventListener('change',()=>{limit=24;render();});more.addEventListener('click',()=>{limit+=24;render();});
 function locate(){
  const note=document.getElementById('nearMeStatus');if(!navigator.geolocation){note.textContent='Location is unavailable in this browser. Search by city, state or ZIP instead.';return;}
  near.disabled=true;note.textContent='Waiting for location permission…';
  navigator.geolocation.getCurrentPosition(p=>{
   position=p.coords;search.value='';state.value='';limit=24;
   cards.forEach(c=>{const lat=Number(c.dataset.lat),lng=Number(c.dataset.lng);const miles=c.dataset.lat&&c.dataset.lng?distance(position.latitude,position.longitude,lat,lng):Infinity;c.dataset.distance=miles;const label=c.querySelector('.stand-distance');label.textContent=Number.isFinite(miles)?`${miles.toFixed(1)} miles away (straight-line distance)`:'';});
   near.disabled=false;note.textContent='Sorted by distance. Your coordinates stay in this browser; they are not sent to this website.';render();
  },e=>{near.disabled=false;note.textContent=e.code===1?'Location permission was declined. You can still search by city, state or ZIP.':'Could not get your location. Try again or search by city, state or ZIP.';},{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
 }
 near.addEventListener('click',locate);render();
 if(new URLSearchParams(location.search).get('near')==='1')locate();
});
