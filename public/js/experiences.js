// Experiencias Olinalia - Conexión con Firebase
// Creado por Ing. Jonatan Garcia Mayo

class OlinaliaExperiences {
    constructor() {
        this.experiences = [];
        this.isConnected = false;
        this.init();
    }

    // Inicializar conexión con Firebase
    async init() {
        try {
            // Verificar si Firebase está disponible
            if (typeof firebase === 'undefined' || typeof db === 'undefined' || typeof storage === 'undefined') {
                console.warn('⚠️ Firebase no está cargado');
                return;
            }

            // Verificar conexión
            await this.checkConnection();
            
            // Cargar experiencias existentes
            await this.loadExperiences();
            
            // Configurar listener en tiempo real
            this.setupRealtimeListener();
            
        } catch (error) {
            console.error('❌ Error inicializando Experiencias Olinalia:', error);
        }
    }

    // Verificar conexión con Firebase
    async checkConnection() {
        try {
            const testDoc = db.collection('_test').doc('olinalia-connection');
            await testDoc.set({
                timestamp: new Date(),
                project: 'Olinalia Experiences'
            });
            await testDoc.delete();
            
            this.isConnected = true;
            console.log('✅ Experiencias Olinalia conectadas a Firebase');
            
        } catch (error) {
            console.warn('⚠️ No se pudo conectar con Firebase para experiencias');
            this.isConnected = false;
        }
    }

    // Cargar experiencias desde Firestore
    async loadExperiences() {
        if (!this.isConnected) return;

        try {
            const snapshot = await db.collection('olinalia-experiences')
                .orderBy('createdAt', 'desc')
                .get(); // Sin límite - cargar todas las experiencias
            
            this.experiences = [];
            snapshot.forEach(doc => {
                this.experiences.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            console.log(`📚 ${this.experiences.length} experiencias cargadas (ilimitadas)`);
            this.displayExperiences();
            
        } catch (error) {
            console.error('❌ Error cargando experiencias:', error);
        }
    }

    // Configurar listener en tiempo real para nuevas experiencias
    setupRealtimeListener() {
        if (!this.isConnected) return;

        db.collection('olinalia-experiences')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => { // Sin límite - escuchar todas las experiencias
                const newExperiences = [];
                snapshot.forEach(doc => {
                    newExperiences.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                this.experiences = newExperiences;
                this.displayExperiences();
                console.log('🔄 Experiencias actualizadas en tiempo real');
            }, (error) => {
                console.error('❌ Error en listener de experiencias:', error);
            });
    }

    // Mostrar experiencias en la interfaz (sin modificar HTML existente)
    displayExperiences() {
        // Buscar contenedor de experiencias existente
        const container = document.querySelector('.testimonials-container');
        if (!container) return;

        // Crear sección de experiencias si no existe
        let experiencesSection = document.querySelector('.olinalia-experiences-section');
        if (!experiencesSection) {
            experiencesSection = document.createElement('div');
            experiencesSection.className = 'olinalia-experiences-section';
            experiencesSection.innerHTML = `
                <h3 class="experiences-subtitle">Experiencias Olinalia (${this.experiences.length})</h3>
                <div class="experiences-grid"></div>
            `;
            
            // Insertar después del contenedor de testimonios
            container.parentNode.insertBefore(experiencesSection, container.nextSibling);
        }

        const experiencesGrid = experiencesSection.querySelector('.experiences-grid');
        const experiencesSubtitle = experiencesSection.querySelector('.experiences-subtitle');
        
        experiencesGrid.innerHTML = '';
        experiencesSubtitle.textContent = `Experiencias Olinalia (${this.experiences.length})`;

        this.experiences.forEach(experience => {
            const experienceCard = this.createExperienceCard(experience);
            experiencesGrid.appendChild(experienceCard);
        });
    }

    // Crear tarjeta de experiencia
    createExperienceCard(experience) {
        const card = document.createElement('div');
        card.className = 'experience-card';
        card.setAttribute('data-aos', 'fade-up');
        
        let imagesHTML = '';
        if (experience.images && experience.images.length > 0) {
            imagesHTML = `
                <div class="experience-images">
                    ${experience.images.slice(0, 3).map(img => `
                        <img src="${img}" alt="${experience.title}" loading="lazy">
                    `).join('')}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="experience-header">
                <h4>${experience.title}</h4>
                <span class="experience-category">${experience.category || 'Experiencia'}</span>
            </div>
            <div class="experience-content">
                <p>${experience.description}</p>
                ${imagesHTML}
            </div>
            <div class="experience-footer">
                <small>${this.formatDate(experience.createdAt)}</small>
                <span class="experience-status">🟢 En vivo</span>
            </div>
        `;

        return card;
    }

    // Formatear fecha
    formatDate(timestamp) {
        if (!timestamp) return '';
        // Si es Timestamp de Firestore modular, usar toDate()
        if (typeof timestamp.toDate === 'function') {
            return timestamp.toDate().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        // Si es Date nativo
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Método para agregar nueva experiencia (para uso futuro)
    async addExperience(experienceData) {
        if (!this.isConnected) {
            console.warn('⚠️ Firebase no conectado para agregar experiencia');
            return null;
        }

        try {
            const experience = {
                title: experienceData.title,
                description: experienceData.description,
                category: experienceData.category || 'General',
                images: experienceData.images || [],
                audioUrl: experienceData.audioUrl || '',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const docRef = await db.collection('olinalia-experiences').add(experience);
            console.log('✅ Nueva experiencia agregada:', docRef.id);
            return docRef.id;
            
        } catch (error) {
            console.error('❌ Error agregando experiencia:', error);
            throw error;
        }
    }

    // Método para obtener estadísticas
    async getStats() {
        if (!this.isConnected) return null;

        try {
            const snapshot = await db.collection('olinalia-experiences').get();
            return {
                total: snapshot.size,
                categories: this.getCategoryStats(snapshot.docs),
                recent: this.experiences.length
            };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return null;
        }
    }

    // Obtener estadísticas por categoría
    getCategoryStats(docs) {
        const categories = {};
        docs.forEach(doc => {
            const category = doc.data().category || 'General';
            categories[category] = (categories[category] || 0) + 1;
        });
        return categories;
    }
}

// Inicializar sistema de experiencias cuando el DOM esté listo
let olinaliaExperiences;

document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que Firebase esté disponible
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && typeof db !== 'undefined' && typeof storage !== 'undefined') {
            clearInterval(checkFirebase);
            olinaliaExperiences = new OlinaliaExperiences();
        }
    }, 100);

    // Timeout después de 5 segundos
    setTimeout(() => {
        clearInterval(checkFirebase);
        if (!olinaliaExperiences) {
            console.warn('⚠️ Firebase no disponible para Experiencias Olinalia');
        }
    }, 5000);
});

// Exponer para uso global
window.OlinaliaExperiences = OlinaliaExperiences; 