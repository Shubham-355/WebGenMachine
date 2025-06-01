import { Github } from 'lucide-react';
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import { useLoad } from '../state/LoadContext';

const Navbar = () => {
    const { isLoaded } = useLoad();
  return (
    <div className="relative backdrop">
      <nav className="flex justify-between text-center bg-black p-4">
        <div className="container mx-auto"></div> 
        <div className="container mx-auto">WebGenMachine</div>
        <div className="container mx-auto flex justify-end items-center"><Github /></div>
      </nav>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: "2px" }}>
        {isLoaded ? (
            <div className='w-full border border-gray-600' />
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