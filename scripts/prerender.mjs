import { createServer } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const origin = 'https://www.taskivo.online';
const template = await readFile('dist/index.html','utf8');
const escape = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const setMeta = (html, key, value) => html.replace(new RegExp('<meta (?:name|property)="'+key+'" content="[^"]*"\\s*/?>'), m => m.replace(/content="[^"]*"/,'content="'+escape(value)+'"'));
const nav = () => h('nav',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',height:72,padding:'0 5%',background:'var(--surface)',borderBottom:'1px solid var(--line)'}},h('a',{href:'/',style:{color:'var(--ink)',fontWeight:900,fontSize:26,textDecoration:'none'}},'Taskivo'),h('div',{style:{display:'flex',gap:16}},h('a',{href:'/blog'},'Blog'),h('a',{href:'/auth'},'Log in')));
const server = await createServer({server:{middlewareMode:true},appType:'custom'});
const manifest = [];
try {
  const {default:Landing,landingStyles} = await server.ssrLoadModule('/src/pages/Landing.jsx');
  const legal = await server.ssrLoadModule('/src/pages/StaticPages.jsx');
  const { EarningGuide, earningGuides } = await server.ssrLoadModule('/src/pages/EarningGuides.jsx');
  const { BlogIndex, ArticleView } = await server.ssrLoadModule('/src/pages/Blog.jsx');
  const {default:css} = await server.ssrLoadModule('/src/styles/global.js');
  const {supabaseUrl,supabaseAnonKey} = await server.ssrLoadModule('/src/lib/supabase.js');
  const navigate = () => {};
  const fields = 'slug,title,meta_desc,category,created_at,content,image_url';
  const posts = [];
  for(let offset=0;;offset+=100) {
    const url = new URL('/rest/v1/posts',supabaseUrl);
    url.search = new URLSearchParams({select:fields,status:'eq.published',order:'created_at.desc,slug.asc',limit:'100',offset:String(offset)});
    const response = await fetch(url,{headers:{apikey:supabaseAnonKey,Authorization:'Bearer '+supabaseAnonKey},signal:AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error('Public post fetch failed: HTTP '+response.status);
    const batch = await response.json();
    if(!Array.isArray(batch)) throw new Error('Public post fetch did not return a list');
    posts.push(...batch.filter(p=>/^[a-z0-9-]+$/.test(p.slug) && p.title && p.content));
    if(batch.length<100) break;
    if(offset>=9900) throw new Error('Post count exceeds build safety limit');
  }
  const writePage = async (path,title,description,component,article=null) => {
    const canonical = origin + path;
    let html = template.replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(title)+'</title>');
    for(const [k,v] of Object.entries({'title':title,'description':description,'og:title':title,'og:description':description,'og:url':canonical,'og:type':article?'article':'website','twitter:title':title,'twitter:description':description,'twitter:url':canonical})) html=setMeta(html,k,v);
    const schema = article ? {'@context':'https://schema.org','@type':'BlogPosting',headline:article.title,description,datePublished:article.created_at,mainEntityOfPage:canonical,author:{'@type':'Organization',name:'Taskivo'},publisher:{'@type':'Organization',name:'Taskivo'}} : null;
    html=html.replace('</head>','<link rel="canonical" href="'+escape(canonical)+'"><meta name="robots" content="index, follow">'+(schema?'<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>':'')+'</head>');
    const body = renderToStaticMarkup(h('div',null,h('style',null,css),h('style',null,landingStyles),nav(),component,h('footer',{style:{padding:'24px 5%',color:'var(--slate)'}},h('a',{href:'/about'},'About'), ' · ',h('a',{href:'/privacy'},'Privacy'), ' · ',h('a',{href:'/terms'},'Terms'), ' · ',h('a',{href:'/paid-surveys'},'Paid surveys'), ' · ',h('a',{href:'/microtasks'},'Microtasks'))));
    html=html.replace('<body>','<body class="theme-dark">').replace('<div id="root"></div>',()=>'<div id="root">'+body+'</div>');
    await writeFile('dist/'+(path==='/'?'index':path.slice(1))+'.html',html);
    manifest.push(canonical);
  };
  const privateTemplate = template.replace('</head>','<meta name="robots" content="noindex, follow"></head>');
  await writeFile('dist/app.html',privateTemplate);
  await writePage('/','Taskivo | Online Microtasks, Surveys & App Testing','Explore digital microtasks, sponsored surveys and app testing. Taskivo connects contributors with businesses seeking genuine feedback.',h(Landing,{navigate}));
  for(const [slug,Component,title,desc] of [
    ['about',legal.About,'About Taskivo','Learn about Taskivo and its contributor network.'],
    ['terms',legal.Terms,'Terms of Service | Taskivo','Read Taskivo terms of service and user obligations.'],
    ['privacy',legal.Privacy,'Privacy Policy | Taskivo','Learn how Taskivo handles user information.'],
    ['disclaimer',legal.Disclaimer,'Disclaimer | Taskivo','Understand Taskivo reward limitations and platform availability.'],
    ['delete-account',legal.DeleteAccount,'Account Deletion | Taskivo','Find Taskivo account and data deletion instructions.']
  ]) await writePage('/'+slug,title,desc,h(Component));
  for(const [slug,guide] of Object.entries(earningGuides)) await writePage('/'+slug,guide.title,guide.description,h(EarningGuide,{slug}));
  await writePage('/blog','Taskivo Blog | Microtasks, App Testing & Digital Work','Practical guides to online microtasks, app testing, user research and digital work.',h(BlogIndex,{navigate,initialPosts:posts}));
  for(const post of posts) await writePage('/article-'+post.slug,post.title+' | Taskivo',post.meta_desc || post.title,h(ArticleView,{navigate,id:'article-'+post.slug,user:null,initialPost:post}),post);
  await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+manifest.map(url=>'<url><loc>'+escape(url)+'</loc></url>').join('')+'</urlset>');
  console.log('Prerendered '+manifest.length+' public URLs, including '+posts.length+' published posts.');
} finally { await server.close(); }
