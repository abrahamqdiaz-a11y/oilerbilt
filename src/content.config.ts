import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const services=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/services'}),schema:z.object({title:z.string(),slug:z.string(),description:z.string(),eyebrow:z.string(),included:z.array(z.string()),cost:z.array(z.string()),related:z.array(z.object({label:z.string(),href:z.string()})),locations:z.array(z.object({label:z.string(),href:z.string()})),faqs:z.array(z.object({q:z.string(),a:z.string()}))})});
const locations=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/locations'}),schema:z.object({title:z.string(),slug:z.string(),description:z.string(),neighborhoods:z.array(z.string()),services:z.array(z.object({label:z.string(),href:z.string()}))})});
export const collections={services,locations};
