/**
 * Servicios View
 * Manage services
 */

export class ServiciosView {
  constructor(app) {
    this.app = app;
  }
  
  async render() {
    const pageContent = document.getElementById('page-content');
    const servicios = await this.app.api.getServicios();
    
    // Sort by order
    servicios.sort((a, b) => a.order - b.order);
    
    pageContent.innerHTML = `
      <div class="data-section">
        <div class="section-header">
          <h2 class="section-title">
            Servicios
            <span class="badge badge-default" style="margin-left: var(--spacing-sm);">${servicios.length}</span>
          </h2>
          <div class="section-actions">
            <a href="#/servicios/new" class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Nuevo Servicio</span>
            </a>
          </div>
        </div>
        
        ${servicios.length > 0 ? `
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 60px">Orden</th>
                <th>Título</th>
                <th>Icono</th>
                <th>Estado</th>
                <th style="width: 100px">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${servicios.map(servicio => `
                <tr data-id="${servicio.id}">
                  <td style="text-align: center; color: var(--color-text-muted);">${servicio.order}</td>
                  <td class="title-cell">${servicio.title}</td>
                  <td><span class="badge badge-default">${servicio.icon || 'default'}</span></td>
                  <td>
                    <span class="badge ${servicio.active ? 'badge-success' : 'badge-warning'}">
                      ${servicio.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <a href="#/servicios/edit/${servicio.id}" class="btn btn-icon btn-sm" title="Editar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </a>
                    <button class="btn btn-icon btn-sm delete-servicio" data-id="${servicio.id}" title="Eliminar">
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
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
            </svg>
            <h3>Sin servicios</h3>
            <p>Crea tu primer servicio</p>
            <a href="#/servicios/new" class="btn btn-primary">Crear Servicio</a>
          </div>
        `}
      </div>
    `;
    
    // Delete buttons
    document.querySelectorAll('.delete-servicio').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const confirmed = await this.app.ui.modal.confirmDanger(
          '¿Eliminar servicio?',
          'Esta acción no se puede deshacer.'
        );
        if (confirmed) {
          await this.app.api.deleteServicio(id);
          this.app.ui.toast.success('Eliminado', 'El servicio ha sido eliminado');
          this.render();
        }
      });
    });
  }
  
  async renderEditor(id = null) {
    const pageContent = document.getElementById('page-content');
    
    let servicio = {
      title: '',
      shortDescription: '',
      body: '',
      icon: 'chart-bar',
      color: 'gradient',
      order: 1,
      active: true,
      features: [],
    };
    
    if (id) {
      const existing = await this.app.api.getServicio(id);
      if (existing) {
        servicio = { ...servicio, ...existing };
      }
    }
    
    const icons = ['chart-bar', 'lightbulb', 'megaphone', 'users', 'calendar', 'cog', 'rocket', 'star'];
    const colors = [
      { label: 'Púrpura', value: 'purple' },
      { label: 'Cyan', value: 'cyan' },
      { label: 'Gradiente', value: 'gradient' }
    ];
    
    pageContent.innerHTML = `
      <form id="servicio-editor-form">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${id ? 'Editar' : 'Nuevo'} Servicio</h3>
          </div>
          <div class="card-body">
            <div class="form-row">
              <div class="form-group">
                <label for="servicio-title">Título</label>
                <input type="text" id="servicio-title" name="title" value="${servicio.title}" required>
              </div>
              <div class="form-group">
                <label for="servicio-order">Orden</label>
                <input type="number" id="servicio-order" name="order" value="${servicio.order}" min="1">
              </div>
            </div>
            
            <div class="form-group">
              <label for="servicio-short">Descripción Corta</label>
              <textarea id="servicio-short" name="shortDescription" rows="2">${servicio.shortDescription || ''}</textarea>
            </div>
            
            <div class="form-group">
              <label for="servicio-body">Descripción Completa</label>
              <textarea id="servicio-body" name="body" rows="6">${servicio.body || ''}</textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="servicio-icon">Icono</label>
                <select id="servicio-icon" name="icon">
                  ${icons.map(icon => `
                    <option value="${icon}" ${servicio.icon === icon ? 'selected' : ''}>${icon}</option>
                  `).join('')}
                </select>
              </div>
              <div class="form-group">
                <label for="servicio-color">Color de Acento</label>
                <select id="servicio-color" name="color">
                  ${colors.map(c => `
                    <option value="${c.value}" ${servicio.color === c.value ? 'selected' : ''}>${c.label}</option>
                  `).join('')}
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <div class="toggle-wrapper">
                <div class="toggle ${servicio.active ? 'active' : ''}" id="toggle-active"></div>
                <label>Servicio Activo</label>
              </div>
            </div>
          </div>
          <div class="card-footer" style="display: flex; justify-content: flex-end; gap: var(--spacing-sm);">
            <button type="button" class="btn btn-secondary" onclick="window.adminApp.router.navigate('servicios')">Cancelar</button>
            <button type="submit" class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              Guardar
            </button>
          </div>
        </div>
      </form>
    `;
    
    // Toggle
    document.getElementById('toggle-active').addEventListener('click', function() {
      this.classList.toggle('active');
    });
    
    // Form submit
    document.getElementById('servicio-editor-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = {
        ...servicio,
        title: formData.get('title'),
        shortDescription: formData.get('shortDescription'),
        body: formData.get('body'),
        icon: formData.get('icon'),
        color: formData.get('color'),
        order: parseInt(formData.get('order')) || 1,
        active: document.getElementById('toggle-active').classList.contains('active'),
      };
      
      if (id) data.id = parseInt(id);
      
      try {
        await this.app.api.saveServicio(data);
        this.app.ui.toast.success('Guardado', 'Servicio guardado correctamente');
        this.app.router.navigate('servicios');
      } catch (error) {
        this.app.ui.toast.error('Error', 'No se pudo guardar el servicio');
      }
    });
  }
}

