import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: Array.from(
    new Set([...(defaultSchema.tagNames ?? []), "img", "h1", "h2", "h3", "h4", "h5", "h6"])
  ),
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    a: [
      ...((defaultSchema.attributes?.a as string[] | undefined) ?? []),
      "href",
      "title",
      "target",
      "rel",
    ],
    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    code: [
      ...((defaultSchema.attributes?.code as string[] | undefined) ?? []),
      "className",
    ],
    pre: [
      ...((defaultSchema.attributes?.pre as string[] | undefined) ?? []),
      "className",
    ],
  },
};

export async function renderMarkdownToHtml(markdown: string) {
  if (!markdown?.trim()) return "";

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
