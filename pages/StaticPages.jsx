import { useEffect } from "react";

// A reusable layout wrapper for all text-heavy pages
function PageLayout({ title, date, children }) {
  useEffect(function () {
    window.scrollTo(0, 0);
    document.title = "Taskivo — " + title;
  }, [title]);

  return (
    <div className="page animate-fadeIn" style={{ paddingBottom: 100, maxWidth: 800 }}>
      <div style={{ marginBottom: 40, borderBottom: "1px solid var(--line)", paddingBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: "var(--ink)", marginBottom: 8, letterSpacing: "-1px" }}>
          {title}
        </h1>
        <div style={{ color: "var(--slate)", fontSize: 14 }}>Last updated: {date}</div>
      </div>
      <div style={{ color: "var(--slate)", fontSize: 16, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 24 }}>
        {children}
      </div>
    </div>
  );
}

export function About() {
  return (
    <PageLayout title="About Taskivo" date="May 2026">
      <p>
        <strong style={{ color: "var(--ink)" }}>Two sides. One platform.</strong><br />
        Taskivo was built on a simple premise: engagement should be genuine, and time should be rewarded. 
      </p>
      <p>
        For years, creators have struggled with algorithmic suppression and "bot" views that do nothing for their actual community growth. On the other side, millions of internet users spend hours watching content for free. We built Taskivo to bridge that gap.
      </p>
      <h3 style={{ color: "var(--ink)", fontSize: 20, marginTop: 16 }}>Our Mission</h3>
      <p>
        Our mission is to create a transparent, global economy for digital engagement. By enforcing strict watch-timers and comprehension quizzes, we guarantee creators get real human interaction, while providing earners globally with a legitimate, accessible way to make money online.
      </p>
    </PageLayout>
  );
}

export function Terms() {
  return (
    <PageLayout title="Terms of Service" date="May 5, 2026">
      <p>Welcome to Taskivo. By accessing our platform, you agree to these terms.</p>
      
      <h3 style={{ color: "var(--ink)", fontSize: 20, marginTop: 16 }}>1. Earner Accounts & Fair Use</h3>
      <p>
        Earners must complete tasks manually and genuinely. The use of automated bots, scripts, tab-switching bypasses, or multiple accounts to farm points is strictly prohibited. Accounts caught violating these rules will be permanently banned and all pending withdrawals will be forfeited.
      </p>

      <h3 style={{ color: "var(--ink)", fontSize: 20, marginTop: 16 }}>2. Creator Campaigns</h3>
      <p>
        Creators are responsible for the content they promote on Taskivo. Videos or articles promoting illegal activities, hate speech, or explicit content will be rejected during the admin approval process without refund.
      </p>

      <h3 style={{ color: "var(--ink)", fontSize: 20, marginTop: 16 }}>3. Withdrawals & Payments</h3>
      <p>
        Points earned hold no real-world value until a withdrawal request is approved by an administrator. Taskivo reserves the right to hold or deny payouts if suspicious activity is detected on the earner's account. Standard processing time for withdrawals is 24 to 48 hours.
      </p>
    </PageLayout>
  );
}

export function Privacy() {
  return (
    <PageLayout title="Privacy Policy" date="May 5, 2026">
      <p>Your privacy is critically important to us. At Taskivo, we follow a few fundamental principles regarding your data.</p>
      
      <h3 style={{ color: "var(--ink)", fontSize: 20, marginTop: 16 }}>Information We Collect</h3>
      <p>
        We only ask for personal information when we truly need it to provide a service to you. This includes your email address for account creation, your country for localized task rates, and your payment details strictly for processing your withdrawals.
      </p>

      <h3 style={{ color: "var(--ink)", fontSize: 20, marginTop: 16 }}>How We Use Your Data</h3>
      <p>
        We use your data to authenticate your account, prevent platform fraud, and ensure you get paid accurately. We do not sell your personal data to third-party marketing agencies. Creator task analytics are anonymized and do not reveal the personal email addresses of the earners.
      </p>
    </PageLayout>
  );
}
