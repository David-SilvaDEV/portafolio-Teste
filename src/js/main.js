const card = document.querySelector('.habilidades');
const texto = document.querySelector('.habilidades-texo');
const contenedor = document.querySelector('.section-cards');
const coraje = document.querySelector('.coraje');

// Trajectory scroll animation
const trajectoryFrame = document.getElementById('trajectory-frame');
const trajectoryLetters = document.getElementById('trajectory-letters');
const trajectoryContainer = document.querySelector('.trajectory-animation-container');
const trajectorySection = document.querySelector('.trayectoria-section');
const totalFrames = 34; // frames from 0.png to 33.png
const startFrame = 0;
const endFrame = 33;
let animationCompleted = false;

let abierta = false;

// Solo activar funcionalidad de click en desktop
function initSoftSkillsInteraction() {
    if (window.innerWidth > 1024) {
        card.addEventListener('click', handleCardClick);
    }
}

function handleCardClick() {
    const anchoContenedor = contenedor.clientWidth;
    const anchoCard = card.clientWidth;

    const movimiento = anchoContenedor - anchoCard - 10; // 10px de margen

    if (!abierta) {
        card.style.left = `${movimiento}px`; // se mueve hasta el borde derecho
        texto.style.width = "70%";
        texto.style.opacity = "1";
        coraje.style.display = "none"
        
        abierta = true;
    } else {
        card.style.left = "0px"; // vuelve al origen
        texto.style.width = "0";
        texto.style.opacity = "0";
        coraje.style.display = "flex"
        
        abierta = false;
    }
}

// Manejar cambios de tamaño de ventana
function handleSoftSkillsResize() {
    if (window.innerWidth <= 1024) {
        // Resetear estilos para responsive
        if (card) {
            card.style.left = "";
            card.removeEventListener('click', handleCardClick);
        }
        if (texto) {
            texto.style.width = "";
            texto.style.opacity = "";
        }
        if (coraje) {
            coraje.style.display = "";
        }
        abierta = false;
    } else {
        // Reactivar funcionalidad desktop
        if (card) {
            card.addEventListener('click', handleCardClick);
        }
    }
}

// Inicializar
initSoftSkillsInteraction();

// Escuchar cambios de tamaño
window.addEventListener('resize', handleSoftSkillsResize);

// Trajectory scroll-controlled animation
function updateTrajectoryFrame() {
    const rect = trajectorySection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calcular qué tan visible está la sección
    let progress = 0;
    
    if (rect.top <= windowHeight && rect.bottom >= 0) {
        // La sección está visible
        if (rect.top >= 0) {
            // La sección está entrando desde abajo
            progress = (windowHeight - rect.top) / windowHeight;
        } else if (rect.bottom <= windowHeight) {
            // La sección está saliendo por arriba
            progress = rect.bottom / windowHeight;
        } else {
            // La sección ocupa toda la pantalla
            progress = 1;
        }
    }
    
    // Limitar progress entre 0 y 1
    progress = Math.max(0, Math.min(1, progress));
    
    // Si la animación ya se completó, mantener el estado final
    if (animationCompleted) {
        return;
    }
    
    // Desvanecer las letras conforme avanza el scroll
    const letterOpacity = Math.max(0, 1 - (progress * 2)); // Desaparecen rápidamente
    trajectoryLetters.style.opacity = letterOpacity;
    
    // Convertir progress a índice de frame (de abajo hacia arriba)
    const frameIndex = Math.floor(progress * (totalFrames - 1));
    const currentFrame = endFrame - frameIndex; // De 33 hacia 0 (de abajo hacia arriba)
    
    // Asegurar que el frame esté en el rango válido
    const validFrame = Math.max(startFrame, Math.min(endFrame, currentFrame));
    
    // Actualizar la imagen
    const framesSrc = `./src/img/trayectoria-frames/${validFrame}.png`;
    trajectoryFrame.src = framesSrc;
    
    // Verificar si la animación se ha completado
    if (progress >= 0.95) { // Casi al 100%
        animationCompleted = true;
        trajectoryLetters.style.opacity = '0'; // Asegurar que las letras estén ocultas
        // Mantener el frame final
        const finalFrame = startFrame; // Frame 0 es el final (la imagen completa)
        trajectoryFrame.src = `./src/img/trayectoria-frames/${finalFrame}.png`;
    }
}

// Listener para scroll en tiempo real
function handleScroll() {
    requestAnimationFrame(updateTrajectoryFrame);
}

// Añadir event listener para scroll
window.addEventListener('scroll', handleScroll);

// Inicializar al cargar la página
window.addEventListener('load', updateTrajectoryFrame);

// ===== ANIMACIONES DE ENTRADA ESCALONADAS =====

// Función para verificar si un elemento está en el viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    ) || (
        rect.top < window.innerHeight &&
        rect.bottom >= 0
    );
}

// Función para animar elementos con delay escalonado
function animateCardsStaggered() {
    const cards = document.querySelectorAll('.carddos');
    const sectionsCards = document.querySelectorAll('.section-cards');
    const trajectorySection = document.querySelector('.trayectoria-section');
    
    // Animar tarjetas principales con delay escalonado
    cards.forEach((card, index) => {
        if (isInViewport(card) && !card.classList.contains('animated')) {
            card.classList.add('animated');
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200); // 200ms de delay entre cada tarjeta
        }
    });
    
    // Animar secciones de tarjetas
    sectionsCards.forEach((section, index) => {
        if (isInViewport(section) && !section.classList.contains('animated')) {
            section.classList.add('animated');
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100);
        }
    });
    
    // Animar sección de trayectoria
    if (trajectorySection && isInViewport(trajectorySection) && !trajectorySection.classList.contains('animated')) {
        trajectorySection.classList.add('animated');
        trajectorySection.style.opacity = '1';
        trajectorySection.style.transform = 'translateY(0)';
    }
}

// Configurar observer para animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            if (element.classList.contains('carddos')) {
                const cards = document.querySelectorAll('.carddos');
                const index = Array.from(cards).indexOf(element);
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.classList.add('animated');
                }, index * 150);
                
            } else if (element.classList.contains('section-cards')) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('animated');
            }
        }
    });
}, observerOptions);

// Observar elementos para animación
const elementsToAnimate = document.querySelectorAll('.carddos, .section-cards');
elementsToAnimate.forEach(element => {
    animationObserver.observe(element);
});

// Ejecutar animaciones al cargar y al hacer scroll
window.addEventListener('load', animateCardsStaggered);
window.addEventListener('scroll', animateCardsStaggered);

// ===== PUNTOS INTERACTIVOS DE LA TRAYECTORIA =====

// Manejar clicks en los puntos de la trayectoria
function initTimelinePoints() {
    const timelinePoints = document.querySelectorAll('.timeline-point');
    let activeTooltip = null;
    
    timelinePoints.forEach(point => {
        const tooltip = point.querySelector('.point-tooltip');
        
        // Click para mostrar/ocultar tooltip
        point.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Cerrar todos los otros tooltips primero
            const allPoints = document.querySelectorAll('.timeline-point');
            allPoints.forEach(p => {
                if (p !== point) {
                    p.classList.remove('active');
                }
            });
            
            // Toggle del tooltip actual
            const isCurrentlyActive = point.classList.contains('active');
            point.classList.toggle('active');
            
            // Actualizar tooltip activo
            activeTooltip = point.classList.contains('active') ? point : null;
            
            // Ajustar posición del tooltip si está activo
            if (activeTooltip) {
                setTimeout(() => adjustTooltipPosition(activeTooltip), 50);
            }
        });
        
        // Hover effects adicionales
        point.addEventListener('mouseenter', () => {
            if (!point.classList.contains('active')) {
                point.querySelector('.point-photo').style.transform = 'scale(1.05)';
            }
        });
        
        point.addEventListener('mouseleave', () => {
            if (!point.classList.contains('active')) {
                point.querySelector('.point-photo').style.transform = 'scale(1)';
            }
        });
    });
    
    // Cerrar tooltips al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.timeline-point') && activeTooltip) {
            activeTooltip.classList.remove('active');
            activeTooltip = null;
        }
    });
    
    // Cerrar tooltips con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeTooltip) {
            activeTooltip.classList.remove('active');
            activeTooltip = null;
        }
    });
}

// Posicionamiento inteligente de tooltips
function adjustTooltipPosition(point) {
    const tooltip = point.querySelector('.point-tooltip');
    const rect = point.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const pointNumber = point.getAttribute('data-point');
    
    // Reset classes
    tooltip.classList.remove('tooltip-left', 'tooltip-right', 'tooltip-top', 'tooltip-bottom');
    
    // Ajustes responsivos según el tamaño de pantalla
    if (viewportWidth <= 480) {
        // Pantallas muy pequeñas - tooltips más compactos
        tooltip.style.minWidth = '180px';
        tooltip.style.maxWidth = '200px';
        tooltip.style.fontSize = '10px';
        tooltip.style.bottom = '50px';
        
        // Centrar todos en pantallas pequeñas
        tooltip.style.left = '50%';
        tooltip.style.right = 'auto';
        tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
        
    } else if (viewportWidth <= 768) {
        // Tablets - ajustes medianos
        tooltip.style.minWidth = '220px';
        tooltip.style.maxWidth = '250px';
        tooltip.style.fontSize = '12px';
        tooltip.style.bottom = '55px';
        
    } else {
        // Desktop - tamaño completo y posicionamiento específico
        tooltip.style.minWidth = '280px';
        tooltip.style.maxWidth = '320px';
        tooltip.style.fontSize = '14px';
        tooltip.style.bottom = '60px';
        
        // Mantener posicionamiento específico para desktop
        if (pointNumber == 1) {
            // Punto 1 - usar posicionamiento CSS específico
            tooltip.style.left = '-10px';
            tooltip.style.right = 'auto';
            tooltip.style.bottom = '65px';
            tooltip.style.minWidth = '250px';
            tooltip.style.maxWidth = '270px';
        } else if (pointNumber == 2) {
            // Punto 2 - separado del punto 1
            tooltip.style.left = '-50px';
            tooltip.style.right = 'auto';
            tooltip.style.bottom = '65px';
        } else if (pointNumber == 5 || pointNumber == 6) {
            // Puntos derechos - tooltip hacia la izquierda  
            tooltip.style.right = pointNumber == 6 ? '-20px' : '-30px';
            tooltip.style.left = 'auto';
        } else {
            // Puntos centrales - centrados
            tooltip.style.left = '50%';
            tooltip.style.right = 'auto';
            tooltip.style.transform = 'translateX(-50%) translateY(-10px)';
        }
    }
    
    // Ajustar horizontalmente
    if (rect.left < 150 && viewportWidth > 480) {
        tooltip.classList.add('tooltip-left');
        tooltip.style.left = '0';
        tooltip.style.transform = 'translateY(10px)';
    } else if (rect.right > viewportWidth - 150 && viewportWidth > 480) {
        tooltip.classList.add('tooltip-right');
        tooltip.style.right = '0';
        tooltip.style.left = 'auto';
        tooltip.style.transform = 'translateY(10px)';
    }
    
    // Ajustar verticalmente
    if (rect.top < 100) {
        tooltip.classList.add('tooltip-bottom');
        tooltip.style.top = '60px';
        tooltip.style.bottom = 'auto';
    }
}

// Animar entrada de puntos de trayectoria
function animateTimelinePoints() {
    const points = document.querySelectorAll('.timeline-point');
    
    points.forEach((point, index) => {
        // Animación inicial escalonada
        setTimeout(() => {
            point.style.opacity = '1';
            point.style.transform = 'translate(-50%, -50%) scale(1)';
            point.style.transition = 'all 0.5s ease';
        }, index * 300 + 1000); // Delay inicial + escalonado
    });
}

// Manejar cambios de tamaño de pantalla
window.addEventListener('resize', () => {
    // Reajustar tooltips activos
    const activePoints = document.querySelectorAll('.timeline-point.active');
    activePoints.forEach(point => {
        setTimeout(() => adjustTooltipPosition(point), 100);
    });
    
    // Reagrupar animaciones si es necesario
    const cards = document.querySelectorAll('.carddos');
    cards.forEach((card, index) => {
        if (window.innerWidth <= 768) {
            card.style.animationDelay = `${index * 100}ms`;
        } else {
            card.style.animationDelay = `${index * 150}ms`;
        }
    });
});

// Inicializar puntos de trayectoria
window.addEventListener('load', () => {
    initTimelinePoints();
    setTimeout(animateTimelinePoints, 2000); // Esperar a que se cargue la imagen
    
    // Configurar tooltips responsive al cargar
    const timelinePoints = document.querySelectorAll('.timeline-point');
    timelinePoints.forEach(point => {
        const tooltip = point.querySelector('.point-tooltip');
        // Configuración inicial responsive
        if (window.innerWidth <= 480) {
            tooltip.style.minWidth = '180px';
            tooltip.style.maxWidth = '200px';
        } else if (window.innerWidth <= 768) {
            tooltip.style.minWidth = '220px';
            tooltip.style.maxWidth = '250px';
        }
    });
});
