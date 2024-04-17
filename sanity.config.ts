import { defineConfig } from "sanity";
import {structureTool} from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemas";
import StudioHeader from "@/components/StudioHeader";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  basePath: "/studio",
  name: "Zivic-Elektro",
  title: "Zivic-Elektro materijal",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  studio: {
    components: {
      navbar: StudioHeader,
    },
  },
});