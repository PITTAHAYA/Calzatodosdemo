import type { InstagramPost } from "@/data/social";
import { instagramEmbedUrl } from "@/data/social";

// Muestra publicaciones de Instagram mediante el embed oficial (iframe con
// carga diferida). No depende de APIs ni tokens: si Instagram no carga, la
// página sigue funcionando y solo se omite el contenido embebido.
export function InstagramFeed({ posts }: { posts: InstagramPost[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div
          key={post.code}
          className="overflow-hidden rounded-2xl border border-graphite-100 bg-white shadow-card"
        >
          <iframe
            src={instagramEmbedUrl(post)}
            title={`Publicación de Instagram ${post.code}`}
            loading="lazy"
            scrolling="no"
            className="h-[560px] w-full border-0"
          />
        </div>
      ))}
    </div>
  );
}
