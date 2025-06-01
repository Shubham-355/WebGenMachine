// 
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { WebContainer } from '@webcontainer/api';

// Global WebContainer singleton
let globalWebContainer: WebContainer | null = null;
let isBooting = false;
let bootPromise: Promise<WebContainer> | null = null;

const Preview = forwardRef(({ parsedFiles, isProcessing }: { parsedFiles: any[], isProcessing: boolean }, ref) => {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(globalWebContainer);
  const [url, setUrl] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const componentMountedRef = useRef(true);

  useEffect(() => {
    componentMountedRef.current = true;
    return () => {
      componentMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    console.log('Preview mounted, globalWebContainer:', !!globalWebContainer, 'isBooting:', isBooting);
    
    if (globalWebContainer) {
      setWebcontainer(globalWebContainer);
      setIsInitializing(false);
    } else if (!isBooting && !bootPromise) {
      initWebContainer();
    } else if (bootPromise) {
      // Wait for existing boot process
      bootPromise.then(container => {
        if (componentMountedRef.current) {
          setWebcontainer(container);
          setIsInitializing(false);
        }
      }).catch(error => {
        if (componentMountedRef.current) {
          setError(`WebContainer initialization failed: ${error.message}`);
          setIsInitializing(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (webcontainer && parsedFiles.length > 0 && !isProcessing) {
      console.log('Setting up project with', parsedFiles.length, 'files');
      setupProject();
    }
  }, [webcontainer, parsedFiles, isProcessing]);

  useImperativeHandle(ref, () => ({
    refreshPreview: () => {
      if (webcontainer) {
        setupProject();
      }
    }
  }));

  const initWebContainer = async () => {
    if (globalWebContainer) {
      setWebcontainer(globalWebContainer);
      return globalWebContainer;
    }
    
    if (bootPromise) {
      return bootPromise;
    }

    if (isBooting) {
      return null;
    }

    console.log('Starting WebContainer initialization...');
    isBooting = true;
    setIsInitializing(true);

    bootPromise = (async () => {
      try {
        // Check if we're in a secure context
        if (!window.isSecureContext) {
          throw new Error('WebContainer requires HTTPS or localhost');
        }

        console.log('Booting WebContainer...');
        const container = await WebContainer.boot();
        console.log('WebContainer booted successfully');
        
        globalWebContainer = container;
        
        if (componentMountedRef.current) {
          setWebcontainer(container);
          setError(null);
          setIsInitializing(false);
        }
        
        return container;
      } catch (error: any) {
        console.error('Failed to boot WebContainer:', error);
        if (componentMountedRef.current) {
          setError(`WebContainer initialization failed: ${error.message}`);
          setIsInitializing(false);
        }
        throw error;
      } finally {
        isBooting = false;
        bootPromise = null;
      }
    })();

    return bootPromise;
  };

  const setupProject = async () => {
    if (!webcontainer || isInstalling) return;

    console.log('Starting project setup with files:', parsedFiles.length);

    try {
      setIsInstalling(true);
      setInstallProgress('Setting up files...');
      setError(null);

      // Add validation
      if (parsedFiles.length === 0) {
        throw new Error('No files to setup. Make sure the generation was successful.');
      }

      // Convert parsed files to WebContainer file structure
      const fileStructure: any = {};
      
      parsedFiles.forEach((file, index) => {
        console.log(`Processing file ${index + 1}:`, file.path);
        const pathParts = file.path.replace(/^\//, '').split('/').filter((part: string) => part !== '');
        let current = fileStructure;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {
              directory: {}
            };
          }
          current = current[pathParts[i]].directory;
        }
        
        const fileName = pathParts[pathParts.length - 1];
        current[fileName] = {
          file: {
            contents: file.content || ''
          }
        };
      });

      console.log('File structure to mount:', Object.keys(fileStructure));
      await webcontainer.mount(fileStructure);
      console.log('Files mounted successfully');

      // Check what files we have
      const hasPackageJson = parsedFiles.some(file => file.name === 'package.json');
      const hasViteConfig = parsedFiles.some(file => file.name.includes('vite.config'));
      const hasIndexHtml = parsedFiles.some(file => file.name === 'index.html');
      
      console.log('Project analysis:', { hasPackageJson, hasViteConfig, hasIndexHtml });
      
      // Detect if Tailwind CSS is being used
      const usesTailwind = parsedFiles.some(file => 
        file.content?.includes('tailwind') || 
        file.content?.includes('class="') ||
        file.content?.includes('className="')
      );

      console.log('Uses Tailwind:', usesTailwind);

      // Add essential files if missing
      if (hasPackageJson && !hasViteConfig) {
        console.log('Adding vite config...');
        
        let viteConfig;
        if (usesTailwind) {
          // Use Tailwind v4 configuration
          viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true,
    port: 3000
  }
})`;
        } else {
          // Standard React configuration
          viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  }
})`;
        }
        
        await webcontainer.fs.writeFile('/vite.config.js', viteConfig);
      }

      // Add CSS file with Tailwind import if using Tailwind but no CSS file exists
      if (usesTailwind) {
        const hasCssFile = parsedFiles.some(file => 
          file.name.endsWith('.css') || file.path.includes('.css')
        );
        
        if (!hasCssFile) {
          console.log('Adding Tailwind CSS file...');
          const tailwindCss = `@import "tailwindcss";

/* Your custom styles here */`;
          await webcontainer.fs.writeFile('/src/index.css', tailwindCss);
          
          // Update main.tsx to import the CSS if it exists
          const hasMainTsx = parsedFiles.some(file => file.name === 'main.tsx');
          if (hasMainTsx) {
            try {
              const mainContent = await webcontainer.fs.readFile('/src/main.tsx', 'utf-8');
              if (!mainContent.includes('index.css')) {
                const updatedMain = `import './index.css'\n${mainContent}`;
                await webcontainer.fs.writeFile('/src/main.tsx', updatedMain);
              }
            } catch (e) {
              console.log('Could not update main.tsx:', e);
            }
          }
        }
      }

      // Fallback: Add Tailwind via CDN to index.html if no proper setup is detected
      if (usesTailwind && hasIndexHtml) {
        try {
          const indexContent = await webcontainer.fs.readFile('/index.html', 'utf-8');
          if (!indexContent.includes('tailwindcss') && !indexContent.includes('@tailwindcss')) {
            console.log('Adding Tailwind CDN fallback...');
            const updatedIndex = indexContent.replace(
              '</head>',
              '  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>\n  </head>'
            );
            await webcontainer.fs.writeFile('/index.html', updatedIndex);
          }
        } catch (e) {
          console.log('Could not update index.html:', e);
        }
      }

      if (componentMountedRef.current) {
        setInstallProgress('Installing dependencies...');
      }
      
      // Install dependencies
      console.log('Starting npm install...');
      const installProcess = await webcontainer.spawn('npm', ['install']);
      
      // If using Tailwind, install Tailwind CSS v4 packages
      if (usesTailwind) {
        console.log('Installing Tailwind CSS v4...');
        try {
          const tailwindInstall = await webcontainer.spawn('npm', ['install', 'tailwindcss', '@tailwindcss/vite']);
          await tailwindInstall.exit;
        } catch (tailwindError) {
          console.log('Tailwind install failed, falling back to CDN:', tailwindError);
        }
      }
      
      const exitCode = await installProcess.exit;
      console.log('npm install exit code:', exitCode);
      
      if (exitCode !== 0) {
        throw new Error(`Installation failed with exit code ${exitCode}`);
      }

      if (componentMountedRef.current) {
        setInstallProgress('Starting development server...');
      }

      // Set up server-ready listener before starting the server
      webcontainer.on('server-ready', (port, serverUrl) => {
        console.log('Server ready on:', serverUrl);
        if (componentMountedRef.current) {
          setUrl(serverUrl);
          setIsInstalling(false);
          setInstallProgress('');
        }
      });

      // Start dev server
      console.log('Starting dev server...');
      try {
        await webcontainer.spawn('npm', ['run', 'dev']);
      } catch (devError) {
        console.log('npm run dev failed, trying alternatives...');
        await startAlternativeServer();
      }

    } catch (error: any) {
      console.error('Error setting up project:', error);
      if (componentMountedRef.current) {
        setIsInstalling(false);
        setError(`Setup failed: ${error.message}`);
        setInstallProgress('');
      }
    }
  };

  const startAlternativeServer = async () => {
    if (!webcontainer) return;
    
    try {
      console.log('Trying vite directly...');
      await webcontainer.spawn('npx', ['vite', '--host', '--port', '3000']);
    } catch (viteError) {
      console.log('Vite failed, trying serve...');
      await startStaticServer();
    }
  };

  const startStaticServer = async () => {
    if (!webcontainer) return;
    
    try {
      console.log('Trying static server...');
      await webcontainer.spawn('npx', ['serve', '-s', '.', '-l', '3000']);
    } catch (serveError) {
      console.error('All server attempts failed:', serveError);
      if (componentMountedRef.current) {
        setError('Failed to start any development server');
        setIsInstalling(false);
      }
    }
  };

  const resetWebContainer = () => {
    console.log('Resetting WebContainer...');
    // Reset global state
    globalWebContainer = null;
    isBooting = false;
    bootPromise = null;
    setWebcontainer(null);
    setUrl(null);
    setError(null);
    setIsInstalling(false);
    setInstallProgress('');
    setIsInitializing(false);
    
    // Reinitialize
    setTimeout(() => {
      initWebContainer();
    }, 100);
  };

  // Show error state for WebContainer initialization issues
  if (error && error.includes('WebContainer initialization failed')) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-300">Preview Unavailable</h3>
          <p className="text-gray-500 text-sm">{error}</p>
          <div className="text-xs text-gray-600 bg-gray-800 p-3 rounded">
            <p className="font-semibold mb-2">To enable preview:</p>
            <ul className="text-left space-y-1">
              <li>• Make sure you're running on localhost</li>
              <li>• Restart your development server</li>
              <li>• Check browser console for additional errors</li>
            </ul>
          </div>
          <button 
            onClick={resetWebContainer}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mx-auto"></div>
          <h3 className="text-lg font-semibold text-gray-300">Processing Your Request</h3>
          <p className="text-gray-500">Parsing generated code...</p>
        </div>
      </div>
    );
  }

  if (isInitializing || (!webcontainer && !error)) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mx-auto"></div>
          <h3 className="text-lg font-semibold text-gray-300">Initializing WebContainer</h3>
          <p className="text-gray-500">Setting up the preview environment...</p>
          <button 
            onClick={resetWebContainer}
            className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
          >
            Reset & Retry
          </button>
        </div>
      </div>
    );
  }

  if (isInstalling) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-50 mx-auto"></div>
          <h3 className="text-lg font-semibold text-gray-300">Setting Up Your Website</h3>
          <p className="text-gray-500">{installProgress}</p>
          <div className="text-xs text-gray-600 max-w-md">
            This may take a moment while we install dependencies and start the development server...
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 max-w-md mx-auto">
            <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Setup Failed</h3>
          <p className="text-gray-500 text-sm max-w-md">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setupProject();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry Setup
          </button>
        </div>
      </div>
    );
  }

  if (!url && webcontainer) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">WebContainer Ready</h3>
          <p className="text-gray-500">Click to start setting up your project</p>
          <button 
            onClick={() => setupProject()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Start Setup
          </button>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">No Preview Available</h3>
          <p className="text-gray-500">Generate some code first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <iframe
          key={url}
          src={url}
          className="w-full h-full border-none"
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          allow="cross-origin-isolated"
          style={{
            isolation: 'isolate',
            contain: 'layout style paint',
          }}
        />
      </div>
    </div>
  );
});

export default Preview;