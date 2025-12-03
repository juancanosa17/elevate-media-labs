/**
 * UI - User Interface Components
 * Toast notifications, Modals, and other UI utilities
 */

export class UI {
  constructor() {
    this.toast = new ToastManager();
    this.modal = new ModalManager();
  }
}

/**
 * Toast Notification Manager
 */
class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
    this.toasts = [];
    this.defaultDuration = 4000;
  }
  
  /**
   * Show a toast notification
   */
  show(type, title, message, duration = this.defaultDuration) {
    const id = Date.now();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = `toast-${id}`;
    
    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    };
    
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    
    this.container.appendChild(toast);
    this.toasts.push(toast);
    
    // Auto remove after duration
    setTimeout(() => this.remove(toast), duration);
    
    return id;
  }
  
  /**
   * Remove a toast
   */
  remove(toast) {
    if (toast && toast.parentNode) {
      toast.classList.add('removing');
      setTimeout(() => {
        toast.remove();
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 300);
    }
  }
  
  // Shorthand methods
  success(title, message) { return this.show('success', title, message); }
  error(title, message) { return this.show('error', title, message, 6000); }
  warning(title, message) { return this.show('warning', title, message); }
  info(title, message) { return this.show('info', title, message); }
}

/**
 * Modal Manager
 */
class ModalManager {
  constructor() {
    this.container = document.getElementById('modal-container');
    this.activeModal = null;
    this.resolvePromise = null;
  }
  
  /**
   * Open a modal
   */
  open(options) {
    const {
      title = '',
      content = '',
      size = '', // '', 'lg', 'xl'
      showClose = true,
      footer = null,
    } = options;
    
    this.container.classList.remove('hidden');
    
    this.container.innerHTML = `
      <div class="modal ${size ? `modal-${size}` : ''}">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          ${showClose ? `
            <button class="modal-close" onclick="window.adminApp.ui.modal.close()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          ` : ''}
        </div>
        <div class="modal-body">${content}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;
    
    this.activeModal = this.container.querySelector('.modal');
    
    // Trap focus inside modal
    this.activeModal.querySelector('input, button, textarea, select')?.focus();
    
    // Close on backdrop click
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }
  
  /**
   * Close the modal
   */
  close(result = null) {
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
    this.activeModal = null;
    
    if (this.resolvePromise) {
      this.resolvePromise(result);
      this.resolvePromise = null;
    }
  }
  
  /**
   * Confirm dialog
   */
  confirm(title, message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      
      this.open({
        title,
        content: `<p style="color: var(--color-text-secondary)">${message}</p>`,
        footer: `
          <button class="btn btn-secondary" onclick="window.adminApp.ui.modal.close(false)">${cancelText}</button>
          <button class="btn btn-primary" onclick="window.adminApp.ui.modal.close(true)">${confirmText}</button>
        `
      });
    });
  }
  
  /**
   * Danger confirm (for deletions)
   */
  confirmDanger(title, message, confirmText = 'Eliminar') {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      
      this.open({
        title,
        content: `
          <div style="text-align: center; padding: var(--spacing-md) 0;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" stroke-width="2" style="margin-bottom: var(--spacing-md);">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p style="color: var(--color-text-secondary)">${message}</p>
          </div>
        `,
        footer: `
          <button class="btn btn-secondary" onclick="window.adminApp.ui.modal.close(false)">Cancelar</button>
          <button class="btn btn-danger" onclick="window.adminApp.ui.modal.close(true)">${confirmText}</button>
        `
      });
    });
  }
  
  /**
   * Form modal
   */
  form(title, formHtml, size = 'lg') {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      
      this.open({
        title,
        content: `<form id="modal-form">${formHtml}</form>`,
        size,
        footer: `
          <button class="btn btn-secondary" onclick="window.adminApp.ui.modal.close(null)">Cancelar</button>
          <button class="btn btn-primary" onclick="window.adminApp.ui.modal.submitForm()">Guardar</button>
        `
      });
      
      // Handle form submit
      const form = document.getElementById('modal-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitForm();
      });
    });
  }
  
  /**
   * Submit form and close modal
   */
  submitForm() {
    const form = document.getElementById('modal-form');
    if (form) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      this.close(data);
    }
  }
}

/**
 * Utility: Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility: Format relative time
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diff = now - then;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return then.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  } else if (days > 0) {
    return `hace ${days} día${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else {
    return 'ahora';
  }
}

/**
 * Utility: Escape HTML
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Utility: Truncate text
 */
export function truncate(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

