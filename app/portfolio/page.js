import PortfolioPage from "@/app/portfolio/PortfolioPage";
import dbConnect from "@/lib/dbConnect";

const Page = async () => {
  await dbConnect();
  return <PortfolioPage />;
};

export default Page;
