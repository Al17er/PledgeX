import { Outlet } from "react-router-dom";
import styles from "./layout.module.scss";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header></Header>
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer></Footer>
    </div>
  );
}

export default MainLayout;
