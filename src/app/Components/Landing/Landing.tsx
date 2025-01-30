import { GettingAllData } from "../../../../API-struct/Api";
import DashboardPage from "../Chat/page";
import { getAllChats } from "../../../../API-struct/Api";

const Landing = async () => {
  const GettingModels = async () => {
    const { data } = await GettingAllData();
    console.log(data);

    return data;
  };
  const modelData = await GettingModels();

  return <DashboardPage modelData={modelData} />;
};

export default Landing;
