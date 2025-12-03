/**
 * Dashboard View
 * Main overview with stats and quick actions
 */

import { formatRelativeTime, truncate } from '../modules/ui.js';

export class DashboardView {
  constructor(app) {
    this.app = app;
  }
  
  async render() {
    const pageContent = document.getElementById('page-content');
    
    // Fetch stats
    const stats = await this.app.api.getStats();
    const posts = await this.app.api.getPosts();
    const casos = await this.app.api.getCasos();
    
    // Get recent posts (last 5)
    const recentPosts = posts.slice(0, 5);
    
    pageContent.innerHTML = `
      <!-- Quick Actions -->
      <div class="quick-actions">
        <a href="#/blog/new" class="quick-action">
          <div class="quick-action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
            </svg>
          </div>
          <div class="quick-action-content">
            <h3>Nuevo Post</h3>
            <p>Crear artículo para el blog</p>
          </div>
        </a>
        <a href="#/casos/new" class="quick-action">
          <div class="quick-action-icon" style="background: rgba(34, 211, 238, 0.1); color: var(--color-cyan);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20V10"/>
              <path d="M18 20V4"/>
              <path d="M6 20v-4"/>
            </svg>
          </div>
          <div class="quick-action-content">
            <h3>Nuevo Caso</h3>
            <p>Añadir caso de éxito</p>
          </div>
        </a>
        <a href="#/settings" class="quick-action">
          <div class="quick-action-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--color-warning);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div class="quick-action-content">
            <h3>Configuración</h3>
            <p>Ajustes del sitio</p>
          </div>
        </a>
      </div>
      
      <!-- Stats Grid -->
      <div class="dashboard-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              </svg>
            </div>
            <div class="stat-trend up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              <span>+12%</span>
            </div>
          </div>
          <div class="stat-value">${stats.posts.total}</div>
          <div class="stat-label">Posts del Blog</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
          </div>
          <div class="stat-value">${stats.servicios.total}</div>
          <div class="stat-label">Servicios Activos</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20V10"/>
                <path d="M18 20V4"/>
                <path d="M6 20v-4"/>
              </svg>
            </div>
            <div class="stat-trend up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              <span>+${stats.casos.featured}</span>
            </div>
          </div>
          <div class="stat-value">${stats.casos.total}</div>
          <div class="stat-label">Casos de Éxito</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
                <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/>
                <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/>
                <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/>
                <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/>
                <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>
              </svg>
            </div>
          </div>
          <div class="stat-value">${stats.posts.published}</div>
          <div class="stat-label">Publicaciones Activas</div>
        </div>
      </div>
      
      <!-- Recent Content & Activity -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--spacing-lg);">
        <!-- Recent Posts -->
        <div class="data-section">
          <div class="section-header">
            <h2 class="section-title">Posts Recientes</h2>
            <a href="#/blog" class="btn btn-ghost btn-sm">Ver todos →</a>
          </div>
          
          ${recentPosts.length > 0 ? `
            <table class="data-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${recentPosts.map(post => `
                  <tr>
                    <td class="title-cell">
                      <a href="#/blog/edit/${post.slug}" style="color: inherit;">${truncate(post.title, 40)}</a>
                    </td>
                    <td><span class="badge badge-default">${post.category || 'Sin categoría'}</span></td>
                    <td>
                      <span class="badge ${post.draft ? 'badge-warning' : 'badge-success'}">
                        ${post.draft ? 'Borrador' : 'Publicado'}
                      </span>
                    </td>
                    <td>${formatRelativeTime(post.date)}</td>
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
              <h3>Sin posts aún</h3>
              <p>Crea tu primer artículo para el blog</p>
              <a href="#/blog/new" class="btn btn-primary">Crear Post</a>
            </div>
          `}
        </div>
        
        <!-- Casos Destacados -->
        <div class="data-section">
          <div class="section-header">
            <h2 class="section-title">Casos Destacados</h2>
          </div>
          
          <div class="activity-list">
            ${casos.filter(c => c.featured).slice(0, 4).map(caso => `
              <div class="activity-item">
                <div class="activity-icon create">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20V10"/>
                    <path d="M18 20V4"/>
                    <path d="M6 20v-4"/>
                  </svg>
                </div>
                <div class="activity-content">
                  <div class="activity-title">${truncate(caso.title, 30)}</div>
                  <div class="activity-time">${caso.metric}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

