import { useAuth } from "../context/AuthContext"; 
import { ProfileCard } from "./ProfileCard";

export function Me() {
  const { user } = useAuth();

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
      {user && (
        <ProfileCard
          userData={user}
          title={` ${user.name} . ${
            user.birthdate ? calculateAge(user.birthdate) : "N/A"
          }`}
          headerContent={
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                {user.imageFilename ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/images/${
                      user.imageFilename
                    }`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl">{user.name?.[0]}</span>
                  </div>
                )}
              </div>
            </div>
          }
          footerContent={<></>}
          customClass="h-50"
        >
          <article className="flex flex-wrap items-center justify-center h-full w-full py-8 px-6 overflow-hidden">
            <p className="text-center overflow-hidden text-ellipsis whitespace-normal">
              {user.description}
            </p>
          </article>
        </ProfileCard>
      )}
    </div>
  );
}