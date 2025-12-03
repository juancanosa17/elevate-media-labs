/**
 * Auth - Authentication Module
 * Handles user authentication with Netlify Identity
 */

export class Auth {
  constructor(store, ui) {
    this.store = store;
    this.ui = ui;
    this.netlifyIdentity = null;
    this.authCallbacks = [];
    
    this.initNetlifyIdentity();
  }
  
  /**
   * Initialize Netlify Identity
   */
  initNetlifyIdentity() {
    if (typeof netlifyIdentity !== 'undefined') {
      this.netlifyIdentity = netlifyIdentity;
      
      // Initialize with your site URL
      this.netlifyIdentity.init();
      
      // Listen for login events
      this.netlifyIdentity.on('login', (user) => {
        this.handleAuthSuccess(user);
      });
      
      // Listen for logout events
      this.netlifyIdentity.on('logout', () => {
        this.handleLogout();
      });
      
      // Listen for errors
      this.netlifyIdentity.on('error', (err) => {
        console.error('Netlify Identity error:', err);
      });
    }
  }
  
  /**
   * Check if user is authenticated
   */
  async checkAuth() {
    // Check Netlify Identity first
    if (this.netlifyIdentity) {
      const user = this.netlifyIdentity.currentUser();
      if (user) {
        this.store.set('user', this.normalizeUser(user));
        return true;
      }
    }
    
    // Check local storage (for demo/dev mode)
    const localUser = localStorage.getItem('admin-user');
    if (localUser) {
      try {
        const user = JSON.parse(localUser);
        this.store.set('user', user);
        return true;
      } catch (e) {
        localStorage.removeItem('admin-user');
      }
    }
    
    return false;
  }
  
  /**
   * Login with email/password
   */
  async login(email, password) {
    // Try Netlify Identity first
    if (this.netlifyIdentity) {
      return new Promise((resolve, reject) => {
        this.netlifyIdentity.login(email, password, true)
          .then(() => resolve())
          .catch((error) => {
            // If Netlify Identity fails, try demo mode
            if (this.isDemoMode(email, password)) {
              this.loginDemo(email);
              resolve();
            } else {
              reject(new Error(error.message || 'Credenciales inválidas'));
            }
          });
      });
    }
    
    // Demo mode fallback
    if (this.isDemoMode(email, password)) {
      this.loginDemo(email);
      return;
    }
    
    throw new Error('Credenciales inválidas');
  }
  
  /**
   * Check if demo credentials
   */
  isDemoMode(email, password) {
    // Allow demo login for development
    return email === 'admin@elevate.com' && password === 'admin123';
  }
  
  /**
   * Demo login
   */
  loginDemo(email) {
    const user = {
      email,
      name: 'Admin',
      role: 'admin',
      avatar: null
    };
    
    localStorage.setItem('admin-user', JSON.stringify(user));
    this.store.set('user', user);
    this.notifyAuthChange(user);
  }
  
  /**
   * Login with Netlify Identity modal
   */
  loginWithNetlify() {
    if (this.netlifyIdentity) {
      this.netlifyIdentity.open('login');
    } else {
      this.ui.toast.error('Error', 'Netlify Identity no está disponible');
    }
  }
  
  /**
   * Logout
   */
  async logout() {
    if (this.netlifyIdentity && this.netlifyIdentity.currentUser()) {
      await this.netlifyIdentity.logout();
    }
    
    localStorage.removeItem('admin-user');
    this.store.set('user', null);
    this.notifyAuthChange(null);
  }
  
  /**
   * Handle successful authentication
   */
  handleAuthSuccess(netlifyUser) {
    const user = this.normalizeUser(netlifyUser);
    this.store.set('user', user);
    this.notifyAuthChange(user);
    
    // Close Netlify Identity modal if open
    if (this.netlifyIdentity) {
      this.netlifyIdentity.close();
    }
  }
  
  /**
   * Handle logout
   */
  handleLogout() {
    localStorage.removeItem('admin-user');
    this.store.set('user', null);
    this.notifyAuthChange(null);
  }
  
  /**
   * Normalize user object from different sources
   */
  normalizeUser(user) {
    if (!user) return null;
    
    // Netlify Identity user
    if (user.app_metadata) {
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        role: user.app_metadata?.roles?.[0] || 'admin',
        avatar: user.user_metadata?.avatar_url
      };
    }
    
    // Already normalized
    return user;
  }
  
  /**
   * Get current user
   */
  getUser() {
    return this.store.get('user');
  }
  
  /**
   * Check if user has role
   */
  hasRole(role) {
    const user = this.getUser();
    return user?.role === role;
  }
  
  /**
   * Register auth state change callback
   */
  onAuthStateChange(callback) {
    this.authCallbacks.push(callback);
  }
  
  /**
   * Notify auth state change
   */
  notifyAuthChange(user) {
    this.authCallbacks.forEach(cb => cb(user));
  }
  
  /**
   * Get auth token for API calls
   */
  async getToken() {
    if (this.netlifyIdentity) {
      const user = this.netlifyIdentity.currentUser();
      if (user) {
        const token = await user.jwt();
        return token;
      }
    }
    return null;
  }
}

