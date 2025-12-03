/**
 * API - Data Access Layer
 * Handles reading/writing content files
 * Works with JSON files and Markdown with frontmatter
 */

export class API {
  constructor(store) {
    this.store = store;
    this.basePath = '/content';
  }
  
  /**
   * Fetch all blog posts
   */
  async getPosts() {
    const cached = this.store.getCache('posts');
    if (cached) return cached;
    
    try {
      // In production, this would fetch from a serverless function or git API
      const response = await fetch('/public/data/blog-posts.json');
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      const posts = data.posts || [];
      
      this.store.set('posts', posts);
      this.store.setCache('posts', posts);
      
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
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
    // In production, this would use Git Gateway API or serverless function
    const posts = await this.getPosts();
    const existingIndex = posts.findIndex(p => p.slug === post.slug);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = { ...posts[existingIndex], ...post, updatedAt: new Date().toISOString() };
    } else {
      post.createdAt = new Date().toISOString();
      post.slug = post.slug || this.generateSlug(post.title);
      posts.unshift(post);
    }
    
    this.store.set('posts', posts);
    this.store.clearCache('posts');
    
    // Store locally for demo
    localStorage.setItem('admin-posts', JSON.stringify(posts));
    
    return post;
  }
  
  /**
   * Delete a post
   */
  async deletePost(slug) {
    const posts = await this.getPosts();
    const filtered = posts.filter(p => p.slug !== slug);
    
    this.store.set('posts', filtered);
    this.store.clearCache('posts');
    
    localStorage.setItem('admin-posts', JSON.stringify(filtered));
    
    return true;
  }
  
  /**
   * Fetch all servicios
   */
  async getServicios() {
    const cached = this.store.getCache('servicios');
    if (cached) return cached;
    
    try {
      // Try to read from localStorage first (demo mode)
      const localData = localStorage.getItem('admin-servicios');
      if (localData) {
        const servicios = JSON.parse(localData);
        this.store.set('servicios', servicios);
        this.store.setCache('servicios', servicios);
        return servicios;
      }
      
      // Default servicios structure
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
    } catch (error) {
      console.error('Error fetching servicios:', error);
      return [];
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
    const servicios = await this.getServicios();
    const existingIndex = servicios.findIndex(s => s.id === servicio.id);
    
    if (existingIndex >= 0) {
      servicios[existingIndex] = { ...servicios[existingIndex], ...servicio };
    } else {
      servicio.id = Math.max(...servicios.map(s => s.id), 0) + 1;
      servicios.push(servicio);
    }
    
    this.store.set('servicios', servicios);
    this.store.clearCache('servicios');
    localStorage.setItem('admin-servicios', JSON.stringify(servicios));
    
    return servicio;
  }
  
  /**
   * Delete servicio
   */
  async deleteServicio(id) {
    const servicios = await this.getServicios();
    const filtered = servicios.filter(s => s.id !== parseInt(id));
    
    this.store.set('servicios', filtered);
    this.store.clearCache('servicios');
    localStorage.setItem('admin-servicios', JSON.stringify(filtered));
    
    return true;
  }
  
  /**
   * Fetch all casos
   */
  async getCasos() {
    const cached = this.store.getCache('casos');
    if (cached) return cached;
    
    try {
      const localData = localStorage.getItem('admin-casos');
      if (localData) {
        const casos = JSON.parse(localData);
        this.store.set('casos', casos);
        this.store.setCache('casos', casos);
        return casos;
      }
      
      // Default casos from the main website
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
    } catch (error) {
      console.error('Error fetching casos:', error);
      return [];
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
    const casos = await this.getCasos();
    const existingIndex = casos.findIndex(c => c.id === caso.id);
    
    if (existingIndex >= 0) {
      casos[existingIndex] = { ...casos[existingIndex], ...caso };
    } else {
      caso.id = Math.max(...casos.map(c => c.id), 0) + 1;
      casos.push(caso);
    }
    
    this.store.set('casos', casos);
    this.store.clearCache('casos');
    localStorage.setItem('admin-casos', JSON.stringify(casos));
    
    return caso;
  }
  
  /**
   * Delete caso
   */
  async deleteCaso(id) {
    const casos = await this.getCasos();
    const filtered = casos.filter(c => c.id !== parseInt(id));
    
    this.store.set('casos', filtered);
    this.store.clearCache('casos');
    localStorage.setItem('admin-casos', JSON.stringify(filtered));
    
    return true;
  }
  
  /**
   * Get settings
   */
  async getSettings() {
    const cached = this.store.getCache('settings');
    if (cached) return cached;
    
    try {
      const localData = localStorage.getItem('admin-settings');
      if (localData) {
        const settings = JSON.parse(localData);
        this.store.set('settings', settings);
        this.store.setCache('settings', settings);
        return settings;
      }
      
      // Fetch from files
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
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {};
    }
  }
  
  /**
   * Save settings
   */
  async saveSettings(section, data) {
    const settings = await this.getSettings();
    settings[section] = { ...settings[section], ...data };
    
    this.store.set('settings', settings);
    this.store.clearCache('settings');
    localStorage.setItem('admin-settings', JSON.stringify(settings));
    
    return settings;
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

