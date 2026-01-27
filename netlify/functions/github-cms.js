/**
 * GitHub CMS - Netlify Function
 * Handles CRUD operations for content management via GitHub API
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'juancanosa17/elevate-media-labs';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

// GitHub API helper
async function githubRequest(endpoint, options = {}) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `GitHub API error: ${response.status}`);
  }
  
  return response.json();
}

// Get file content from GitHub
async function getFile(path) {
  try {
    const data = await githubRequest(`/contents/${path}?ref=${GITHUB_BRANCH}`);
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { content, sha: data.sha };
  } catch (error) {
    if (error.message.includes('404')) {
      return { content: null, sha: null };
    }
    throw error;
  }
}

// Create or update file on GitHub
async function saveFile(path, content, message, sha = null) {
  const body = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: GITHUB_BRANCH
  };
  
  if (sha) {
    body.sha = sha;
  }
  
  return githubRequest(`/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

// Delete file from GitHub
async function deleteFile(path, message, sha) {
  return githubRequest(`/contents/${path}`, {
    method: 'DELETE',
    body: JSON.stringify({
      message,
      sha,
      branch: GITHUB_BRANCH
    })
  });
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Convert post object to markdown with frontmatter
function postToMarkdown(post) {
  const frontmatter = {
    title: post.title,
    date: post.date,
    author: post.author || 'Elevate Media Labs',
    featuredImage: post.featuredImage || '',
    category: post.category || 'Estrategia',
    excerpt: post.excerpt || '',
    tags: post.tags || [],
    draft: post.draft || false,
    readTime: post.readTime || 5,
    featured: post.featured || false
  };
  
  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return `${key}: []`;
        return `${key}:\n${value.map(v => `  - "${v}"`).join('\n')}`;
      }
      if (typeof value === 'string') return `${key}: "${value}"`;
      return `${key}: ${value}`;
    })
    .join('\n');
  
  return `---\n${yaml}\n---\n\n${post.body || ''}`;
}

// Parse markdown with frontmatter to post object
function markdownToPost(content, slug) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  if (!match) return null;
  
  const [, frontmatterStr, body] = match;
  const post = { slug, body };
  
  // Simple YAML parser for our frontmatter
  const lines = frontmatterStr.split('\n');
  let currentKey = null;
  let currentArray = null;
  
  for (const line of lines) {
    if (line.startsWith('  - ')) {
      // Array item
      if (currentArray) {
        const value = line.replace('  - ', '').replace(/^"|"$/g, '');
        post[currentKey].push(value);
      }
    } else if (line.includes(': ')) {
      const colonIndex = line.indexOf(': ');
      const key = line.substring(0, colonIndex);
      let value = line.substring(colonIndex + 2);
      
      // Check if array starts
      if (value === '' || value === '[]') {
        post[key] = [];
        currentKey = key;
        currentArray = value === '' ? true : false;
      } else {
        currentArray = false;
        // Remove quotes
        value = value.replace(/^"|"$/g, '');
        // Convert booleans
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        // Convert numbers
        else if (!isNaN(value) && value !== '') value = Number(value);
        
        post[key] = value;
      }
    }
  }
  
  return post;
}

// Handlers for different content types
const handlers = {
  // BLOG POSTS
  async getPosts() {
    try {
      const { content } = await getFile('public/data/blog-posts.json');
      const posts = content ? JSON.parse(content) : [];
      return { statusCode: 200, headers, body: JSON.stringify({ posts }) };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  },
  
  async savePost(post) {
    try {
      // Generate slug if new post
      if (!post.slug) {
        post.slug = generateSlug(post.title);
      }
      
      // Get current posts
      const { content: postsJson, sha: postsSha } = await getFile('public/data/blog-posts.json');
      const posts = postsJson ? JSON.parse(postsJson) : [];
      
      // Update or add post
      const existingIndex = posts.findIndex(p => p.slug === post.slug);
      const postMeta = {
        slug: post.slug,
        title: post.title,
        date: post.date,
        author: post.author,
        featuredImage: post.featuredImage,
        category: post.category,
        excerpt: post.excerpt,
        tags: post.tags,
        draft: post.draft,
        readTime: post.readTime,
        featured: post.featured,
        updatedAt: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        posts[existingIndex] = { ...posts[existingIndex], ...postMeta };
      } else {
        postMeta.createdAt = new Date().toISOString();
        posts.unshift(postMeta);
      }
      
      // Save markdown file
      const mdPath = `content/blog/${post.slug}.md`;
      const { sha: mdSha } = await getFile(mdPath);
      const mdContent = postToMarkdown(post);
      
      await saveFile(
        mdPath,
        mdContent,
        `${existingIndex >= 0 ? 'Update' : 'Create'} blog post: ${post.title}`,
        mdSha
      );
      
      // Update posts index
      await saveFile(
        'public/data/blog-posts.json',
        JSON.stringify(posts, null, 2),
        `Update blog posts index`,
        postsSha
      );
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, post: postMeta }) };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  },
  
  async deletePost(slug) {
    try {
      // Get current posts
      const { content: postsJson, sha: postsSha } = await getFile('public/data/blog-posts.json');
      const posts = postsJson ? JSON.parse(postsJson) : [];
      
      // Remove from index
      const filtered = posts.filter(p => p.slug !== slug);
      
      // Delete markdown file
      const mdPath = `content/blog/${slug}.md`;
      const { sha: mdSha } = await getFile(mdPath);
      
      if (mdSha) {
        await deleteFile(mdPath, `Delete blog post: ${slug}`, mdSha);
      }
      
      // Update posts index
      await saveFile(
        'public/data/blog-posts.json',
        JSON.stringify(filtered, null, 2),
        `Remove post from index: ${slug}`,
        postsSha
      );
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  },
  
  // SETTINGS
  async getSettings(section) {
    try {
      const path = `content/settings/${section}.json`;
      const { content } = await getFile(path);
      const data = content ? JSON.parse(content) : {};
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  },
  
  async saveSettings(section, data) {
    try {
      const path = `content/settings/${section}.json`;
      const { sha } = await getFile(path);
      
      await saveFile(
        path,
        JSON.stringify(data, null, 2),
        `Update ${section} settings`,
        sha
      );
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, data }) };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  },
  
  // SERVICIOS
  async getServicios() {
    try {
      const { content } = await getFile('content/data/servicios.json');
      const servicios = content ? JSON.parse(content) : [];
      return { statusCode: 200, headers, body: JSON.stringify({ servicios }) };
    } catch (error) {
      // Return default if file doesn't exist
      const defaultServicios = [
        { id: 1, title: 'Estrategia & Data Intelligence', slug: 'estrategia-data-intelligence', order: 1, active: true },
        { id: 2, title: 'Publicidad 360°', slug: 'publicidad-360', order: 2, active: true },
        { id: 3, title: 'Comunicación que Conecta', slug: 'comunicacion-que-conecta', order: 3, active: true },
        { id: 4, title: 'Plan de Marketing & Performance', slug: 'marketing-performance', order: 4, active: true },
        { id: 5, title: 'Activaciones & Experiencias 360°', slug: 'activaciones-experiencias', order: 5, active: true },
        { id: 6, title: 'Engage Events & Summits', slug: 'engage-events', order: 6, active: true },
        { id: 7, title: 'Research & Media Lab', slug: 'research-media-lab', order: 7, active: true },
      ];
      return { statusCode: 200, headers, body: JSON.stringify({ servicios: defaultServicios }) };
    }
  },
  
  async saveServicio(servicio) {
    try {
      const { content, sha } = await getFile('content/data/servicios.json');
      const servicios = content ? JSON.parse(content) : [];
      
      const existingIndex = servicios.findIndex(s => s.id === servicio.id);
      
      if (existingIndex >= 0) {
        servicios[existingIndex] = { ...servicios[existingIndex], ...servicio };
      } else {
        servicio.id = Math.max(...servicios.map(s => s.id), 0) + 1;
        servicios.push(servicio);
      }
      
      await saveFile(
        'content/data/servicios.json',
        JSON.stringify(servicios, null, 2),
        `Update servicio: ${servicio.title}`,
        sha
      );
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, servicio }) };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  },
  
  async deleteServicio(id) {
    try {
      const { content, sha } = await getFile('content/data/servicios.json');
      const servicios = content ? JSON.parse(content) : [];
      const filtered = servicios.filter(s => s.id !== parseInt(id));
      
      await saveFile(
        'content/data/servicios.json',
        JSON.stringify(filtered, null, 2),
        `Delete servicio id: ${id}`,
        sha
      );
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  },
  
  // CASOS
  async getCasos() {
    try {
      const { content } = await getFile('content/data/casos.json');
      const casos = content ? JSON.parse(content) : [];
      return { statusCode: 200, headers, body: JSON.stringify({ casos }) };
    } catch (error) {
      const defaultCasos = [
        { id: 1, title: 'Transformación Digital TechCorp', client: 'TechCorp', category: 'Estrategia & Data Intelligence', metric: '+250% ROI', featured: true },
        { id: 2, title: 'Lanzamiento Marca EcoLife', client: 'EcoLife', category: 'Publicidad 360°', metric: '+45M Reach', featured: true },
        { id: 3, title: 'Reputación FoodHub', client: 'FoodHub', category: 'Comunicación', metric: '+80% Engagement', featured: false },
        { id: 4, title: 'Optimización FinTech Solutions', client: 'FinTech Solutions', category: 'Performance Marketing', metric: '-60% CAC', featured: false },
        { id: 5, title: 'Summit Innovation 2024', client: 'Summit Innovation', category: 'Eventos & Experiencias', metric: '5K Asistentes', featured: true },
        { id: 6, title: 'Estudio RetailTech Insights', client: 'RetailTech', category: 'Research & Media Lab', metric: '+35% Brand Lift', featured: false },
      ];
      return { statusCode: 200, headers, body: JSON.stringify({ casos: defaultCasos }) };
    }
  },
  
  async saveCaso(caso) {
    try {
      const { content, sha } = await getFile('content/data/casos.json');
      const casos = content ? JSON.parse(content) : [];
      
      const existingIndex = casos.findIndex(c => c.id === caso.id);
      
      if (existingIndex >= 0) {
        casos[existingIndex] = { ...casos[existingIndex], ...caso };
      } else {
        caso.id = Math.max(...casos.map(c => c.id), 0) + 1;
        casos.push(caso);
      }
      
      await saveFile(
        'content/data/casos.json',
        JSON.stringify(casos, null, 2),
        `Update caso: ${caso.title}`,
        sha
      );
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, caso }) };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  },
  
  async deleteCaso(id) {
    try {
      const { content, sha } = await getFile('content/data/casos.json');
      const casos = content ? JSON.parse(content) : [];
      const filtered = casos.filter(c => c.id !== parseInt(id));
      
      await saveFile(
        'content/data/casos.json',
        JSON.stringify(filtered, null, 2),
        `Delete caso id: ${id}`,
        sha
      );
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  }
};

// Main handler
exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  // Check auth token
  if (!GITHUB_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'GitHub token not configured' })
    };
  }
  
  const path = event.path.replace('/.netlify/functions/github-cms', '');
  const method = event.httpMethod;
  
  try {
    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }
    
    // Route requests
    // POSTS
    if (path === '/posts' && method === 'GET') {
      return handlers.getPosts();
    }
    if (path === '/posts' && method === 'POST') {
      return handlers.savePost(body);
    }
    if (path.startsWith('/posts/') && method === 'DELETE') {
      const slug = path.replace('/posts/', '');
      return handlers.deletePost(slug);
    }
    
    // SETTINGS
    if (path.startsWith('/settings/') && method === 'GET') {
      const section = path.replace('/settings/', '');
      return handlers.getSettings(section);
    }
    if (path.startsWith('/settings/') && method === 'POST') {
      const section = path.replace('/settings/', '');
      return handlers.saveSettings(section, body);
    }
    
    // SERVICIOS
    if (path === '/servicios' && method === 'GET') {
      return handlers.getServicios();
    }
    if (path === '/servicios' && method === 'POST') {
      return handlers.saveServicio(body);
    }
    if (path.startsWith('/servicios/') && method === 'DELETE') {
      const id = path.replace('/servicios/', '');
      return handlers.deleteServicio(id);
    }
    
    // CASOS
    if (path === '/casos' && method === 'GET') {
      return handlers.getCasos();
    }
    if (path === '/casos' && method === 'POST') {
      return handlers.saveCaso(body);
    }
    if (path.startsWith('/casos/') && method === 'DELETE') {
      const id = path.replace('/casos/', '');
      return handlers.deleteCaso(id);
    }
    
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

