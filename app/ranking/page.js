import dbConnect from "@/lib/dbConnect";
import Ranking from "@/app/ranking/Ranking";
const Page = async () => {
  await dbConnect();
  return <Ranking />;
};

export default Page;
