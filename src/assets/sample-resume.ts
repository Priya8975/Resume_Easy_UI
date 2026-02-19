import type { ResumeData } from '@/types/resume';

export const sampleResume: ResumeData = {
  meta: {
    id: "resume-1",
    name: "Priyanka Pradip More - Resume",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    schemaVersion: 1,
  },
  contactInfo: {
    name: "Priyanka Pradip More",
    email: "priyamore8975@gmail.com",
    phone: "+1 5165098900",
    linkedin: "https://www.linkedin.com/in/morepriya/",
    github: "https://github.com/Priya8975",
    location: "Stony Brook, NY",
  },
  sections: [
    // ─── Education ───────────────────────────────────────────────
    {
      id: "section-education",
      type: "education",
      title: "Education",
      enabled: true,
      displayOrder: 0,
      entries: [
        {
          id: "edu-1",
          enabled: true,
          displayOrder: 0,
          data: {
            type: "education",
            institution: "Stony Brook University",
            degree: "Master of Science",
            field: "Computer Engineering",
            startDate: "Aug 2024",
            endDate: "May 2026",
            gpa: "3.9/4.0",
            location: "Stony Brook, NY",
            availableCoursework: "Machine Learning, Deep Learning, Computer Vision, Digital Image Processing, Networking Algorithms, Switching and Routing in Parallel Systems, Distributed Systems, Cyber Physical Systems",
          },
          bulletPoints: [
            {
              id: "edu-1-bp-1",
              text: "\\textbf{Coursework:} Machine Learning, Deep Learning, Computer Vision, Digital Image Processing, Networking Algorithms.",
              enabled: true,
              displayOrder: 0,
            },
          ],
        },
        {
          id: "edu-2",
          enabled: true,
          displayOrder: 1,
          data: {
            type: "education",
            institution: "Savitribai Phule Pune University",
            degree: "Bachelor of Engineering",
            field: "Computer Science",
            startDate: "Aug 2020",
            endDate: "May 2023",
            gpa: "3.8/4.0",
            location: "Pune, India",
            availableCoursework: "DSA, Systems Programming \\& OS, DBMS, Linux, Cloud Computing, NLP, High Performance Computing, Web Designing, Computer Graphics, Data Structures, Operating Systems, Systems Programming, Database Management Systems, Android Dev, AI, Natural Language Processing, Data Science, Big Data Analytics",
          },
          bulletPoints: [
            {
              id: "edu-2-bp-1",
              text: "\\textbf{Coursework:} DSA, Systems Programming \\& OS, DBMS, Linux, Cloud Computing, NLP, High Performance Computing.",
              enabled: true,
              displayOrder: 0,
            },
          ],
        },
      ],
    },

    // ─── Skills ──────────────────────────────────────────────────
    {
      id: "section-skills",
      type: "skills",
      title: "Skills",
      enabled: true,
      displayOrder: 2,
      entries: [
        {
          id: "skills-1",
          enabled: true,
          displayOrder: 0,
          data: {
            type: "skills",
            category: "Programming Languages",
            items: "C, C++, Python, JavaScript, TypeScript, SQL.",
            availableItems: "Java, C, C++, Python, JavaScript, TypeScript, SQL, Go",
          },
          bulletPoints: [],
        },
        {
          id: "skills-2",
          enabled: true,
          displayOrder: 1,
          data: {
            type: "skills",
            category: "Frameworks & Libraries",
            items: "ReactJS, Angular, Svelte, Flask, FastAPI, React Native, Pandas, NumPy, SciPy, scikit-learn, PyTorch, TensorFlow, Hugging Face Transformers, LangChain, LangGraph.",
            availableItems: "ReactJS, Angular, Svelte, Node.js, Electron, Spring Boot, Flask, FastAPI, Streamlit, Tailwind CSS, Flutter, React Native, Django, JUnit, Pandas, NumPy, SciPy, scikit-learn, PyTorch, TensorFlow, Hugging Face Transformers, LangChain, LangGraph",
          },
          bulletPoints: [],
        },
        {
          id: "skills-3",
          enabled: true,
          displayOrder: 2,
          data: {
            type: "skills",
            category: "Tools & Technologies",
            items: "AWS, Azure, GCP, Docker, Docker Compose, Kubernetes, Jenkins, Git, GitLab, GitHub Actions, ChromaDB, OpenAI Whisper.",
            availableItems: "AWS, Azure, GCP, Docker, Docker Compose, Kubernetes, Jenkins, Git, GitLab, GitHub Actions, Android Studio, ChromaDB, OpenAI Whisper, SHAP, WebSocket",
          },
          bulletPoints: [],
        },
        {
          id: "skills-4",
          enabled: true,
          displayOrder: 3,
          data: {
            type: "skills",
            category: "Databases",
            items: "MySQL, PostgreSQL, MongoDB, Firebase, Firestore.",
            availableItems: "MySQL, PostgreSQL, MongoDB, Firebase, Firestore, Redis",
          },
          bulletPoints: [],
        },
      ],
    },

    // ─── Professional Experience ─────────────────────────────────
    {
      id: "section-experience",
      type: "experience",
      title: "Professional Experience",
      enabled: true,
      displayOrder: 1,
      entries: [
        {
          id: "exp-1",
          enabled: true,
          displayOrder: 0,
          data: {
            type: "experience",
            company: "Stony Brook University",
            title: "Graduate Research Assistant",
            startDate: "Jul 2025",
            endDate: "Present",
          },
          bulletPoints: [
            {
              id: "exp-1-bp-1",
              text: "Built a \\textbf{physics-informed ML digital twin} in \\textbf{PyTorch} for DC-DC boost converter parameter estimation, combining \\textbf{neural networks} with \\textbf{ODE-based simulation} to achieve \\textbf{5.19\\% MAPE} on component prediction.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "exp-1-bp-2",
              text: "Engineered a data pipeline using \\textbf{SciPy ODE solvers} \\& \\textbf{Latin Hypercube Sampling} to synthesize \\textbf{1,000} labeled waveform samples, and performed \\textbf{observability analysis} that reduced prediction error from \\textbf{23\\%} to \\textbf{5.19\\%}.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "exp-1-bp-3",
              text: "Benchmarked \\textbf{3 modeling approaches} (PIML, NARX-ANN, feedforward network), with the \\textbf{NARX predictor} achieving \\textbf{R\\textsuperscript{2} = 0.9998} on open-loop waveform prediction.",
              enabled: true,
              displayOrder: 2,
            },
          ],
        },
        {
          id: "exp-2",
          enabled: true,
          displayOrder: 1,
          data: {
            type: "experience",
            company: "Persistent Systems",
            title: "Software Engineer",
            startDate: "Jul 2023",
            endDate: "Jul 2024",
          },
          bulletPoints: [
            {
              id: "exp-2-bp-1",
              text: "Developed \\& launched CodeHealth, an AI-based code review platform using LLMs, \\textbf{Python} \\& \\textbf{React} on \\textbf{AWS} \\& \\textbf{Azure}, which analyzed \\textbf{50,000+} LOC \\& flagged potential vulnerabilities, reducing code quality issues by \\textbf{15\\%}.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "exp-2-bp-2",
              text: "Integrated \\textbf{OpenAI APIs} with \\textbf{custom prompts} to assess code quality, reducing manual review time by \\textbf{2 hrs/week}.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "exp-2-bp-3",
              text: "Spearheaded the creation of \\textbf{35+} configurable coding rules, enabling teams to customize linting based on standards.",
              enabled: true,
              displayOrder: 2,
            },
            {
              id: "exp-2-bp-4",
              text: "Accelerated development cycles by \\textbf{25\\%} by integrating \\textbf{GitHub Copilot} \\& \\textbf{Amazon CodeWhisperer} into the SDLC.",
              enabled: true,
              displayOrder: 3,
            },
          ],
        },
        {
          id: "exp-3",
          enabled: true,
          displayOrder: 2,
          data: {
            type: "experience",
            company: "S3 IT Service",
            title: "Software Developer",
            startDate: "Jul 2022",
            endDate: "Jul 2023",
          },
          bulletPoints: [
            {
              id: "exp-3-bp-1",
              text: "Developed \\textbf{backend} systems using \\textbf{Python/Flask} \\& \\textbf{frontend PWAs} with \\textbf{Angular/Svelte}, serving \\textbf{1M} users.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "exp-3-bp-2",
              text: "Built a recommendation engine using \\textbf{correlation analysis} \\& \\textbf{clustering}, and a \\textbf{Random Forest Classifier} to evaluate customer credit history \\& assign credit scores, which improved the speed of creditworthiness evaluation by \\textbf{18\\%}.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "exp-3-bp-3",
              text: "Deployed \\textbf{Docker} \\& \\textbf{Kubernetes} configurations, enabling \\textbf{zero-downtime deployments} \\& \\textbf{auto-scaling} across production services.",
              enabled: true,
              displayOrder: 2,
            },
            {
              id: "exp-3-bp-4",
              text: "Automated reconciliation of \\textbf{2,000+} transaction discrepancies \\& performed \\textbf{root cause analysis (RCA)}.",
              enabled: true,
              displayOrder: 3,
            },
          ],
        },
      ],
    },

    // ─── Projects ────────────────────────────────────────────────
    {
      id: "section-projects",
      type: "projects",
      title: "Projects",
      enabled: true,
      displayOrder: 3,
      entries: [
        {
          id: "proj-1",
          enabled: true,
          displayOrder: 1,
          data: {
            type: "projects",
            name: "Audio Transcription for speech impaired",
            startDate: "May 2024",
            endDate: "Mar 2025",
          },
          bulletPoints: [
            {
              id: "proj-1-bp-1",
              text: "Fine-tuned \\textbf{OpenAI Whisper} using \\textbf{PyTorch} \\& \\textbf{Hugging Face Transformers} to improve speech-to-text for people with Dysarthria, creating both general \\& user-specific models.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-1-bp-2",
              text: "Improved Word Error Rate (WER) by \\textbf{50\\%} with general models \\& up to \\textbf{80\\%} with user-specific models.",
              enabled: true,
              displayOrder: 1,
            },
          ],
        },
        {
          id: "proj-2",
          enabled: false,
          displayOrder: 3,
          data: {
            type: "projects",
            name: "Project Z: Universal Remote Controller",
            startDate: "Dec 2024",
            endDate: "Dec 2024",
          },
          bulletPoints: [
            {
              id: "proj-2-bp-1",
              text: "Built an Android app using \\textbf{Java (Android Studio)} to remotely control a PC's mouse/keyboard via touch gestures, ensuring seamless cross-device interaction.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-2-bp-2",
              text: "Designed a lightweight \\textbf{JSON} command protocol with retry/backoff \\& Boosted reliability with \\textbf{JUnit} tests.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "proj-2-bp-3",
              text: "Developed a cross-platform controller using \\textbf{NodeJS} \\& \\textbf{Electron} with a command server \\& FTP for file sharing.",
              enabled: true,
              displayOrder: 2,
            },
          ],
        },
        {
          id: "proj-3",
          enabled: true,
          displayOrder: 2,
          data: {
            type: "projects",
            name: "Smart Health Monitoring System",
            url: "https://www.ijraset.com/research-paper/iot-based-health-monitoring-system",
            startDate: "Aug 2023",
            endDate: "Jun 2024",
          },
          bulletPoints: [
            {
              id: "proj-3-bp-1",
              text: "Engineered a real-time health monitoring system utilizing \\textbf{IoT} sensors to capture patient data, achieving a \\textbf{15\\%} improvement in early disease prediction accuracy via machine learning models.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-3-bp-2",
              text: "Designed a \\textbf{React Native} mobile application enabling patients to view real-time vitals \\& built a \\textbf{React.js} web portal for doctors to monitor patient health metrics \\& manage profiles.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "proj-3-bp-3",
              text: "Published \\underline{\\href{https://www.ijraset.com/research-paper/iot-based-health-monitoring-system}{\\textbf{\"IoT-Based Health Monitoring System\"}}} in \\textbf{IJRASET}, presenting an IoT sensor framework for \\textbf{ML-driven disease prediction} \\& \\textbf{real-time patient monitoring}.",
              enabled: true,
              displayOrder: 2,
            },
          ],
        },
        {
          id: "proj-4",
          enabled: true,
          displayOrder: 0,
          data: {
            type: "projects",
            name: "Regulatory Q&A: Multi-Agent Compliance System",
            url: "https://regulatory-qa.vercel.app/",
            startDate: "Jan 2026",
            endDate: "Jan 2026",
          },
          bulletPoints: [
            {
              id: "proj-4-bp-1",
              text: "Built a \\textbf{multi-agent RAG system} using \\textbf{LangGraph, LangChain \\& GPT-4o} to answer regulatory compliance questions across \\textbf{5 frameworks} (SR 11-7, NIST AI RMF, ISO 42001, NAIC, CO SB21-169) with cited sources.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-4-bp-2",
              text: "Implemented a \\textbf{hallucination-detection agent} that validates every LLM response against \\textbf{ChromaDB}-retrieved documents, automatically retrying below a \\textbf{0.7 confidence threshold} to ensure factual accuracy.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "proj-4-bp-3",
              text: "Deployed a \\textbf{React + FastAPI} application via \\textbf{Docker Compose} with a \\textbf{GitHub Actions CI/CD} pipeline running \\textbf{16 automated tests} and linting on every push.",
              enabled: true,
              displayOrder: 2,
            },
          ],
        },
        {
          id: "proj-5",
          enabled: false,
          displayOrder: 4,
          data: {
            type: "projects",
            name: "Climate-Driven Insurance Risk Prediction",
            url: "https://priya8975-climate-risk-insurance.streamlit.app/",
            startDate: "Nov 2025",
            endDate: "Nov 2025",
          },
          bulletPoints: [
            {
              id: "proj-5-bp-1",
              text: "Engineered an end-to-end \\textbf{Python} pipeline investigating the U.S. insurance affordability crisis by integrating \\textbf{1.5M+} flood insurance claims across \\textbf{3,200 counties} from \\textbf{OpenFEMA, Census ACS \\& FRED APIs}.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-5-bp-2",
              text: "Trained \\textbf{Gamma \\& Tweedie GLMs} for claim severity modeling, \\textbf{SARIMA} for disaster trend forecasting, and \\textbf{Gradient Boosting} for county-level uninsurability classification (\\textbf{AUC-ROC = 0.83} test, \\textbf{0.87 CV}), identifying \\textbf{575 high-risk counties}; applied \\textbf{SHAP} for model explainability.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "proj-5-bp-3",
              text: "Validated robustness through \\textbf{16 sensitivity configurations}, \\textbf{10-fold geographic cross-validation}, and \\textbf{7-year expanding-window} temporal validation.",
              enabled: true,
              displayOrder: 2,
            },
          ],
        },
        {
          id: "proj-6",
          enabled: false,
          displayOrder: 5,
          data: {
            type: "projects",
            name: "Resilient Webhook Delivery System",
            url: "https://github.com/Priya8975/webhook-delivery-system",
            startDate: "Feb 2026",
            endDate: "Feb 2026",
          },
          bulletPoints: [
            {
              id: "proj-6-bp-1",
              text: "Engineered a fault-tolerant webhook delivery platform in \\textbf{Go} that fans out events to \\textbf{1,000+} subscriber endpoints with \\textbf{at-least-once delivery guarantees}, \\textbf{exponential backoff retries} (5 attempts), and a \\textbf{dead letter queue} for permanent failures.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-6-bp-2",
              text: "Implemented per-subscriber \\textbf{circuit breakers} (closed \\textrightarrow{} open \\textrightarrow{} half-open) and a \\textbf{sliding-window rate limiter} using atomic \\textbf{Redis Lua scripts}, preventing cascading failures across distributed endpoints.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "proj-6-bp-3",
              text: "Achieved \\textbf{\\~{}95 deliveries/sec} throughput via a \\textbf{100-goroutine worker pool} backed by \\textbf{Redis sorted-set job queues} and buffered channels, delivering \\textbf{3,000 webhooks} at \\textbf{100\\%} success rate in load testing.",
              enabled: true,
              displayOrder: 2,
            },
            {
              id: "proj-6-bp-4",
              text: "Developed a real-time \\textbf{React + Tailwind} monitoring dashboard with \\textbf{WebSocket} live feed for delivery metrics and subscriber health; validated reliability with \\textbf{26 tests} using \\textbf{Go's race detector} in a \\textbf{GitHub Actions CI} pipeline.",
              enabled: true,
              displayOrder: 3,
            },
          ],
        },
      ],
    },

    // ─── Achievements / Extracurriculars ─────────────────────────
    {
      id: "section-achievements",
      type: "achievements",
      title: "Achievements / Extracurriculars",
      enabled: false,
      displayOrder: 4,
      entries: [
        {
          id: "ach-1",
          enabled: true,
          displayOrder: 0,
          data: {
            type: "achievements",
            description: "Public Relations Head: Indian Graduate Student Association(IGSA), Stony Brook University.",
          },
          bulletPoints: [],
        },
        {
          id: "ach-2",
          enabled: true,
          displayOrder: 1,
          data: {
            type: "achievements",
            description: "Digital Multimedia Tools Instructor: CSTEP program at Stony Brook University.",
          },
          bulletPoints: [],
        },
        {
          id: "ach-3",
          enabled: true,
          displayOrder: 2,
          data: {
            type: "achievements",
            description: "Intra-College Smart India Hackathon Runner-Up: Developed a digitized toll collection system.",
          },
          bulletPoints: [],
        },
      ],
    },
  ],
};

export default sampleResume;
