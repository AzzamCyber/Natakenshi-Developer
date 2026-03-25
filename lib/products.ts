import fs from "fs"
import path from "path"
import matter from "gray-matter"

const productsDirectory = path.join(process.cwd(), "content/products")

export function getAllProducts() {
  const files = fs.readdirSync(productsDirectory)

  return files.map((file) => {
    const slug = file.replace(".md", "")
    const fullPath = path.join(productsDirectory, file)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      ...data,
      content,
    }
  })
}

export function getProductBySlug(slug: string) {
  const fullPath = path.join(productsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  return {
    slug,
    ...data,
    content,
  }
}