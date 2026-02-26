import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Tool, ToolSubmission } from '../backend';

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAdminListTools() {
  const { actor, isFetching } = useActor();

  return useQuery<Tool[]>({
    queryKey: ['adminTools'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminListTools();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<ToolSubmission[]>({
    queryKey: ['submissions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveSubmission(submissionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['adminTools'] });
    },
  });
}

export function useRejectSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectSubmission(submissionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}

export function useGetNewsletterEmails() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['newsletterEmails'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getNewsletterEmails();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBulkUploadTools() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tools: Tool[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUploadTools(tools);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['adminTools'] });
    },
  });
}

export function useAddTool() {
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
      isFeatured: boolean;
      isPopular: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTool(
        data.name,
        data.iconUrl,
        data.description,
        data.category,
        data.pricingTag,
        data.officialLink,
        data.isFeatured,
        data.isPopular
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['adminTools'] });
    },
  });
}

export function useUpdateTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      iconUrl: string;
      description: string;
      category: string;
      pricingTag: string;
      officialLink: string;
      isFeatured: boolean;
      isPopular: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTool(
        data.id,
        data.name,
        data.iconUrl,
        data.description,
        data.category,
        data.pricingTag,
        data.officialLink,
        data.isFeatured,
        data.isPopular
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['adminTools'] });
    },
  });
}

export function useDeleteTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTool(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['adminTools'] });
    },
  });
}
