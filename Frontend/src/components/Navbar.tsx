import { Github } from 'lucide-react';
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import { useLoad } from '../state/LoadContext';

const Navbar = () => {
    const { isLoaded } = useLoad();
    
  return (
    <div className="relative backdrop">
      <nav className="flex justify-between items-center bg-black p-4">
        <div></div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
            WebGenMachine
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <a 
            href="https://github.com/Shubham-355/WebGenMachine"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-2 rounded-lg bg-black/60 border border-gray-700/70 hover:border-gray-600/80 transition-all duration-300 hover:bg-gray-900/60"
            aria-label="View source on GitHub"
          >
            <Github className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
          </a>
        </div>
      </nav>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: "2px" }}>
        {isLoaded ? (
            <div className='w-full border border-gray-800' />
        ) : (<HoverBorderGradient
          containerClassName="w-full rounded-none border-none"
          className="h-px p-0 bg-transparent"
          as="div"
        >
          <div className="w-full h-full"></div>
        </HoverBorderGradient>)
        }
        
      </div>
    </div>
  );
}

export default Navbar;