// app/projects/page.tsx
import { getContentItems } from '@/lib/content';
import { ProjectItem } from '@/lib/types';
import Link from 'next/link';

export default function ProjectsPage() {
  const projects = getContentItems('projects') as ProjectItem[];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'maintained': return 'status-maintained';
      case 'idea': return 'status-idea';
      default: return 'status-default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interactive': return '🎮';
      case 'visualization': return '📊';
      case 'archive': return '📝';
      case 'tool': return '🛠️';
      default: return '💡';
    }
  };

  return (
    <div className="content-section">
      <h1>Projects</h1>
      <p className="intro-text">Creative experiments and side projects in motion.</p>
      
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.slug} className="project-card">
            <div className="project-header">
              <div className="project-info">
                <div className="project-details">
                  <h2 className="project-title">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h2>
                  <div className="project-meta">
                    <span className={`project-status ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                    <span className="project-type">
                      {project.project_type}
                    </span>
                  </div>
                </div>
              </div>
              <time className="project-date">
                {new Date(project.date).toLocaleDateString()}
              </time>
            </div>
            
            {project.excerpt && (
              <p className="project-excerpt">{project.excerpt}</p>
            )}
            
            {project.tags && project.tags.length > 0 && (
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="project-tech">
                <span className="tech-label">Tech:</span>
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            
            <div className="project-links">
              <Link href={`/projects/${project.slug}`} className="project-link">
                View project →
              </Link>
              {project.demo_url && project.demo_url !== `/projects/${project.slug}` && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="project-link demo-link">
                  Live demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-link github-link">
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="projects-empty">
          <p>No projects yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
