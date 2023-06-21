import Image from "next/image";
import { useState } from "react";
import {
  boardSections,
  OrgSection,
  TeamMembers,
  TeamPageSections,
} from "./config";

const TeamPage = () => {
  const [selectedSection, setSelectedSection] = useState<OrgSection>("geral");
  return (
    <>
      <div className="flex flex-row gap-4 underline">
        {boardSections.map((section) => section)}
      </div>
      <div className="m-7 flex flex-col gap-3">
        <h6 className="flex justify-center text-3xl">Equipa</h6>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {/* {TeamMembers.map((member, index) => (
            <div key={index} className="flex flex-col justify-center gap-3">
              <div className="avatar flex justify-center">
                <div className="bg-black-100 w-24 rounded border">
                  <Image
                    src="/logo.png"
                    alt="HawkStars Board member"
                    width={64}
                    height={64}
                    className="rounded"
                  />
                </div>
              </div>
              <h6 className="text-center">{member.name}</h6>
            </div>
          ))} */}
        </div>
      </div>
    </>
  );
};

export default TeamPage;
