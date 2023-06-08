import Navbar from "../../components/Navbar";
import Image from "next/image";

const teamMembers = [
  { name: "Angelo" },
  { name: "Paulo V" },
  { name: "Paulo G" },
];

const WIPPage = () => {
  return (
    <>
      <Navbar />

      <div className="flex flex-col m-7 gap-3">
        <h6 className="flex justify-center text-3xl">Equipa</h6>
        <div className="grid grid-cols-3 mt-3 gap-3">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col justify-center gap-3">
              <div className="avatar flex justify-center">
                <div className="w-24 rounded bg-black-100 border">
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

export default WIPPage;
