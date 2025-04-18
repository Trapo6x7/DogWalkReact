import { UserData } from "../types/Interfaces";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";

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
    <Card className={`w-full bg-[#FBFFEE] backdrop-blur-sm pt-3 ${customClass}`}>
      <div className="p-6 space-y-6 flex flex-col gap-4">
        <CardHeader className="flex items-center justify-center gap-6 p-0">
          {headerContent}
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm text-[#DA915D]/80">
                {description}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        {children && <CardContent className="p-0">{children}</CardContent>}

        {footerContent && (
          <CardFooter className="flex justify-end p-0">
            {footerContent}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}
