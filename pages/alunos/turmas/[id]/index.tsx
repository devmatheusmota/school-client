import Dashboard from "@/components/Dashboard";
import { AuthContext } from "@/contexts/AuthContext";
import { MenuSelected } from "@/interface/menuPosition";
import { api } from "@/services/api";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

export default function StudentByCoursePage() {
  const { user } = useContext(AuthContext);
  const [student, setStudent] = useState([]);
  const [course, setCourse] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    api
      .get(`/student/course/${id}`)
      .then((response) => setStudent(response.data.students))
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message,
        });
      });

    api.get(`/course/${id}`).then((response) => {
      setCourse(response.data.course);
    });
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Alunos</title>
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
            ? MenuSelected.TURMASADMIN
            : user?.role === "TEACHER"
            ? MenuSelected.TURMASTEACHER
            : undefined
        }
      >
        <h1 className="text-4xl">Alunos da Turma {course?.name} </h1>
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-3xl text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              Swal.fire({
                                title: "Tem certeza?",
                                text: "Você não poderá desfazer essa ação!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Sim, remover!",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  api
                                    .post(`/course/student`, {
                                      course_id: course.id,
                                      student_id: student.id,
                                    })
                                    .then(() => {
                                      Swal.fire(
                                        "Deletado!",
                                        "O aluno foi removido dessa turma.",
                                        "success"
                                      ).then((result) => {
                                        if (result.isConfirmed) {
                                          router.reload();
                                        }
                                      });
                                    })
                                    .catch((error) => {
                                      Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: error.response.data.message,
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

  return {
    props: {},
  };
};
