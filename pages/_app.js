import '../styles/globals.css'
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import logo from '../public/logo.png';
import React from 'react';
import Link from 'next/link'
import Footer from '../components/Footer';


const NavBarItem = ({ title, classprops }) => (
    <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
  );


  function MyApp({ Component, pageProps }) {
    const [toggleMenu, setToggleMenu] = React.useState(false);

    return (
      <div>
        <nav className="w-full flex md:justify-center justify-between items-center p-4" style={{background:"black"}}>
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <img src={logo} alt="logo" className="w-32 cursor-pointer" />
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                {[
                  <Link href="/">
                    <a className="mr-4 text-white-500">
                      Home
                    </a>
                  </Link>,
                  <Link href="/create-item">
                    <a className="mr-6 text-white-500">
                      Sell Digital Asset
                    </a>
                  </Link>,
                  <Link href="/my-assets">
                    <a className="mr-6 text-white-500">
                      My Digital Assets
                    </a>
                  </Link>,
                  <Link href="/creator-dashboard">
                    <a className="mr-6 text-white-500">
                      Creator Dashboard
                    </a>
                  </Link>
                ].map((item, index) => (
                    <NavBarItem key={item + index} title={item} />
                ))}
                <li className="bg-[#fe8c00] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#e57e00]">
                    <span style={{color:"black", fontWeight:"500"}}>Login</span>
                </li>
            </ul>
            <div className="flex relative">
                {!toggleMenu && (
                <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
                )}
                {toggleMenu && (
                <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
                )}
                {toggleMenu && (
                <ul
                    className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
                    flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
                >
                    {/* blue-glassmorphism color */}
                <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
                {[
                   <Link href="/">
                     <a className="mr-4 text-white-500">
                       Home
                     </a>
                   </Link>,
                   <Link href="/create-item">
                     <a className="mr-6 text-white-500">
                       Sell Digital Asset
                     </a>
                   </Link>,
                   <Link href="/my-assets">
                     <a className="mr-6 text-white-500">
                       My Digital Assets
                     </a>
                   </Link>,
                   <Link href="/creator-dashboard">
                     <a className="mr-6 text-white-500">
                       Creator Dashboard
                     </a>
                   </Link>
                   ].map(
                        (item, index) => <NavBarItem key={item + index} title={item} classprops="my-2 text-lg" />,
                    )}
                </ul>
                )}
            </div>
        </nav>
        <Component {...pageProps} />
        <Footer />
      </div>
    );
}

export default MyApp