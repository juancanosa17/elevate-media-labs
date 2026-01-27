/**
 * API - Data Access Layer
 * Handles reading/writing content via Netlify Functions + GitHub API
 */

export class API {
  constructor(store) {
    this.store = store;
    this.baseUrl = '/.netlify/functions/github-cms';
    this.useLocalFallback = false; // Set to true for local development
  }
  
  /**
   * Make API request to Netlify Function
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  }
  
  /**
   * Fetch all blog posts
   */
  async getPosts() {
    const cached = this.store.getCache('posts');
    if (cached) return cached;
    
    try {
      // Try API first
      const data = await this.request('/posts');
      const posts = data.posts || [];
      
      this.store.set('posts', posts);
      this.store.setCache('posts', posts);
      
      return posts;
    } catch (error) {
      console.warn('API error, trying local fallback:', error.message);
      
      // Fallback to static file
      try {
        const response = await fetch('/public/data/blog-posts.json');
        if (response.ok) {
          const posts = await response.json();
          this.store.set('posts', posts);
          this.store.setCache('posts', posts);
          return Array.isArray(posts) ? posts : [];
        }
      } catch (e) {
        console.error('Local fallback also failed');
      }
      
      return [];
    }
  }
  
  /**
   * Get single post by slug
   */
  async getPost(slug) {
    const posts = await this.getPosts();
    return posts.find(p => p.slug === slug);
  }
  
  /**
   * Save a post (create or update)
   */
  async savePost(post) {
    try {
      const result = await this.request('/posts', {
        method: 'POST',
        body: JSON.stringify(post)
      });
      
      // Clear cache to force refresh
      this.store.clearCache('posts');
      
      return result.post || post;
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  }
  
  /**
   * Delete a post
   */
  async deletePost(slug) {
    try {
      await this.request(`/posts/${slug}`, {
        method: 'DELETE'
      });
      
      this.store.clearCache('posts');
      
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
  
  /**
   * Fetch all servicios
   */
  async getServicios() {
    const cached = this.store.getCache('servicios');
    if (cached) return cached;
    
    try {
      const data = await this.request('/servicios');
      const servicios = data.servicios || [];
      
      this.store.set('servicios', servicios);
      this.store.setCache('servicios', servicios);
      
      return servicios;
    } catch (error) {
      console.warn('API error for servicios:', error.message);
      
      // Default servicios
      const defaultServicios = [
        { id: 1, title: 'Estrategia & Data Intelligence', order: 1, active: true },
        { id: 2, title: 'Publicidad 360°', order: 2, active: true },
        { id: 3, title: 'Comunicación que Conecta', order: 3, active: true },
        { id: 4, title: 'Plan de Marketing & Performance', order: 4, active: true },
        { id: 5, title: 'Activaciones & Experiencias 360°', order: 5, active: true },
        { id: 6, title: 'Engage Events & Summits', order: 6, active: true },
        { id: 7, title: 'Research & Media Lab', order: 7, active: true },
      ];
      
      this.store.set('servicios', defaultServicios);
      this.store.setCache('servicios', defaultServicios);
      
      return defaultServicios;
    }
  }
  
  /**
   * Get single servicio
   */
  async getServicio(id) {
    const servicios = await this.getServicios();
    return servicios.find(s => s.id === parseInt(id));
  }
  
  /**
   * Save servicio
   */
  async saveServicio(servicio) {
    try {
      const result = await this.request('/servicios', {
        method: 'POST',
        body: JSON.stringify(servicio)
      });
      
      this.store.clearCache('servicios');
      
      return result.servicio || servicio;
    } catch (error) {
      console.error('Error saving servicio:', error);
      throw error;
    }
  }
  
  /**
   * Delete servicio
   */
  async deleteServicio(id) {
    try {
      await this.request(`/servicios/${id}`, {
        method: 'DELETE'
      });
      
      this.store.clearCache('servicios');
      
      return true;
    } catch (error) {
      console.error('Error deleting servicio:', error);
      throw error;
    }
  }
  
  /**
   * Fetch all casos
   */
  async getCasos() {
    const cached = this.store.getCache('casos');
    if (cached) return cached;
    
    try {
      const data = await this.request('/casos');
      const casos = data.casos || [];
      
      this.store.set('casos', casos);
      this.store.setCache('casos', casos);
      
      return casos;
    } catch (error) {
      console.warn('API error for casos:', error.message);
      
      // Default casos
      const defaultCasos = [
        { id: 1, title: 'Transformación Digital TechCorp', client: 'TechCorp', category: 'Estrategia & Data Intelligence', metric: '+250% ROI', featured: true },
        { id: 2, title: 'Lanzamiento Marca EcoLife', client: 'EcoLife', category: 'Publicidad 360°', metric: '+45M Reach', featured: true },
        { id: 3, title: 'Reputación FoodHub', client: 'FoodHub', category: 'Comunicación', metric: '+80% Engagement', featured: false },
        { id: 4, title: 'Optimización FinTech Solutions', client: 'FinTech Solutions', category: 'Performance Marketing', metric: '-60% CAC', featured: false },
        { id: 5, title: 'Summit Innovation 2024', client: 'Summit Innovation', category: 'Eventos & Experiencias', metric: '5K Asistentes', featured: true },
        { id: 6, title: 'Estudio RetailTech Insights', client: 'RetailTech', category: 'Research & Media Lab', metric: '+35% Brand Lift', featured: false },
      ];
      
      this.store.set('casos', defaultCasos);
      this.store.setCache('casos', defaultCasos);
      
      return defaultCasos;
    }
  }
  
  /**
   * Get single caso
   */
  async getCaso(id) {
    const casos = await this.getCasos();
    return casos.find(c => c.id === parseInt(id));
  }
  
  /**
   * Save caso
   */
  async saveCaso(caso) {
    try {
      const result = await this.request('/casos', {
        method: 'POST',
        body: JSON.stringify(caso)
      });
      
      this.store.clearCache('casos');
      
      return result.caso || caso;
    } catch (error) {
      console.error('Error saving caso:', error);
      throw error;
    }
  }
  
  /**
   * Delete caso
   */
  async deleteCaso(id) {
    try {
      await this.request(`/casos/${id}`, {
        method: 'DELETE'
      });
      
      this.store.clearCache('casos');
      
      return true;
    } catch (error) {
      console.error('Error deleting caso:', error);
      throw error;
    }
  }
  
  /**
   * Get settings
   */
  async getSettings() {
    const cached = this.store.getCache('settings');
    if (cached) return cached;
    
    try {
      const [general, social, hero, seo] = await Promise.all([
        this.request('/settings/general').catch(() => ({})),
        this.request('/settings/social').catch(() => ({})),
        this.request('/settings/hero').catch(() => ({})),
        this.request('/settings/seo').catch(() => ({})),
      ]);
      
      const settings = { general, social, hero, seo };
      
      this.store.set('settings', settings);
      this.store.setCache('settings', settings);
      
      return settings;
    } catch (error) {
      console.warn('API error for settings:', error.message);
      
      // Try fetching from static files
      try {
        const [general, social, hero, seo] = await Promise.all([
          this.fetchJson('/content/settings/general.json').catch(() => ({})),
          this.fetchJson('/content/settings/social.json').catch(() => ({})),
          this.fetchJson('/content/settings/hero.json').catch(() => ({})),
          this.fetchJson('/content/settings/seo.json').catch(() => ({})),
        ]);
        
        const settings = { general, social, hero, seo };
        
        this.store.set('settings', settings);
        this.store.setCache('settings', settings);
        
        return settings;
      } catch (e) {
        return { general: {}, social: {}, hero: {}, seo: {} };
      }
    }
  }
  
  /**
   * Save settings
   */
  async saveSettings(section, data) {
    try {
      await this.request(`/settings/${section}`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      // Update local cache
      const settings = await this.getSettings();
      settings[section] = { ...settings[section], ...data };
      
      this.store.set('settings', settings);
      this.store.clearCache('settings');
      
      return settings;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
  
  /**
   * Get dashboard stats
   */
  async getStats() {
    const [posts, servicios, casos] = await Promise.all([
      this.getPosts(),
      this.getServicios(),
      this.getCasos(),
    ]);
    
    return {
      posts: {
        total: posts.length,
        published: posts.filter(p => !p.draft).length,
        drafts: posts.filter(p => p.draft).length,
      },
      servicios: {
        total: servicios.length,
        active: servicios.filter(s => s.active).length,
      },
      casos: {
        total: casos.length,
        featured: casos.filter(c => c.featured).length,
      }
    };
  }
  
  /**
   * Utility: Fetch JSON file
   */
  async fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return response.json();
  }
  
  /**
   * Utility: Generate slug from title
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  /**
   * Utility: Format date
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
