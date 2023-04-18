import Dashboard from "@/components/Dashboard";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

export default function CoursescoursesPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const id = router.query.id;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (id) {
      api
        .get(`/course/teacher/${id}`)
        .then((response) => {
          console.log(response);
          setCourses(response.data.courses);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message,
          });
        });
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Professores</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,600,0,200"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,600,0,200"
        />
      </Helmet>
      <Dashboard user={user}>
        <h1 className="text-4xl">Turmas do Professor(a) {user?.name}</h1>
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
                        Nome
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ano
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {course.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {course.year}
                          </div>
                        </td>
                        <td className="flex flex-row justify-end items-center px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                            <a href={`/alunos/turmas/${course.id}`}>Alunos</a>
                          </button>
                          <a
                            href="#"
                            className="text-3xl text-indigo-600 hover:text-indigo-900"
                          >
                            <span className="material-symbols-outlined w-10 h-10 text-green-700">
                              edit
                            </span>
                          </a>
                          <a
                            href="#"
                            className="text-3xl text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              Swal.fire({
                                title: "Tem certeza?",
                                text: "Você não poderá reverter isso!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Sim, apague!",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  api
                                    .delete(`/courses/${course.id}`)
                                    .then(() => {
                                      Swal.fire(
                                        "Apagado!",
                                        "O professor foi apagado.",
                                        "success"
                                      );
                                    });
                                }
                              });
                            }}
                          >
                            <span className="material-symbols-outlined w-10 h-10 text-red-700">
                              delete
                            </span>
                          </a>
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