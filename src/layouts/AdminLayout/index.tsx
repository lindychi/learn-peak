import { useEffect, useState } from "react";
import { Book, Home, MessageCircleQuestion } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { TooltipProvider } from "@/components/ui/tooltip";
import SideTooltip from "./Tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getUser, logoutUser } from "@/services/user";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const user = await getUser();
      if (user.email !== "igam0000@gmail.com") {
        logoutUser();
        throw new Error("Not Admin User");
      }
      setIsLoading(false);
    } catch (e) {
      navigate("/login");
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <span className="text-2xl font-bold">Loading...</span>
        </div>
      ) : (
        <>
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-neutral-800 sm:flex text-neutral-400">
            <TooltipProvider>
              <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <SideTooltip
                  title="Dashboard"
                  link="/admin"
                  icon={<Home className="h-5 w-5" />}
                />
                <SideTooltip
                  title="Subjects"
                  link="/admin/subjects"
                  icon={<Book className="h-5 w-5" />}
                />
                <SideTooltip
                  title="Questions"
                  link="/admin/questions"
                  icon={<MessageCircleQuestion className="h-5 w-5" />}
                />
              </nav>
            </TooltipProvider>
          </aside>
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 min-h-screen bg-neutral-200">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 justify-between">
              <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="#">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="#">Products</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>All Products</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        src="/placeholder-user.jpg"
                        className="h-9 w-9"
                      />
                    </Avatar>
                    <img
                      src="/placeholder-user.jpg"
                      width={36}
                      height={36}
                      alt="Avatar"
                      className="overflow-hidden rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}
