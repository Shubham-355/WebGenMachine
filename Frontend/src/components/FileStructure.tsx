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
    const root: { [key: string]: FileNode } = {};
    
    // First, create the basic project structure
    const createFolder = (path: string, name: string) => {
      if (!root[name]) {
        root[name] = {
          name: name,
          type: 'folder',
          path: path,
          children: {}
        };
      }
    };

    // Create default folders
    createFolder('src', 'src');
    createFolder('src/components', 'components');
    createFolder('src/pages', 'pages');
    createFolder('src/styles', 'styles');
    createFolder('src/utils', 'utils');
    createFolder('src/hooks', 'hooks');
    createFolder('src/assets', 'assets');
    createFolder('public', 'public');
    
    files.forEach(file => {
      // Clean and normalize the file path
      let normalizedPath = file.name || file.path || '';
      
      // Remove leading slashes and backslashes
      normalizedPath = normalizedPath.replace(/^[\/\\]+/, '');
      
      // Convert backslashes to forward slashes
      normalizedPath = normalizedPath.replace(/\\/g, '/');
      
      // Remove duplicate slashes
      normalizedPath = normalizedPath.replace(/\/+/g, '/');
      
      // If the file doesn't have a path structure, organize it by file type
      if (!normalizedPath.includes('/')) {
        const ext = normalizedPath.split('.').pop()?.toLowerCase();
        
        // Organize files into appropriate folders based on extension
        if (['tsx', 'jsx'].includes(ext || '')) {
          normalizedPath = `src/components/${normalizedPath}`;
        } else if (['ts', 'js'].includes(ext || '') && !normalizedPath.includes('config')) {
          normalizedPath = `src/utils/${normalizedPath}`;
        } else if (['css', 'scss', 'sass'].includes(ext || '')) {
          normalizedPath = `src/styles/${normalizedPath}`;
        } else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'].includes(ext || '')) {
          normalizedPath = `src/assets/${normalizedPath}`;
        } else if (['html'].includes(ext || '')) {
          normalizedPath = `public/${normalizedPath}`;
        } else {
          normalizedPath = `src/${normalizedPath}`;
        }
      }
      
      // Split path into parts and filter out empty strings
      const parts = normalizedPath.split('/').filter(part => part.trim() !== '');
      
      if (parts.length === 0) return; // Skip invalid paths
      
      let currentPath = '';
      let currentLevel = root;
      
      parts.forEach((part, index) => {
        // Build the current path
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isFile = index === parts.length - 1;
        
        // Create node if it doesn't exist
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            type: isFile ? 'file' : 'folder',
            path: currentPath,
            children: isFile ? undefined : {},
            file: isFile ? file : undefined
          };
        }
        
        // Move deeper into the structure for folders
        if (!isFile && currentLevel[part].children) {
          currentLevel = currentLevel[part].children as { [key: string]: FileNode };
        }
      });
    });

    // Remove empty folders
    const removeEmptyFolders = (nodeObj: { [key: string]: FileNode }): { [key: string]: FileNode } => {
      const result: { [key: string]: FileNode } = {};
      
      Object.entries(nodeObj).forEach(([key, node]) => {
        if (node.type === 'file') {
          result[key] = node;
        } else if (node.children) {
          const cleanedChildren = removeEmptyFolders(node.children as { [key: string]: FileNode });
          if (Object.keys(cleanedChildren).length > 0) {
            result[key] = {
              ...node,
              children: cleanedChildren
            };
          }
        }
      });
      
      return result;
    };

    const cleanedRoot = removeEmptyFolders(root);

    // Convert nested object structure to array structure
    const convertToArray = (nodeObj: { [key: string]: FileNode }): FileNode[] => {
      return Object.values(nodeObj).map(node => ({
        ...node,
        children: node.children ? convertToArray(node.children as { [key: string]: FileNode }) : undefined
      })).sort((a, b) => {
        // First sort by type (folders before files)
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        
        // Then sort alphabetically, but prioritize common folders
        const folderPriority: { [key: string]: number } = {
          'src': 1,
          'public': 2,
          'components': 3,
          'pages': 4,
          'styles': 5,
          'assets': 6,
          'utils': 7,
          'hooks': 8,
          'lib': 9,
          'types': 10,
          'config': 11
        };
        
        if (a.type === 'folder' && b.type === 'folder') {
          const aPriority = folderPriority[a.name.toLowerCase()] || 999;
          const bPriority = folderPriority[b.name.toLowerCase()] || 999;
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }
        }
        
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      });
    };

    return convertToArray(cleanedRoot);
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
    const paddingLeft = depth * 16; // Reduced for better spacing

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