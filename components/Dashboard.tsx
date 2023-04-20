/* eslint-disable @next/next/no-img-element */
import { Fragment, useContext, useEffect } from "react";
import Head from "next/head";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { AuthContext, User } from "@/contexts/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard({
  children,
  user,
  menuSelected,
}: {
  children: any;
  user: User;
  menuSelected: number;
}) {
  const adminNavigation = [
    { text: "Professores", href: "/professores" },
    { text: "Alunos", href: "/alunos" },
    { text: "Turmas", href: "/turmas" },
    { text: "Disciplinas", href: "/disciplinas" },
    { text: "Atividades", href: "/atividades" },
    { text: "Notas", href: "/notas" },
  ];
  const teacherNavigation = [
    { text: "Alunos", href: "/alunos" },
    { text: "Turmas", href: "/turmas" },
    { text: "Disciplinas", href: "/disciplinas" },
    { text: "Atividades", href: "/atividades" },
    { text: "Notas", href: "/notas" },
  ];
  const studentNavigation = [
    { text: "Atividades", href: "/atividades" },
    { text: "Notas", href: "/notas" },
  ];

  const teacherProfile = [
    { text: "Perfil", href: `/professores/${user?.id}/editar` },
  ];
  const studentProfile = [
    { text: "Perfil", href: `/alunos/${user?.id}/editar` },
    { text: "Carteirinha", href: "#" },
  ];

  const navigation =
    user?.role === "ADMIN"
      ? adminNavigation
      : user?.role === "TEACHER"
      ? teacherNavigation
      : studentNavigation;

  const profile = user?.role !== "STUDENT" ? teacherProfile : studentProfile;

  const { signOut } = useContext(AuthContext);

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Disclosure as="nav" className="bg-gray-800">
        {/* Mobile menu, show/hide based on menu open state. */}
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                      alt="Workflow"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item, itemIdx) =>
                        itemIdx === menuSelected ? (
                          <Fragment key={item.text}>
                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                            <a
                              href={item.href}
                              className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                              {item.text}
                            </a>
                          </Fragment>
                        ) : (
                          <a
                            key={item.text}
                            href={item.href}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                          >
                            {item.text}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 rounded-full"
                                src="https://github.com/devmatheusmota.png"
                                alt=""
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              {profile.map((item) => (
                                <Menu.Item key={item.text}>
                                  {({ active }) => (
                                    <a
                                      href={item.href}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.text}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                              <Menu.Item>
                                <a
                                  href="#"
                                  className="block px-4 py-2 text-sm text-gray-700"
                                  onClick={() => {
                                    signOut();
                                  }}
                                >
                                  Sign out
                                </a>
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item, itemIdx) =>
                  itemIdx === 0 ? (
                    <Fragment key={item.text}>
                      {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                      <a
                        href={item.href}
                        className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                      >
                        {item.text}
                      </a>
                    </Fragment>
                  ) : (
                    <a
                      key={item.text}
                      href={item.href}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item.text}
                    </a>
                  )
                )}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://github.com/devmatheusmota.png"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      Matheus Mota
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      devmatheusmota@gmail.com
                    </div>
                  </div>
                  <button className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {profile.map((item) => (
                    <a
                      key={item.text}
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {item.text}
                    </a>
                  ))}
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main className="h-screen w-screen bg-slate-300">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
