import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ProfileCard } from "./ProfileCard";
import { Button } from "./ui/button";

interface MeProps {
  userData: any;
}

export function Me({ userData }: MeProps) {
  const { setUser } = useAuth();
  const [localUserData, setLocalUserData] = useState(userData);

  useEffect(() => {
    setLocalUserData(userData);
  }, [userData]);

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
      {localUserData && (
        <ProfileCard
          userData={localUserData}
          title={` ${localUserData.name} . ${
            localUserData.birthdate
              ? calculateAge(localUserData.birthdate)
              : "N/A"
          }`}
          headerContent={
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                {localUserData.imageFilename ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/images/${
                      localUserData.imageFilename
                    }`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl">{localUserData.name?.[0]}</span>
                  </div>
                )}
              </div>

              <Button
                className="absolute bottom-0 right-0 p-2 rounded-full"
                onClick={() => document.getElementById("upload-photo")?.click()}
              >
                +
              </Button>
              <input
                type="file"
                id="upload-photo"
                style={{ display: "none" }}
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                      const token = localStorage.getItem("authToken");
                      const response = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/users/image`,
                        {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          body: formData,
                        }
                      );

                      if (response.ok) {
                        const updatedUser = await response.json();
                        setLocalUserData(updatedUser);
                        setUser(updatedUser);
                      }
                    } catch (error) {
                      console.error("Erreur :", error);
                    }
                  }
                }}
              />
            </div>
          }
          footerContent={<></>}
          customClass="h-[10%]"
        >
          <article className="flex flex-wrap items-center justify-center h-full w-full py-8 px-6 overflow-hidden">
            <p className="text-center overflow-hidden text-ellipsis whitespace-normal">
              {localUserData.description}
            </p>
          </article>
        </ProfileCard>
      )}
    </div>
  );
}
