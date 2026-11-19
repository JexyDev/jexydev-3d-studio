/**
 * agents.ts
 * Static definitions for all autonomous agents in the JexyDev Studio.
 */

import type { AgentDefinition, AgentId } from '../types/studio';

export const AGENT_DEFINITIONS: Record<AgentId, AgentDefinition> = {
  hermes: {
    id: 'hermes',
    displayName: 'HERMES',
    formalRole: 'Lead Orchestrator & Planner',
    formalDescription:
      'Hermes serves as the central intelligence of the Autonomous Engineering Studio. It decomposes high-level engineering specifications into granular sprint tasks, maintains the global task queue, and routes work to specialized agents via the 9Router protocol. Hermes governs the complete DISCOVER → PLAN → IMPLEMENT → VERIFY → AUDIT → DEPLOY lifecycle, enforcing quality gates and sequencing constraints at every phase boundary.',
    coreStack: ['9Router', 'Task Queue Engine', 'Sprint Planner', 'Quality Gate Controller', 'Pipeline Coordinator'],
    qualityGate:
      'Full lifecycle governance. No task exits Hermes without validated routing metadata, acceptance criteria, and phase assignment.',
    accentColor: '#38BDF8',
    position: [0, 0, 0],
    cameraPosition: [0, 4, 8],
    cameraTarget: [0, 0, 0],
  },

  frontend: {
    id: 'frontend',
    displayName: 'FRONTEND AGENT',
    formalRole: 'Frontend & Mobile Engineer',
    formalDescription:
      'The Frontend Agent is responsible for delivering responsive, performant, and accessible user interfaces across Web and Mobile platforms. It manages React component architectures, state management strategies, cross-platform design system implementation in Flutter, and integration with backend APIs. All UI output is subject to Lighthouse performance audits and accessibility compliance checks.',
    coreStack: ['React 18', 'Next.js', 'TypeScript', 'Flutter', 'Tailwind CSS', 'Zustand', 'React Query'],
    qualityGate:
      'UI snapshot regression suite, Lighthouse performance score ≥ 90, WCAG 2.1 AA accessibility validation, cross-viewport responsiveness check.',
    accentColor: '#10B981',
    position: [-5, 0, -4],
    cameraPosition: [-7, 3, 2],
    cameraTarget: [-5, 0, -4],
  },

  backend: {
    id: 'backend',
    displayName: 'BACKEND AGENT',
    formalRole: 'Backend & Database Engineer',
    formalDescription:
      'The Backend Agent architects and implements scalable REST and GraphQL APIs, designs relational and document database schemas, and enforces authentication, authorization, and data integrity contracts. It manages database migrations, ORM configurations, caching strategies, and queue implementations to support high-throughput production systems.',
    coreStack: ['Laravel 12', 'Node.js 20', 'Express.js', 'PostgreSQL 17', 'Prisma ORM', 'MongoDB', 'Redis'],
    qualityGate:
      'Schema migration dry-run validation, PHPUnit and Jest integration test suites, zero N+1 query policy enforced by Eloquent and Prisma analyzers.',
    accentColor: '#A78BFA',
    position: [5, 0, -4],
    cameraPosition: [7, 3, 2],
    cameraTarget: [5, 0, -4],
  },

  qa: {
    id: 'qa',
    displayName: 'QA / QC AGENT',
    formalRole: 'Quality Assurance & Quality Control Engineer',
    formalDescription:
      'The QA/QC Agent executes comprehensive test suites covering unit, integration, regression, and edge-case scenarios. It performs static code analysis, enforces code style standards, and operates as the mandatory quality gate before any pull request receives merge approval. No code enters production without passing the QA/QC Agent\'s full validation matrix.',
    coreStack: ['PHPUnit', 'Pest', 'Jest', 'Vitest', 'ESLint', 'PHP CS Fixer', 'Pint', 'CodeQL'],
    qualityGate:
      'Zero merge policy without passing test matrix. Mandatory test coverage floor enforced. Static analysis must report zero critical findings.',
    accentColor: '#FCD34D',
    position: [-5, 0, 4],
    cameraPosition: [-7, 3, 8],
    cameraTarget: [-5, 0, 4],
  },

  devops: {
    id: 'devops',
    displayName: 'DEVOPS & DOCS AGENT',
    formalRole: 'DevOps Engineer & Technical Documentation Specialist',
    formalDescription:
      'The DevOps & Docs Agent maintains containerized infrastructure, CI/CD pipelines, and staging-to-production deployment automation. It also authors and maintains formal documentation artifacts including Product Requirements Documents (PRD), Software Requirements Specifications (SRS), Software Design Documents (SDD), and OpenAPI specifications, ensuring all systems are both operationally sound and comprehensively documented.',
    coreStack: ['Docker', 'Podman', 'GitHub Actions', 'Nginx', 'Supervisor', 'OpenAPI 3.x', 'Markdown'],
    qualityGate:
      'CI pipeline green-gate required before all deployments. Documentation artifacts validated against ISO/IEC 12207 standards prior to release.',
    accentColor: '#F9A8D4',
    position: [5, 0, 4],
    cameraPosition: [7, 3, 8],
    cameraTarget: [5, 0, 4],
  },
};

export const AGENT_IDS: AgentId[] = ['hermes', 'frontend', 'backend', 'qa', 'devops'];
