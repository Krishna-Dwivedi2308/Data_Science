// "use client"
// import { Link, useLocation } from 'react-router-dom';
// export default function Header() {
//   const location = useLocation();
//   const isRootPath = location.pathname === '/';
//   return (
//     <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//         <Link to="/" className="sr-only"></Link>
//         <div className="flex items-center gap-2 ">
//           <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-lg">M</span>
//           </div>
//           <span className="text-xl font-bold">Museify</span>
//         </div>
//       </Link>
//       {isRootPath ? (
//         <nav className="hidden md:flex items-center gap-8">
//           <a href="#features" className="text-muted-foreground hover:text-foreground transition">
//             Features
//           </a>
//           <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">
//             How it Works
//           </a>
//           <a href="#cta" className="text-muted-foreground hover:text-foreground transition">
//             Get Started
//           </a>
//         </nav>) : (null)}
//     </div>
//     </header >
//   )
// }

"use client";
import { get_token_from_local } from "@/utils/handleTokens";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isRootPath = location.pathname === "/";
  const { name } = get_token_from_local();
  return (
    <header className="bg-background/80 border-border fixed top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* FIX 1: The Link component was incorrectly closed and wrapping the main div.
            It should wrap the Logo/Title section and be correctly closed. */}
        <Link to="/" className="flex items-center gap-2">
          {/* Removed the unnecessary <Link to="/" className="sr-only"></Link> */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <span className="text-xl font-bold">Museify</span>
          </div>
        </Link>{" "}
        {/* Correctly closed Link wrapping the logo/title */}
        {isRootPath ? (
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition"
            >
              How it Works
            </a>
            <a href="#cta" className="text-muted-foreground hover:text-foreground transition">
              Get Started
            </a>
          </nav>
        ) : (
          <div className="hidden items-center gap-8 px-4 md:flex">
            {name && (
              <span className="text-muted-foreground hover:text-foreground transition">{name}</span>
            )}
          </div>
        )}
      </div>{" "}
      {/* FIX 2: This is the closing tag for the main content div, 
                   it was positioned incorrectly in the original code. */}
    </header>
  );
}
