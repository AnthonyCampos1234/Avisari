import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    userType?: string;
}

interface AuthSession {
    user?: AuthUser;
    expires: string;
}

export const useAuth = (requireAuth = false) => {
    const { data: session, status } = useSession() as { data: AuthSession | null, status: "loading" | "authenticated" | "unauthenticated" };
    const router = useRouter();

    useEffect(() => {
        if (requireAuth && status === "unauthenticated") {
            router.push("/signin");
        }
    }, [requireAuth, status, router]);

    return {
        session,
        status,
        user: session?.user as AuthUser | undefined,
        userType: session?.user?.userType
    };
};