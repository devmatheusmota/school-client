/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
import Dashboard from "@/components/Dashboard";
import { AuthContext } from "@/contexts/AuthContext";
import { MenuSelected } from "@/interface/menuPosition";
import { api } from "@/services/api";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

export default function ActivitiesPage() {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api
      .get(`/activity`)
      .then((response) => {
        setActivities(response.data.activities);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error?.response.data.message,
        });
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Atividades </title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,600,0,200"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,600,0,200"
        />
      </Helmet>
      <Dashboard
        user={user}
        menuSelected={
          user?.role === "ADMIN"
            ? MenuSelected.ATIVIDADESADMIN
            : user?.role === "TEACHER"
            ? MenuSelected.ATIVIDADESTEACHER
            : MenuSelected.ATIVIDADESTEACHER
        }
      >
        <h1 className="text-4xl">Atividades</h1>
        <div className="flex flex-col mt-4">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Atividade
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Descrição
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data de Entrega
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity) => (
                      <tr key={activity.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {activity?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {activity?.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {activity?.due_date
                              .split("T")[0]
                              .split("-")
                              .reverse()
                              .join("/")}
                          </div>
                        </td>
                        <td className="flex flex-row justify-end items-center px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                            <a
                              href={`/notas/atividades/${activity.id}?atividade=${activity.name}`}
                            >
                              Notas
                            </a>
                          </button>
                          {user.role !== "STUDENT" && (
                            <a
                              href={`/atividades/${activity.id}/editar`}
                              className="text-3xl text-indigo-600 hover:text-indigo-900"
                            >
                              <span className="material-symbols-outlined w-10 h-10 text-green-700">
                                edit
                              </span>
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Dashboard>
    </>
  );
}
