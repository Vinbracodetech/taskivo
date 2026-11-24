export const services = [
  { id:'social', label:'Social & Video', title:'Video testing & content promotion', icon:'▶️', desc:'Get structured feedback on videos, hooks, scripts and creative assets. Promotion can use transparent, client-funded advertising rather than paid public views.', deliverables:['Creative feedback report','Video clarity and retention research','Optional paid media planning'], task:'Video feedback' },
  { id:'growth', label:'Audience Growth', title:'Audience research & growth strategy', icon:'👥', desc:'Understand your intended audience, test messaging and plan organic or paid acquisition. No guaranteed followers, likes or subscriptions.', deliverables:['Audience research','Messaging and content strategy','Campaign planning'], task:'Audience research' },
  { id:'seo', label:'SEO Services', title:'SEO audits & website research', icon:'🔍', desc:'Identify technical indexing issues, improve content and collect genuine usability feedback without paying people to manipulate search rankings.', deliverables:['Technical and on-page audit','Keyword and content research','Usability feedback'], task:'Website usability' },
  { id:'adsense', label:'Publisher Optimization', title:'AdSense & publisher optimization', icon:'💰', desc:'Review page experience, monetization readiness and ad placement against applicable policies. We do not sell incentivized ad traffic or ad clicks.', deliverables:['Monetization readiness review','Page experience recommendations','Ad placement and policy review'], task:'Publisher usability' },
  { id:'qa', label:'QA Testing', title:'App QA testing', icon:'🐛', desc:'Commission genuine testers to check app features and deliver reproducible bug reports with relevant screenshots. No paid ratings or reviews.', deliverables:['Test scenarios','Bug reports and screenshots','Usability findings'], task:'App testing' },
  { id:'ugc', label:'UGC Videos', title:'Original UGC videos', icon:'🤳', desc:'Commission original product demos or creative videos with agreed usage rights, honest disclosures and no fabricated testimonials.', deliverables:['Original video deliverables','Agreed commercial usage rights','Manual quality review'], task:'Content creation' }
];

// Indicative USD starting prices based on the original Taskivo price tiers.
// Scope, participant pay and availability must be agreed before funding; no automatic checkout.
export const servicePackages = {
  "social": [
    {
      "id": "pilot",
      "name": "Pilot",
      "amount": 2,
      "scope": "1 short creative feedback response",
      "features": [
        "One short clip or creative",
        "One structured response"
      ],
      "isPopular": false
    },
    {
      "id": "basic",
      "name": "Basic",
      "amount": 5,
      "scope": "2 short feedback responses",
      "features": [
        "One creative",
        "Two independent responses"
      ],
      "isPopular": false
    },
    {
      "id": "starter",
      "name": "Starter",
      "amount": 12,
      "scope": "5 short feedback responses",
      "features": [
        "One creative",
        "Five structured responses"
      ],
      "isPopular": false
    },
    {
      "id": "pro",
      "name": "Pro",
      "amount": 25,
      "scope": "10 short feedback responses",
      "features": [
        "Up to two creatives",
        "Consolidated feedback"
      ],
      "isPopular": true
    },
    {
      "id": "scale",
      "name": "Scale",
      "amount": 50,
      "scope": "20 short feedback responses",
      "features": [
        "Up to three creatives",
        "Comparison summary"
      ],
      "isPopular": false
    }
  ],
  "growth": [
    {
      "id": "pilot",
      "name": "Pilot",
      "amount": 3,
      "scope": "1 audience feedback response",
      "features": [
        "One short messaging question",
        "One response from an eligible participant"
      ],
      "isPopular": false
    },
    {
      "id": "basic",
      "name": "Basic",
      "amount": 7,
      "scope": "3 short audience responses",
      "features": [
        "One audience segment",
        "Three structured responses"
      ],
      "isPopular": false
    },
    {
      "id": "starter",
      "name": "Starter",
      "amount": 15,
      "scope": "6 short audience responses",
      "features": [
        "One audience segment",
        "Messaging feedback"
      ],
      "isPopular": false
    },
    {
      "id": "pro",
      "name": "Pro",
      "amount": 30,
      "scope": "12 short audience responses",
      "features": [
        "Up to two audience segments",
        "Findings summary"
      ],
      "isPopular": true
    },
    {
      "id": "scale",
      "name": "Scale",
      "amount": 60,
      "scope": "25 short audience responses",
      "features": [
        "Up to three audience segments",
        "Audience insights summary"
      ],
      "isPopular": false
    }
  ],
  "seo": [
    {
      "id": "pilot",
      "name": "Pilot",
      "amount": 2.5,
      "scope": "Quick automated check of 1 URL",
      "features": [
        "Public page title and metadata checks",
        "Basic crawlability indicators"
      ],
      "isPopular": false
    },
    {
      "id": "basic",
      "name": "Basic",
      "amount": 6,
      "scope": "Basic review of 1 URL",
      "features": [
        "Metadata and heading checks",
        "Brief recommendations"
      ],
      "isPopular": false
    },
    {
      "id": "starter",
      "name": "Starter",
      "amount": 14,
      "scope": "Focused audit of 1 page",
      "features": [
        "On-page and indexing checks",
        "Prioritized fixes"
      ],
      "isPopular": false
    },
    {
      "id": "pro",
      "name": "Pro",
      "amount": 28,
      "scope": "Focused audit of up to 3 pages",
      "features": [
        "Technical and content checks",
        "Action checklist"
      ],
      "isPopular": true
    },
    {
      "id": "scale",
      "name": "Scale",
      "amount": 55,
      "scope": "Focused audit of up to 6 pages",
      "features": [
        "Technical and on-page findings",
        "Optimization recommendations"
      ],
      "isPopular": false
    }
  ],
  "adsense": [
    {
      "id": "pilot",
      "name": "Pilot",
      "amount": 3.5,
      "scope": "Quick publisher readiness checklist",
      "features": [
        "Basic public page checks",
        "No paid ad traffic or clicks"
      ],
      "isPopular": false
    },
    {
      "id": "basic",
      "name": "Basic",
      "amount": 8,
      "scope": "Basic review of 1 page",
      "features": [
        "Visible layout and policy risk checks",
        "Brief recommendations"
      ],
      "isPopular": false
    },
    {
      "id": "starter",
      "name": "Starter",
      "amount": 18,
      "scope": "Focused review of 1 page",
      "features": [
        "Monetization readiness",
        "Ad placement and usability feedback"
      ],
      "isPopular": false
    },
    {
      "id": "pro",
      "name": "Pro",
      "amount": 38,
      "scope": "Review of up to 3 pages",
      "features": [
        "Page experience and policy risk checks",
        "Prioritized recommendations"
      ],
      "isPopular": true
    },
    {
      "id": "scale",
      "name": "Scale",
      "amount": 75,
      "scope": "Review of up to 6 pages",
      "features": [
        "Publisher usability review",
        "Optimization action plan"
      ],
      "isPopular": false
    }
  ],
  "qa": [
    {
      "id": "pilot",
      "name": "Pilot",
      "amount": 5,
      "scope": "1 short app smoke-test submission",
      "features": [
        "One brief test scenario",
        "One tester's findings"
      ],
      "isPopular": false
    },
    {
      "id": "starter",
      "name": "Starter",
      "amount": 12,
      "scope": "3 short app test submissions",
      "features": [
        "One short scenario",
        "Screenshots where relevant"
      ],
      "isPopular": false
    },
    {
      "id": "pro",
      "name": "Pro",
      "amount": 28,
      "scope": "6 short app test submissions",
      "features": [
        "Up to two short scenarios",
        "Issue summary"
      ],
      "isPopular": true
    },
    {
      "id": "scale",
      "name": "Scale",
      "amount": 60,
      "scope": "12 short app test submissions",
      "features": [
        "Up to three short scenarios",
        "Consolidated findings"
      ],
      "isPopular": false
    }
  ],
  "ugc": [
    {
      "id": "pilot",
      "name": "Pilot",
      "amount": 15,
      "scope": "1 simple raw UGC clip",
      "features": [
        "One brief 10–15 second clip",
        "No editing or product purchases",
        "Usage rights agreed before work"
      ],
      "isPopular": false
    },
    {
      "id": "starter",
      "name": "Starter",
      "amount": 28,
      "scope": "1 short UGC video",
      "features": [
        "One 15–30 second video",
        "Simple brief and agreed rights"
      ],
      "isPopular": false
    },
    {
      "id": "pro",
      "name": "Pro",
      "amount": 65,
      "scope": "2 short UGC videos",
      "features": [
        "Two simple 15–30 second videos",
        "Agreed usage rights and review"
      ],
      "isPopular": true
    },
    {
      "id": "scale",
      "name": "Scale",
      "amount": 120,
      "scope": "4 short UGC videos",
      "features": [
        "Four simple 15–30 second videos",
        "Agreed rights and quality review"
      ],
      "isPopular": false
    }
  ]
};
