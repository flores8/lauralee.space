import { getContentItems, getContentItemBySlug, getRelatedContent } from '@/lib/content';
import { ProjectItem } from '@/lib/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  const projects = getContentItems('projects') as ProjectItem[];
  
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectPage({ params }: Props) {
  const project = getContentItemBySlug('projects', params.slug);
  
  if (!project) {
    notFound();
  }
  
  const projectData = project as ProjectItem & { content: string };
  const relatedContent = getRelatedContent(projectData);
  
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
      <div className="mb-6">
        <Link href="/projects" className="text-blue-600 hover:underline text-sm">
          ← Back to Projects
        </Link>
      </div>
      
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{getTypeIcon(projectData.project_type)}</span>
          <h1 className="text-3xl font-bold">{projectData.title}</h1>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(projectData.status)}`}>
            {projectData.status.replace('-', ' ')}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {projectData.project_type}
          </span>
          <time className="text-sm text-gray-500">
            {new Date(projectData.date).toLocaleDateString()}
          </time>
        </div>
        
        {projectData.excerpt && (
          <p className="text-lg text-gray-700 mb-6">{projectData.excerpt}</p>
        )}
        
        <div className="flex items-center gap-4 mb-6">
          {projectData.demo_url && (
            <a 
              href={projectData.demo_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Live Demo
            </a>
          )}
          {projectData.github_url && (
            <a 
              href={projectData.github_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </header>

      <div className="prose prose-lg max-w-none mb-8">
        <MDXRemote source={projectData.content} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projectData.tech_stack && projectData.tech_stack.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {projectData.tech_stack.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {projectData.tags && projectData.tags.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {projectData.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {relatedContent.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6">Related Content</h3>
          <div className="grid gap-4">
            {relatedContent.map((item) => (
              <div key={item.slug} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      <Link href={`/${item.type}/${item.slug}`} className="hover:text-blue-600">
                        {item.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-500 capitalize mt-1">{item.type}</p>
                  </div>
                  <time className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </time>
                </div>
                {item.excerpt && (
                  <p className="text-sm text-gray-700 mt-2">{item.excerpt}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
