import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";

const Navbar = () => {
  const navigation = [
    { label: "Home", url: "/" },
    { label: "Catalogue", url: "/catalogo" },
    { label: "Book Your visit", url: "/reservation" },
    { label: "About", url: "/conoce" },  
  ];

  return (
    <div className="w-full bg-blue-400">
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-0">
        {/* Logo  */}
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
                <Link href="/">
                  <span className="flex items-center space-x-2 text-2xl font-medium text-black-500 dark:text-black-100">
                    <span>
                      <Image
                        src="/img/logo.svg"
                        alt="N"
                        width="32"
                        height="32"
                        className="w-11"
                      />
                    </span>
                    <span>Yachay Tech Museum</span>
                  </span>
                </Link>

                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="px-2 py-1 ml-auto text-black-500 rounded-md lg:hidden hover:text-black-500 focus:text-black-500 focus:bg-black-100 focus:outline-none dark:text-black-300 dark:focus:bg-trueGray-700">
                  <svg
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    {open && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    )}
                    {!open && (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="flex flex-wrap w-full my-5 lg:hidden">
                  <ul className="w-full">
                    {navigation.map((item, index) => (
                      <li key={index} className="w-full px-4 py-2 -ml-4">
                        <Link href={item.url}>
                          <span className="text-black-500 rounded-md dark:text-black-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none">
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                    <li className="w-full px-6 py-2 mt-3 text-center">
                      <Link href="/">
                        <span className="text-white bg-black-200 rounded-md lg:ml-5">
                          Get Started
                        </span>
                      </Link>
                    </li>
                  </ul>
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>

        {/* menu  */}
        <div className="hidden text-center lg:flex lg:items-center">
          <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
            {navigation.map((menu, index) => (
              <li className="mr-3 nav__item" key={index}>
                <Link href={menu.url}>
                  <span className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                    {menu.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden mr-3 space-x-4 lg:flex nav__item">
          <Link href="/">
            <span className="px-6 py-2 text-white bg-indigo-600 rounded-md md:ml-5">
              Virtual Visit 
              (coming soon)
            </span>
          </Link>
          <ThemeChanger />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
