import Header from "../../components/header";
import { ReactNode } from "react";
const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header></Header>
        <div className="flex mt-20 pb-20 items-center">{children}</div>
      </div>
    </main>
  );
};

export default HomeLayout;
