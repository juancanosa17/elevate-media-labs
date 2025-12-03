/**
 * Casos de Éxito View
 * Manage success cases/portfolio
 */

export class CasosView {
  constructor(app) {
    this.app = app;
  }
  
  async render() {
    const pageContent = document.getElementById('page-content');
    const casos = await this.app.api.getCasos();
    
    pageContent.innerHTML = `
      <div class="data-section">
        <div class="section-header">
          <h2 class="section-title">
            Casos de Éxito
            <span class="badge badge-default" style="margin-left: var(--spacing-sm);">${casos.length}</span>
          </h2>
          <div class="section-actions">
            <a href="#/casos/new" class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Nuevo Caso</span>
            </a>
          </div>
        </div>
        
        ${casos.length > 0 ? `
          <div class="content-grid">
            ${casos.map(caso => `
              <div class="content-card">
                <div class="content-card-image">
                  ${caso.image ? `<img src="${caso.image}" alt="${caso.title}">` : `
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1">
                      <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
                    </svg>
                  `}
                </div>
                <div class="content-card-body">
                  <div class="content-card-category">${caso.category}</div>
                  <h3 class="content-card-title">${caso.title}</h3>
                  <p class="content-card-excerpt">${caso.description || ''}</p>
                  <div class="content-card-meta">
                    <span class="badge ${caso.featured ? 'badge-info' : 'badge-default'}">
                      ${caso.featured ? '★ Destacado' : caso.metric}
                    </span>
                    <div class="content-card-actions">
                      <a href="#/casos/edit/${caso.id}" class="btn btn-ghost btn-sm">Editar</a>
                      <button class="btn btn-ghost btn-sm delete-caso" data-id="${caso.id}" style="color: var(--color-error);">Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
            </svg>
            <h3>Sin casos de éxito</h3>
            <p>Añade tu primer caso de éxito al portfolio</p>
            <a href="#/casos/new" class="btn btn-primary">Crear Caso</a>
          </div>
        `}
      </div>
    `;
    
    // Delete buttons
    document.querySelectorAll('.delete-caso').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const confirmed = await this.app.ui.modal.confirmDanger(
          '¿Eliminar caso?',
          'Esta acción no se puede deshacer.'
        );
        if (confirmed) {
          await this.app.api.deleteCaso(id);
          this.app.ui.toast.success('Eliminado', 'El caso ha sido eliminado');
          this.render();
        }
      });
    });
  }
  
  async renderEditor(id = null) {
    const pageContent = document.getElementById('page-content');
    
    let caso = {
      title: '',
      client: '',
      industry: 'Tecnología',
      category: 'Estrategia',
      metric: '',
      description: '',
      body: '',
      tags: [],
      image: '',
      order: 1,
      featured: false,
    };
    
    if (id) {
      const existing = await this.app.api.getCaso(id);
      if (existing) {
        caso = { ...caso, ...existing };
      }
    }
    
    const industries = ['Tecnología', 'E-commerce', 'Retail', 'Servicios', 'Salud', 'Educación', 'Finanzas', 'Alimentación', 'Moda', 'Entretenimiento', 'Otro'];
    const categories = ['Estrategia', 'Data Intelligence', 'Marketing Digital', 'Comunicación', 'Eventos', 'Campaña 360°'];
    
    pageContent.innerHTML = `
      <form id="caso-editor-form">
        <div class="editor-container">
          <div class="editor-main">
            <div class="editor-panel">
              <div class="form-group">
                <label for="caso-title">Título del Caso</label>
                <input type="text" id="caso-title" name="title" value="${caso.title}" required>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="caso-client">Cliente</label>
                  <input type="text" id="caso-client" name="client" value="${caso.client}" required>
                </div>
                <div class="form-group">
                  <label for="caso-metric">Métrica Principal</label>
                  <input type="text" id="caso-metric" name="metric" value="${caso.metric}" placeholder="Ej: +250% ROI">
                </div>
              </div>
              
              <div class="form-group">
                <label for="caso-description">Descripción Corta</label>
                <textarea id="caso-description" name="description" rows="3">${caso.description || ''}</textarea>
              </div>
              
              <div class="form-group">
                <label for="caso-body">Descripción Completa</label>
                <textarea id="caso-body" name="body" rows="8">${caso.body || ''}</textarea>
              </div>
            </div>
          </div>
          
          <div class="editor-sidebar">
            <div class="editor-panel">
              <div class="editor-panel-title">Publicación</div>
              
              <div class="form-group">
                <div class="toggle-wrapper">
                  <div class="toggle ${caso.featured ? 'active' : ''}" id="toggle-featured"></div>
                  <label>Destacado</label>
                </div>
              </div>
              
              <div class="form-group">
                <label for="caso-order">Orden</label>
                <input type="number" id="caso-order" name="order" value="${caso.order}" min="1">
              </div>
              
              <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-lg);">
                <button type="button" class="btn btn-secondary" onclick="window.adminApp.router.navigate('casos')">Cancelar</button>
                <button type="submit" class="btn btn-primary" style="flex: 1;">Guardar</button>
              </div>
            </div>
            
            <div class="editor-panel">
              <div class="editor-panel-title">Clasificación</div>
              
              <div class="form-group">
                <label for="caso-industry">Industria</label>
                <select id="caso-industry" name="industry">
                  ${industries.map(ind => `
                    <option value="${ind}" ${caso.industry === ind ? 'selected' : ''}>${ind}</option>
                  `).join('')}
                </select>
              </div>
              
              <div class="form-group">
                <label for="caso-category">Categoría</label>
                <select id="caso-category" name="category">
                  ${categories.map(cat => `
                    <option value="${cat}" ${caso.category === cat ? 'selected' : ''}>${cat}</option>
                  `).join('')}
                </select>
              </div>
            </div>
            
            <div class="editor-panel">
              <div class="editor-panel-title">Imagen</div>
              <div class="image-upload" id="image-dropzone">
                ${caso.image ? `
                  <img src="${caso.image}" alt="Preview" style="max-height: 120px; object-fit: cover; border-radius: var(--radius-md);">
                ` : `
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p>Arrastra una imagen</p>
                `}
                <input type="file" id="image-input" accept="image/*" style="display: none;">
              </div>
              <input type="hidden" id="caso-image" name="image" value="${caso.image || ''}">
            </div>
          </div>
        </div>
      </form>
    `;
    
    // Toggle
    document.getElementById('toggle-featured').addEventListener('click', function() {
      this.classList.toggle('active');
    });
    
    // Image upload
    const imageDropzone = document.getElementById('image-dropzone');
    const imageInput = document.getElementById('image-input');
    
    imageDropzone.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          document.getElementById('caso-image').value = ev.target.result;
          imageDropzone.innerHTML = `<img src="${ev.target.result}" alt="Preview" style="max-height: 120px; object-fit: cover; border-radius: var(--radius-md);">`;
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Form submit
    document.getElementById('caso-editor-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = {
        ...caso,
        title: formData.get('title'),
        client: formData.get('client'),
        industry: formData.get('industry'),
        category: formData.get('category'),
        metric: formData.get('metric'),
        description: formData.get('description'),
        body: formData.get('body'),
        image: formData.get('image'),
        order: parseInt(formData.get('order')) || 1,
        featured: document.getElementById('toggle-featured').classList.contains('active'),
      };
      
      if (id) data.id = parseInt(id);
      
      try {
        await this.app.api.saveCaso(data);
        this.app.ui.toast.success('Guardado', 'Caso guardado correctamente');
        this.app.router.navigate('casos');
      } catch (error) {
        this.app.ui.toast.error('Error', 'No se pudo guardar el caso');
      }
    });
  }
}

