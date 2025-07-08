/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://studio-major.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*'],
  
  // Multilingual support
  alternateRefs: [
    {
      href: 'https://studio-major.vercel.app/en',
      hreflang: 'en',
    },
    {
      href: 'https://studio-major.vercel.app/id',
      hreflang: 'id',
    },
  ],
  
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*', '/api/*'],
      },
    ],
    additionalSitemaps: [
      'https://studio-major.vercel.app/sitemap.xml',
    ],
  },
  
  transform: async (config, path) => {
    // Custom priority untuk different pages
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/en' || path === '/id') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/projects')) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.includes('/skills') || path.includes('/certificates')) {
      priority = 0.8;
      changefreq = 'monthly';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
