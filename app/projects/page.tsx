// app/projects/page.tsx
import { getContentItems } from '@/lib/content';
import { ProjectItem } from '@/lib/types';
import Link from 'next/link';

export default function ProjectsPage() {
  const projects = getContentItems('projects') as ProjectItem[];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'maintained': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <p>Creative experiments and side projects in motion.</p>
      
      <div className="grid gap-6 mt-8">
        {projects.map((project) => (
          <div key={project.slug} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(project.project_type)}</span>
                <div>
                  <h2 className="text-xl font-semibold">
                    <Link href={`/projects/${project.slug}`} className="hover:text-blue-600">
                      {project.title}
                    </Link>
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {project.project_type}
                    </span>
                  </div>
                </div>
              </div>
              <time className="text-sm text-gray-500">
                {new Date(project.date).toLocaleDateString()}
              </time>
            </div>
            
            {project.excerpt && (
              <p className="text-gray-700 mb-4">{project.excerpt}</p>
            )}
            
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm text-gray-500">Tech:</span>
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/projects/${project.slug}`} className="text-blue-600 hover:underline">
                View Project →
              </Link>
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No projects yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
