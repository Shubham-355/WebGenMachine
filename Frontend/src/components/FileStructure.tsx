import { File, Folder } from 'lucide-react';

const FileStructure = ({ files, onFileSelect }: { files: any[], onFileSelect: (file: any) => void }) => {
  if (!files || files.length === 0) {
    return (
      <div className="text-center p-4">
        <h2 className="text-lg font-semibold text-gray-300 mb-2">File Structure</h2>
        <p className="text-gray-500 text-sm">No files generated yet</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-300 mb-4">File Structure</h2>
      <div className="space-y-1">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors"
            onClick={() => onFileSelect(file)}
          >
            <File className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm text-gray-300 truncate">{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileStructure;