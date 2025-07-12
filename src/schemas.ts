import { z } from 'zod';

export const KnowledgeBaseSearchResponseSchema = z.object({
  totalResults: z.number(),
  results: z.array(
    z.object({
      content: z.string(),
      score: z.number(),
      citation: z
        .object({
          documentId: z.string(),
          name: z.string(),
          filename: z.string(),
        })
        .optional(),
    })
  ),
});

export type KnowledgeBaseSearchResponse = z.infer<typeof KnowledgeBaseSearchResponseSchema>;
