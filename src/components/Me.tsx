import { UserData } from "../types/Interfaces";
import { ProfileCard } from "./ProfileCard";

interface MeProps {
  userData: UserData | null;
}

export function Me({ userData }: MeProps) {
  function calculateAge(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  return (
    <div>
      {userData && (
        <ProfileCard
          userData={userData}
          title={` ${userData.name} . ${
            userData.birthdate ? calculateAge(userData.birthdate) : "N/A"
          }`}
          headerContent={
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                {userData.imageFilename ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/images/${userData.imageFilename}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl">{userData.name?.[0]}</span>
                  </div>
                )}
              </div>
            </div>
          }
          footerContent={<></>}
        >
          <article className="flex flex-col items-center py-8 overflow-y-hidden ">
            <p>{userData.description}</p>
          </article>
        </ProfileCard>
      )}
    </div>
  );
}