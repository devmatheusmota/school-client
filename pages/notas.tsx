import Dashboard from "@/components/Dashboard";
import { AuthContext } from "@/contexts/AuthContext";
import { MenuSelected } from "@/interface/menuPosition";
import { GetServerSideProps } from "next";
import { useContext } from "react";

export default function GradePage() {
  const { user } = useContext(AuthContext);

  return (
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
      <h1>Notas</h1>
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
