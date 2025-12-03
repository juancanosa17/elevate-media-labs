/**
 * Settings View
 * Site configuration
 */

export class SettingsView {
  constructor(app) {
    this.app = app;
    this.activeTab = 'general';
  }
  
  async render() {
    const pageContent = document.getElementById('page-content');
    const settings = await this.app.api.getSettings();
    
    pageContent.innerHTML = `
      <div class="settings-container">
        <!-- Tabs -->
        <div class="settings-tabs">
          <button class="settings-tab ${this.activeTab === 'general' ? 'active' : ''}" data-tab="general">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            General
          </button>
          <button class="settings-tab ${this.activeTab === 'social' ? 'active' : ''}" data-tab="social">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
            Redes Sociales
          </button>
          <button class="settings-tab ${this.activeTab === 'hero' ? 'active' : ''}" data-tab="hero">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="9" y1="9" x2="15" y2="9"/>
              <line x1="9" y1="13" x2="15" y2="13"/>
              <line x1="9" y1="17" x2="12" y2="17"/>
            </svg>
            Hero
          </button>
          <button class="settings-tab ${this.activeTab === 'seo' ? 'active' : ''}" data-tab="seo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            SEO
          </button>
        </div>
        
        <!-- Tab Content -->
        <div class="settings-content">
          ${this.renderTab(settings)}
        </div>
      </div>
      
      <style>
        .settings-container {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: var(--spacing-xl);
          max-width: 900px;
        }
        
        .settings-tabs {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .settings-tab {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--color-text-secondary);
          text-align: left;
          transition: all var(--transition-base);
        }
        
        .settings-tab:hover {
          color: var(--color-text-primary);
          background: var(--color-bg-tertiary);
        }
        
        .settings-tab.active {
          color: var(--color-accent);
          background: rgba(168, 85, 247, 0.1);
        }
        
        .settings-content {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
        }
        
        @media (max-width: 768px) {
          .settings-container {
            grid-template-columns: 1fr;
          }
          
          .settings-tabs {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: var(--spacing-sm);
          }
          
          .settings-tab {
            white-space: nowrap;
          }
        }
      </style>
    `;
    
    // Tab switching
    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeTab = tab.dataset.tab;
        this.render();
      });
    });
    
    // Form submission
    const form = document.getElementById('settings-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.saveSettings(e.target);
      });
    }
  }
  
  renderTab(settings) {
    const tabs = {
      general: this.renderGeneralTab(settings.general || {}),
      social: this.renderSocialTab(settings.social || {}),
      hero: this.renderHeroTab(settings.hero || {}),
      seo: this.renderSeoTab(settings.seo || {}),
    };
    
    return tabs[this.activeTab] || tabs.general;
  }
  
  renderGeneralTab(data) {
    return `
      <form id="settings-form" data-section="general">
        <h3 style="margin-bottom: var(--spacing-lg); color: var(--color-text-primary);">Información General</h3>
        
        <div class="form-group">
          <label for="siteName">Nombre del Sitio</label>
          <input type="text" id="siteName" name="siteName" value="${data.siteName || 'Elevate Media Labs'}">
        </div>
        
        <div class="form-group">
          <label for="tagline">Tagline</label>
          <input type="text" id="tagline" name="tagline" value="${data.tagline || 'Estrategia & Data Intelligence'}">
        </div>
        
        <div class="form-group">
          <label for="siteDescription">Descripción</label>
          <textarea id="siteDescription" name="siteDescription" rows="3">${data.siteDescription || ''}</textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="contactEmail">Email de Contacto</label>
            <input type="email" id="contactEmail" name="contactEmail" value="${data.contactEmail || ''}">
          </div>
          <div class="form-group">
            <label for="contactPhone">Teléfono</label>
            <input type="text" id="contactPhone" name="contactPhone" value="${data.contactPhone || ''}">
          </div>
        </div>
        
        <div class="form-group">
          <label for="address">Dirección</label>
          <input type="text" id="address" name="address" value="${data.address || ''}">
        </div>
        
        <h4 style="margin: var(--spacing-xl) 0 var(--spacing-md); color: var(--color-text-primary);">Analytics</h4>
        
        <div class="form-row">
          <div class="form-group">
            <label for="googleAnalyticsId">Google Analytics ID</label>
            <input type="text" id="googleAnalyticsId" name="googleAnalyticsId" value="${data.googleAnalyticsId || ''}" placeholder="G-XXXXXXXXXX">
          </div>
          <div class="form-group">
            <label for="gtmId">Google Tag Manager ID</label>
            <input type="text" id="gtmId" name="gtmId" value="${data.gtmId || ''}" placeholder="GTM-XXXXXXX">
          </div>
        </div>
        
        <div style="margin-top: var(--spacing-xl); display: flex; justify-content: flex-end;">
          <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>
    `;
  }
  
  renderSocialTab(data) {
    return `
      <form id="settings-form" data-section="social">
        <h3 style="margin-bottom: var(--spacing-lg); color: var(--color-text-primary);">Redes Sociales</h3>
        
        <div class="form-group">
          <label for="linkedin">LinkedIn</label>
          <input type="url" id="linkedin" name="linkedin" value="${data.linkedin || ''}" placeholder="https://linkedin.com/company/...">
        </div>
        
        <div class="form-group">
          <label for="twitter">Twitter / X</label>
          <input type="url" id="twitter" name="twitter" value="${data.twitter || ''}" placeholder="https://x.com/...">
        </div>
        
        <div class="form-group">
          <label for="instagram">Instagram</label>
          <input type="url" id="instagram" name="instagram" value="${data.instagram || ''}" placeholder="https://instagram.com/...">
        </div>
        
        <div class="form-group">
          <label for="facebook">Facebook</label>
          <input type="url" id="facebook" name="facebook" value="${data.facebook || ''}" placeholder="https://facebook.com/...">
        </div>
        
        <div class="form-group">
          <label for="youtube">YouTube</label>
          <input type="url" id="youtube" name="youtube" value="${data.youtube || ''}" placeholder="https://youtube.com/...">
        </div>
        
        <div class="form-group">
          <label for="whatsapp">WhatsApp</label>
          <input type="text" id="whatsapp" name="whatsapp" value="${data.whatsapp || ''}" placeholder="+5491123456789">
        </div>
        
        <div style="margin-top: var(--spacing-xl); display: flex; justify-content: flex-end;">
          <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>
    `;
  }
  
  renderHeroTab(data) {
    return `
      <form id="settings-form" data-section="hero">
        <h3 style="margin-bottom: var(--spacing-lg); color: var(--color-text-primary);">Contenido del Hero</h3>
        
        <div class="form-group">
          <label for="title">Título Principal</label>
          <input type="text" id="title" name="title" value="${data.title || 'ELEVATE MEDIA LABS'}">
        </div>
        
        <div class="form-group">
          <label for="subtitle">Subtítulo</label>
          <input type="text" id="subtitle" name="subtitle" value="${data.subtitle || 'Estrategia & Data Intelligence'}">
        </div>
        
        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea id="description" name="description" rows="4">${data.description || ''}</textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="ctaText">Texto del Botón CTA</label>
            <input type="text" id="ctaText" name="ctaText" value="${data.ctaText || 'Hablemos'}">
          </div>
          <div class="form-group">
            <label for="ctaLink">Link del Botón CTA</label>
            <input type="text" id="ctaLink" name="ctaLink" value="${data.ctaLink || '#contacto'}">
          </div>
        </div>
        
        <div style="margin-top: var(--spacing-xl); display: flex; justify-content: flex-end;">
          <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>
    `;
  }
  
  renderSeoTab(data) {
    return `
      <form id="settings-form" data-section="seo">
        <h3 style="margin-bottom: var(--spacing-lg); color: var(--color-text-primary);">SEO Global</h3>
        
        <div class="form-group">
          <label for="metaTitle">Meta Título</label>
          <input type="text" id="metaTitle" name="metaTitle" value="${data.metaTitle || ''}">
          <span class="form-hint">60-70 caracteres recomendados</span>
        </div>
        
        <div class="form-group">
          <label for="metaDescription">Meta Descripción</label>
          <textarea id="metaDescription" name="metaDescription" rows="3">${data.metaDescription || ''}</textarea>
          <span class="form-hint">150-160 caracteres recomendados</span>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="language">Idioma</label>
            <select id="language" name="language">
              <option value="es" ${data.language === 'es' ? 'selected' : ''}>Español</option>
              <option value="en" ${data.language === 'en' ? 'selected' : ''}>English</option>
              <option value="pt" ${data.language === 'pt' ? 'selected' : ''}>Português</option>
            </select>
          </div>
          <div class="form-group">
            <label for="region">Región</label>
            <input type="text" id="region" name="region" value="${data.region || ''}" placeholder="AR, MX, CO...">
          </div>
        </div>
        
        <div style="margin-top: var(--spacing-xl); display: flex; justify-content: flex-end;">
          <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>
    `;
  }
  
  async saveSettings(form) {
    const section = form.dataset.section;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await this.app.api.saveSettings(section, data);
      this.app.ui.toast.success('Guardado', 'Configuración actualizada');
    } catch (error) {
      this.app.ui.toast.error('Error', 'No se pudo guardar la configuración');
    }
  }
}

