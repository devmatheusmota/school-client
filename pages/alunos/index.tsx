/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
import Dashboard from "@/components/Dashboard";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Helmet } from "react-helmet";
import { GetServerSideProps } from "next";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MenuSelected } from "@/interface/menuPosition";

export default function TeacherPage({ students }) {
  const { user, token } = useContext(AuthContext);
  const [student, setStudent] = useState([]);

  useEffect(() => {
    setStudent(students);
  }, [students]);

  return (
    <>
      <Helmet>
        <title>Alunos </title>
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
            ? MenuSelected.ALUNOSADMIN
            : user?.role === "TEACHER"
            ? MenuSelected.ALUNOSTEACHER
            : undefined
        }
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl">Alunos</h1>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
            <a href={`/alunos/cadastrar`}>Cadastrar aluno</a>
          </button>
        </div>
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
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {student.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student.email}
                          </div>
                        </td>
                        <td className="flex flex-row justify-end items-center px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                            <a href={`/alunos/${student.id}/notas`}>Notas</a>
                          </button>
                          <a
                            href={`/alunos/${student.id}/editar`}
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
                                    .delete(`/student/${student.id}`, {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    })
                                    .then(() => {
                                      Swal.fire(
                                        "Apagado!",
                                        "O aluno foi apagado.",
                                        "success"
                                      ).then(() => {
                                        window.location.reload();
                                      });
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["nextauth.token"]: token } = ctx.req.cookies;

  if (!token || token === "null") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const res = await api.get("/student", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const students = res.data.students;

  return {
    props: {
      students: students,
    },
  };
};
