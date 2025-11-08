// blog-post.js - Sistema para mostrar posts individuales

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Función para formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}

// Función para renderizar el post
function renderPost(post) {
    // Actualizar meta tags del documento
    document.title = `${post.title} - Elevate Media Labs`;
    
    // Ocultar loading, mostrar container
    document.getElementById('post-loading').style.display = 'none';
    document.getElementById('post-container').style.display = 'block';
    
    // Rellenar datos del post
    document.getElementById('post-category').textContent = post.category;
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-author').textContent = post.author;
    document.getElementById('post-author-avatar').textContent = post.author.charAt(0).toUpperCase();
    document.getElementById('post-date').textContent = formatDate(post.date);
    document.getElementById('post-read-time').textContent = `${post.readTime} min lectura`;
    
    // Featured Image
    const featuredImageDiv = document.getElementById('post-featured-image');
    if (post.featuredImage) {
        featuredImageDiv.innerHTML = `<img src="${post.featuredImage}" alt="${post.title}">`;
    } else {
        // SVG por defecto
        featuredImageDiv.innerHTML = `
            <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
                <rect fill="#1a1625" width="1200" height="600"/>
                <path d="M600,200 L450,350 L600,320 Z" fill="#a855f7" opacity="0.8"/>
                <path d="M600,320 L450,350 L490,450 L600,400 Z" fill="#6b21a8" opacity="0.8"/>
                <path d="M600,200 L750,350 L600,320 Z" fill="#94a3b8" opacity="0.8"/>
                <path d="M600,320 L750,350 L710,450 L600,400 Z" fill="#475569" opacity="0.8"/>
                <line x1="600" y1="200" x2="600" y2="400" stroke="white" stroke-width="4" opacity="0.5"/>
            </svg>
        `;
    }
    
    // Renderizar contenido Markdown
    const bodyDiv = document.getElementById('post-body');
    if (typeof marked !== 'undefined') {
        // Configurar marked
        marked.setOptions({
            breaks: true,
            gfm: true
        });
        bodyDiv.innerHTML = marked.parse(post.content);
    } else {
        // Fallback si marked.js no carga
        bodyDiv.innerHTML = post.content.replace(/\n/g, '<br>');
    }
    
    // Tags
    const tagsDiv = document.getElementById('post-tags');
    if (post.tags && post.tags.length > 0) {
        tagsDiv.innerHTML = post.tags.map(tag => 
            `<span class="post-tag">#${tag}</span>`
        ).join('');
    }
}

// Función para mostrar error
function showError() {
    document.getElementById('post-loading').style.display = 'none';
    document.getElementById('post-error').style.display = 'block';
}

// Función principal para cargar el post
async function loadPost() {
    const slug = getUrlParameter('slug');
    
    if (!slug) {
        showError();
        return;
    }
    
    try {
        // Cargar datos de blog
        const response = await fetch('/public/data/blog-posts.json');
        
        if (!response.ok) {
            throw new Error('No se pudo cargar el blog');
        }
        
        const posts = await response.json();
        
        // Buscar el post por slug
        const post = posts.find(p => p.slug === slug);
        
        if (post) {
            renderPost(post);
        } else {
            showError();
        }
        
    } catch (error) {
        console.error('Error cargando post:', error);
        showError();
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPost);
} else {
    loadPost();
}

