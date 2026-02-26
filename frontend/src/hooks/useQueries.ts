import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Tool, PaginatedTools, ToolSubmission } from '../backend';

export function useListTools(
  page: number,
  pageSize: number,
  filter?: string | null,
  sortBy?: string | null
) {
  const { actor, isFetching } = useActor();

  return useQuery<PaginatedTools>({
    queryKey: ['tools', page, pageSize, filter, sortBy],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listTools(BigInt(page), BigInt(pageSize), filter || null, sortBy || null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchTools(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Tool[]>({
    queryKey: ['searchTools', searchTerm],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!searchTerm.trim()) return [];
      return actor.searchTools(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0,
  });
}

export function useGetToolBySlug(slug: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Tool | null>({
    queryKey: ['tool', slug],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getToolBySlug(slug);
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

export function useGetSimilarTools(toolId: bigint, limit: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Tool[]>({
    queryKey: ['similarTools', toolId.toString(), limit],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSimilarTools(toolId, BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedCollections() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['featuredCollections'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeaturedCollections();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCollection(collectionId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCollection(BigInt(collectionId));
    },
    enabled: !!actor && !isFetching && !!collectionId,
  });
}

export function useGetToolsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Tool[]>({
    queryKey: ['toolsByCategory', category],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getToolsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetFeaturedTools() {
  const { actor, isFetching } = useActor();

  return useQuery<Tool[]>({
    queryKey: ['featuredTools'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeaturedTools();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      iconUrl: string;
      description: string;
      category: string;
      pricingTag: string;
      officialLink: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitTool(
        data.name,
        data.iconUrl,
        data.description,
        data.category,
        data.pricingTag,
        data.officialLink
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}

export function useSubscribeNewsletter() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.subscribeNewsletter(email);
    },
  });
}
