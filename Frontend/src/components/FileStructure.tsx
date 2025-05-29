
const FileStructure = () => {
  return (
    <div className="file-structure">
      <h2>File Structure</h2>
      <ul>
        <li>src/</li>
        <ul>
          <li>components/</li>
          <ul>
            <li>FileStructure.tsx</li>
            <li>Header.tsx</li>
            <li>Footer.tsx</li>
          </ul>
          <li>App.tsx</li>
          <li>index.tsx</li>
        </ul>
        <li>public/</li>
        <ul>
          <li>index.html</li>
        </ul>
      </ul>
    </div>
  );
}

export default FileStructure;