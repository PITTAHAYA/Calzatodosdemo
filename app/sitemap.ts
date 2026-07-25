import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { brands } from "@/data/brands";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/mujer",
    "/hombre",
    "/ninos",
    "/deportivo",
    "/urbano",
    "/formal",
    "/escolar",
    "/seguridad",
    "/ofertas",
    "/marcas",
    "/catalogo",
    "/mayoristas",
    "/tiendas",
    "/nosotros",
    "/contacto",
    "/preguntas-frecuentes",
    "/garantia",
    "/cambios-y-devoluciones",
    "/politica-de-privacidad",
    "/terminos-y-condiciones",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const brandRoutes = brands.map((b) => ({
    url: `${base}/marcas/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/productos/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...brandRoutes, ...productRoutes];
}
