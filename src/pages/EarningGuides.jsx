import { useEffect } from 'react';

export const earningGuides = {
  'paid-surveys': {
    title: 'Paid Surveys in Nigeria | Taskivo',
    heading: 'Paid surveys and research opportunities',
    description: 'Learn how paid surveys work, how eligibility is determined and how Taskivo plans to handle verified survey rewards in Nigeria.',
    sections: [
      ['How online surveys work', 'Research companies invite participants to answer questions about products, shopping habits or everyday experiences. A survey may have screening questions to find people whose experiences match the study. Answer honestly; being screened out does not mean you did anything wrong.'],
      ['Availability in Nigeria', 'Survey availability varies by country, age group and research demand. Offerwall.GG is available in a limited pilot. No minimum number of surveys or income is guaranteed. Check your account for eligibility and current availability.'],
      ['Rewards and withdrawals', 'Withdrawal requests open every Saturday from 9:00 AM until midnight (Sunday 12:00 AM), West Africa Time (WAT), for eligible accounts with at least 100 PTS and valid bank details. Verified rewards are credited without waiting for provider settlement. Requests are reviewed for bank transfer. The amount displayed before a task starts is in PTS, not US dollars.'],
      ['Participate safely', 'Use one account, provide accurate profile information, and do not use a VPN to misrepresent your country. Never share banking passwords, one-time codes or identity documents with an unverified survey. Taskivo does not require a deposit to join.'],
      ['If a reward is missing', 'Keep the offer name, completion date and any reference number. Use the partner support option or contact support@taskivo.online. Do not repeat an offer unless its terms allow it.']
    ]
  },
  'microtasks': {
    title: 'Online Microtasks and App Testing | Taskivo',
    heading: 'Online microtasks and app testing',
    description: 'Discover how digital microtasks, usability feedback, app testing and original content assignments work on Taskivo.',
    sections: [
      ['What is a microtask?', 'A microtask is a small assignment with a specific deliverable, such as checking a product interface, identifying a bug or answering a research question. Read the requirements and estimated reward before choosing a task.'],
      ['App and website testing', 'A useful testing report explains the device or browser used, the steps taken, the expected result and the actual result. Avoid sending private data or unrelated screenshots. Businesses can use this feedback to identify usability issues.'],
      ['Research and original content', 'Other opportunities may include questionnaires, product feedback and original content assignments. Availability depends on funded campaigns and partner approval. We do not guarantee work or income.'],
      ['How rewards work', 'Complete the stated requirements and submit accurate evidence where requested. Reward eligibility and redemption are subject to verification and applicable payout conditions. Do not pay to unlock tasks or provide fake reviews or engagement. Internal reading rewards record 3 PTS per article after two minutes; admin assignments are reviewed separately. Withdrawals remain paused.'],
      ['Getting started', 'Create an account, check the task dashboard and choose an assignment you can complete honestly. If no suitable tasks are available, check back rather than accepting a task you cannot complete. Businesses can contact support@taskivo.online for campaign inquiries.']
    ]
  }
};

export function EarningGuide({ slug }) {
  const guide = Object.hasOwn(earningGuides, slug) ? earningGuides[slug] : null;
  useEffect(() => {
    if (!guide) return;
    document.title = guide.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = guide.description;
  }, [guide]);
  if (!guide) return null;
  return <main style={{maxWidth: 850, margin:'0 auto', padding:'64px 5%', color:'var(--ink)', fontFamily:"'DM Sans', sans-serif"}}>
    <a href="/" style={{color:'var(--slate)'}}>Taskivo home</a>
    <h1 style={{fontSize:36, fontWeight:800, margin:'24px 0 16px'}}>{guide.heading}</h1>
    <p style={{fontSize:18, lineHeight:1.7, color:'var(--slate)'}}>{guide.description}</p>
    {guide.sections.map(([title,body]) => <section key={title} style={{margin:'32px 0'}}><h2 style={{fontSize:23, fontWeight:700}}>{title}</h2><p style={{fontSize:16, lineHeight:1.8, color:'var(--slate)'}}>{body}</p></section>)}
    <section style={{margin:'32px 0'}}><h2 style={{fontSize:23}}>Frequently asked questions</h2><h3 style={{fontSize:17,marginTop:16}}>Is income guaranteed?</h3><p style={{lineHeight:1.8,color:'var(--slate)'}}>No. Availability, eligibility and approval vary. Recorded rewards are not the same as received cash.</p><h3 style={{fontSize:17,marginTop:16}}>Can I withdraw now?</h3><p style={{lineHeight:1.8,color:'var(--slate)'}}>Weekly withdrawal requests are subject to the Saturday window and account eligibility.</p><h3 style={{fontSize:17,marginTop:16}}>Where can I learn more?</h3><p style={{lineHeight:1.8}}><a href="/article-paid-surveys-in-nigeria-beginners-guide">Complete paid survey guide for Nigeria</a> · <a href="/article-how-to-spot-fake-earning-sites-vs-legitimate-micro-task-platforms">Recognize online task scams</a></p></section>
    <div style={{padding:24, border:'1px solid var(--line)', background:'var(--surface-card)', borderRadius:16}}>
      <a href="/auth" style={{display:'inline-block', background:'var(--lime)', color:'#000', borderRadius:8, padding:'12px 18px', fontWeight:700, textDecoration:'none'}}>Explore your account</a>
      <p style={{color:'var(--slate)', marginTop:16}}>Related: <a href={slug==='paid-surveys'?'/microtasks':'/paid-surveys'} style={{color:'var(--ink)'}}>{slug==='paid-surveys'?'Online microtasks':'Paid surveys'}</a> · <a href="/blog" style={{color:'var(--ink)'}}>Taskivo blog</a></p>
    </div>
  </main>;
}
