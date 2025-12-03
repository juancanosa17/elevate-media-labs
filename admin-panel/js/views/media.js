/**
 * Media View
 * Media library management (placeholder for future expansion)
 */

export class MediaView {
  constructor(app) {
    this.app = app;
  }
  
  async render() {
    const pageContent = document.getElementById('page-content');
    
    pageContent.innerHTML = `
      <div class="data-section">
        <div class="section-header">
          <h2 class="section-title">Biblioteca de Medios</h2>
          <div class="section-actions">
            <button class="btn btn-primary" id="btn-upload">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>Subir Archivo</span>
            </button>
          </div>
        </div>
        
        <div class="empty-state" style="padding: var(--spacing-4xl);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 80px; height: 80px;">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <h3>Biblioteca de Medios</h3>
          <p>Esta función estará disponible próximamente.</p>
          <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-top: var(--spacing-md);">
            Por ahora, puedes subir imágenes directamente en los editores de posts y casos.
          </p>
        </div>
      </div>
      
      <!-- Future: Grid of media files -->
      <div class="media-grid" style="display: none;">
        <!-- Media items would go here -->
      </div>
    `;
    
    // Upload button (placeholder)
    document.getElementById('btn-upload')?.addEventListener('click', () => {
      this.app.ui.toast.info('Próximamente', 'Esta función estará disponible pronto');
    });
  }
}

