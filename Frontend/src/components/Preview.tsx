// 
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { WebContainer } from '@webcontainer/api';

// Global WebContainer singleton
let globalWebContainer: WebContainer | null = null;
let isBooting = false;
let bootPromise: Promise<WebContainer> | null = null;

// Common npm packages mapping - maps import names to npm package names and versions
const COMMON_PACKAGES: Record<string, string> = {
  // Icons
  'lucide-react': '^0.300.0',
  'react-icons': '^5.0.0',
  '@heroicons/react': '^2.1.0',
  'phosphor-react': '^1.4.1',
  '@phosphor-icons/react': '^2.0.0',
  
  // UI Libraries
  '@radix-ui/react-icons': '^1.3.0',
  '@radix-ui/react-slot': '^1.0.0',
  '@radix-ui/react-dialog': '^1.0.0',
  '@radix-ui/react-dropdown-menu': '^2.0.0',
  '@radix-ui/react-popover': '^1.0.0',
  '@radix-ui/react-tooltip': '^1.0.0',
  '@radix-ui/react-tabs': '^1.0.0',
  '@radix-ui/react-accordion': '^1.0.0',
  '@radix-ui/react-checkbox': '^1.0.0',
  '@radix-ui/react-select': '^2.0.0',
  '@radix-ui/react-switch': '^1.0.0',
  '@radix-ui/react-label': '^2.0.0',
  '@radix-ui/react-separator': '^1.0.0',
  '@radix-ui/react-avatar': '^1.0.0',
  '@radix-ui/react-progress': '^1.0.0',
  '@radix-ui/react-scroll-area': '^1.0.0',
  '@radix-ui/react-hover-card': '^1.0.0',
  '@radix-ui/react-alert-dialog': '^1.0.0',
  '@radix-ui/react-context-menu': '^2.0.0',
  '@radix-ui/react-menubar': '^1.0.0',
  '@radix-ui/react-navigation-menu': '^1.0.0',
  '@radix-ui/react-slider': '^1.0.0',
  '@radix-ui/react-toast': '^1.0.0',
  '@radix-ui/react-toggle': '^1.0.0',
  '@radix-ui/react-toggle-group': '^1.0.0',
  
  // Animation
  'framer-motion': '^11.0.0',
  '@react-spring/web': '^9.7.0',
  'react-transition-group': '^4.4.5',
  'gsap': '^3.12.0',
  
  // State Management
  'zustand': '^4.5.0',
  'jotai': '^2.6.0',
  'recoil': '^0.7.7',
  '@tanstack/react-query': '^5.0.0',
  'swr': '^2.2.0',
  'redux': '^5.0.0',
  'react-redux': '^9.0.0',
  '@reduxjs/toolkit': '^2.0.0',
  
  // Routing
  'react-router-dom': '^6.21.0',
  '@tanstack/react-router': '^1.0.0',
  'wouter': '^3.0.0',
  
  // Forms
  'react-hook-form': '^7.49.0',
  '@hookform/resolvers': '^3.3.0',
  'formik': '^2.4.5',
  'yup': '^1.3.0',
  'zod': '^3.22.0',
  
  // HTTP
  'axios': '^1.6.0',
  'ky': '^1.2.0',
  
  // Utilities
  'clsx': '^2.1.0',
  'class-variance-authority': '^0.7.0',
  'cva': '^0.0.0',
  'tailwind-merge': '^2.2.0',
  'date-fns': '^3.0.0',
  'dayjs': '^1.11.0',
  'lodash': '^4.17.21',
  'uuid': '^9.0.0',
  'nanoid': '^5.0.0',
  
  // Charts
  'recharts': '^2.10.0',
  'chart.js': '^4.4.0',
  'react-chartjs-2': '^5.2.0',
  '@nivo/core': '^0.84.0',
  '@nivo/bar': '^0.84.0',
  '@nivo/line': '^0.84.0',
  '@nivo/pie': '^0.84.0',
  'victory': '^37.0.0',
  
  // Tables
  '@tanstack/react-table': '^8.11.0',
  
  // Markdown
  'react-markdown': '^9.0.0',
  'marked': '^11.0.0',
  
  // Carousel/Slider
  'swiper': '^11.0.0',
  'embla-carousel-react': '^8.0.0',
  
  // Drag and Drop
  '@dnd-kit/core': '^6.1.0',
  '@dnd-kit/sortable': '^8.0.0',
  'react-beautiful-dnd': '^13.1.1',
  
  // Toast/Notifications
  'react-hot-toast': '^2.4.1',
  'sonner': '^1.3.0',
  'react-toastify': '^10.0.0',
  
  // Modals
  'react-modal': '^3.16.1',
  
  // Date Picker
  'react-datepicker': '^4.25.0',
  'react-day-picker': '^8.10.0',
  
  // Image
  'react-image-crop': '^11.0.0',
  'react-dropzone': '^14.2.0',
  
  // Maps
  'react-map-gl': '^7.1.0',
  '@react-google-maps/api': '^2.19.0',
  'leaflet': '^1.9.4',
  'react-leaflet': '^4.2.1',
  
  // Video
  'react-player': '^2.14.0',
  
  // PDF
  'react-pdf': '^7.7.0',
  '@react-pdf/renderer': '^3.3.0',
  
  // Syntax Highlighting
  'prism-react-renderer': '^2.3.0',
  'react-syntax-highlighter': '^15.5.0',
  'highlight.js': '^11.9.0',
  
  // Copy to Clipboard
  'react-copy-to-clipboard': '^5.1.0',
  
  // Headless UI
  '@headlessui/react': '^1.7.0',
  
  // Other common
  'cmdk': '^0.2.0',
  'vaul': '^0.9.0',
  'input-otp': '^1.0.0',
  'next-themes': '^0.2.0',
  'react-resizable-panels': '^1.0.0',
};

// Function to detect required packages from file contents
const detectRequiredPackages = (files: any[]): Record<string, string> => {
  const detectedPackages: Record<string, string> = {};
  
  files.forEach(file => {
    if (!file.content) return;
    
    // Match import statements: import ... from 'package' or import ... from "package"
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"]([^'"./][^'"]*)['"]/g;
    
    // Match require statements: require('package')
    const requireRegex = /require\s*\(\s*['"]([^'"./][^'"]*)['"]\s*\)/g;
    
    let match;
    
    while ((match = importRegex.exec(file.content)) !== null) {
      const packageName = match[1].split('/')[0].startsWith('@') 
        ? match[1].split('/').slice(0, 2).join('/') 
        : match[1].split('/')[0];
      
      // Skip react and react-dom as they're already included
      if (packageName === 'react' || packageName === 'react-dom') continue;
      
      // Check if we know this package
      const fullPackageName = Object.keys(COMMON_PACKAGES).find(pkg => 
        pkg === packageName || pkg.startsWith(packageName + '/')
      ) || packageName;
      
      if (COMMON_PACKAGES[fullPackageName]) {
        detectedPackages[fullPackageName] = COMMON_PACKAGES[fullPackageName];
      } else if (!packageName.startsWith('.') && !packageName.startsWith('/')) {
        // Unknown package - add with 'latest' version
        detectedPackages[packageName] = 'latest';
      }
    }
    
    while ((match = requireRegex.exec(file.content)) !== null) {
      const packageName = match[1].split('/')[0].startsWith('@') 
        ? match[1].split('/').slice(0, 2).join('/') 
        : match[1].split('/')[0];
      
      if (packageName === 'react' || packageName === 'react-dom') continue;
      
      const fullPackageName = Object.keys(COMMON_PACKAGES).find(pkg => 
        pkg === packageName || pkg.startsWith(packageName + '/')
      ) || packageName;
      
      if (COMMON_PACKAGES[fullPackageName]) {
        detectedPackages[fullPackageName] = COMMON_PACKAGES[fullPackageName];
      } else if (!packageName.startsWith('.') && !packageName.startsWith('/')) {
        detectedPackages[packageName] = 'latest';
      }
    }
  });
  
  return detectedPackages;
};

// Base project files for a React + Vite + Tailwind project
const getBaseProjectFiles = (usesTailwind: boolean, extraDependencies: Record<string, string> = {}) => ({
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: 'vite-react-app',
        private: true,
        version: '0.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          ...(usesTailwind ? { 'tailwindcss': '^4.0.0' } : {}),
          ...extraDependencies
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.2.1',
          'vite': '^5.0.0',
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
          ...(usesTailwind ? { '@tailwindcss/vite': '^4.0.0' } : {})
        }
      }, null, 2)
    }
  },
  'index.html': {
    file: {
      contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
    }
  },
  'vite.config.js': {
    file: {
      contents: usesTailwind 
        ? `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 3000 }
})`
        : `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 3000 }
})`
    }
  },
  'src': {
    directory: {
      'main.tsx': {
        file: {
          contents: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
${usesTailwind ? "import './index.css'" : ''}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`
        }
      },
      ...(usesTailwind ? {
        'index.css': {
          file: {
            contents: `@import "tailwindcss";`
          }
        }
      } : {})
    }
  }
});

const Preview = forwardRef(({ parsedFiles, isProcessing }: { parsedFiles: any[], isProcessing: boolean }, ref) => {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(globalWebContainer);
  const [url, setUrl] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const componentMountedRef = useRef(true);
  const setupHashRef = useRef<string>('');
  const serverReadyListenerRef = useRef(false);

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
      bootPromise.then(container => {
        if (componentMountedRef.current) {
          setWebcontainer(container);
          setIsInitializing(false);
        }
      }).catch(err => {
        if (componentMountedRef.current) {
          setError(`WebContainer initialization failed: ${err.message}`);
          setIsInitializing(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (webcontainer && parsedFiles.length > 0 && !isProcessing) {
      const filesHash = parsedFiles.map(f => f.path).join(',');
      if (filesHash !== setupHashRef.current) {
        console.log('Setting up project with', parsedFiles.length, 'files');
        setupHashRef.current = filesHash;
        setupProject();
      }
    }
  }, [webcontainer, parsedFiles, isProcessing]);

  useImperativeHandle(ref, () => ({
    refreshPreview: () => {
      if (webcontainer) {
        setupHashRef.current = '';
        setupProject();
      }
    }
  }));

  const initWebContainer = async () => {
    if (globalWebContainer) {
      setWebcontainer(globalWebContainer);
      return globalWebContainer;
    }
    
    if (bootPromise) return bootPromise;
    if (isBooting) return null;

    console.log('Starting WebContainer initialization...');
    isBooting = true;
    setIsInitializing(true);

    bootPromise = (async () => {
      try {
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
      } catch (err: any) {
        console.error('Failed to boot WebContainer:', err);
        if (componentMountedRef.current) {
          setError(`WebContainer initialization failed: ${err.message}`);
          setIsInitializing(false);
        }
        throw err;
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
      setInstallProgress('Analyzing project...');
      setError(null);
      setUrl(null);

      if (parsedFiles.length === 0) {
        throw new Error('No files to setup. Make sure the generation was successful.');
      }

      // Detect if Tailwind CSS is being used
      const usesTailwind = parsedFiles.some(file => 
        file.content?.includes('tailwind') || 
        file.content?.includes('className="') ||
        file.content?.includes("className='") ||
        file.content?.includes('className={')
      );
      console.log('Uses Tailwind:', usesTailwind);

      // Detect required packages from imports
      setInstallProgress('Detecting dependencies...');
      const detectedPackages = detectRequiredPackages(parsedFiles);
      console.log('Detected packages:', detectedPackages);

      // Check what essential files we have
      const hasPackageJson = parsedFiles.some(file => file.name === 'package.json' || file.path === '/package.json');
      const hasIndexHtml = parsedFiles.some(file => file.name === 'index.html' || file.path === '/index.html');
      const hasMainTsx = parsedFiles.some(file => 
        file.name === 'main.tsx' || file.path === '/src/main.tsx' || 
        file.name === 'main.jsx' || file.path === '/src/main.jsx'
      );

      console.log('Project analysis:', { hasPackageJson, hasIndexHtml, hasMainTsx });

      setInstallProgress('Setting up project files...');

      // STEP 1: Mount base project structure first (without package.json if user has one)
      if (!hasIndexHtml || !hasMainTsx) {
        console.log('Creating base project structure...');
        // Create base files but we'll handle package.json separately
        const baseFiles = getBaseProjectFiles(usesTailwind, detectedPackages);
        
        // If user has package.json, remove it from base files to avoid conflict
        if (hasPackageJson) {
          delete (baseFiles as any)['package.json'];
        }
        
        await webcontainer.mount(baseFiles);
        console.log('Base project files mounted');
      }

      // STEP 2: Mount user's files (except package.json which we'll handle specially)
      const userFileStructure: any = {};
      let userPackageJson: any = null;
      
      parsedFiles.forEach((file, index) => {
        console.log(`Processing file ${index + 1}:`, file.path);
        
        // Extract user's package.json content for merging later
        if (file.name === 'package.json' || file.path === '/package.json' || file.path === 'package.json') {
          try {
            userPackageJson = JSON.parse(file.content || '{}');
            console.log('Found user package.json:', userPackageJson.name);
          } catch (e) {
            console.log('Failed to parse user package.json:', e);
          }
          return; // Don't add to file structure yet
        }
        
        const pathParts = file.path.replace(/^\//, '').split('/').filter((part: string) => part !== '');
        let current = userFileStructure;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = { directory: {} };
          }
          current = current[pathParts[i]].directory;
        }
        
        const fileName = pathParts[pathParts.length - 1];
        current[fileName] = {
          file: { contents: file.content || '' }
        };
      });

      if (Object.keys(userFileStructure).length > 0) {
        console.log('User file structure to mount:', Object.keys(userFileStructure));
        await webcontainer.mount(userFileStructure);
        console.log('User files mounted successfully');
      }

      // STEP 3: Create or merge package.json with all required dependencies
      const finalPackageJson = {
        name: userPackageJson?.name || 'vite-react-app',
        private: true,
        version: userPackageJson?.version || '0.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
          ...(userPackageJson?.scripts || {})
        },
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          ...(usesTailwind ? { 'tailwindcss': '^4.0.0' } : {}),
          ...detectedPackages,
          ...(userPackageJson?.dependencies || {})
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.2.1',
          'vite': '^5.0.0',
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
          ...(usesTailwind ? { '@tailwindcss/vite': '^4.0.0' } : {}),
          ...(userPackageJson?.devDependencies || {})
        }
      };

      console.log('Final package.json dependencies:', Object.keys(finalPackageJson.dependencies));
      await webcontainer.fs.writeFile('/package.json', JSON.stringify(finalPackageJson, null, 2));

      // STEP 4: Ensure vite.config.js is correct
      const viteConfigContent = usesTailwind 
        ? `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 3000 }
})`
        : `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 3000 }
})`;
      
      await webcontainer.fs.writeFile('/vite.config.js', viteConfigContent);
      console.log('Vite config written');

      // Set up server-ready listener (only once)
      if (!serverReadyListenerRef.current) {
        serverReadyListenerRef.current = true;
        webcontainer.on('server-ready', (port, serverUrl) => {
          console.log('Server ready on port:', port, 'URL:', serverUrl);
          if (componentMountedRef.current) {
            setUrl(serverUrl);
            setIsInstalling(false);
            setInstallProgress('');
          }
        });
      }

      setInstallProgress('Installing dependencies...');
      
      console.log('Starting npm install...');
      const installProcess = await webcontainer.spawn('npm', ['install']);
      
      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log('npm:', data);
        }
      }));
      
      const exitCode = await installProcess.exit;
      console.log('npm install exit code:', exitCode);
      
      if (exitCode !== 0) {
        console.warn('npm install had issues, but continuing...');
      }

      setInstallProgress('Starting development server...');

      console.log('Starting dev server...');
      const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);
      
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log('dev:', data);
        }
      }));

    } catch (err: any) {
      console.error('Error setting up project:', err);
      if (componentMountedRef.current) {
        setIsInstalling(false);
        setError(`Setup failed: ${err.message}`);
        setInstallProgress('');
      }
    }
  };

  const resetWebContainer = () => {
    console.log('Resetting WebContainer...');
    globalWebContainer = null;
    isBooting = false;
    bootPromise = null;
    setupHashRef.current = '';
    serverReadyListenerRef.current = false;
    setWebcontainer(null);
    setUrl(null);
    setError(null);
    setIsInstalling(false);
    setInstallProgress('');
    setIsInitializing(false);
    
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