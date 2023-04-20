import Dashboard from "@/components/Dashboard";
import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { useContext } from "react";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  return (
    <Dashboard user={user} menuSelected={undefined}>
      <h1 className="text-2xl font-semibold text-gray-900">
        Olá {user.name}, seja muito bem vindo(a).
      </h1>
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
