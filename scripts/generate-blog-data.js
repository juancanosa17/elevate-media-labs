const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directorios
const BLOG_DIR = path.join(__dirname, '../content/blog');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'blog-posts.json');

// Función para leer todos los posts
function generateBlogData() {
  try {
    // Verificar que existe el directorio de blog
    if (!fs.existsSync(BLOG_DIR)) {
      console.log('⚠️  Directorio de blog no encontrado, creando estructura...');
      fs.mkdirSync(BLOG_DIR, { recursive: true });
      return;
    }

    // Leer todos los archivos .md
    const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
      console.log('📭 No se encontraron posts de blog');
      // Crear archivo vacío
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
      return;
    }

    // Procesar cada archivo
    const posts = files.map(filename => {
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // Extraer excerpt (primeros 200 caracteres del contenido si no hay excerpt)
      const excerpt = data.excerpt || content.substring(0, 200).replace(/#{1,6}\s/g, '').trim() + '...';

      return {
        slug: filename.replace('.md', ''),
        title: data.title || 'Sin título',
        date: data.date || new Date().toISOString(),
        author: data.author || 'Elevate Media Labs',
        featuredImage: data.featuredImage || null,
        category: data.category || 'General',
        excerpt: excerpt,
        tags: data.tags || [],
        draft: data.draft || false,
        readTime: data.readTime || 5,
        content: content
      };
    });

    // Filtrar posts en borrador (draft: true)
    const publishedPosts = posts.filter(post => !post.draft);

    // Ordenar por fecha (más reciente primero)
    publishedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Asegurar que existe el directorio de salida
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Escribir JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(publishedPosts, null, 2));
    
    console.log(`✅ Generados ${publishedPosts.length} posts de blog`);
    console.log(`📝 Archivo creado: ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('❌ Error generando datos de blog:', error);
    process.exit(1);
  }
}

// Ejecutar
generateBlogData();

