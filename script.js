document.addEventListener('DOMContentLoaded', ()=>{
  const year=document.getElementById('year');
  year.textContent=new Date().getFullYear();

  const modal=document.getElementById('modalRegistro');
  const form=document.getElementById('formRegistro');
  const userSummary=document.getElementById('userSummary');

  const usuario=JSON.parse(localStorage.getItem('greensoft_user'));
  if(usuario){mostrarUsuario(usuario);modal.style.display='none';}

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const u={
      id:'G'+Date.now(),
      nombres:form.nombres.value,
      apellidos:form.apellidos.value,
      grado:form.grado.value,
      aula:form.aula.value
    };
    localStorage.setItem('greensoft_user',JSON.stringify(u));
    mostrarUsuario(u);
    modal.style.display='none';
  });

  function mostrarUsuario(u){
    userSummary.innerHTML=`<strong>${u.nombres} ${u.apellidos}</strong> • ${u.grado} - Aula ${u.aula} • ID: ${u.id}`;
  }

  // Proyectos
  const formProyecto=document.getElementById('formProyecto');
  const lista=document.getElementById('listaProyectos');
  formProyecto.addEventListener('submit',e=>{
    e.preventDefault();
    const t=document.getElementById('tituloProyecto').value.trim();
    const d=document.getElementById('descProyecto').value.trim();
    if(!t||!d)return;
    const p=JSON.parse(localStorage.getItem('greensoft_proj')||'[]');
    p.unshift({t,d,f:new Date().toLocaleString()});
    localStorage.setItem('greensoft_proj',JSON.stringify(p));
    render();
    formProyecto.reset();
  });
  function render(){
    const p=JSON.parse(localStorage.getItem('greensoft_proj')||'[]');
    lista.innerHTML=p.map(x=>`<div class="card"><h4>${x.t}</h4><p>${x.d}</p><small>${x.f}</small></div>`).join('');
  }
  render();

  // Aportes
  const formA=document.getElementById('formAporte');
  const total=document.getElementById('totalBotellas');
  formA.addEventListener('submit',e=>{
    e.preventDefault();
    const n=Number(document.getElementById('cantBotellas').value);
    const a=JSON.parse(localStorage.getItem('greensoft_aporte')||'[]');
    a.push(n);
    localStorage.setItem('greensoft_aporte',JSON.stringify(a));
    total.textContent='Total registrado: '+a.reduce((x,y)=>x+y,0);
    formA.reset();
  });
});
