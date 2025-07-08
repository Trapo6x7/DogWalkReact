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
    <div className={`w-full rounded-lg bg-[#FBFFEE] backdrop-blur-sm overflow-hidden pt-2 ${customClass}`}>
      <div className="p-3 flex flex-col items-center gap-2 text-center">
        <div className="w-full text-center">
          {headerContent}
          <h2 className="text-lg font-medium text-secondary-brown w-full mb-0.5">{title}</h2>
          {description && (
            <p className="text-xs text-[rgba(218,145,93,0.8)] w-full">{description}</p>
          )}
        </div>
        {children && <div className="p-0">{children}</div>}
        {footerContent && (
          <div className="flex justify-end p-0 w-full">{footerContent}</div>
        )}
      </div>
    </div>
  );
}
