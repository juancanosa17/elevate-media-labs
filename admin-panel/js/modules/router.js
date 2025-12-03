/**
 * Router - Hash-based SPA Router
 * Handles navigation and route matching
 */

export class Router {
  constructor() {
    this.routes = new Map();
    this.defaultRoute = 'dashboard';
    this.currentRoute = null;
    this.currentParams = {};
    this.isStarted = false;
    this.changeCallbacks = [];
  }
  
  /**
   * Add a route
   */
  addRoute(path, handler) {
    this.routes.set(path, handler);
  }
  
  /**
   * Set default route
   */
  setDefault(route) {
    this.defaultRoute = route;
  }
  
  /**
   * Register route change callback
   */
  onRouteChange(callback) {
    this.changeCallbacks.push(callback);
  }
  
  /**
   * Start the router
   */
  start() {
    if (this.isStarted) return;
    
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
    this.isStarted = true;
  }
  
  /**
   * Navigate to a route
   */
  navigate(path) {
    window.location.hash = `#/${path}`;
  }
  
  /**
   * Go back
   */
  back() {
    window.history.back();
  }
  
  /**
   * Reload current route
   */
  async reload() {
    await this.handleRoute();
  }
  
  /**
   * Handle route change
   */
  async handleRoute() {
    const hash = window.location.hash.slice(2) || this.defaultRoute; // Remove '#/'
    const { route, params, handler } = this.matchRoute(hash);
    
    if (handler) {
      this.currentRoute = route;
      this.currentParams = params;
      
      // Notify listeners
      this.changeCallbacks.forEach(cb => cb(route, params));
      
      // Show loading state
      const pageContent = document.getElementById('page-content');
      if (pageContent) {
        pageContent.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
      }
      
      // Execute handler
      try {
        await handler(params);
      } catch (error) {
        console.error('Route handler error:', error);
        if (pageContent) {
          pageContent.innerHTML = `
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3>Error al cargar</h3>
              <p>${error.message}</p>
              <button class="btn btn-primary" onclick="window.adminApp.router.reload()">Reintentar</button>
            </div>
          `;
        }
      }
    } else {
      // 404 - Route not found
      this.navigate(this.defaultRoute);
    }
  }
  
  /**
   * Match route against registered routes
   */
  matchRoute(hash) {
    // Direct match first
    if (this.routes.has(hash)) {
      return {
        route: hash,
        params: {},
        handler: this.routes.get(hash)
      };
    }
    
    // Pattern matching for dynamic routes
    for (const [pattern, handler] of this.routes) {
      const params = this.extractParams(pattern, hash);
      if (params) {
        return {
          route: hash,
          params,
          handler
        };
      }
    }
    
    return { route: null, params: {}, handler: null };
  }
  
  /**
   * Extract params from route pattern
   */
  extractParams(pattern, hash) {
    const patternParts = pattern.split('/');
    const hashParts = hash.split('/');
    
    if (patternParts.length !== hashParts.length) {
      return null;
    }
    
    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        // Dynamic segment
        const paramName = patternParts[i].slice(1);
        params[paramName] = decodeURIComponent(hashParts[i]);
      } else if (patternParts[i] !== hashParts[i]) {
        // Mismatch
        return null;
      }
    }
    
    return params;
  }
  
  /**
   * Get current route info
   */
  getCurrent() {
    return {
      route: this.currentRoute,
      params: this.currentParams
    };
  }
}

