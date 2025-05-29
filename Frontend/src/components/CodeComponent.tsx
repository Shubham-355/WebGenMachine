

const CodeComponent = () => {
  return (
    <div className="code-container">
      <h2 className="text-xl font-semibold mb-4">Code View</h2>
      <div className="code-content bg-gray-900 text-gray-100 p-4 rounded-md font-mono">
        <pre>
          {`// Example generated code
function App() {
  return (
    <div className="app">
      <header>
        <h1>Generated Web Application</h1>
      </header>
      <main>
        <p>Content goes here...</p>
      </main>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
};

export default CodeComponent;