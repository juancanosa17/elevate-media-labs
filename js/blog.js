// blog.js - Sistema de visualización de posts del blog

// Función para formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}

// Función para crear el HTML de una card de post
function createPostCard(post) {
    // Extraer primer párrafo del contenido si no hay excerpt
    const excerpt = post.excerpt || post.content.substring(0, 150).replace(/#{1,6}\s/g, '') + '...';
    
    // Imagen por defecto si no hay
    const imageUrl = post.featuredImage || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"%3E%3Crect fill="%231a1625" width="800" height="400"/%3E%3Cpath d="M400,150 L300,250 L400,230 Z" fill="%23a855f7"/%3E%3Cpath d="M400,230 L300,250 L330,310 L400,280 Z" fill="%236b21a8"/%3E%3Cpath d="M400,150 L500,250 L400,230 Z" fill="%2394a3b8"/%3E%3Cpath d="M400,230 L500,250 L470,310 L400,280 Z" fill="%23475569"/%3E%3C/svg%3E';
    
    return `
        <article class="blog-post-card animate-on-scroll">
            <div class="post-image">
                <img src="${imageUrl}" alt="${post.title}" onerror="this.src='${imageUrl}'">
                <span class="post-category">${post.category}</span>
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-date">${formatDate(post.date)}</span>
                    <span class="post-read-time">${post.readTime} min lectura</span>
                </div>
                <h3 class="post-title">
                    <a href="/blog-post.html?slug=${post.slug}">${post.title}</a>
                </h3>
                <p class="post-excerpt">
                    ${excerpt}
                </p>
                <div class="post-footer">
                    <div class="post-author">
                        <div class="author-avatar">${post.author.charAt(0).toUpperCase()}</div>
                        <span class="author-name">${post.author}</span>
                    </div>
                    <a href="/blog-post.html?slug=${post.slug}" class="post-link">Leer más →</a>
                </div>
            </div>
        </article>
    `;
}

// Función principal para cargar y mostrar los posts
async function loadBlogPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    const emptyState = document.querySelector('.blog-empty-state');
    
    try {
        // Cargar datos de blog
        const response = await fetch('/public/data/blog-posts.json');
        
        if (!response.ok) {
            throw new Error('No se pudo cargar el blog');
        }
        
        const posts = await response.json();
        
        // Si hay posts, mostrarlos
        if (posts && posts.length > 0) {
            // Ocultar mensaje de "Próximamente"
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            
            // Crear HTML para cada post
            const postsHTML = posts.map(post => createPostCard(post)).join('');
            blogGrid.insertAdjacentHTML('beforeend', postsHTML);
            
            // Reiniciar animaciones de scroll
            if (typeof initScrollAnimations === 'function') {
                initScrollAnimations();
            }
        } else {
            // Si no hay posts, mostrar mensaje de "Próximamente"
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Error cargando posts:', error);
        
        // En caso de error, mostrar el empty state
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogPosts);
} else {
    loadBlogPosts();
}

