/**
 * Auth - Authentication Module
 * Handles user authentication with Netlify Identity
 * SECURE: Only allows login via Netlify Identity
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
      this.netlifyIdentity.init({
        APIUrl: 'https://elevatemedialabs.com/.netlify/identity'
      });
      
      // Listen for login events
      this.netlifyIdentity.on('login', (user) => {
        console.log('Netlify Identity login:', user.email);
        this.handleAuthSuccess(user);
      });
      
      // Listen for logout events
      this.netlifyIdentity.on('logout', () => {
        console.log('Netlify Identity logout');
        this.handleLogout();
      });
      
      // Listen for errors
      this.netlifyIdentity.on('error', (err) => {
        console.error('Netlify Identity error:', err);
        this.ui?.toast?.error('Error de autenticación', err.message || 'Error desconocido');
      });
      
      // Listen for init event
      this.netlifyIdentity.on('init', (user) => {
        if (user) {
          console.log('Netlify Identity init with user:', user.email);
          this.handleAuthSuccess(user);
        }
      });
    } else {
      console.warn('Netlify Identity widget not loaded');
    }
  }
  
  /**
   * Check if user is authenticated
   */
  async checkAuth() {
    // Check Netlify Identity
    if (this.netlifyIdentity) {
      const user = this.netlifyIdentity.currentUser();
      if (user) {
        this.store.set('user', this.normalizeUser(user));
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Login with email/password via Netlify Identity
   */
  async login(email, password) {
    if (!this.netlifyIdentity) {
      throw new Error('Netlify Identity no está disponible. Recarga la página.');
    }
    
    // Use GoTrue API for direct login
    const gotrue = this.netlifyIdentity.gotrue;
    
    if (gotrue) {
      try {
        const response = await gotrue.login(email, password, true);
        this.handleAuthSuccess(response);
        return;
      } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Credenciales inválidas');
      }
    } else {
      throw new Error('Por favor usa el botón "Continuar con Netlify" para iniciar sesión');
    }
  }
  
  /**
   * Login with Netlify Identity modal (recommended)
   */
  loginWithNetlify() {
    if (this.netlifyIdentity) {
      this.netlifyIdentity.open('login');
    } else {
      this.ui?.toast?.error('Error', 'Netlify Identity no está disponible. Recarga la página.');
    }
  }
  
  /**
   * Signup with Netlify Identity modal
   */
  signupWithNetlify() {
    if (this.netlifyIdentity) {
      this.netlifyIdentity.open('signup');
    } else {
      this.ui?.toast?.error('Error', 'Netlify Identity no está disponible');
    }
  }
  
  /**
   * Logout
   */
  async logout() {
    if (this.netlifyIdentity && this.netlifyIdentity.currentUser()) {
      await this.netlifyIdentity.logout();
    }
    
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
    this.store.set('user', null);
    this.notifyAuthChange(null);
  }
  
  /**
   * Normalize user object from Netlify Identity
   */
  normalizeUser(user) {
    if (!user) return null;
    
    // Netlify Identity user
    if (user.app_metadata || user.user_metadata) {
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        role: user.app_metadata?.roles?.[0] || 'editor',
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
   * Check if user is admin
   */
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin' || user?.role === 'ADMIN';
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
        try {
          const token = await user.jwt();
          return token;
        } catch (error) {
          console.error('Error getting JWT:', error);
          return null;
        }
      }
    }
    return null;
  }
  
  /**
   * Refresh the current user's token
   */
  async refreshToken() {
    if (this.netlifyIdentity) {
      const user = this.netlifyIdentity.currentUser();
      if (user) {
        try {
          await user.jwt(true); // Force refresh
          return true;
        } catch (error) {
          console.error('Error refreshing token:', error);
          return false;
        }
      }
    }
    return false;
  }
}
