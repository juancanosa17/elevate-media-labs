/**
 * Elevate Admin Panel - Main Application
 * 
 * Architecture:
 * - Modular ES6 design
 * - Hash-based routing
 * - State management
 * - Event-driven components
 */

import { Auth } from './modules/auth.js';
import { Router } from './modules/router.js';
import { UI } from './modules/ui.js';
import { Store } from './modules/store.js';
import { API } from './modules/api.js';

// Dashboard View
import { DashboardView } from './views/dashboard.js';
import { BlogView } from './views/blog.js';
import { ServiciosView } from './views/servicios.js';
import { CasosView } from './views/casos.js';
import { SettingsView } from './views/settings.js';
import { MediaView } from './views/media.js';

class AdminApp {
  constructor() {
    this.isInitialized = false;
    
    // Initialize core modules
    this.store = new Store();
    this.api = new API(this.store);
    this.ui = new UI();
    this.auth = new Auth(this.store, this.ui);
    this.router = new Router();
    
    // Views
    this.views = {
      dashboard: new DashboardView(this),
      blog: new BlogView(this),
      servicios: new ServiciosView(this),
      casos: new CasosView(this),
      settings: new SettingsView(this),
      media: new MediaView(this),
    };
  }
  
  /**
   * Initialize the application
   */
  async init() {
    console.log('🚀 Initializing Elevate Admin Panel...');
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Setup routes
    this.setupRoutes();
    
    // Check authentication
    const isAuthenticated = await this.auth.checkAuth();
    
    if (isAuthenticated) {
      this.showApp();
      this.router.start();
    } else {
      this.showAuthScreen();
    }
    
    this.isInitialized = true;
    console.log('✅ Admin Panel initialized');
  }
  
  /**
   * Setup application routes
   */
  setupRoutes() {
    this.router.addRoute('dashboard', () => this.views.dashboard.render());
    this.router.addRoute('blog', () => this.views.blog.render());
    this.router.addRoute('blog/new', () => this.views.blog.renderEditor());
    this.router.addRoute('blog/edit/:id', (params) => this.views.blog.renderEditor(params.id));
    this.router.addRoute('servicios', () => this.views.servicios.render());
    this.router.addRoute('servicios/new', () => this.views.servicios.renderEditor());
    this.router.addRoute('servicios/edit/:id', (params) => this.views.servicios.renderEditor(params.id));
    this.router.addRoute('casos', () => this.views.casos.render());
    this.router.addRoute('casos/new', () => this.views.casos.renderEditor());
    this.router.addRoute('casos/edit/:id', (params) => this.views.casos.renderEditor(params.id));
    this.router.addRoute('settings', () => this.views.settings.render());
    this.router.addRoute('media', () => this.views.media.render());
    
    // Default route
    this.router.setDefault('dashboard');
    
    // Route change callback
    this.router.onRouteChange((route, params) => {
      this.updateActiveNav(route);
      this.updatePageTitle(route);
    });
  }
  
  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
    
    // Netlify login button
    const netlifyLoginBtn = document.getElementById('btn-netlify-login');
    if (netlifyLoginBtn) {
      netlifyLoginBtn.addEventListener('click', () => this.auth.loginWithNetlify());
    }
    
    // Logout button
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }
    
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }
    
    // Mobile menu button
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => this.toggleMobileSidebar());
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('btn-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refresh());
    }
    
    // Auth state change
    this.auth.onAuthStateChange((user) => {
      if (user) {
        this.showApp();
        this.updateUserInfo(user);
        if (!this.router.isStarted) {
          this.router.start();
        }
      } else {
        this.showAuthScreen();
      }
    });
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Click outside sidebar on mobile
    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('sidebar');
      const mobileBtn = document.getElementById('mobile-menu-btn');
      if (sidebar && sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          !mobileBtn.contains(e.target)) {
        this.toggleMobileSidebar(false);
      }
    });
  }
  
  /**
   * Handle login form submission
   */
  async handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span>';
    
    try {
      await this.auth.login(email, password);
      this.ui.toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente');
    } catch (error) {
      this.ui.toast.error('Error de autenticación', error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Ingresar</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }
  }
  
  /**
   * Handle logout
   */
  async handleLogout() {
    const confirmed = await this.ui.modal.confirm(
      '¿Cerrar sesión?',
      '¿Estás seguro de que quieres cerrar tu sesión?'
    );
    
    if (confirmed) {
      await this.auth.logout();
      this.ui.toast.info('Sesión cerrada', 'Has cerrado sesión correctamente');
    }
  }
  
  /**
   * Toggle sidebar collapsed state
   */
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
    }
  }
  
  /**
   * Toggle mobile sidebar
   */
  toggleMobileSidebar(force) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (typeof force === 'boolean') {
        sidebar.classList.toggle('open', force);
      } else {
        sidebar.classList.toggle('open');
      }
    }
  }
  
  /**
   * Show the main application
   */
  showApp() {
    const authScreen = document.getElementById('auth-screen');
    const app = document.getElementById('app');
    
    if (authScreen) authScreen.classList.add('hidden');
    if (app) app.classList.remove('hidden');
    
    // Restore sidebar state
    const sidebar = document.getElementById('sidebar');
    if (sidebar && localStorage.getItem('sidebar-collapsed') === 'true') {
      sidebar.classList.add('collapsed');
    }
  }
  
  /**
   * Show the authentication screen
   */
  showAuthScreen() {
    const authScreen = document.getElementById('auth-screen');
    const app = document.getElementById('app');
    
    if (authScreen) authScreen.classList.remove('hidden');
    if (app) app.classList.add('hidden');
  }
  
  /**
   * Update user info in sidebar
   */
  updateUserInfo(user) {
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    
    if (userAvatar && user) {
      userAvatar.textContent = (user.name || user.email || 'U').charAt(0).toUpperCase();
    }
    if (userName && user) {
      userName.textContent = user.name || user.email || 'Usuario';
    }
  }
  
  /**
   * Update active navigation item
   */
  updateActiveNav(route) {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const baseRoute = route.split('/')[0];
    
    navLinks.forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === baseRoute) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Close mobile sidebar on navigation
    this.toggleMobileSidebar(false);
  }
  
  /**
   * Update page title
   */
  updatePageTitle(route) {
    const titles = {
      'dashboard': 'Dashboard',
      'blog': 'Blog',
      'blog/new': 'Nuevo Post',
      'blog/edit': 'Editar Post',
      'servicios': 'Servicios',
      'servicios/new': 'Nuevo Servicio',
      'servicios/edit': 'Editar Servicio',
      'casos': 'Casos de Éxito',
      'casos/new': 'Nuevo Caso',
      'casos/edit': 'Editar Caso',
      'settings': 'Configuración',
      'media': 'Media',
    };
    
    const baseRoute = route.includes('/edit/') ? route.split('/').slice(0, 2).join('/') : route;
    const title = titles[baseRoute] || 'Dashboard';
    
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      pageTitle.textContent = title;
    }
    
    document.title = `${title} | Elevate Admin`;
  }
  
  /**
   * Refresh current view
   */
  async refresh() {
    const refreshBtn = document.getElementById('btn-refresh');
    if (refreshBtn) {
      refreshBtn.classList.add('spinning');
      refreshBtn.querySelector('svg').style.animation = 'spin 0.5s linear';
    }
    
    // Clear cache and reload current route
    this.store.clearCache();
    await this.router.reload();
    
    if (refreshBtn) {
      setTimeout(() => {
        refreshBtn.classList.remove('spinning');
        refreshBtn.querySelector('svg').style.animation = '';
      }, 500);
    }
    
    this.ui.toast.success('Actualizado', 'Datos actualizados correctamente');
  }
  
  /**
   * Handle keyboard shortcuts
   */
  handleKeyboard(e) {
    // Cmd/Ctrl + K - Quick search (future feature)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      // TODO: Open quick search
    }
    
    // Escape - Close modals
    if (e.key === 'Escape') {
      this.ui.modal.close();
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.adminApp = new AdminApp();
  window.adminApp.init();
});

