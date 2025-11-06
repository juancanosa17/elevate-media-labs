# Elevate Media Labs

**Estrategia & Data Intelligence**

Decisiones que combinan análisis y creatividad. Interpretamos el comportamiento de las audiencias para diseñar estrategias que generan impacto real. Transformamos datos en inteligencia accionable para marcas que buscan crecer con propósito.

## 🚀 Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)
- Google Fonts (Inter)
- tsParticles (Partículas interactivas)
- Decap CMS (Sistema de gestión de contenido)

## 📝 Admin Panel

Este proyecto incluye un panel de administración para gestionar el contenido del blog y servicios.

### Acceso al Admin

**URL:** `https://elevate-media-labs.vercel.app/admin`

### Configuración Inicial (Solo primera vez)

#### Opción 1: Con Netlify (Recomendado)

1. **Deployar en Netlify** (además de Vercel):
   - Conecta el mismo repositorio de GitHub a Netlify
   - Netlify te dará acceso a Identity & Git Gateway gratis

2. **Habilitar Netlify Identity:**
   - Ve a tu dashboard de Netlify
   - Selecciona el sitio
   - Ve a Settings → Identity
   - Click en "Enable Identity"
   - Ve a Services → Git Gateway
   - Click en "Enable Git Gateway"

3. **Invitar usuarios:**
   - En Identity, click en "Invite users"
   - Ingresa el email del administrador
   - El usuario recibirá un email para configurar su contraseña

4. **Accede al admin:**
   - Ve a `/admin` en tu sitio de Netlify o Vercel
   - Inicia sesión con tus credenciales

#### Opción 2: Modo Local (Para desarrollo)

1. Instala Decap CMS local server:
```bash
npx decap-server
```

2. En otro terminal, abre el sitio con Live Server

3. Ve a `http://localhost:8080/admin`

### Gestionar Contenido

El admin panel te permite:

- ✅ **Blog Posts:** Crear, editar y eliminar artículos
- ✅ **Servicios:** Agregar nuevos servicios o editar existentes
- ✅ **Casos de Éxito:** Gestionar el portfolio
- ✅ **Configuración:** Editar información general y redes sociales
- ✅ **Imágenes:** Subir y gestionar archivos multimedia

### Workflow de Publicación

1. Accede a `/admin`
2. Crea o edita contenido
3. Haz click en "Publish"
4. El contenido se guarda en GitHub como commit
5. Vercel/Netlify auto-deploya los cambios (~30 segundos)

## 🌐 Deployment

### Vercel (Principal)

1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente la configuración
3. Cada push a `main` desplegará automáticamente

**URL de producción:** [elevate-media-labs.vercel.app](https://elevate-media-labs.vercel.app)

### Netlify (Para Admin Panel)

1. Conecta el mismo repositorio a Netlify
2. Configura Identity & Git Gateway (ver arriba)
3. Usa esta URL para acceder al admin con autenticación

## 📂 Estructura del Proyecto

```
elevate-media-labs/
├── admin/                  # Panel de administración
│   ├── index.html         # Interfaz del CMS
│   └── config.yml         # Configuración del CMS
├── content/               # Contenido gestionado por CMS
│   ├── blog/              # Posts del blog (.md)
│   ├── servicios/         # Servicios (.md)
│   ├── casos/             # Casos de éxito (.md)
│   └── settings/          # Configuración general (.json)
├── public/
│   └── uploads/          # Imágenes subidas por el CMS
├── styles/
│   └── style.css         # Estilos principales
├── js/
│   └── script.js         # JavaScript principal
├── index.html            # Página principal
├── blog.html             # Página del blog
├── netlify.toml          # Configuración Netlify/CMS
├── .gitignore
└── README.md
```

## 🛠️ Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/juancanosa17/elevate-media-labs.git

# Navegar al directorio
cd elevate-media-labs

# (Opcional) Iniciar servidor local del CMS
npx decap-server

# Abrir con Live Server o similar
# El sitio estará disponible en http://localhost:5500
# El admin estará en http://localhost:5500/admin
```

## 🎨 Características

- ✨ Diseño minimalista y moderno
- 🎯 Partículas interactivas con tsParticles
- 🔮 Efectos glassmorphism
- 📱 100% responsive
- 🚀 Performance optimizado
- 📝 CMS integrado para gestión de contenido
- 🔄 Auto-deploy en cada cambio
- 🎨 Paleta de colores morado/cyan

## 📧 Contacto

Email: hola@elevatemedialabs.com  
Web: https://elevate-media-labs.vercel.app

---

© 2025 Elevate Media Labs. Elevamos marcas con inteligencia y propósito.
