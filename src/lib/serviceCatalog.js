export const services = [
  { id:'social', label:'Social & Video', title:'Video testing & content promotion', icon:'▶️', desc:'Get structured feedback on videos, hooks, scripts and creative assets. Promotion can use transparent, client-funded advertising rather than paid public views.', deliverables:['Creative feedback report','Video clarity and retention research','Optional paid media planning'], task:'Video feedback' },
  { id:'growth', label:'Audience Growth', title:'Audience research & growth strategy', icon:'👥', desc:'Understand your intended audience, test messaging and plan organic or paid acquisition. No guaranteed followers, likes or subscriptions.', deliverables:['Audience research','Messaging and content strategy','Campaign planning'], task:'Audience research' },
  { id:'seo', label:'SEO Services', title:'SEO audits & website research', icon:'🔍', desc:'Identify technical indexing issues, improve content and collect genuine usability feedback without paying people to manipulate search rankings.', deliverables:['Technical and on-page audit','Keyword and content research','Usability feedback'], task:'Website usability' },
  { id:'adsense', label:'Publisher Optimization', title:'AdSense & publisher optimization', icon:'💰', desc:'Review page experience, monetization readiness and ad placement against applicable policies. We do not sell incentivized ad traffic or ad clicks.', deliverables:['Monetization readiness review','Page experience recommendations','Ad placement and policy review'], task:'Publisher usability' },
  { id:'qa', label:'QA Testing', title:'App QA testing', icon:'🐛', desc:'Commission genuine testers to check app features and deliver reproducible bug reports with relevant screenshots. No paid ratings or reviews.', deliverables:['Test scenarios','Bug reports and screenshots','Usability findings'], task:'App testing' },
  { id:'ugc', label:'UGC Videos', title:'Original UGC videos', icon:'🤳', desc:'Commission original product demos or creative videos with agreed usage rights, honest disclosures and no fabricated testimonials.', deliverables:['Original video deliverables','Agreed commercial usage rights','Manual quality review'], task:'Content creation' }
];

// Indicative USD prices for reviewed quotes, not automatic checkout amounts.
export const servicePackages = {
  "social": [
    {
      "id": "starter",
      "name": "Starter",
      "amount": 15,
      "scope": "5 short video feedback submissions",
      "features": [
        "Feedback on one video or creative",
        "5 structured responses",
        "Summary of improvements"
      ],
      "isPopular": false
    },
    {
      "id": "professional",
      "name": "Professional",
      "amount": 35,
      "scope": "12 short video feedback submissions",
      "features": [
        "Up to 2 creative variations",
        "12 structured responses",
        "Comparative feedback summary"
      ],
      "isPopular": true
    },
    {
      "id": "business",
      "name": "Business",
      "amount": 75,
      "scope": "25 short video feedback submissions",
      "features": [
        "Up to 3 creative variations",
        "25 structured responses",
        "Creative testing report"
      ],
      "isPopular": false
    }
  ],
  "growth": [
    {
      "id": "starter",
      "name": "Starter",
      "amount": 20,
      "scope": "5 audience research responses",
      "features": [
        "One target audience",
        "5 structured responses",
        "Messaging recommendations"
      ],
      "isPopular": false
    },
    {
      "id": "professional",
      "name": "Professional",
      "amount": 50,
      "scope": "15 audience research responses",
      "features": [
        "Up to 2 audience segments",
        "15 structured responses",
        "Audience insights summary"
      ],
      "isPopular": true
    },
    {
      "id": "business",
      "name": "Business",
      "amount": 100,
      "scope": "30 audience research responses",
      "features": [
        "Up to 3 audience segments",
        "30 structured responses",
        "Growth strategy recommendations"
      ],
      "isPopular": false
    }
  ],
  "seo": [
    {
      "id": "starter",
      "name": "Starter",
      "amount": 25,
      "scope": "1-page SEO audit",
      "features": [
        "One public webpage",
        "Indexing and on-page checks",
        "Prioritized recommendations"
      ],
      "isPopular": false
    },
    {
      "id": "professional",
      "name": "Professional",
      "amount": 65,
      "scope": "Up to 5 pages",
      "features": [
        "Technical and on-page audit",
        "Keyword and content opportunities",
        "Prioritized action plan"
      ],
      "isPopular": true
    },
    {
      "id": "business",
      "name": "Business",
      "amount": 150,
      "scope": "Up to 15 pages",
      "features": [
        "Site structure and indexing review",
        "Content and keyword analysis",
        "Detailed optimization roadmap"
      ],
      "isPopular": false
    }
  ],
  "adsense": [
    {
      "id": "starter",
      "name": "Starter",
      "amount": 25,
      "scope": "1-page monetization review",
      "features": [
        "One public webpage",
        "Policy and placement review",
        "Readiness recommendations"
      ],
      "isPopular": false
    },
    {
      "id": "professional",
      "name": "Professional",
      "amount": 60,
      "scope": "Up to 5 pages",
      "features": [
        "Page experience review",
        "Ad placement recommendations",
        "Policy risk checklist"
      ],
      "isPopular": true
    },
    {
      "id": "business",
      "name": "Business",
      "amount": 120,
      "scope": "Up to 15 pages",
      "features": [
        "Monetization and usability audit",
        "Technical improvement roadmap",
        "Policy risk review"
      ],
      "isPopular": false
    }
  ],
  "qa": [
    {
      "id": "starter",
      "name": "Starter",
      "amount": 20,
      "scope": "5 basic app test submissions",
      "features": [
        "One short test scenario",
        "5 genuine tester submissions",
        "Issue and feedback summary"
      ],
      "isPopular": false
    },
    {
      "id": "professional",
      "name": "Professional",
      "amount": 50,
      "scope": "12 basic app test submissions",
      "features": [
        "Up to 2 short test scenarios",
        "12 tester submissions",
        "Reproducible bug reports where found"
      ],
      "isPopular": true
    },
    {
      "id": "business",
      "name": "Business",
      "amount": 100,
      "scope": "25 basic app test submissions",
      "features": [
        "Up to 3 short test scenarios",
        "25 tester submissions",
        "Consolidated QA report"
      ],
      "isPopular": false
    }
  ],
  "ugc": [
    {
      "id": "starter",
      "name": "Starter",
      "amount": 50,
      "scope": "1 short UGC video",
      "features": [
        "One 15–30 second video",
        "Agreed brief and usage rights",
        "Manual quality review"
      ],
      "isPopular": false
    },
    {
      "id": "professional",
      "name": "Professional",
      "amount": 135,
      "scope": "3 short UGC videos",
      "features": [
        "Three 15–30 second videos",
        "Agreed briefs and usage rights",
        "Manual quality review"
      ],
      "isPopular": true
    },
    {
      "id": "business",
      "name": "Business",
      "amount": 220,
      "scope": "5 short UGC videos",
      "features": [
        "Five 15–30 second videos",
        "Agreed briefs and usage rights",
        "Manual quality review"
      ],
      "isPopular": false
    }
  ]
};
