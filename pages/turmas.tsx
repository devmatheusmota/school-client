import Dashboard from "@/components/Dashboard";
import { AuthContext } from "@/contexts/AuthContext";
import { MenuSelected } from "@/interface/menuPosition";
import { GetServerSideProps } from "next";
import { useContext } from "react";

export default function CoursesPage() {
  const { user } = useContext(AuthContext);

  return (
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
      <h1>Turmas</h1>
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

  return {
    props: {},
  };
};
