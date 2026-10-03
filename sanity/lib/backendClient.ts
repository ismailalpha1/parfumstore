import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId} from "../env";

// export const backendClient = createClient({
//     projectId,
//     dataset,
//     apiVersion,
//     useCdn:true,
//     token: process.env.SANITY_API_TOKEN,
// });
export const backendClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

console.log(
  "Sanity token exists:",
  !!process.env.SANITY_API_TOKEN
);