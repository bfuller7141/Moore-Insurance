// src/content/config.ts
import { defineCollection, z } from "astro:content";
import { getCollection } from "astro:content";


const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    // You can store the date as a JavaScript Date. If your Markdown frontmatter
    // is a string, use z.string() instead.
    date: z.date(),
    author: z.string(),
    youtubeUrl: z.string().optional(),
    body: z.string(),
  }),
});

const serviceCollection = defineCollection({
  schema: z.object({
    serviceName: z.string(),
    image: z.string(),
    pageTitle: z.object({
      pre: z.string(),
      highlight: z.string(),
      post: z.string().optional(),
    }),
    description: z.string().optional(),
    aboutServices: z.string().optional(),
    benefits: z.array(z.object({
      text: z.string(),
    })),
    category: z.enum(["Personal Coverage", "Business Coverage", "Auto Coverage", "Other"]),
  }),
});

const faqCollection = defineCollection({
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.enum(["General", "Service"]),
  }),
});

const reviewCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    rating: z.number(),
    review: z.string().optional(),
  }),
});

export const collections = {
  post: postCollection,
  service: serviceCollection,
  faq: faqCollection,
  review: reviewCollection,
};
