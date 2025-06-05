import { File, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  file?: any;
}

const FileStructure = ({ files, onFileSelect }: { files: any[], onFileSelect: (file: any) => void }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'components', 'pages', 'styles', 'assets', 'utils', 'hooks']));

  if (!files || files.length === 0) {
    return (
      <div className="h-full">
        <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
          <Folder className="w-5 h-5 mr-2 text-blue-400" />
          Explorer
        </h2>
        <div className="text-center py-8">
          <Folder className="w-12 h-12 mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">No files generated yet</p>
        </div>
      </div>
    );
  }

  const buildFileTree = (files: any[]): FileNode[] => {
    const folderMap = new Map<string, FileNode>();
    const rootNodes: FileNode[] = [];

    // Process each file
    files.forEach(file => {
      let normalizedPath = file.name || file.path || '';
      normalizedPath = normalizedPath.replace(/^[\/\\]+/, '').replace(/\\/g, '/').replace(/\/+/g, '/');
      
      // Smart categorization for files without folder structure
      if (!normalizedPath.includes('/')) {
        const fileName = normalizedPath.toLowerCase();
        const ext = normalizedPath.split('.').pop()?.toLowerCase();
        
        // Keep certain files at root level
        const rootLevelFiles = [
          'package.json', 'package-lock.json', 'yarn.lock',
          'readme.md', 'readme.txt', 'license', 'license.md',
          'gitignore', '.gitignore', '.env', '.env.local',
          'dockerfile', 'docker-compose.yml', 'docker-compose.yaml',
          'tsconfig.json', 'jsconfig.json', 'webpack.config.js',
          'vite.config.js', 'vite.config.ts', 'next.config.js',
          'tailwind.config.js', 'tailwind.config.ts',
          'eslint.config.js', '.eslintrc.js', '.eslintrc.json',
          'prettier.config.js', '.prettierrc'
        ];
        
        if (rootLevelFiles.some(rootFile => fileName.includes(rootFile.toLowerCase()))) {
          // Keep at root level
        } else if (['tsx', 'jsx'].includes(ext || '')) {
          normalizedPath = `src/components/${normalizedPath}`;
        } else if (['ts', 'js'].includes(ext || '') && !fileName.includes('config')) {
          normalizedPath = `src/utils/${normalizedPath}`;
        } else if (['css', 'scss', 'sass'].includes(ext || '')) {
          normalizedPath = `src/styles/${normalizedPath}`;
        } else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'].includes(ext || '')) {
          normalizedPath = `src/assets/${normalizedPath}`;
        } else if (['html'].includes(ext || '')) {
          normalizedPath = `public/${normalizedPath}`;
        }
        // Note: removed the fallback that put everything in src/
      }

      const parts = normalizedPath.split('/').filter((part: string) => part.trim() !== '');
      
      // Create folder structure
      let currentPath = '';
      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
        
        if (!folderMap.has(currentPath)) {
          const folderNode: FileNode = {
            name: folderName,
            type: 'folder',
            path: currentPath,
            children: []
          };
          folderMap.set(currentPath, folderNode);
          
          // Add to parent or root
          if (parentPath && folderMap.has(parentPath)) {
            folderMap.get(parentPath)!.children!.push(folderNode);
          } else if (!parentPath) {
            rootNodes.push(folderNode);
          }
        }
      }
      
      // Create file node
      const fileName = parts[parts.length - 1];
      const fileNode: FileNode = {
        name: fileName,
        type: 'file',
        path: normalizedPath,
        file: file
      };
      
      // Add file to appropriate parent
      if (parts.length === 1) {
        rootNodes.push(fileNode);
      } else {
        const parentFolderPath = parts.slice(0, -1).join('/');
        const parentFolder = folderMap.get(parentFolderPath);
        if (parentFolder && parentFolder.children) {
          parentFolder.children.push(fileNode);
        }
      }
    });

    // Sort function
    const sortNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.sort((a, b) => {
        // Folders first, then files
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      }).map(node => {
        if (node.type === 'folder' && node.children) {
          node.children = sortNodes(node.children);
        }
        return node;
      });
    };

    return sortNodes(rootNodes);
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const FileTreeNode = ({ node, depth = 0 }: { node: FileNode; depth?: number }) => {
    const isExpanded = expandedFolders.has(node.path);

    const getFileIcon = (fileName: string) => {
      const ext = fileName.split('.').pop()?.toLowerCase();
      const iconColor = {
        'tsx': 'text-blue-400',
        'ts': 'text-blue-500',
        'jsx': 'text-cyan-400',
        'js': 'text-yellow-400',
        'css': 'text-pink-400',
        'scss': 'text-pink-500',
        'html': 'text-orange-400',
        'json': 'text-green-400',
        'md': 'text-gray-400',
        'txt': 'text-gray-400',
        'svg': 'text-purple-400',
        'png': 'text-green-500',
        'jpg': 'text-green-500',
        'jpeg': 'text-green-500',
        'gif': 'text-green-500',
        'ico': 'text-blue-300'
      }[ext || ''] || 'text-gray-400';
      
      return iconColor;
    };

    return (
      <div>
        <div
          className={`flex items-center py-1 cursor-pointer transition-all duration-200 group hover:bg-gray-800/50 rounded ${
            node.type === 'file' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-700/50'
          }`}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else if (node.file) {
              onFileSelect(node.file);
            }
          }}
        >
          {/* Expand/Collapse Icon for folders */}
          {node.type === 'folder' && (
            <span className="w-4 h-4 mr-1 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-300 transition-colors" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-300 transition-colors" />
              )}
            </span>
          )}
          
          {/* File/Folder Icon */}
          {node.type === 'folder' ? (
            <div className="flex items-center">
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 mr-2 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 mr-2 text-blue-400" />
              )}
            </div>
          ) : (
            <div className="flex items-center" style={{ marginLeft: '16px' }}>
              <File className={`w-4 h-4 mr-2 ${getFileIcon(node.name)}`} />
            </div>
          )}
          
          {/* File/Folder Name */}
          <span className={`text-sm truncate select-none flex-1 ${
            node.type === 'folder' 
              ? 'text-gray-200 font-medium' 
              : 'text-gray-300'
          } group-hover:text-white transition-colors`}>
            {node.name}
          </span>
        </div>
        
        {/* Children */}
        {node.type === 'folder' && isExpanded && node.children && node.children.length > 0 && (
          <div>
            {node.children.map((child, index) => (
              <FileTreeNode key={`${child.path}-${index}`} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const fileTree = buildFileTree(files);

  return (
    <div className="rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-200 flex items-center">
          <Folder className="w-5 h-5 mr-2 text-blue-400" />
          Explorer
        </h2>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-0.5">
          {fileTree.map((node, index) => (
            <FileTreeNode key={`${node.path}-${index}`} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FileStructure;