/**
 * Blog View
 * List and manage blog posts
 */

import { formatRelativeTime, truncate, debounce } from '../modules/ui.js';

export class BlogView {
  constructor(app) {
    this.app = app;
    this.searchTerm = '';
    this.filterCategory = '';
    this.filterStatus = '';
  }
  
  async render() {
    const pageContent = document.getElementById('page-content');
    const posts = await this.app.api.getPosts();
    
    // Apply filters
    let filteredPosts = posts;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(p => 
        p.title?.toLowerCase().includes(term) || 
        p.excerpt?.toLowerCase().includes(term)
      );
    }
    if (this.filterCategory) {
      filteredPosts = filteredPosts.filter(p => p.category === this.filterCategory);
    }
    if (this.filterStatus) {
      filteredPosts = filteredPosts.filter(p => 
        this.filterStatus === 'draft' ? p.draft : !p.draft
      );
    }
    
    // Get unique categories
    const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];
    
    pageContent.innerHTML = `
      <div class="data-section">
        <div class="section-header">
          <h2 class="section-title">
            Posts del Blog
            <span class="badge badge-default" style="margin-left: var(--spacing-sm); font-size: var(--font-size-xs);">
              ${posts.length} total
            </span>
          </h2>
          <div class="section-actions">
            <div class="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                type="text" 
                id="search-posts" 
                placeholder="Buscar posts..." 
                value="${this.searchTerm}"
              >
            </div>
            <select id="filter-category" class="form-select" style="padding: var(--spacing-xs) var(--spacing-md); background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-primary); font-size: var(--font-size-sm);">
              <option value="">Todas las categorías</option>
              ${categories.map(cat => `
                <option value="${cat}" ${this.filterCategory === cat ? 'selected' : ''}>${cat}</option>
              `).join('')}
            </select>
            <select id="filter-status" class="form-select" style="padding: var(--spacing-xs) var(--spacing-md); background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-primary); font-size: var(--font-size-sm);">
              <option value="">Todos los estados</option>
              <option value="published" ${this.filterStatus === 'published' ? 'selected' : ''}>Publicados</option>
              <option value="draft" ${this.filterStatus === 'draft' ? 'selected' : ''}>Borradores</option>
            </select>
            <a href="#/blog/new" class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Nuevo Post</span>
            </a>
          </div>
        </div>
        
        ${filteredPosts.length > 0 ? `
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 40%">Título</th>
                <th>Categoría</th>
                <th>Autor</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th style="width: 100px">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPosts.map(post => `
                <tr data-slug="${post.slug}">
                  <td class="title-cell">
                    <a href="#/blog/edit/${post.slug}" style="color: inherit;">
                      ${truncate(post.title, 50)}
                    </a>
                    ${post.featured ? '<span class="badge badge-info" style="margin-left: var(--spacing-xs);">★</span>' : ''}
                  </td>
                  <td><span class="badge badge-default">${post.category || '-'}</span></td>
                  <td style="color: var(--color-text-muted);">${post.author || '-'}</td>
                  <td>
                    <span class="badge ${post.draft ? 'badge-warning' : 'badge-success'}">
                      ${post.draft ? 'Borrador' : 'Publicado'}
                    </span>
                  </td>
                  <td style="color: var(--color-text-muted);">${formatRelativeTime(post.date)}</td>
                  <td class="actions-cell">
                    <a href="#/blog/edit/${post.slug}" class="btn btn-icon btn-sm" title="Editar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </a>
                    <button class="btn btn-icon btn-sm delete-post" data-slug="${post.slug}" title="Eliminar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
            </svg>
            <h3>${this.searchTerm || this.filterCategory || this.filterStatus ? 'Sin resultados' : 'Sin posts aún'}</h3>
            <p>${this.searchTerm || this.filterCategory || this.filterStatus ? 'No se encontraron posts con los filtros aplicados' : 'Crea tu primer artículo para el blog'}</p>
            ${!this.searchTerm && !this.filterCategory && !this.filterStatus ? `
              <a href="#/blog/new" class="btn btn-primary">Crear Post</a>
            ` : ''}
          </div>
        `}
      </div>
    `;
    
    // Setup event listeners
    this.setupListeners();
  }
  
  setupListeners() {
    // Search
    const searchInput = document.getElementById('search-posts');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        this.searchTerm = e.target.value;
        this.render();
      }, 300));
    }
    
    // Filter by category
    const filterCategory = document.getElementById('filter-category');
    if (filterCategory) {
      filterCategory.addEventListener('change', (e) => {
        this.filterCategory = e.target.value;
        this.render();
      });
    }
    
    // Filter by status
    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) {
      filterStatus.addEventListener('change', (e) => {
        this.filterStatus = e.target.value;
        this.render();
      });
    }
    
    // Delete buttons
    document.querySelectorAll('.delete-post').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const slug = e.currentTarget.dataset.slug;
        await this.deletePost(slug);
      });
    });
  }
  
  async deletePost(slug) {
    const confirmed = await this.app.ui.modal.confirmDanger(
      '¿Eliminar post?',
      'Esta acción no se puede deshacer. El post será eliminado permanentemente.'
    );
    
    if (confirmed) {
      try {
        await this.app.api.deletePost(slug);
        this.app.ui.toast.success('Eliminado', 'El post ha sido eliminado');
        this.render();
      } catch (error) {
        this.app.ui.toast.error('Error', 'No se pudo eliminar el post');
      }
    }
  }
  
  async renderEditor(slug = null) {
    const pageContent = document.getElementById('page-content');
    
    let post = {
      title: '',
      date: new Date().toISOString().slice(0, 16).replace('T', ' ') + ':00',
      author: 'Elevate Media Labs',
      featuredImage: '',
      category: 'Estrategia',
      excerpt: '',
      body: '',
      tags: [],
      draft: true,
      readTime: 5,
      featured: false,
    };
    
    if (slug) {
      const existingPost = await this.app.api.getPost(slug);
      if (existingPost) {
        post = { ...post, ...existingPost };
      }
    }
    
    const categories = [
      'Estrategia', 'Data Intelligence', 'Marketing', 'Comunicación',
      'Eventos', 'Tecnología', 'Tendencias', 'Casos de Éxito', 'Innovación'
    ];
    
    pageContent.innerHTML = `
      <form id="post-editor-form" class="editor-container">
        <!-- Main Editor -->
        <div class="editor-main">
          <div class="editor-panel">
            <div class="form-group">
              <label for="post-title">Título</label>
              <input type="text" id="post-title" name="title" value="${post.title}" placeholder="Título del artículo..." required>
              <span class="form-hint">El título principal del artículo (60-70 caracteres para SEO)</span>
            </div>
            
            <div class="form-group">
              <label for="post-excerpt">Resumen</label>
              <textarea id="post-excerpt" name="excerpt" rows="3" placeholder="Breve resumen del artículo...">${post.excerpt || ''}</textarea>
              <span class="form-hint">Resumen para listados y SEO (150-160 caracteres)</span>
            </div>
            
            <div class="form-group">
              <label for="post-body">Contenido</label>
              <div class="editor-toolbar">
                <button type="button" data-action="bold" title="Negrita (Ctrl+B)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                  </svg>
                </button>
                <button type="button" data-action="italic" title="Cursiva (Ctrl+I)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>
                  </svg>
                </button>
                <button type="button" data-action="heading" title="Encabezado">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 12h12"/><path d="M6 4v16"/><path d="M18 4v16"/>
                  </svg>
                </button>
                <button type="button" data-action="link" title="Enlace">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </button>
                <button type="button" data-action="list" title="Lista">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </button>
                <button type="button" data-action="quote" title="Cita">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                  </svg>
                </button>
              </div>
              <textarea id="post-body" name="body" class="markdown-editor" rows="15" placeholder="Escribe el contenido en Markdown...">${post.body || ''}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="editor-sidebar">
          <!-- Publish Panel -->
          <div class="editor-panel">
            <div class="editor-panel-title">Publicación</div>
            
            <div class="form-group">
              <div class="toggle-wrapper">
                <div class="toggle ${!post.draft ? 'active' : ''}" id="toggle-publish" data-field="draft"></div>
                <label>Publicar</label>
              </div>
              <span class="form-hint">Activar para publicar el artículo</span>
            </div>
            
            <div class="form-group">
              <div class="toggle-wrapper">
                <div class="toggle ${post.featured ? 'active' : ''}" id="toggle-featured" data-field="featured"></div>
                <label>Destacado</label>
              </div>
              <span class="form-hint">Mostrar en la página principal</span>
            </div>
            
            <div class="form-group">
              <label for="post-date">Fecha de publicación</label>
              <input type="datetime-local" id="post-date" name="date" value="${post.date?.replace(' ', 'T').slice(0, 16)}">
            </div>
            
            <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-lg);">
              <button type="button" class="btn btn-secondary" onclick="window.adminApp.router.navigate('blog')">Cancelar</button>
              <button type="submit" class="btn btn-primary" style="flex: 1;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                </svg>
                Guardar
              </button>
            </div>
          </div>
          
          <!-- Category & Author -->
          <div class="editor-panel">
            <div class="editor-panel-title">Categoría & Autor</div>
            
            <div class="form-group">
              <label for="post-category">Categoría</label>
              <select id="post-category" name="category">
                ${categories.map(cat => `
                  <option value="${cat}" ${post.category === cat ? 'selected' : ''}>${cat}</option>
                `).join('')}
              </select>
            </div>
            
            <div class="form-group">
              <label for="post-author">Autor</label>
              <input type="text" id="post-author" name="author" value="${post.author}">
            </div>
            
            <div class="form-group">
              <label for="post-readtime">Tiempo de lectura (min)</label>
              <input type="number" id="post-readtime" name="readTime" value="${post.readTime}" min="1" max="60">
            </div>
          </div>
          
          <!-- Tags -->
          <div class="editor-panel">
            <div class="editor-panel-title">Tags</div>
            <div class="form-group">
              <div class="tags-input" id="tags-container">
                ${(post.tags || []).map(tag => `
                  <span class="tag">
                    ${tag}
                    <button type="button" onclick="this.parentElement.remove()">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </span>
                `).join('')}
                <input type="text" id="tag-input" placeholder="Añadir tag...">
              </div>
              <span class="form-hint">Presiona Enter para añadir</span>
            </div>
          </div>
          
          <!-- Featured Image -->
          <div class="editor-panel">
            <div class="editor-panel-title">Imagen Destacada</div>
            <div id="image-upload-area">
              ${post.featuredImage ? `
                <div class="image-preview">
                  <img src="${post.featuredImage}" alt="Preview">
                  <button type="button" class="image-preview-remove" onclick="document.getElementById('image-upload-area').innerHTML = document.getElementById('image-upload-template').innerHTML;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ` : `
                <div class="image-upload" id="image-dropzone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p>Arrastra una imagen o <span>selecciona</span></p>
                  <input type="file" id="image-input" accept="image/*" style="display: none;">
                </div>
              `}
            </div>
            <template id="image-upload-template">
              <div class="image-upload" id="image-dropzone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p>Arrastra una imagen o <span>selecciona</span></p>
                <input type="file" id="image-input" accept="image/*" style="display: none;">
              </div>
            </template>
            <input type="hidden" id="post-featuredImage" name="featuredImage" value="${post.featuredImage || ''}">
          </div>
        </div>
      </form>
    `;
    
    // Setup editor listeners
    this.setupEditorListeners(slug);
  }
  
  setupEditorListeners(editingSlug) {
    const form = document.getElementById('post-editor-form');
    
    // Form submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.savePost(editingSlug);
    });
    
    // Toggle switches
    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
      });
    });
    
    // Tags input
    const tagInput = document.getElementById('tag-input');
    if (tagInput) {
      tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const value = tagInput.value.trim();
          if (value) {
            const container = document.getElementById('tags-container');
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.innerHTML = `
              ${value}
              <button type="button" onclick="this.parentElement.remove()">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            `;
            container.insertBefore(tagSpan, tagInput);
            tagInput.value = '';
          }
        }
      });
    }
    
    // Image upload
    const imageDropzone = document.getElementById('image-dropzone');
    const imageInput = document.getElementById('image-input');
    
    if (imageDropzone && imageInput) {
      imageDropzone.addEventListener('click', () => imageInput.click());
      
      imageDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageDropzone.classList.add('dragover');
      });
      
      imageDropzone.addEventListener('dragleave', () => {
        imageDropzone.classList.remove('dragover');
      });
      
      imageDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageDropzone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          this.handleImageUpload(file);
        }
      });
      
      imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.handleImageUpload(file);
        }
      });
    }
    
    // Editor toolbar
    document.querySelectorAll('.editor-toolbar button').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.applyMarkdown(action);
      });
    });
  }
  
  handleImageUpload(file) {
    // In a real app, this would upload to a server
    // For demo, we'll use a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      document.getElementById('post-featuredImage').value = imageUrl;
      document.getElementById('image-upload-area').innerHTML = `
        <div class="image-preview">
          <img src="${imageUrl}" alt="Preview">
          <button type="button" class="image-preview-remove" onclick="document.getElementById('image-upload-area').innerHTML = document.getElementById('image-upload-template').innerHTML; document.getElementById('post-featuredImage').value = '';">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      `;
    };
    reader.readAsDataURL(file);
  }
  
  applyMarkdown(action) {
    const textarea = document.getElementById('post-body');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    const actions = {
      bold: { before: '**', after: '**' },
      italic: { before: '_', after: '_' },
      heading: { before: '## ', after: '' },
      link: { before: '[', after: '](url)' },
      list: { before: '- ', after: '' },
      quote: { before: '> ', after: '' },
    };
    
    const { before, after } = actions[action] || { before: '', after: '' };
    
    textarea.value = text.substring(0, start) + before + selected + after + text.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + before.length, end + before.length);
  }
  
  async savePost(editingSlug) {
    const form = document.getElementById('post-editor-form');
    const formData = new FormData(form);
    
    // Collect tags
    const tags = [];
    document.querySelectorAll('#tags-container .tag').forEach(tag => {
      const text = tag.textContent.trim();
      if (text) tags.push(text);
    });
    
    // Get toggle values
    const draft = !document.getElementById('toggle-publish').classList.contains('active');
    const featured = document.getElementById('toggle-featured').classList.contains('active');
    
    const post = {
      title: formData.get('title'),
      date: formData.get('date')?.replace('T', ' ') + ':00',
      author: formData.get('author'),
      category: formData.get('category'),
      excerpt: formData.get('excerpt'),
      body: formData.get('body'),
      featuredImage: formData.get('featuredImage'),
      readTime: parseInt(formData.get('readTime')) || 5,
      tags,
      draft,
      featured,
    };
    
    // If editing, keep the slug
    if (editingSlug) {
      post.slug = editingSlug;
    }
    
    try {
      await this.app.api.savePost(post);
      this.app.ui.toast.success('Guardado', `Post ${editingSlug ? 'actualizado' : 'creado'} correctamente`);
      this.app.router.navigate('blog');
    } catch (error) {
      this.app.ui.toast.error('Error', 'No se pudo guardar el post');
    }
  }
}

