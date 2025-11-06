# Guía del Admin Panel - Elevate Media Labs

## 🎯 Acceso al Admin Panel

**URL:** `https://elevate-media-labs.vercel.app/admin`

---

## 📋 Configuración Inicial (Una Sola Vez)

### Paso 1: Deploy en Netlify

Aunque uses Vercel para el sitio principal, necesitas Netlify para la autenticación del CMS (es gratis).

1. Ve a [netlify.com](https://netlify.com)
2. Click en **"Add new site"** → **"Import an existing project"**
3. Conecta con GitHub
4. Selecciona el repositorio `elevate-media-labs`
5. Deja la configuración por defecto
6. Click en **"Deploy"**

### Paso 2: Habilitar Identity & Git Gateway

1. En tu dashboard de Netlify, selecciona el sitio
2. Ve a **Site settings** → **Identity**
3. Click en **"Enable Identity"**
4. Scroll down a **"Services"** → **"Git Gateway"**
5. Click en **"Enable Git Gateway"**
6. En "Registration preferences", selecciona **"Invite only"** (más seguro)

### Paso 3: Crear tu cuenta de admin

1. En el dashboard de Netlify, ve a **Identity**
2. Click en **"Invite users"**
3. Ingresa tu email
4. Recibirás un email de invitación
5. Haz click en el link del email
6. Crea tu contraseña
7. ¡Listo! Ya puedes acceder al admin

---

## 🚀 Cómo Usar el Admin Panel

### Acceder

1. Ve a `https://elevate-media-labs.vercel.app/admin` (o la URL de Netlify)
2. Click en **"Login with Netlify Identity"**
3. Ingresa tu email y contraseña
4. ¡Bienvenido al admin panel!

---

## 📝 Gestionar Blog Posts

### Crear un Nuevo Post

1. En el sidebar, click en **"Blog"**
2. Click en **"New Blog"**
3. Completa los campos:
   - **Título:** Título del artículo
   - **Fecha de Publicación:** Selecciona la fecha
   - **Autor:** Tu nombre
   - **Imagen Destacada:** Click en "Choose an image" → Sube una imagen
   - **Categoría:** Selecciona una categoría
   - **Excerpt:** Resumen corto (150-200 caracteres)
   - **Contenido:** Escribe tu artículo usando Markdown
   - **Tags:** Agrega etiquetas separadas por enter
   - **Estado:** 
     - ✅ No marcado = Publicado
     - ✅ Marcado = Borrador (no se muestra)
   - **Tiempo de Lectura:** Minutos estimados de lectura

4. Click en **"Publish"** (arriba a la derecha)
5. Confirma con **"Publish now"**

### Editar un Post Existente

1. Click en **"Blog"** en el sidebar
2. Busca el post en la lista
3. Click en el post
4. Edita lo que necesites
5. Click en **"Publish"** → **"Publish now"**

### Eliminar un Post

1. Click en el post que quieres eliminar
2. Click en el menú de 3 puntos (arriba a la derecha)
3. Click en **"Delete entry"**
4. Confirma

---

## 🛠️ Gestionar Servicios

### Agregar un Nuevo Servicio

1. Click en **"Servicios"** en el sidebar
2. Click en **"New Servicios"**
3. Completa:
   - **Título:** Nombre del servicio
   - **Número de Orden:** Orden de aparición (1, 2, 3...)
   - **Descripción Corta:** Texto breve para la card
   - **Descripción Completa:** Detalles del servicio (Markdown)
   - **Icono:** Nombre del ícono (opcional)
   - **Activo:** ✅ = Se muestra, ❌ = Oculto

4. **Publish**

### Editar Servicios Existentes

Mismo proceso que con los posts del blog.

---

## 🏆 Gestionar Casos de Éxito

1. Click en **"Casos de Éxito"**
2. **New Casos de Éxito**
3. Completa:
   - **Título:** Nombre del proyecto
   - **Cliente:** Nombre del cliente
   - **Categoría:** Tipo de servicio
   - **Métrica Principal:** Ej: "+250% ROI"
   - **Descripción:** Resumen del caso
   - **Tags:** Etiquetas del proyecto
   - **Imagen:** Imagen del proyecto (opcional)
   - **Orden:** Orden de aparición
   - **Destacado:** Si quieres resaltarlo

4. **Publish**

---

## ⚙️ Configuración General

### Editar Información del Sitio

1. Click en **"Configuración"** → **"Información General"**
2. Edita:
   - Nombre del Sitio
   - Descripción
   - Email de Contacto
   - Teléfono
   - Dirección
3. **Publish**

### Editar Redes Sociales

1. **"Configuración"** → **"Redes Sociales"**
2. Agrega las URLs completas de tus perfiles
3. **Publish**

---

## 📸 Gestión de Imágenes

### Subir Imágenes

Cuando crees contenido que necesite imágenes:

1. Click en el campo de imagen
2. **"Choose an image"**
3. Arrastra una imagen o click en **"Upload"**
4. Selecciona tu imagen
5. Click en **"Insert from Media Library"**

### Mejores Prácticas

- **Tamaño recomendado para blog:** 1200x630px
- **Formato:** JPG o PNG
- **Peso:** Máximo 500KB (optimiza con TinyPNG antes)
- **Nombres:** Usa nombres descriptivos (ej: `estrategia-digital-2024.jpg`)

---

## ✍️ Usar Markdown

El editor soporta Markdown para dar formato al texto:

```markdown
# Título 1
## Título 2
### Título 3

**Texto en negrita**
*Texto en cursiva*

- Item de lista
- Otro item

1. Lista numerada
2. Segundo item

[Texto del link](https://ejemplo.com)

> Cita o nota importante
```

---

## 🔄 Workflow de Publicación

1. Creas o editas contenido en el admin
2. Click en **"Publish"**
3. El contenido se guarda en GitHub (como un commit)
4. Vercel detecta el cambio
5. Auto-deploya el sitio (~30 segundos)
6. Tu contenido está en vivo! 🎉

---

## 🆘 Solución de Problemas

### No puedo acceder al admin

- Verifica que hayas habilitado Identity en Netlify
- Verifica que tengas una invitación aceptada
- Prueba hacer logout y volver a login

### Mis cambios no aparecen en el sitio

- Espera ~1 minuto (deploy tarda 30-60 seg)
- Verifica en GitHub que el commit se haya creado
- Refresca la página con Ctrl+Shift+R (o Cmd+Shift+R)

### Error al subir imágenes

- Verifica el tamaño (máx 10MB)
- Verifica el formato (JPG, PNG, GIF, WebP)
- Intenta optimizar la imagen antes de subirla

### El admin no carga

- Verifica tu conexión a Internet
- Limpia caché del navegador
- Intenta en modo incógnito

---

## 📞 Soporte

Si tienes problemas técnicos:
- Revisa la [documentación de Decap CMS](https://decapcms.org/docs/intro/)
- Contacta al equipo de desarrollo

---

¡Disfruta creando contenido increíble! 🚀

