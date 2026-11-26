import {useEffect,useState} from 'react';
import {supabase} from '../lib/supabase';
import {safeArticleHtml} from '../lib/safeArticleHtml.js';
const fields='slug,title,meta_desc,category,created_at,updated_at,image_url,image_alt,image_credit';
const categoryLabel=c=>c==='creator'?'Creator & Business':'Online Work';
const wordCount=s=>String(s||'').replace(/<[^>]*>/g,' ').trim().split(/\s+/).filter(Boolean).length;
const imageUrl=u=>typeof u==='string'&&/^https:\/\/(?![^/]*@)/i.test(u)?u:'';
const styles=`
.ed-shell{max-width:1180px;margin:auto;padding:44px 5% 88px;color:var(--ink)}
.ed-shell a{color:inherit;text-decoration:none}
.ed-heading{font-size:clamp(32px,5vw,50px);line-height:1.14;letter-spacing:-1.5px;margin:12px 0 16px;font-weight:800}
.ed-copy{font-size:16px;line-height:1.75;color:var(--slate);max-width:760px}
.ed-kicker{font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--slate)}
.ed-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr));gap:24px}
.ed-card{display:flex;flex-direction:column;border:1px solid var(--line);background:var(--surface-card);border-radius:14px;overflow:hidden;min-width:0}
.ed-card:hover{border-color:var(--lime)}
.ed-card img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}
.ed-card-text{padding:20px;flex:1}
.ed-card-text h2{font-size:19px;line-height:1.35;margin:10px 0;overflow-wrap:anywhere}
.ed-card-text p{font-size:13px;line-height:1.65;color:var(--slate);margin:0 0 16px}
.ed-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:28px 0}
.ed-tab{padding:10px 16px;border:1px solid var(--line);background:var(--surface-card);color:var(--ink);border-radius:100px;font-weight:700;cursor:pointer}
.ed-tab[aria-pressed=true]{background:var(--lime);color:#111}
.ed-article{max-width:830px;margin:auto;padding:40px 5% 100px;color:var(--ink)}
.ed-breadcrumb{font-size:13px;color:var(--slate);margin-bottom:28px}
.ed-breadcrumb a{color:var(--ink)}
.ed-feature{margin:26px 0 32px}
.ed-feature img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;display:block}
.ed-feature figcaption{font-size:12px;color:var(--slate);margin-top:8px}
.ed-prose{font-size:16px;line-height:1.9;color:var(--ink);overflow-wrap:anywhere}
.ed-prose h2{font-size:clamp(22px,3vw,28px);line-height:1.3;margin:42px 0 16px;letter-spacing:-.5px}
.ed-prose h3{font-size:19px;line-height:1.45;margin:26px 0 12px}
.ed-prose p,.ed-prose ul,.ed-prose ol{margin:0 0 20px}
.ed-prose ul,.ed-prose ol{padding-left:24px}
.ed-prose li{margin-bottom:10px}
.ed-prose a{color:var(--ink);text-decoration:underline;text-decoration-color:#80b52e;text-underline-offset:3px;font-weight:600}
.ed-prose table{display:block;overflow:auto;max-width:100%;border-collapse:collapse;margin:24px 0}
.ed-prose th,.ed-prose td{padding:10px 14px;border:1px solid var(--line);text-align:left;vertical-align:top}
.ed-prose th{background:var(--surface-card)}
.ed-related{padding:24px;background:var(--surface-card);border:1px solid var(--line);border-radius:14px;margin-top:42px}
.ed-related a{display:block;color:var(--ink);padding:12px 0;border-bottom:1px solid var(--line);line-height:1.5}
@media(max-width:650px){.ed-shell,.ed-article{padding-top:28px}.ed-grid{gap:16px}.ed-card-text{padding:16px}.ed-prose{font-size:15px}.ed-related{padding:16px}}
`;
function Photo({post,article=false}){
 const url=imageUrl(post.image_url);
 if(!url)return null;
 const image=<img src={url} alt={post.image_alt||post.title} width="1200" height={article?675:750} loading={article?'eager':'lazy'} decoding="async"/>;
 return article?<figure className="ed-feature">{image}{post.image_credit&&<figcaption>Illustrative photograph · {post.image_credit}</figcaption>}</figure>:image;
}
export function BlogIndex({initialPosts=null}){
 const [posts,setPosts]=useState(initialPosts||[]),[loading,setLoading]=useState(initialPosts===null),[category,setCategory]=useState('all'),[error,setError]=useState('');
 useEffect(()=>{let live=true;async function load(){try{const {data,error}=await supabase.from('posts').select(fields).eq('status','published').order('updated_at',{ascending:false,nullsFirst:false}).order('created_at',{ascending:false});if(error)throw error;if(live)setPosts(data||[]);}catch{if(live)setError('Unable to load the latest articles. Please refresh.');}finally{if(live)setLoading(false);}}load();return()=>{live=false};},[]);
 const visible=posts.filter(p=>category==='all'||p.category===category);
 return <main className="ed-shell"><style>{styles}</style><div className="ed-kicker">TASKIVO RESOURCE LIBRARY</div><h1 className="ed-heading">Practical guides for digital work</h1><p className="ed-copy">Explore online work, paid research, safe earning habits, app testing and organic creator growth. Public articles are free to read, without an account or reward requirement.</p>
 <div className="ed-tabs">{[['all','All articles'],['earner','Online work'],['creator','Creators & business']].map(([id,label])=><button className="ed-tab" key={id} aria-pressed={category===id} onClick={()=>setCategory(id)}>{label}</button>)}</div>
 {error&&<p role="alert">{error}</p>}{loading?<p>Loading articles…</p>:<div className="ed-grid">{visible.map(p=><a className="ed-card" href={'/article-'+p.slug} key={p.slug}><Photo post={p}/><div className="ed-card-text"><span className="ed-kicker">{categoryLabel(p.category)}</span><h2>{p.title}</h2><p>{p.meta_desc}</p><span style={{fontSize:13,fontWeight:800}}>Read guide →</span></div></a>)}</div>}{!loading&&!visible.length&&!error&&<p>No articles in this category yet.</p>}
 <div className="ed-related"><h2 style={{fontSize:20}}>Start with these resources</h2><a href="/paid-surveys">Paid survey guide</a><a href="/microtasks">Online microtasks and app testing</a><a href="/youtube-monetization">YouTube monetization support</a></div></main>;
}
export function ArticleView({id,initialPost=null,initialRelated=[]}){
 const slug=id.replace('article-','');
 const [post,setPost]=useState(initialPost),[status,setStatus]=useState(initialPost?'ready':'loading'),[related,setRelated]=useState(initialRelated);
 useEffect(()=>{let live=true;async function load(){try{const {data,error}=await supabase.from('posts').select(fields+',content').eq('slug',slug).eq('status','published').maybeSingle();if(error)throw error;if(!live)return;if(!data){setPost(null);setStatus('missing');return;}setPost(data);setStatus('ready');const more=await supabase.from('posts').select('slug,title').eq('status','published').eq('category',data.category).neq('slug',slug).limit(4);if(live&&!more.error)setRelated(more.data||[]);}catch{if(live)setStatus('error');}}load();return()=>{live=false};},[slug]);
 useEffect(()=>{if(!post){if(status==='missing'){document.title='Article not found | Taskivo';const r=document.querySelector('meta[name="robots"]');if(r)r.content='noindex, follow';}return;}document.title=post.title+' | Taskivo';const d=document.querySelector('meta[name="description"]');if(d)d.content=post.meta_desc;},[post,status]);
 if(status==='missing'||status==='error')return <main className="ed-article"><style>{styles}</style><h1>{status==='missing'?'Article not found':'Article temporarily unavailable'}</h1><p><a href="/blog">Browse articles</a></p></main>;
 if(!post)return <main className="ed-article"><style>{styles}</style><p>Loading article…</p></main>;
 const date=new Date(post.updated_at||post.created_at);const dateText=Number.isNaN(date.getTime())?'':date.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
 return <article className="ed-article"><style>{styles}</style><nav aria-label="Breadcrumb" className="ed-breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / {categoryLabel(post.category)}</nav><div className="ed-kicker">{categoryLabel(post.category)}</div><h1 className="ed-heading">{post.title}</h1><p className="ed-copy">{post.meta_desc}</p><p style={{fontSize:13,color:'var(--slate)',marginTop:20}}>Taskivo Editorial · {dateText&&('Updated '+dateText+' · ')}{Math.max(1,Math.ceil(wordCount(post.content)/220))} min read</p><Photo post={post} article/><div className="ed-prose" dangerouslySetInnerHTML={{__html:safeArticleHtml(post.content)}}/><div className="ed-related"><h2 style={{fontSize:20}}>Related reading</h2>{related.filter(p=>p.slug!==slug).slice(0,4).map(p=><a href={'/article-'+p.slug} key={p.slug}>{p.title}</a>)}<a href={post.category==='creator'?'/youtube-monetization':'/paid-surveys'}>{post.category==='creator'?'YouTube monetization support':'Paid survey guide'}</a><a href="/microtasks">Online microtasks explained</a><a href="/blog">Browse all guides</a></div><p style={{color:'var(--slate)',fontSize:13,lineHeight:1.7,marginTop:24}}>Editorial information only. Task availability, payment conditions and platform policies may change. <a href="/disclaimer" style={{color:'var(--ink)'}}>Read our disclaimer.</a></p></article>;
}
export function TaskivoSecureNode(){return null;}
