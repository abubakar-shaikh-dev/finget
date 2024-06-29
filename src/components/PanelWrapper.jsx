import { Fragment, useState, useRef } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SiWebmoney } from "react-icons/si";
import { Modal } from "antd";

export default function PanelWrapper({ children }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  const toogleRef = useRef(null);

  const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl: "profile.png",
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      current: location.pathname === "/dashboard",
    },
    {
      name: "Transactions",
      href: "/transactions",
      current: location.pathname === "/transactions",
    },
    {
      name: "Accounts",
      href: "/accounts",
      current: location.pathname === "/accounts",
    },
    {
      name: "Categories",
      href: "/categories",
      current: location.pathname === "/categories",
    },
    {
      name: "Settings",
      href: "/settings",
      current: location.pathname === "/settings",
    },
  ];

  const userNavigation = [
    { name: "Settings", href: "/settings" },
    { name: "Log out", href: "#" },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Modal
        title="Attention Required !"
        open={logoutModal}
        onCancel={() => setLogoutModal(!logoutModal)}
        onOk={async () => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        okText="Logout"
        okButtonProps={{ style: { background: "#1f2937" } }}
      >
        <h1>Are you sure you want to logout?</h1>
      </Modal>
      <div className="min-h-full">
        <div className="bg-gray-800 pb-32">
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="border-b border-gray-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                      <div className="flex items-center">
                        <div className="flex justify-center items-center gap-2">
                          <SiWebmoney style={{ color: "#fff" }} />
                          <h1 className="text-white font-bold">FINGET</h1>
                        </div>
                        <div className="hidden md:block">
                          <div className="ml-10 flex items-baseline space-x-4">
                            {navigation.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className={classNames(
                                  item.current
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                  "px-3 py-2 rounded-md text-sm font-medium"
                                )}
                                aria-current={item.current ? "page" : undefined}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                          <Menu as="div" className="relative ml-3">
                            <div>
                              <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="sr-only">Open user menu</span>
                                <img
                                  className="h-8 w-8 rounded-full bg-white"
                                  src={user.imageUrl}
                                  alt=""
                                />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {userNavigation.map((item) => (
                                  <Menu.Item key={item.name}>
                                    {({ active }) => (
                                      <Link
                                        to={item.href}
                                        className={classNames(
                                          active ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700"
                                        )}
                                        onClick={() => {
                                          if (item.name === "Log out") {
                                            setLogoutModal(true);
                                          }
                                        }}
                                      >
                                        {item.name}
                                      </Link>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                      <div className="-mr-2 flex md:hidden">
                        <Disclosure.Button
                          className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                          onClick={() => setIsOpen(!isOpen)}
                          ref={toogleRef}
                        >
                          <span className="sr-only">Open main menu</span>
                          {isOpen ? (
                            <XMarkIcon
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <Bars3Icon
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </Disclosure.Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="md:hidden">
                  <div className="space-y-1 px-2 py-3 sm:px-3">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                        onClick={() => toogleRef.current.click()}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 pt-4 pb-3">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full bg-white"
                          src={user.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">
                          {user.name}
                        </div>
                        <div className="text-sm font-medium leading-none text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                          onClick={() => {
                            if (item.name === "Log out") {
                              setLogoutModal(true);
                            }
                          }}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {location.pathname === "/dashboard" && (
                <>
                  <h1 className="text-4xl font-bold tracking-tight text-white">
                    Hello, John Doe 👋
                  </h1>
                  <br />
                </>
              )}
              <h3 className="text-2xl font-bold tracking-tight text-white">
                {location.pathname === "/dashboard"
                  ? "Dashboard"
                  : location.pathname === "/transactions"
                  ? "Transactions"
                  : location.pathname === "/accounts"
                  ? "Accounts"
                  : location.pathname === "/categories"
                  ? "Categories"
                  : location.pathname === "/settings"
                  ? "Settings"
                  : ""}
              </h3>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
              {children}
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  );
}
