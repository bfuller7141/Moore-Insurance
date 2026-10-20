import { defineCollection, z } from "astro:content";
import { head } from "motion/react-client";

// Define the "post" collection – note the folder is "posts"
const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string(),
    youtubeUrl: z.string().optional(),
    headerImg: z.string().optional(),
    body: z.string(),
  }),
});

// Define the "service" collection – folder "services"
const serviceCollection = defineCollection({
  schema: z.object({
    serviceName: z.string(),
    image: z.string(),
    headerImg: z.string().optional(),
    pageTitle: z.object({
      pre: z.string(),
      highlight: z.string(),
      post: z.string().optional(),
    }),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    description: z.string().optional(),
    aboutTitle: z.object({
      line1: z.string(),
      line2Pre: z.string().optional(),
      highlight: z.string(),
      line2Post: z.string().optional(),
    }).optional(),
    aboutServices: z.string().optional(),
    benefits: z.array(
      z.object({
        text1: z.string(),
        text2: z.string(),
        text3: z.string(),
      })
    ),
    comparisonCards: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ).length(3).optional(),
    midpageTitle: z.object({
      line1: z.string(),
      highlight: z.string(),
      line2: z.string(),
    }).optional(),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ).length(5).optional(),
    finalCtaTitle: z.object({
      line1: z.string(),
      highlight: z.string(),
      afterHighlight: z.string().optional(),
      line2: z.string(),
    }).optional(),
    benefitImg: z.string().optional(),
    category: z.union([
      z.enum(["Personal Coverage", "Business Coverage", "Auto Coverage", "Other"]),
      z.array(z.enum(["Personal Coverage", "Business Coverage", "Auto Coverage", "Other"]))
    ])
  }),
});

// Define the "faq" collection – folder "faqs"
const faqCollection = defineCollection({
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.enum(["General", "Service"]),
  }),
});

// Define the "review" collection – folder "reviews"
const reviewCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    rating: z.number(),
    review: z.string().optional(),
  }),
});

// Export collections
export const collections = {
  post: postCollection,
  service: serviceCollection,
  faq: faqCollection,
  review: reviewCollection,
};
