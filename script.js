document.addEventListener('DOMContentLoaded', () => {

  //==================================================================//
  //  LÓGICA PARA EL MODAL DE "LA TRANSFORMACIÓN EN NÚMEROS"
  //==================================================================//
  const modal = document.getElementById('modal-desglose');
  if (modal) {
    const closeModalBtn = document.getElementById('modal-close');
    const btnsDesglose = document.querySelectorAll('.btn-desglose');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalChartCanvas = document.getElementById('tramite-chart');
    let currentModalChart = null;

    const datosTramites = {
      tramiteA: {
        titulo: "Desglose del Trámite A",
        descripcion: "Resultados acumulados del último trimestre para el Trámite A.",
        grafica: { labels: ['Enero', 'Febrero', 'Marzo'], data: [4000, 6000, 5000] }
      },
      tramiteB: {
        titulo: "Desglose del Trámite B",
        descripcion: "Comparativa de solicitudes recibidas vs. resueltas para el Trámite B.",
        grafica: { labels: ['Recibidas', 'Resueltas', 'Pendientes'], data: [12000, 8500, 3500] }
      }
    };

    const openModal = (tramiteId) => {
      const datos = datosTramites[tramiteId];
      if (!datos) return;

      modalTitle.textContent = datos.titulo;
      modalDescription.textContent = datos.descripcion;

      if (currentModalChart) currentModalChart.destroy();
      currentModalChart = new Chart(modalChartCanvas, {
        type: 'bar',
        data: {
          labels: datos.grafica.labels,
          datasets: [{
            label: 'Número de Casos',
            data: datos.grafica.data,
            backgroundColor: 'rgba(13, 115, 119, 0.7)',
            borderColor: 'rgba(13, 115, 119, 1)',
            borderWidth: 1
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
      });
      modal.classList.add('active');
    };

    const closeModal = () => {
      modal.classList.remove('active');
      setTimeout(() => { if (currentModalChart) currentModalChart.destroy(); }, 300);
    };

    btnsDesglose.forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.tramite)));
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  }

  //==================================================================//
  //  LÓGICA PARA LA SECCIÓN "SIMPLIFICACIÓN POR TEMÁTICA"
  //==================================================================//
  const tematicaChartCanvas = document.getElementById('tematica-chart');
  if (tematicaChartCanvas) {
    const legendList = document.getElementById('tematica-legend-list');
    const detailsPanel = document.getElementById('tematica-details-panel');
    let tematicaChart = null;
    const datosTematicas = {
        salud: { label: "Salud", tramitesSimplificados: 35, color: "#0D7377", details: { digitalizados: 18, reduccionPasos: 45, tiempoAhorrado: 12000 } },
        educacion: { label: "Educación", tramitesSimplificados: 25, color: "#86B6B8", details: { digitalizados: 22, reduccionPasos: 55, tiempoAhorrado: 9500 } },
        economia: { label: "Economía y Finanzas", tramitesSimplificados: 20, color: "#FFC107", details: { digitalizados: 15, reduccionPasos: 30, tiempoAhorrado: 8000 } },
        seguridad: { label: "Seguridad y Justicia", tramitesSimplificados: 15, color: "#323232", details: { digitalizados: 9, reduccionPasos: 25, tiempoAhorrado: 6000 } }
    };

    const mostrarDetalles = (themeKey) => {
      const themeData = datosTematicas[themeKey];
      if (!themeData) return;
      detailsPanel.innerHTML = `<h4>Detalles de ${themeData.label}</h4><p><strong>Trámites Simplificados:</strong> ${themeData.tramitesSimplificados}</p><p><strong>Totalmente Digitalizados:</strong> ${themeData.details.digitalizados}</p><p><strong>Reducción de Pasos Promedio:</strong> ${themeData.details.reduccionPasos}%</p><p><strong>Horas Ahorradas a la Ciudadanía:</strong> ${themeData.details.tiempoAhorrado.toLocaleString('es-MX')}</p>`;
      document.querySelectorAll('#tematica-legend-list li').forEach(li => li.classList.toggle('active', li.dataset.theme === themeKey));
    };

    const labels = Object.values(datosTematicas).map(d => d.label);
    const data = Object.values(datosTematicas).map(d => d.tramitesSimplificados);
    const colors = Object.values(datosTematicas).map(d => d.color);

    legendList.innerHTML = '';
    Object.keys(datosTematicas).forEach((key, index) => {
      const theme = datosTematicas[key];
      const li = document.createElement('li');
      li.dataset.theme = key;
      li.innerHTML = `<span class="legend-color-dot" style="background-color: ${theme.color};"></span><span class="legend-label">${theme.label}</span><span class="legend-value">${theme.tramitesSimplificados}</span>`;
      li.addEventListener('click', () => mostrarDetalles(key));
      li.addEventListener('mouseover', () => { if (tematicaChart) { tematicaChart.setActiveElements([{ datasetIndex: 0, index: index }]); tematicaChart.update(); } });
      li.addEventListener('mouseout', () => { if (tematicaChart) { tematicaChart.setActiveElements([]); tematicaChart.update(); } });
      legendList.appendChild(li);
    });

    tematicaChart = new Chart(tematicaChartCanvas, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: '#FFFFFF', borderWidth: 4, hoverOffset: 20 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: true } } }
    });

    const primeraTematica = Object.keys(datosTematicas)[0];
    if (primeraTematica) mostrarDetalles(primeraTematica);
  }

  //==================================================================//
  //  ANIMACIÓN DE CONTADORES PARA INDICADORES CLAVE
  //==================================================================//
  const kpiSection = document.getElementById('indicadores-clave');
  if (kpiSection) {
    const animateKpiNumbers = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.kpi-number');
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 10);
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                clearInterval(timer);
                counter.innerText = target.toLocaleString('es-MX', {maximumFractionDigits: 1});
              } else {
                counter.innerText = (current % 1 === 0 ? current : current.toFixed(1)).toLocaleString('es-MX');
              }
            }, 10);
          });
          observer.unobserve(entry.target);
        }
      });
    };
    const kpiObserver = new IntersectionObserver(animateKpiNumbers, { threshold: 0.5 });
    kpiObserver.observe(kpiSection);
  }

  //==================================================================//
  //  ANIMACIÓN DE BARRAS PARA RANKING DE DEPENDENCIAS
  //==================================================================//
  const dependenciasSection = document.getElementById('dependencias-impacto');
  if (dependenciasSection) {
    const rankingBars = document.querySelectorAll('.ranking-bar');
    rankingBars.forEach(bar => {
      bar.setAttribute('data-width', bar.style.width);
      bar.style.width = '0%';
    });
    const animateRankingBars = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          rankingBars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
          });
          observer.unobserve(entry.target);
        }
      });
    };
    const rankingObserver = new IntersectionObserver(animateRankingBars, { threshold: 0.2 });
    rankingObserver.observe(dependenciasSection);
  }

  //==================================================================//
  //  NUEVO: LÓGICA PARA EL MODAL DE LA SECCIÓN DE ESTRATEGIA
  //==================================================================//
  const estrategiaModal = document.getElementById('modal-estrategia');
  if (estrategiaModal) {
    const closeEstrategiaModalBtn = document.getElementById('modal-estrategia-close');
    const btnsDesgloseEstrategia = document.querySelectorAll('.btn-desglose-estrategia');
    const estrategiaModalBody = document.getElementById('modal-estrategia-body');

    const datosEstrategia = {
      atencion: {
        titulo: "👥 Nuevo Modelo de Atención Ciudadana",
        contenido: `<h3>El Reto</h3><p>La interacción con el gobierno era fragmentada y compleja. El ciudadano debía visitar múltiples oficinas, a menudo sin saber a dónde ir. Nuestro objetivo fue crear un punto de contacto único, eficiente y humano.</p><h3>Acciones Clave Implementadas</h3><ul><li>Diseño arquitectónico y funcional del nuevo Centro de Atención en Ciudad de Gobierno.</li><li>Centralización de los 30 trámites de mayor demanda en un solo lugar.</li><li>Implementación de un sistema de turnos digital para eliminar filas y optimizar la espera.</li><li>Creación de un área de "Primer Contacto" para guiar y asesorar a los ciudadanos.</li></ul><h3>Próximos Pasos</h3><p>Inauguración de la Fase 1 del Centro de Atención en diciembre de 2025. Integración de 20 trámites adicionales y lanzamiento de la app móvil para agendar citas y dar seguimiento.</p>`
      },
      capacitacion: {
        titulo: "🎓 Capacitación y Profesionalización",
        contenido: `<h3>El Reto</h3><p>La transformación digital no es solo tecnología, es cultura. Necesitábamos servidores públicos con una mentalidad de servicio, empoderados con las herramientas para resolver problemas de manera efectiva.</p><h3>Acciones Clave Implementadas</h3><ul><li>Programa "Servidor Público de 10": Cursos intensivos en empatía y comunicación efectiva.</li><li>Talleres "Lean Government": Capacitación en metodologías ágiles para la reingeniería de procesos.</li><li>Certificación obligatoria en las nuevas plataformas digitales del estado.</li><li>Creación de un sistema de incentivos basado en la satisfacción ciudadana.</li></ul><h3>Resultados Medibles</h3><p><strong>1,582 horas de capacitación</strong> impartidas. <strong>412 servidores públicos</strong> certificados. La retroalimentación ciudadana sobre la calidad de la atención ha mejorado en un <strong>45%</strong> en las áreas intervenidas.</p>`
      },
      tecnologia: {
          titulo: "⚙️ Reingeniería y Tecnología de Punta",
          contenido: `<h3>El Reto</h3><p>Los sistemas gubernamentales eran obsoletos, aislados y no se comunicaban entre sí, obligando al ciudadano a presentar el mismo documento una y otra vez. El objetivo era crear un ecosistema digital unificado.</p><h3>Acciones Clave Implementadas</h3><ul><li>Plataforma de Interoperabilidad del Estado (PIE): Permite que las dependencias compartan información de forma segura y en tiempo real.</li><li>"Mi Carpeta Ciudadana": Un repositorio digital donde los ciudadanos pueden guardar sus documentos oficiales una sola vez.</li><li>Automatización Robótica de Procesos (RPA) para validaciones internas, reduciendo el tiempo de respuesta de días a minutos.</li></ul><h3>Impacto Tecnológico</h3><p>La PIE ya conecta a 7 dependencias clave. Más de <strong>50,000 hidalguenses</strong> han activado "Mi Carpeta Ciudadana", ahorrando un estimado de <strong>200,000 viajes</strong> a oficinas gubernamentales.</p>`
      },
      regulacion: {
          titulo: "⚖️ Marco Regulatorio Ágil",
          contenido: `<h3>El Reto</h3><p>Las leyes y reglamentos eran a menudo la mayor barrera para la simplificación. Se necesitaba un fundamento legal que no solo permitiera el cambio, sino que lo exigiera y lo hiciera sostenible a largo plazo.</p><h3>Acciones Clave Implementadas</h3><ul><li>Creación, socialización y aprobación de la nueva Ley de Mejora Regulatoria del Estado de Hidalgo.</li><li>Digitalización y puesta en línea del Catálogo Estatal de Trámites y Servicios, haciéndolo 100% público y transparente.</li><li>Establecimiento de un Consejo de Mejora Regulatoria con participación ciudadana y empresarial.</li><li>Decreto de "Cero Papel" para la creación de nuevas regulaciones internas.</li></ul><h3>Garantía a Futuro</h3><p>La nueva ley obliga a todas las dependencias a revisar y simplificar el 50% de sus trámites en los próximos 2 años y establece sanciones para quien cree nuevos requisitos sin justificación. <strong>La simplificación ya no es una opción, es la ley.</strong></p>`
      }
    };

    const openEstrategiaModal = (pilarId) => {
      const datos = datosEstrategia[pilarId];
      if (!datos) return;
      estrategiaModalBody.innerHTML = `<h2>${datos.titulo}</h2>${datos.contenido}`;
      estrategiaModal.classList.add('active');
    };

    const closeEstrategiaModal = () => {
      estrategiaModal.classList.remove('active');
    };

    btnsDesgloseEstrategia.forEach(btn => btn.addEventListener('click', () => openEstrategiaModal(btn.dataset.pilar)));
    closeEstrategiaModalBtn.addEventListener('click', closeEstrategiaModal);
    estrategiaModal.addEventListener('click', (e) => { if (e.target === estrategiaModal) closeEstrategiaModal(); });
  }

  ///==================================================================//
  //  NUEVO: LÓGICA PARA EL MODAL DE AGENDAS ANUALES
  //==================================================================//
  const agendaModal = document.getElementById('modal-agenda');
  if (agendaModal) {
    const closeAgendaModalBtn = document.getElementById('modal-agenda-close');
    const btnsAgenda = document.querySelectorAll('.btn-agenda');
    const agendaModalTitle = document.getElementById('modal-agenda-title');
    const agendaModalSubtitle = document.getElementById('modal-agenda-subtitle');
    const agendaModalContent = document.getElementById('modal-agenda-content');

    const datosAgendas = {
      regulatoria: {
        title: "Agenda de Mejora Regulatoria 2025",
        subtitle: "Plan de revisión y actualización de marcos normativos para facilitar la inversión y la vida ciudadana.",
        dependencias: [
          { nombre: "Secretaría de Desarrollo Económico", tramites: [
              { nombre: "Reglamento de Apertura Rápida de Empresas", icon: "🏢" }, 
              { nombre: "Ley de Fomento a la Inversión", icon: "📈" }, 
              { nombre: "Norma Técnica para Parques Industriales", icon: "🏭" }
            ] 
          },
          { nombre: "Secretaría de Medio Ambiente", tramites: [
              { nombre: "Reglamento de Manifestación de Impacto Ambiental", icon: "🌳" }, 
              { nombre: "Norma de Emisiones para Fuentes Fijas", icon: "💨" }
            ] 
          },
          { nombre: "Secretaría de Finanzas Públicas", tramites: [
              { nombre: "Actualización al Código Fiscal del Estado", icon: "💰" }, 
              { nombre: "Reglamento de la Ley de Adquisiciones", icon: "📜" }
            ] 
          }
        ]
      },
      simplificacion: {
        title: "Agenda de Simplificación de Trámites 2025",
        subtitle: "Iniciativas prioritarias para digitalizar y rediseñar los trámites de mayor impacto para la ciudadanía.",
        dependencias: [
          { nombre: "Secretaría de Salud", tramites: [
              { nombre: "Citas en Línea para Centros de Salud", icon: "🗓️" }, 
              { nombre: "Expediente Clínico Digital Único (Fase 1)", icon: "❤️" }, 
              { nombre: "Solicitud de Tarjeta de Salud para Comerciantes", icon: "👨‍🍳" }
            ] 
          },
          { nombre: "Secretaría de Educación Pública", tramites: [
              { nombre: "Proceso de Pre-inscripción en Línea (Unificado)", icon: "🎓" }, 
              { nombre: "Emisión Digital de Certificados de Estudio", icon: "📄" }, 
              { nombre: "Sistema de Becas (Solicitud y Seguimiento)", icon: "⭐" }
            ]
          },
          { nombre: "Secretaría de Obras Públicas", tramites: [
              { nombre: "Licencia de Construcción para Vivienda Unifamiliar", icon: "🏠" }, 
              { nombre: "Permiso de Ruptura de Pavimento", icon: "🚧" }
            ] 
          },
          { nombre: "Registro Público de la Propiedad", tramites: [
              { nombre: "Certificado de Libertad de Gravamen en Línea", icon: "📑" }, 
              { nombre: "Consulta Remota de Folios", icon: "🔍" }
            ] 
          }
        ]
      }
    };

    const openAgendaModal = (agendaKey) => {
      const agenda = datosAgendas[agendaKey];
      if (!agenda) return;

      agendaModalTitle.innerText = agenda.title;
      agendaModalSubtitle.innerText = agenda.subtitle;
      
      let accordionHTML = '';
      agenda.dependencias.forEach(dep => {
        accordionHTML += `
          <div class="accordion-item">
            <button class="accordion-header">
              <span>${dep.nombre} <strong>(${dep.tramites.length} Iniciativas)</strong></span>
            </button>
            <div class="accordion-content">
              <div class="tramites-grid">
                ${dep.tramites.map(t => `
                  <div class="tramite-card-item">
                    <span class="tramite-icon">${t.icon}</span>
                    <span class="tramite-name">${t.nombre}</span>
                    <a href="https://ruts.hidalgo.gob.mx/ver/572" class="tramite-link" target="_blank" rel="noopener noreferrer">Ver en RUTS ➔</a>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      });
      agendaModalContent.innerHTML = accordionHTML;

      const accordionHeaders = agendaModalContent.querySelectorAll('.accordion-header');
      accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
          const content = header.nextElementSibling;
          header.classList.toggle('active');
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
      });

      agendaModal.classList.add('active');
    };

    const closeAgendaModal = () => {
      agendaModal.classList.remove('active');
    };

    btnsAgenda.forEach(btn => {
      btn.addEventListener('click', () => {
        const agendaKey = btn.dataset.agenda;
        openAgendaModal(agendaKey);
      });
    });

    closeAgendaModalBtn.addEventListener('click', closeAgendaModal);
    agendaModal.addEventListener('click', (e) => {
      if (e.target === agendaModal) closeAgendaModal();
    });
  }

});