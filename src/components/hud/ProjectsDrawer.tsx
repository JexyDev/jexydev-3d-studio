/**
 * ProjectsDrawer.tsx
 * Executive drawer showing BERSEKA, Bogor Tolo, and Bitanic production system cards
 * with architecture highlights and links.
 */

import { PROJECTS } from '../../data/projects';
import type { ProjectCard } from '../../types/studio';

interface ProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectsDrawer({ isOpen, onClose }: ProjectsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="relative ml-auto w-full max-w-md h-full hud-panel border-l border-slate-800 flex flex-col slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="font-mono text-sm font-bold text-cyan-400 tracking-widest">
              FEATURED PRODUCTION SYSTEMS
            </h2>
            <p className="font-mono text-xs text-slate-500 mt-0.5">
              Jeremy Darrell Andreas — JexyDev Portfolio
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 transition-colors font-mono text-sm"
          >
            ✕
          </button>
        </div>

        {/* Projects list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {PROJECTS.map((project) => (
            <ProjectCardView key={project.id} project={project} />
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-800">
          <a
            href="https://github.com/JexyDev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full font-mono text-xs py-2.5 px-4 rounded border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition-all"
          >
            VIEW ALL REPOSITORIES ON GITHUB →
          </a>
        </div>
      </aside>
    </div>
  );
}

function ProjectCardView({ project }: { project: ProjectCard }) {
  return (
    <article
      className="rounded border bg-slate-900/80 overflow-hidden"
      style={{ borderColor: project.accentColor + '33' }}
    >
      {/* Card header */}
      <div
        className="px-4 py-3 border-b"
        style={{
          borderColor: project.accentColor + '22',
          borderLeftWidth: 3,
          borderLeftColor: project.accentColor,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3
              className="font-mono text-sm font-bold tracking-widest"
              style={{ color: project.accentColor }}
            >
              {project.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {project.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Domain description */}
      <div className="px-4 py-3 border-b border-slate-800">
        <p className="text-xs text-slate-500 leading-relaxed">{project.domain}</p>
      </div>

      {/* Metrics */}
      <div className="px-4 py-3 border-b border-slate-800">
        <p className="font-mono text-xs text-slate-600 mb-2 tracking-wider">KEY METRICS</p>
        <div className="space-y-1">
          {project.metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-slate-500 shrink-0">{m.label}</span>
              <span
                className="font-mono text-xs font-bold text-right"
                style={{
                  color: m.value.includes('PENDING') ? '#64748B' : project.accentColor,
                  fontStyle: m.value.includes('PENDING') ? 'italic' : 'normal',
                }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="px-4 py-3 border-b border-slate-800">
        <p className="font-mono text-xs text-slate-600 mb-2 tracking-wider">TECH STACK</p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs px-1.5 py-0.5 rounded border border-slate-700 text-slate-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="px-4 py-3 flex items-center gap-3">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs px-3 py-1.5 rounded border border-slate-700 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-all"
        >
          GITHUB →
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs px-3 py-1.5 rounded border hover:opacity-80 transition-all"
            style={{
              borderColor: project.accentColor + '66',
              color: project.accentColor,
              background: project.accentColor + '15',
            }}
          >
            LIVE →
          </a>
        )}
      </div>
    </article>
  );
}
