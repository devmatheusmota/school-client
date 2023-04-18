/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
import Dashboard from "@/components/Dashboard";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Helmet } from "react-helmet";
import { GetServerSideProps } from "next";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { XIcon } from "@heroicons/react/outline";
import { MenuSelected } from "@/interface/menuPosition";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export default function EditGradePage() {
  const { user, token } = useContext(AuthContext);
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const [grade, setGrade] = useState(null);

  const { id, atividade, disciplina } = router.query;

  useEffect(() => {
    api.get(`/grade/${id}`).then((response) => {
      setGrade(response.data.grade);
    });

    setValue("value", grade?.value);
  }, [grade?.value, id, setValue]);

  const onSubmit = (data) => {
    data.value = +data.value;
    try {
      api
        .patch(`/grade/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Nota atualizada com sucesso!",
          }).then(() => {
            window.location.href = `/alunos/${grade.Student.id}/notas`;
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error?.response.data.message,
          });
        });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response.data.message,
      });
    }
  };

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
      <Dashboard
        user={user}
        menuSelected={
          user?.role === "ADMIN"
            ? MenuSelected.NOTASADMIN
            : user?.role === "TEACHER"
            ? MenuSelected.NOTASTEACHER
            : MenuSelected.NOTASSTUDENT
        }
      >
        <h1 className="text-4xl">Atualização de Notas</h1>
        <div className="flex flex-col mt-4">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nota"
                    >
                      Nota
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="nota"
                      type="number"
                      placeholder="Nota"
                      {...register("value")}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="disciplina"
                    >
                      Disciplina
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                      id="disciplina"
                      type="text"
                      placeholder="Disciplina"
                      disabled
                      value={disciplina}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="atividade"
                    >
                      Atividade
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                      id="atividade"
                      type="text"
                      placeholder="Atividade"
                      disabled
                      value={atividade}
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
