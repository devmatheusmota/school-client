import Dashboard from "@/components/Dashboard";
import { AuthContext } from "@/contexts/AuthContext";
import { MenuSelected } from "@/interface/menuPosition";
import { api } from "@/services/api";
import { GetServerSideProps } from "next";
import { useContext, useEffect, useState } from "react";

export default function StudentPage({ students }) {
  const { user } = useContext(AuthContext);
  const [student, setStudent] = useState([]);

  useEffect(() => {
    setStudent(students);
  }, [students]);

  return (
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
      <h1 className="text-4xl">Alunos</h1>
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
                      ID
                    </th>
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
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.id}
                            </div>
                          </div>
                        </div>
                      </td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href="#"
                          className="text-3xl text-indigo-600 hover:text-indigo-900"
                        >
                          📝
                        </a>
                        <a
                          href="#"
                          className="text-3xl text-indigo-600 hover:text-indigo-900"
                        >
                          ❌
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

  return {
    props: {
      students: res.data.students,
    },
  };
};
