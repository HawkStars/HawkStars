import Image from "next/image";

const teamMembers = [
  { name: "Angelo" },
  { name: "Paulo V" },
  { name: "Paulo G" },
];

const TeamPage = () => {
  return (
    <>
      <div className="m-7 flex flex-col gap-3">
        <h6 className="flex justify-center text-3xl">Equipa</h6>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {teamMembers.map((member, index) => (
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
          ))}
        </div>
      </div>
    </>
  );
};

export default TeamPage;
