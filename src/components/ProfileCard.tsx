import { UserData } from "../types/Interfaces";

type ProfileCardProps = {
  title?: string;
  description?: string;
  headerContent?: React.ReactNode;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  userData?: UserData;
  customClass?: string;
};


export function ProfileCard({
  title,
  description,
  headerContent,
  children,
  footerContent,
  customClass = "",
}: ProfileCardProps) {
  return (
    <div className={`w-full rounded-lg bg-[#FBFFEE] backdrop-blur-sm overflow-hidden ${customClass}`} style={{ paddingTop: "0.5rem" }}>
      <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textAlign: "center" }}>
        <div style={{ width: "100%", textAlign: "center", }}>
          {headerContent}
          <h2 style={{ fontSize: "1.25rem", fontWeight: 500, color: "var(--secondary-brown)", width: "100%", marginBottom: "0.1rem" }}>{title}</h2>
          {description && (
            <p style={{ fontSize: "0.75rem", color: "rgba(218, 145, 93, 0.8)", width: "100%" }}>
              {description}
            </p>
          )}
        </div>

        {children && <div style={{ padding: 0 }}>{children}</div>}

        {footerContent && (
          <div style={{ display: "flex", justifyContent: "flex-end", padding: 0 }}>
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
}
