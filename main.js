function ipToInt(ip){return ip.split('.').reduce((a,o)=>(a<<8)+Number(o),0)>>>0}
function intToIp(int){return[(int>>>24)&255,(int>>>16)&255,(int>>>8)&255,int&255].join('.')}
function cidrToMask(cidr){if(cidr===0)return'0.0.0.0';return intToIp((~((2**(32-cidr))-1))>>>0)}
function getClass(ip){const f=Number(ip.split('.')[0]);if(f<=127)return'Class A';if(f<=191)return'Class B';if(f<=223)return'Class C';return'Other'}
function isPrivate(ip){const p=ip.split('.').map(Number);return p[0]===10||(p[0]===172&&p[1]>=16&&p[1]<=31)||(p[0]===192&&p[1]===168)}
function validIp(ip){const p=ip.split('.');if(p.length!==4)return false;return p.every(x=>{const n=Number(x);return Number.isInteger(n)&&n>=0&&n<=255})}

function calculate(){
  const ip=document.getElementById('ip').value.trim();
  const cidr=Number(document.getElementById('cidr').value);
  if(!validIp(ip)||!Number.isInteger(cidr)||cidr<0||cidr>32)return alert('Invalid input');

  const ipInt=ipToInt(ip);
  const maskInt=cidr===0?0:((~((2**(32-cidr))-1))>>>0);

  const network=(ipInt & maskInt)>>>0;
  const broadcast=(network | (~maskInt>>>0))>>>0;

  const total=2**(32-cidr);
  const usable=cidr>=31?Math.max(total-2,0):total-2;

  const firstIP=usable>0?network+1:network;
  const lastIP=usable>0?broadcast-1:broadcast;

  document.getElementById('output').innerHTML=`
    <div class="section-title">🔍 Basic Info</div>
    <div class="grid">
      <div class="card">IP Class: ${getClass(ip)}</div>
      <div class="card">Type: ${isPrivate(ip)?'Private':'Public'}</div>
      <div class="card">Subnet Mask: ${cidrToMask(cidr)}</div>
    </div>

    <div class="section-title">📡 Network Details</div>
    <div class="grid">
      <div class="card">Network: ${intToIp(network)}</div>
      <div class="card">Broadcast: ${intToIp(broadcast)}</div>
      <div class="card">Total IP: ${total}</div>
      <div class="card">Usable Host: ${usable}</div>
      <div class="card">First IP: ${intToIp(firstIP)}</div>
      <div class="card">Last IP: ${intToIp(lastIP)}</div>
    </div>
  `;
}

function clearAll(){
  document.getElementById('ip').value='';
  document.getElementById('cidr').value='';
  document.getElementById('output').innerHTML='';
}