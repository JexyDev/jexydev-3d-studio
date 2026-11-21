/**
 * projects.ts
 * Production system definitions for the JexyDev Portfolio.
 *
 * Metrics marked [VERIFIED_METRIC_PENDING] are awaiting direct extraction
 * from the respective codebases. All other values are forensically verified.
 */

import type { ProjectCard } from '../types/studio';

export const PROJECTS: ProjectCard[] = [
  {
    id: 'berseka',
    name: 'BERSEKA',
    tagline: 'Pilah Sampah Cerdas — Intelligent Waste Classification & Community Environmental Management',
    domain:
      'Smart city waste management platform integrated with university KKN Tematik programs and AI-powered Computer Vision waste classification for Kelurahan/RW-level environmental governance in Kota Bandung.',
    techStack: [
      'Node.js 20',
      'Express.js',
      'TypeScript',
      'Prisma ORM',
      'PostgreSQL 15',
      'React 18',
      'Vite',
      'Redis',
      'Docker',
      'GitHub Actions',
      'Computer Vision AI',
    ],
    metrics: [
      { label: 'Prisma ORM Models', value: '83' },
      { label: 'PostgreSQL Columns', value: '951+' },
      { label: 'API Endpoints', value: '659' },
      { label: 'Core Git Commits', value: '3,333 (Main) / 4,119 (Total)' },
      { label: 'Lines of Code', value: '302,189' },
      { label: 'Live URL', value: 'berseka.id' },
      { label: 'Architecture', value: 'TypeScript Monorepo (NPM Workspaces)' },
    ],
    accentColor: '#10B981',
    githubUrl: 'https://github.com/JexyDev/Pilah-Sampah-Cerdas',
    liveUrl: 'https://berseka.id',
  },
  {
    id: 'bitanic',
    name: 'BITANIC',
    tagline: 'Smart Precision Agriculture LMS & IoT Workstation for ATPH 4.0 Vocational Education',
    domain:
      'An integrated Learning Management System for vocational agriculture curriculum (ATPH 4.0), directly connected to a fleet of IoT Trainer Kit workstations. Reads 7-in-1 soil sensor data via Modbus RS485 RTU and controls actuator relays with precision. Features collision-free lab scheduling, digital practicum report submission, 4-scale rubric grading, and strict multi-tenant isolation.',
    techStack: [
      'Laravel 12',
      'PHP 8.2+',
      'PostgreSQL 17',
      'Tailwind CSS v4',
      'Vite',
      'PHPUnit',
      'Docker',
      'GitHub Actions',
      'Modbus RS485 RTU',
    ],
    metrics: [
      { label: 'Eloquent Models', value: '37' },
      { label: 'Database Migrations', value: '41' },
      { label: 'IoT Protocol', value: 'Modbus RS485 RTU' },
      { label: 'Sensor Parameters', value: '7-in-1 (pH, EC, Moisture, Temp, N, P, K)' },
      { label: 'Actuator Relays', value: '4 (Irrigation, Mist, Nutrient A & B)' },
      { label: 'Multi-Tenancy', value: 'Zero-IDOR enforced at query layer' },
    ],
    accentColor: '#38BDF8',
    githubUrl: 'https://github.com/JexyDev/Bitanic',
    liveUrl: null,
  },
  {
    id: 'bogor-tolo',
    name: 'BOGOR TOLO',
    tagline: 'Digital Marketplace for Local Merchants & SMEs in Bogor, West Java',
    domain:
      'A Flutter-powered digital marketplace enabling local merchants and small-to-medium enterprises in Bogor to establish online storefronts, manage product catalogues, process orders, and reach customers across the region. Features a Laravel REST API backend with an administrative management portal.',
    techStack: ['Flutter', 'Dart', 'Laravel', 'PHP', 'MySQL', 'REST API'],
    metrics: [
      { label: 'Client Platforms', value: 'iOS & Android (Flutter)' },
      { label: 'Backend', value: 'Laravel REST API + Admin Portal' },
      { label: 'Target Market', value: 'Local Merchants & SMEs, Bogor, West Java' },
      { label: 'API Routes', value: '[VERIFIED_METRIC_PENDING]' },
      { label: 'Models', value: '[VERIFIED_METRIC_PENDING]' },
    ],
    accentColor: '#A78BFA',
    githubUrl: 'https://github.com/JexyDev',
    liveUrl: null,
  },
];
