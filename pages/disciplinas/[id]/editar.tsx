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
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export default function EditsubjectPage() {
  const { user, token } = useContext(AuthContext);
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const [subject, setSubject] = useState(null);
  const [teachers, setTeachers] = useState([]);

  const { id } = router.query;

  useEffect(() => {
    api
      .get(`/subject/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSubject(response.data.subject);
      });

    api
      .get("/teacher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTeachers(response.data.teachers);
      });

    setValue("name", subject?.name);
    setValue("teacher", subject?.teacher_id);
  }, [id, setValue, subject?.name, subject?.teacher_id, token]);

  const onSubmit = (data) => {
    try {
      api
        .patch(`/subject/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Disciplina atualizada com sucesso!",
          }).then(() => {
            window.location.href = "/disciplinas";
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message,
          });
        });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Disciplinas</title>
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
            ? MenuSelected.DISCIPLINASADMIN
            : user?.role === "TEACHER"
            ? MenuSelected.DISCIPLINASTEACHER
            : undefined
        }
      >
        <h1 className="text-4xl">Atualização de Disciplinas</h1>
        <div className="flex flex-col mt-4">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Nome
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="name"
                      type="text"
                      placeholder="Nome"
                      {...register("name")}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Professor
                    </label>
                    <select {...register("teacher")}>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="password"
                    >
                      Senha
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      placeholder="Senha"
                      {...register("password")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Atualizar
                    </button>
                  </div>
                </form>
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
