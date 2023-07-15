import MainTeamPage from "@/components/team/Main";
import { Metadata } from "next";

export const metadata = {
  title: "Hawk Stars - Team",
  description:
    "The members of the board member, financial and main board that manage this non profit organization",
} as Metadata;

const TeamPage = () => {
  return <MainTeamPage />;
};

export default TeamPage;
