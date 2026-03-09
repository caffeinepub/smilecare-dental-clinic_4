import { useQuery } from "@tanstack/react-query";
import type { Role } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

/**
 * Fetches the caller's role from the backend.
 * Returns { role, isLoading, isError } — role is null if not registered,
 * Role.patient or Role.doctor if registered.
 */
export function useRole() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<Role | null>({
    queryKey: ["role", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyRole();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 30_000,
  });

  return {
    role: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
