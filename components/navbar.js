import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";

const Navbar = () => {
  const navigation = [
    { label: "Home", url: "/" },
    { label: "Catalogue", url: "/catalogo" },
    { label: "Book Your Visit", url: "/reservation" },
    { label: "About", url: "/conoce" },  
  ];

  return (
    <Disclosure as="header" className="sticky top-0 z-50 bg-white shadow-md">
      {({ open }) => (
        <>
          <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/img/logo.svg"
                alt="Yachay Tech Museum Logo"
                width={40}
                height={40}
                className="hidden md:block"
              />
              <span className="text-xl font-semibold text-gray-800">Yachay Tech Museum</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-6 items-center">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className="text-gray-700 hover:text-purple-500 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/virtual-visit"
                className="px-4 py-2 bg-blue-200 text-gray-800 rounded-full hover:bg-purple-300 transition-colors duration-300 flex items-center"
              >
                Virtual Visit
                <span className="ml-2 text-sm">(Coming Soon)</span>
              </Link>
              <ThemeChanger />
            </div>

            {/* Mobile Menu Button */}
            <Disclosure.Button className="lg:hidden text-gray-700 hover:text-purple-500 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {open ? (
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                </svg>
              )}
            </Disclosure.Button>
          </nav>

          {/* Mobile Menu Panel */}
          <Disclosure.Panel className="lg:hidden bg-white shadow-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-purple-100 hover:text-purple-600 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/virtual-visit"
                className="block px-4 py-2 mt-2 bg-blue-200 text-gray-800 rounded-full text-center hover:bg-purple-300 transition-colors duration-300 flex justify-center"
              >
                Virtual Visit
                <span className="ml-2 text-sm">(Coming Soon)</span>
              </Link>
              <div className="mt-4 px-4">
                <ThemeChanger />
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;