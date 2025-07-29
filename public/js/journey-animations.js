// Journey Animations - Animaciones personalizadas para el viaje del Linaloe
// Autor: Ing. Jonatan Garcia Mayo

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animaciones de scroll para la sección del viaje
    initJourneyAnimations();
    
    // Inicializar efectos de parallax para las imágenes
    initParallaxEffects();
    
    // Inicializar animaciones de hover para los elementos interactivos
    initHoverAnimations();
});

function initJourneyAnimations() {
    const journeySteps = document.querySelectorAll('.journey-step');
    const processItems = document.querySelectorAll('.process-item');
    
    // Crear un observador de intersección para las animaciones de scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Agregar clase visible para activar la animación
                entry.target.classList.add('visible');
                
                // Si es un paso del viaje, agregar animación escalonada
                if (entry.target.classList.contains('journey-step')) {
                    animateJourneyStep(entry.target);
                }
                
                // Si es un elemento del proceso, agregar animación con delay
                if (entry.target.classList.contains('process-item')) {
                    animateProcessItem(entry.target);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar todos los elementos
    journeySteps.forEach(step => observer.observe(step));
    processItems.forEach(item => observer.observe(item));
}

function animateJourneyStep(step) {
    const content = step.querySelector('.step-content');
    const visual = step.querySelector('.step-visual');
    const details = step.querySelectorAll('.detail-item');
    
    // Animación del contenido
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            content.style.transition = 'all 0.8s ease';
            content.style.opacity = '1';
            content.style.transform = 'translateX(0)';
        }, 200);
    }
    
    // Animación de la imagen
    if (visual) {
        visual.style.opacity = '0';
        visual.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            visual.style.transition = 'all 0.8s ease';
            visual.style.opacity = '1';
            visual.style.transform = 'scale(1)';
        }, 400);
    }
    
    // Animación escalonada de los detalles
    details.forEach((detail, index) => {
        detail.style.opacity = '0';
        detail.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            detail.style.transition = 'all 0.6s ease';
            detail.style.opacity = '1';
            detail.style.transform = 'translateX(0)';
        }, 600 + (index * 150));
    });
}

function animateProcessItem(item) {
    const icon = item.querySelector('.process-icon');
    const title = item.querySelector('h4');
    const text = item.querySelector('p');
    
    // Animación del ícono
    if (icon) {
        icon.style.transform = 'scale(0) rotate(180deg)';
        icon.style.opacity = '0';
        
        setTimeout(() => {
            icon.style.transition = 'all 0.6s ease';
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.opacity = '1';
        }, 100);
    }
    
    // Animación del título
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            title.style.transition = 'all 0.6s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Animación del texto
    if (text) {
        text.style.opacity = '0';
        text.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            text.style.transition = 'all 0.6s ease';
            text.style.opacity = '1';
            text.style.transform = 'translateY(0)';
        }, 500);
    }
}

function initParallaxEffects() {
    const stepImages = document.querySelectorAll('.step-image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        stepImages.forEach((image, index) => {
            const rate = scrolled * -0.3 + (index * 0.1);
            const rect = image.getBoundingClientRect();
            
            // Solo aplicar parallax si la imagen está en el viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                image.style.transform = `translateY(${rate}px)`;
            }
        });
    });
}

function initHoverAnimations() {
    // Efectos de hover para los elementos del viaje
    const stepVisuals = document.querySelectorAll('.step-visual');
    const processItems = document.querySelectorAll('.process-item');
    const detailItems = document.querySelectorAll('.detail-item');
    
    // Efectos para las imágenes del viaje - más orgánicos
    stepVisuals.forEach(visual => {
        visual.addEventListener('mouseenter', function() {
            const randomRotation = (Math.random() - 0.5) * 2; // -1 a 1 grados
            const randomScale = 1.02 + Math.random() * 0.06; // 1.02 a 1.08
            this.style.transform = `scale(${randomScale}) rotate(${randomRotation}deg)`;
            this.style.boxShadow = '0 25px 50px rgba(139, 69, 19, 0.4)';
            this.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        visual.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            this.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    });
    
    // Efectos para los elementos del proceso
    processItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(212, 175, 55, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Efectos para los elementos de detalle
    detailItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(15px) scale(1.02)';
            this.style.background = 'rgba(212, 175, 55, 0.25)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
            this.style.background = 'rgba(212, 175, 55, 0.1)';
        });
    });
}

// Función para crear partículas flotantes en el fondo
function createFloatingParticles() {
    const journeySection = document.querySelector('.linaloe-journey');
    if (!journeySection) return;
    
    // Crear partículas más orgánicas y variadas
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Variar el tamaño y forma de las partículas
        const size = 2 + Math.random() * 4;
        const isSquare = Math.random() > 0.7;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(212, 175, 55, ${0.2 + Math.random() * 0.4});
            border-radius: ${isSquare ? '0' : '50%'};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${8 + Math.random() * 15}s infinite ease-in-out;
            animation-delay: ${Math.random() * 8}s;
            z-index: 1;
            transform: rotate(${Math.random() * 360}deg);
        `;
        journeySection.appendChild(particle);
    }
    
    // Agregar algunas partículas más grandes como "estrellas"
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('div');
        star.className = 'floating-star';
        star.innerHTML = '⭐';
        star.style.cssText = `
            position: absolute;
            font-size: ${12 + Math.random() * 8}px;
            color: rgba(212, 175, 55, ${0.3 + Math.random() * 0.4});
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: twinkle ${6 + Math.random() * 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 6}s;
            z-index: 1;
        `;
        journeySection.appendChild(star);
    }
}

// Agregar estilos CSS para las partículas flotantes más orgánicas
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
        }
        25% {
            transform: translateY(-15px) rotate(90deg);
            opacity: 0.6;
        }
        50% {
            transform: translateY(-25px) rotate(180deg);
            opacity: 0.8;
        }
        75% {
            transform: translateY(-15px) rotate(270deg);
            opacity: 0.5;
        }
        100% {
            transform: translateY(0px) rotate(360deg);
            opacity: 0.2;
        }
    }
    
    @keyframes twinkle {
        0%, 100% {
            opacity: 0.3;
            transform: scale(1) rotate(0deg);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.2) rotate(180deg);
        }
    }
    
    .floating-particle, .floating-star {
        pointer-events: none;
    }
    
    .floating-star {
        text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
    }
`;
document.head.appendChild(style);

// Inicializar partículas cuando la página esté completamente cargada
window.addEventListener('load', createFloatingParticles);

// Función para agregar efectos de sonido sutiles (opcional)
function addSoundEffects() {
    const stepVisuals = document.querySelectorAll('.step-visual');
    
    stepVisuals.forEach(visual => {
        visual.addEventListener('click', function() {
            // Crear un efecto de sonido sutil usando Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        });
    });
}

// Inicializar efectos de sonido si el usuario ha interactuado con la página
document.addEventListener('click', function() {
    addSoundEffects();
}, { once: true }); 