// Creado por Ing. Jonatan Garcia
// © 2024 Jonatan Garcia Mayo. Todos los derechos reservados.
document.addEventListener('DOMContentLoaded', function() {
    // Hide preloader when page is loaded
    window.addEventListener('load', function() {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
        }, 500);
    });

    // Canvas setup
    const canvas = document.getElementById('fragrance-animation');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles = [];
    const particleCount = 200; // Aumentado para mejor efecto
    const title = "OLINALIA";
    let titleParticles = [];

    // Función para obtener puntos del texto
    function getTextPoints() {
        ctx.font = "bold 80px 'Playfair Display'";
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.textAlign = "center";
        ctx.fillText(title, canvas.width/2, 120);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const points = [];
        
        for(let i = 0; i < pixels.length; i += 4) {
            const x = (i / 4) % canvas.width;
            const y = Math.floor((i / 4) / canvas.width);
            
            if(pixels[i + 3] > 0) {
                points.push({
                    x: x,
                    y: y
                });
            }
        }
        
        return points;
    }

    class Particle {
        constructor(isTitle = false) {
            this.isTitle = isTitle;
            // Paleta de colores ocre
            this.ocreColors = [
                [204, 119, 34],   // ocre
                [255, 204, 102],  // amarillo suave
                [186, 140, 99],   // café claro
                [255, 183, 197],  // rosado suave
                [255, 153, 51],   // naranja
                [255, 215, 0],    // dorado
                [255, 228, 181]   // mocasín (ocre claro)
            ];
            // Asignar color aleatorio
            const color = this.ocreColors[Math.floor(Math.random() * this.ocreColors.length)];
            this.colorR = color[0];
            this.colorG = color[1];
            this.colorB = color[2];
            this.reset();
        }
// Hace que funcione el movimiento de las partículas 
        reset() {
            if (this.isTitle) {
                const point = titleParticles[Math.floor(Math.random() * titleParticles.length)];
                this.targetX = point.x;
                this.targetY = point.y;
            }
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 3;
            this.speedY = (Math.random() - 0.5) * 3;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
// Actualiza las partículas para su buen funcionamiento
        update() {
            if (this.isTitle) {
                this.x += (this.targetX - this.x) * 0.05;
                this.y += (this.targetY - this.y) * 0.05;
            } else {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width || 
                    this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
        }
// Definición y asignación de colores
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.colorR}, ${this.colorG}, ${this.colorB}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Inicializar partículas después de cargar la fuente
    document.fonts.ready.then(() => {
        titleParticles = getTextPoints();
        
        // Crear partículas del título
        for (let i = 0; i < titleParticles.length; i++) {
            particles.push(new Particle(true));
        }
        
        // Crear partículas de fondo
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(false));
        }
    });

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // 3D Gallery Setup
    const galleryContainer = document.querySelector('.gallery-items-wrapper');
    const perfumes = [
        'perfume1.jpg',
        'perfume2.jpg',
        'perfume3.jpg',
        'perfume4.jpg',
        'perfume5.jpg',
        'perfume6.jpg'  // Se pueden añadir más imágenes
    ];

    // Crea los elementos de la galería
    perfumes.forEach((perfume, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.backgroundImage = `url(assets/images/${perfume})`;
        item.style.transform = `rotateY(${(index * 60)}deg) translateZ(500px)`; // Adjusted angle to 60 degrees (360/6)
        galleryContainer.appendChild(item);
    });

    // Rotación interactiva
    let currentRotation = 0;
    let targetRotation = 0;
    let isDragging = false;
    let startX;
    let rotateInterval;

    galleryContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        clearInterval(rotateInterval);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta = e.clientX - startX;
        targetRotation = currentRotation + delta * 0.5;
        galleryContainer.style.transform = `rotateY(${targetRotation}deg)`;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        currentRotation = targetRotation;
        startAutoRotate();
    });

    function startAutoRotate() {
        rotateInterval = setInterval(() => {
            currentRotation += 0.5;
            targetRotation = currentRotation;
            galleryContainer.style.transform = `rotateY(${currentRotation}deg)`;
        }, 50);
    }

    startAutoRotate();

    // Audio setup
    const audio = new Audio('assets/audio/olinalia-ambient.mp3');
    audio.loop = true;
    audio.volume = 0.5; // Volumen inicial al 50%

    const playPauseBtn = document.getElementById('playPause');
    const volumeSlider = document.querySelector('.volume-slider');

    playPauseBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value / 100;
    });

    // Testimonial Form Functions
    function openTestimonialForm() {
        document.getElementById('testimonialModal').style.display = 'block';
    }

    function closeTestimonialForm() {
        document.getElementById('testimonialModal').style.display = 'none';
    }

    // Add form submission handler
    document.getElementById('testimonialForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const occupation = document.getElementById('occupation').value;
        const testimonial = document.getElementById('testimonial').value;
        const photoFile = document.getElementById('photo').files[0];
        
        try {
            let photoUrl = '';
            
            // Upload photo if provided
            if (photoFile) {
                const photoRef = storage.ref(`testimonials/${Date.now()}_${photoFile.name}`);
                await photoRef.put(photoFile);
                photoUrl = await photoRef.getDownloadURL();
            }
            
            // Save testimonial to Firestore
            await db.collection('testimonials').add({
                name: name,
                occupation: occupation,
                testimonial: testimonial,
                photoUrl: photoUrl,
                date: new Date()
            });

            alert('¡Gracias por compartir tu experiencia!');
            closeTestimonialForm();
            location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al enviar tu testimonio. Por favor, intenta de nuevo.');
        }
    });

    // Add function to load testimonials
    async function loadTestimonials() {
        try {
            const testimonialsContainer = document.querySelector('.testimonials-container');
            const snapshot = await db.collection('testimonials').orderBy('date', 'desc').limit(3).get();
            
            testimonialsContainer.innerHTML = ''; // Clear existing testimonials
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                const testimonialHTML = `
                    <div class="testimonial-card" data-aos="fade-up">
                        <div class="testimonial-image">
                            <img src="${data.photoUrl || 'assets/images/default-avatar.jpg'}" alt="${data.name}">
                        </div>
                        <div class="testimonial-content">
                            <div class="quote-icon">❝</div>
                            <p>${data.testimonial}</p>
                            <h4>${data.name}</h4>
                            <span>${data.occupation}</span>
                        </div>
                    </div>
                `;
                testimonialsContainer.innerHTML += testimonialHTML;
            });
        } catch (error) {
            console.error('Error loading testimonials:', error);
        }
    }

    // Load testimonials when page loads
    document.addEventListener('DOMContentLoaded', loadTestimonials);
});

// Inicializar AOS
AOS.init({
    duration: 1000,
    once: true
});