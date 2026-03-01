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
    name: "Priyanka More",
    email: "priyamore8975@gmail.com",
    phone: "+1(516)509-8900",
    linkedin: "https://www.linkedin.com/in/morepriya/",
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
            location: "New York",
            availableCoursework: "Distributed Systems, Machine Learning, Computer Vision, Natural Language Processing, Deep Learning, NLP, Networking Algorithms, Digital Image Processing, Switching and Routing in Parallel Systems, Cyber Physical Systems",
          },
          bulletPoints: [
            {
              id: "edu-1-bp-1",
              text: "Coursework: Distributed Systems, Machine Learning, Computer Vision, Natural Language Processing, Deep Learning",
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
            location: "India",
            availableCoursework: "Data Structures and Algorithms, Database Systems, Operating Systems, Cloud Computing, Big Data Analytics, DSA, Algorithms, Linux, Systems Programming, OS, DBMS, High Performance Computing, Web Designing, Computer Graphics, Database Management Systems, Android Dev, AI, Big Data, Data Science",
          },
          bulletPoints: [
            {
              id: "edu-2-bp-1",
              text: "Coursework: Data Structures and Algorithms, Database Systems, Operating Systems, Cloud Computing, Big Data Analytics",
              enabled: true,
              displayOrder: 0,
            },
          ],
        },
      ],
    },

    // ─── Work Experience ────────────────────────────────────────
    {
      id: "section-experience",
      type: "experience",
      title: "Work Experience",
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
            startDate: "July 2025",
            endDate: "Present",
            location: "Stony Brook, NY",
          },
          bulletPoints: [
            {
              id: "exp-1-bp-1",
              text: "Engineered a \\textbf{PyTorch} and \\textbf{SciPy} data pipeline to synthesize 1,000+ samples, cutting data preparation time by 60\\%.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "exp-1-bp-2",
              text: "Developed a \\textbf{PyTorch} ML model for circuit behavior prediction, reducing estimation error from 23\\% to 5.19\\%.",
              enabled: true,
              displayOrder: 1,
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
            startDate: "July 2023",
            endDate: "July 2024",
            location: "Pune, India",
          },
          bulletPoints: [
            {
              id: "exp-2-bp-1",
              text: "Architected CodeHealth, an \\textbf{LLM}-powered platform on \\textbf{AWS} with \\textbf{Azure OpenAI} and \\textbf{RAG} to enable natural language querying of repo health and vulnerabilities, reducing manual code review time by 60\\%.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "exp-2-bp-2",
              text: "Designed distributed \\textbf{microservices} with REST APIs and an API gateway for repo ingestion, scan orchestration and vulnerability reporting, achieving 95\\%+ test coverage across all services.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "exp-2-bp-3",
              text: "Architected a \\textbf{Kafka} scan pipeline for parallel security, quality and dependency scans to process \\textbf{5M+} scan events/day.",
              enabled: true,
              displayOrder: 2,
            },
            {
              id: "exp-2-bp-4",
              text: "Optimized \\textbf{MongoDB} schema with indexing and sharding strategies for millions of scan findings, achieving 35\\% faster query response times on the health score dashboard.",
              enabled: true,
              displayOrder: 3,
            },
            {
              id: "exp-2-bp-5",
              text: "Engineered \\textbf{CI/CD} plugins for GitHub Actions and GitLab CI with quality gates, branch protection and inline PR annotations, reducing production failures by 60\\%.",
              enabled: true,
              displayOrder: 4,
            },
            {
              id: "exp-2-bp-6",
              text: "Implemented \\textbf{circuit breakers} and fallback handlers across NVD and OSV, maintaining 99.9\\% scan service availability.",
              enabled: true,
              displayOrder: 5,
            },
            {
              id: "exp-2-bp-7",
              text: "Built an \\textbf{MDC} based async logging utility for multi-threaded scan tracking, increasing audit log coverage by 75\\%.",
              enabled: false,
              displayOrder: 6,
            },
            {
              id: "exp-2-bp-8",
              text: "Constructed Grafana dashboards with key metrics to monitor 10+ microservices, cutting incident response time by 35\\%.",
              enabled: true,
              displayOrder: 7,
            },
            {
              id: "exp-2-bp-9",
              text: "Devised modular \\textbf{Bash} scripts for air-gapped enterprise repo ingestion, cutting repo setup and scan time by 50\\%.",
              enabled: false,
              displayOrder: 8,
            },
            {
              id: "exp-2-bp-10",
              text: "Automated nightly scans and SBOM generation for 1000+ repositories via job scheduler, delivering daily health digests.",
              enabled: false,
              displayOrder: 9,
            },
            {
              id: "exp-2-bp-11",
              text: "Spearheaded a \\textbf{React} dashboard with org-level health scores and finding drill-downs, achieving 90\\% Jest test coverage.",
              enabled: true,
              displayOrder: 10,
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
            title: "Software Engineer",
            startDate: "May 2022",
            endDate: "July 2022",
            location: "Pune, India",
          },
          bulletPoints: [
            {
              id: "exp-3-bp-1",
              text: "Engineered \\textbf{Flask} backend services and \\textbf{Angular} PWAs for a B2B rural commerce platform, serving 1M+ customers.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "exp-3-bp-2",
              text: "Developed a \\textbf{Random Forest} Classifier for customer credit scoring, reducing creditworthiness evaluation time by 25\\%.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "exp-3-bp-3",
              text: "Built a \\textbf{Recommendation Engine} using correlation analysis and clustering, increasing product discovery by 30\\%.",
              enabled: true,
              displayOrder: 2,
            },
            {
              id: "exp-3-bp-4",
              text: "Deployed \\textbf{Docker} and \\textbf{Kubernetes} pipelines to enable zero-downtime deployments, cutting release cycle time by 40\\%.",
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
      displayOrder: 2,
      entries: [
        {
          id: "proj-4",
          enabled: true,
          displayOrder: 1,
          data: {
            type: "projects",
            name: "Regulatory Q&A: Multi-Agent Compliance System",
            shortName: "RegGuard",
            techStack: "LangGraph, LangChain, GPT-4o, ChromaDB, React, FastAPI, Docker, LangSmith",
            url: "https://github.com/Priya8975/regulatory-qa",
            startDate: "Jan 2026",
            endDate: "Jan 2026",
          },
          bulletPoints: [
            {
              id: "proj-4-bp-1",
              text: "Designed and deployed a \\textbf{LangGraph multi-agent RAG} system using \\textbf{GPT-4o} and \\textbf{ChromaDB} to answer regulatory compliance questions across 5 financial frameworks, reducing manual research time by 70\\%.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-4-bp-2",
              text: "Engineered a hallucination-detection agent that validates every LLM response against source documents, auto-retrying below 0.7 confidence threshold, achieving 92\\% factual accuracy.",
              enabled: false,
              displayOrder: 1,
            },
            {
              id: "proj-4-bp-3",
              text: "Engineered a ChromaDB-backed hallucination-detection agent with confidence-based auto-retry, achieving 92\\% accuracy.",
              enabled: true,
              displayOrder: 2,
            },
          ],
        },
        {
          id: "proj-1",
          enabled: false,
          displayOrder: 1,
          data: {
            type: "projects",
            name: "Audio Transcription for speech impaired",
            shortName: "ClearVoice",
            techStack: "PyTorch, Hugging Face Transformers, OpenAI Whisper",
            startDate: "May 2024",
            endDate: "Mar 2025",
          },
          bulletPoints: [
            {
              id: "proj-1-bp-1",
              text: "Fine-tuned \\textbf{OpenAI Whisper} with \\textbf{PyTorch} and \\textbf{Hugging Face Transformers} for dysarthric speech recognition, reducing Word Error Rate by 50\\% (general) and 80\\% (personalized models).",
              enabled: true,
              displayOrder: 0,
            },
          ],
        },
        {
          id: "proj-3",
          enabled: false,
          displayOrder: 2,
          data: {
            type: "projects",
            name: "Smart Health Monitoring System",
            shortName: "VitalWatch",
            techStack: "React Native, React.js, Flask, Firebase, MQTT",
            startDate: "Aug 2023",
            endDate: "Jun 2024",
          },
          bulletPoints: [
            {
              id: "proj-3-bp-1",
              text: "Built a real-time health monitoring system using \\textbf{Flask} and \\textbf{React Native} with ML-driven disease prediction, improving early detection accuracy by 15\\%.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-3-bp-2",
              text: "Engineered a real-time health monitoring system utilizing \\textbf{IoT} sensors to capture patient data, achieving a \\textbf{15\\%} improvement in early disease prediction accuracy via machine learning models.",
              enabled: false,
              displayOrder: 1,
            },
            {
              id: "proj-3-bp-3",
              text: "Designed a \\textbf{React Native} mobile application enabling patients to view real-time vitals \\& built a \\textbf{React.js} web portal for doctors to monitor patient health metrics \\& manage profiles.",
              enabled: false,
              displayOrder: 2,
            },
            {
              id: "proj-3-bp-4",
              text: "Published \\underline{{\\hypersetup{urlcolor=black}\\href{https://www.ijraset.com/research-paper/iot-based-health-monitoring-system}{\\textbf{``IoT-Based Health Monitoring System''}}}} in \\textbf{IJRASET}, presenting an IoT sensor framework for \\textbf{ML-driven disease prediction} \\& \\textbf{real-time patient monitoring}.",
              enabled: false,
              displayOrder: 3,
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
            shortName: "CtrlAnywhere",
            techStack: "Java, Android, NodeJS, Electron",
            startDate: "Dec 2024",
            endDate: "Dec 2024",
          },
          bulletPoints: [
            {
              id: "proj-2-bp-1",
              text: "Built an Android app in \\textbf{Java} to remotely control PC mouse/keyboard via touch gestures with a \\textbf{JSON} command protocol, achieving under 50ms response latency.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-2-bp-2",
              text: "Developed a cross-platform \\textbf{Node.js} and \\textbf{Electron} controller with FTP sharing, reducing connection failures by 40\\%.",
              enabled: true,
              displayOrder: 1,
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
            shortName: "RiskMap",
            techStack: "Python, scikit-learn, SARIMA, statsmodels, SHAP, Streamlit",
            url: "https://github.com/Priya8975/climate-risk-insurance",
            startDate: "Nov 2025",
            endDate: "Nov 2025",
          },
          bulletPoints: [
            {
              id: "proj-5-bp-1",
              text: "Engineered an end-to-end \\textbf{Python} data pipeline integrating 1.5M+ flood insurance claims from OpenFEMA, Census ACS and FRED APIs across 3,200 counties.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-5-bp-2",
              text: "Trained \\textbf{Gamma} and \\textbf{Tweedie GLMs} for claim severity modeling, finding each flood event increases payouts by 28\\%.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "proj-5-bp-3",
              text: "Trained a \\textbf{scikit-learn} Gradient Boosting classifier for county-level uninsurability risk, identifying 575 high-risk counties with AUC-ROC = 0.83.",
              enabled: true,
              displayOrder: 2,
            },
            {
              id: "proj-5-bp-4",
              text: "Leveraged \\textbf{SHAP} explainability and \\textbf{SARIMA} forecasting, detecting a 45\\% rise in disaster declarations over 20 years.",
              enabled: true,
              displayOrder: 3,
            },
            {
              id: "proj-5-bp-5",
              text: "Validated model robustness across 16 sensitivity configurations, 10-fold geographic CV and 7-year temporal validation.",
              enabled: true,
              displayOrder: 4,
            },
            {
              id: "proj-5-bp-6",
              text: "Deployed a \\textbf{Streamlit} dashboard with county-level risk rankings, SHAP visualizations and FEMA regional breakdowns.",
              enabled: true,
              displayOrder: 5,
            },
          ],
        },
        {
          id: "proj-6",
          enabled: true,
          displayOrder: 0,
          data: {
            type: "projects",
            name: "Resilient Webhook Delivery System",
            shortName: "HookRelay",
            techStack: "Go, Redis, React, Tailwind, WebSocket, GitHub Actions",
            url: "https://github.com/Priya8975/webhook-delivery-system",
            startDate: "Feb 2026",
            endDate: "Feb 2026",
          },
          bulletPoints: [
            {
              id: "proj-6-bp-1",
              text: "Designed and built a fault-tolerant \\textbf{Go} webhook delivery platform with a 100-goroutine worker pool and \\textbf{Redis} sorted-set job queues, achieving 95 deliveries/sec and 100\\% success rate across 3,000 webhooks.",
              enabled: true,
              displayOrder: 0,
            },
            {
              id: "proj-6-bp-2",
              text: "Engineered per-subscriber \\textbf{circuit breakers} and \\textbf{Redis} sliding-window rate limiters using atomic Lua scripts with exponential backoff retries, delivering at-least-once guarantees to 1,000+ endpoints.",
              enabled: true,
              displayOrder: 1,
            },
            {
              id: "proj-6-bp-3",
              text: "Developed a \\textbf{React + WebSocket} real-time monitoring dashboard with live delivery metrics, validated by 26 tests using Go's race detector in a \\textbf{GitHub Actions CI} pipeline.",
              enabled: true,
              displayOrder: 2,
            },
            {
              id: "proj-6-bp-4",
              text: "Engineered a fault-tolerant webhook delivery platform in \\textbf{Go} that fans out events to \\textbf{1,000+} subscriber endpoints with \\textbf{at-least-once delivery guarantees}, \\textbf{exponential backoff retries} (5 attempts), and a \\textbf{dead letter queue} for permanent failures.",
              enabled: false,
              displayOrder: 3,
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
      displayOrder: 3,
      entries: [
        {
          id: "skills-1",
          enabled: true,
          displayOrder: 0,
          data: {
            type: "skills",
            category: "Programming Languages",
            items: "Python, Go, Java, JavaScript, TypeScript, C++, SQL",
            availableItems: "Python, Go, Java, JavaScript, TypeScript, C++, SQL, HTML, CSS, Bash, C",
          },
          bulletPoints: [],
        },
        {
          id: "skills-2",
          enabled: true,
          displayOrder: 1,
          data: {
            type: "skills",
            category: "Frameworks/Libraries",
            items: "React.js, Angular, Flask, FastAPI, Node.js, Spring Boot, LangChain, LangGraph, PyTorch, Hugging Face Transformers, NumPy, Pandas, Tailwind CSS, WebSocket, JUnit, TensorFlow",
            availableItems: "React.js, Angular, Flask, FastAPI, Node.js, Spring Boot, LangChain, LangGraph, PyTorch, Hugging Face Transformers, NumPy, Pandas, Tailwind CSS, WebSocket, JUnit, TensorFlow, React, scikit-learn, SciPy, OpenAI Whisper, Svelte, React Native, Spring WebFlux, Electron, Streamlit, Django, Flutter",
          },
          bulletPoints: [],
        },
        {
          id: "skills-3",
          enabled: true,
          displayOrder: 2,
          data: {
            type: "skills",
            category: "Databases",
            items: "MongoDB, Redis, PostgreSQL, MySQL, Firebase, ChromaDB",
            availableItems: "MongoDB, Redis, PostgreSQL, MySQL, Firebase, ChromaDB, Firestore, Neo4j, Pinecone",
          },
          bulletPoints: [],
        },
        {
          id: "skills-4",
          enabled: true,
          displayOrder: 3,
          data: {
            type: "skills",
            category: "DevOps/Tools",
            items: "Docker, Kubernetes, Kafka, AWS, Azure, GitHub Actions, GitLab CI, Git, Linux, Grafana, GCP, Cursor, Cline, AmazonQ",
            availableItems: "Docker, Kubernetes, Kafka, AWS, Azure, GitHub Actions, GitLab CI, Git, Linux, Grafana, GCP, Cursor, Cline, AmazonQ, SHAP, Tailwind, Docker Compose, Spark, Hadoop, AWS (S3, EC2, EKS, CloudWatch), Azure (Data Factory, Data Lake Storage, Databricks), Jenkins, SonarQube, Autosys, Android Studio",
          },
          bulletPoints: [],
        },
      ],
    },

    // ─── Extracurriculars ────────────────────────────────────────
    {
      id: "section-achievements",
      type: "achievements",
      title: "Extracurriculars",
      enabled: false,
      displayOrder: 4,
      entries: [
        {
          id: "ach-3",
          enabled: true,
          displayOrder: 0,
          data: {
            type: "achievements",
            description: "Intra-College Smart India Hackathon Winner: Developed a digitized toll collection system.",
          },
          bulletPoints: [],
        },
        {
          id: "ach-1",
          enabled: true,
          displayOrder: 1,
          data: {
            type: "achievements",
            description: "Public Relations Head: Indian Graduate Student Association(IGSA), Stony Brook University.",
          },
          bulletPoints: [],
        },
        {
          id: "ach-2",
          enabled: true,
          displayOrder: 2,
          data: {
            type: "achievements",
            description: "Digital Multimedia Tools Instructor: CSTEP program at Stony Brook University.",
          },
          bulletPoints: [],
        },
      ],
    },
  ],
};

export default sampleResume;
