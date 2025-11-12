// ReciclaTec - script.js
// Guarda datos de usuario en localStorage y maneja interacciones básicas

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalRegistro');
  const formRegistro = document.getElementById('formRegistro');
  const userSummary = document.getElementById('userSummary');
  const yearSpan = document.getElementById('year');

  yearSpan.textContent = new Date().getFullYear();

  // Revisar si ya existe usuario en localStorage
  const usuario = JSON.parse(localStorage.getItem('recicla_usuario'));
  if (usuario && usuario.id) {
    mostrarUsuario(usuario);
    modal.style.display = 'none';
  } else {
    modal.style.display = 'flex';
  }

  // Generador simple de ID
  function generarId() {
    return 'R' + Date.now().toString().slice(-6) + Math.floor(Math.random()*90+10);
  }

  // Manejar registro
  formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const grado = document.getElementById('grado').value.trim();
    const aula = document.getElementById('aula').value.trim();

    const usuario = {
      id: generarId(),
      nombres, apellidos, grado, aula,
      registradoEn: new Date().toISOString()
    };
    localStorage.setItem('recicla_usuario', JSON.stringify(usuario));
    mostrarUsuario(usuario);
    modal.style.display = 'none';
  });

  function mostrarUsuario(u) {
    userSummary.innerHTML = `<strong>${u.nombres} ${u.apellidos}</strong> • ${u.grado} - Aula ${u.aula} • ID: <span class="id">${u.id}</span>`;
    // Actualizar estadisticas iniciales
    cargarEstadisticasBasicas();
  }

  // --- Mini actividad: respuesta de botón
  const optionButtons = document.querySelectorAll('.option');
  const feedback = document.getElementById('feedbackActividad');

  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const a = btn.getAttribute('data-answer');
      if (a === 'bien') {
        feedback.textContent = '¡Correcto! La botella va al tacho amarillo.';
        feedback.style.color = 'green';
      } else {
        feedback.textContent = 'Casi... esa opción no es correcta. Inténtalo de nuevo.';
        feedback.style.color = '#c0392b';
      }
    });
  });

  // --- Proyectos: publicar y listar
  const formProyecto = document.getElementById('formProyecto');
  const listaProyectos = document.getElementById('listaProyectos');

  formProyecto.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('tituloProyecto').value.trim();
    const desc = document.getElementById('descProyecto').value.trim();
    if (!titulo || !desc) return;

    const proyectos = JSON.parse(localStorage.getItem('recicla_proyectos') || '[]');
    const nuevo = {
      id: 'P' + Date.now(),
      titulo, desc,
      autor: JSON.parse(localStorage.getItem('recicla_usuario'))?.nombres || 'Anónimo',
      fecha: new Date().toLocaleString()
    };
    proyectos.unshift(nuevo);
    localStorage.setItem('recicla_proyectos', JSON.stringify(proyectos));
    formProyecto.reset();
    renderProyectos();
  });

  function renderProyectos(){
    const proyectos = JSON.parse(localStorage.getItem('recicla_proyectos') || '[]');
    listaProyectos.innerHTML = proyectos.map(p => `
      <div class="proy">
        <strong>${p.titulo}</strong>
        <p>${p.desc}</p>
        <small>Publicado por ${p.autor} • ${p.fecha}</small>
      </div>
    `).join('');
  }
  renderProyectos();

  // --- EcoRetos: registrar aportes de botellas
  const formAporte = document.getElementById('formAporte');
  const totalBotellas = document.getElementById('totalBotellas');

  function cargarEstadisticasBasicas() {
    // Simulamos algunos números si no existen
    const stats = JSON.parse(localStorage.getItem('recicla_stats') || '{}');
    if (!stats.residuosEstimados) {
      stats.residuosEstimados = 320; // ejemplo colegio
    }
    if (!stats.reciclable) {
      stats.reciclable = 180;
    }
    if (!stats.participantes) {
      stats.participantes = JSON.parse(localStorage.getItem('recicla_proyectos') || '[]').length || 0;
    }
    localStorage.setItem('recicla_stats', JSON.stringify(stats));

    document.getElementById('estResiduos').textContent = stats.residuosEstimados;
    document.getElementById('estReciclable').textContent = stats.reciclable;
    document.getElementById('participacion').textContent = stats.participantes;
  }

  // actualizar totales guardados
  function actualizarTotalBotellas(change){
    const aporte = JSON.parse(localStorage.getItem('recicla_aportes') || '[]');
    const total = aporte.reduce((s,x) => s + Number(x.cantidad || 0), 0);
    totalBotellas.textContent = 'Total registrado: ' + total;
  }

  formAporte.addEventListener('submit', (e) => {
    e.preventDefault();
    const cantidad = Number(document.getElementById('cantBotellas').value || 0);
    if (cantidad <= 0) return;
    const aporte = JSON.parse(localStorage.getItem('recicla_aportes') || '[]');
    const user = JSON.parse(localStorage.getItem('recicla_usuario') || '{}');
    aporte.push({id: 'A' + Date.now(), usuario: user.id || 'anon', cantidad, fecha: new Date().toLocaleString()});
    localStorage.setItem('recicla_aportes', JSON.stringify(aporte));
    document.getElementById('cantBotellas').value = 0;
    actualizarTotalBotellas();
    // opcional: aumentar estadistica de participacion
    const stats = JSON.parse(localStorage.getItem('recicla_stats') || '{}');
    stats.participantes = new Set((JSON.parse(localStorage.getItem('recicla_aportes')||'[]').map(a=>a.usuario))).size;
    localStorage.setItem('recicla_stats', JSON.stringify(stats));
    cargarEstadisticasBasicas();
  });

  // Inicializar totales y estadisticas
  actualizarTotalBotellas();
  cargarEstadisticasBasicas();

  // Rellenar ranking simulado (opcional: podrías generar dinámico por aulas)
  function cargarRankingSimulado(){
    const ranking = [
      {aula:'A', valor:12},
      {aula:'B', valor:9},
      {aula:'C', valor:5}
    ];
    const el = document.getElementById('rankingList');
    el.innerHTML = ranking.map(r => `<li>Aula ${r.aula} - ${r.valor}</li>`).join('');
  }
  cargarRankingSimulado();

}); // DOMContentLoaded