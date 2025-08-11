import { useEffect, useState } from "react";
import "../../styles/layout/MainLayout.css";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();

  const menu: any[] = [
    {
      module: "Home",
      image: "/images/menu/dashboard.png",
      children: [
        {
          section: "Dashboard",
          link: "/",
        },
      ],
    },
    // {
    //   module: "Schedules",
    //   image: "/images/menu/schedules.png",
    //   children: [
    //     {
    //       section: "Jobs",
    //       link: "/jobs",
    //     },
    //     {
    //       section: "Journeys",
    //       link: "/journeys",
    //     },
    //     {
    //       section: "Expenses",
    //       link: "/journeys",
    //     },
    //   ],
    // },
    {
      module: "Financing",
      image: "/images/menu/cash.png",
      children: [
        {
          section: "Expenses",
          link: "/expenses",
        },
      ],
    },
    {
      module: "Administration",
      image: "/images/menu/administration.png",
      children: [
        {
          section: "System Users",
          link: "/users",
        },
        {
          section: "User Roles",
          link: "/roles",
        },
        {
          section: "Permissions",
          link: "/",
        },
      ],
    },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const [selectedModule, setSelectedModule] = useState("Home");
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [childrenArray, setChildrenArray] = useState<any[]>([
    {
      section: "Dashboard",
      link: "/",
    },
  ]);

  const [alreadyModule, setAlreadyModule] = useState("Home");

  const handle_menuClick = (module: string, children: any[]) => {
    setSelectedModule(module);
    setChildrenArray(children);
  };

  const handle_sectionClick = (
    section: string,
    module: string,
    link: string
  ) => {
    setSelectedSection(section);
    setAlreadyModule(module);

    navigate(link);
  };

  const handleReload = () => {
    setIsLoading(true);

    const flattenedMenu = menu.flatMap((item) =>
      item.children.map((child: any) => ({
        link: child.link,
        section: child.section,
        module: item.module,
      }))
    );

    const browserlink = window.location.href;
    const pathParts = new URL(browserlink).pathname.split("/").filter(Boolean);
    const lastPart = pathParts.length ? pathParts.pop() : "";

    const link = `/${lastPart}`;

    const linkObj = flattenedMenu.find((f_menu: any) => f_menu.link === link);

    const moduleFind = menu.find(
      (m_data: any) => m_data.module === linkObj.module
    );
    const childrens = moduleFind.children;

    setSelectedModule(linkObj.module);
    setChildrenArray(childrens);
    setSelectedSection(linkObj.section);
    setAlreadyModule(linkObj.module);

    setIsLoading(false);
  };

  useEffect(() => {
    handleReload();
  }, []);

  return (
    <div>
      {!isLoading && (
        <div className="Main-Layout d-flex">
          <div>
            <div className="Sider px-3 position-sticky sticky-top">
              <div className="Sider-Logo">
                <img className="logoimg" src="/images/logos/logo.jpg" alt="" />
              </div>

              <div className="menu-title mb-2 mt-4">
                <p className="mb-0">MENU</p>
              </div>

              <div className="d-flex flex-column">
                {menu.map((item: any) => (
                  <div>
                    <button
                      className={
                        selectedModule !== item.module
                          ? "menu-button py-2"
                          : "selected-button py-2"
                      }
                      onClick={() =>
                        handle_menuClick(item.module, item.children)
                      }
                    >
                      <div className="d-flex align-item-center">
                        <img src={item.image} alt="" />
                        <p>{item.module}</p>
                      </div>
                      {alreadyModule === item.module && (
                        <i className="bi bi-circle-fill dot-iconer"></i>
                      )}
                    </button>

                    <div>
                      {item.module === selectedModule &&
                        childrenArray &&
                        childrenArray.length !== 0 && (
                          <div className="d-flex flex-column side-border ms-4">
                            {childrenArray.map((child: any, j: number) => (
                              <div className="d-flex align-items-center">
                                <div className="border-lefter"></div>
                                <button
                                  onClick={() =>
                                    handle_sectionClick(
                                      child.section,
                                      item.module,
                                      child.link
                                    )
                                  }
                                  className={
                                    child.section !== selectedSection
                                      ? "section-button"
                                      : "selected-section-button"
                                  }
                                >
                                  {child.section}
                                </button>
                                {j + 1 === childrenArray.length && (
                                  <div className="white-dropper"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="Page-content">
            <div className="Header px-3 position-sticky sticky-top">
              <h5>SERVICES & MAINTENANCE</h5>

              <div className="Header-Options">
                <div className="header-profile">
                  <i className="bi bi-bell-fill me-4"></i>
                  <img src="/images/common/user.png" alt="" />
                  <div>
                    <h6 className="mb-0">Chathura Hettiarachchi</h6>
                    <p className="mb-0">Admin</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="Page-Body p-3">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
