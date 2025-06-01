import { Editor } from '@monaco-editor/react';

const CodeComponent = ({ selectedFile }: { selectedFile: any }) => {
  const getLanguage = (filename: string) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts':
        return 'typescript';
      case 'jsx':
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      default:
        return 'javascript';
    }
  };

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No File Selected</h3>
          <p className="text-gray-500">Select a file from the file structure to view its code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-1 border-b border-gray-700">
        <span className="text-xs text-gray-500">{selectedFile.path}</span>
      </div>
      
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguage(selectedFile.name)}
          value={selectedFile.content || '// No content available'}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
};

export default CodeComponent;