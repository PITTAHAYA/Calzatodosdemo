// =========================================================================
// PUBLICACIONES DE INSTAGRAM — Calzatodos Group
// -------------------------------------------------------------------------
// Se muestran en la sección "Redes sociales" de la página de inicio mediante
// el embed oficial de Instagram (iframe con carga diferida). Si Instagram no
// carga, la página sigue funcionando normalmente.
//
// Para agregar/cambiar publicaciones: copia el enlace desde Instagram
// (Compartir → Copiar enlace) y pega solo el CÓDIGO de la publicación.
//   - Enlace: https://www.instagram.com/p/DawONcynX-Y/  -> code: "DawONcynX-Y", type: "p"
//   - Enlace: https://www.instagram.com/reel/DbJz8lkz1Ga/ -> code: "DbJz8lkz1Ga", type: "reel"
// =========================================================================

export interface InstagramPost {
  type: "p" | "reel";
  code: string;
}

export const instagramPosts: InstagramPost[] = [
  { type: "reel", code: "DbJz8lkz1Ga" },
  { type: "p", code: "DawONcynX-Y" },
  { type: "p", code: "DaBonYgjKQR" },
  { type: "reel", code: "DZ8gMRYzGPc" },
  { type: "p", code: "DZ5-O7SDb60" },
  { type: "reel", code: "DaqWuntTVV4" },
];

// URL de la publicación (para enlazar).
export function instagramPostUrl(post: InstagramPost): string {
  return `https://www.instagram.com/${post.type}/${post.code}/`;
}

// URL de embed (iframe) de Instagram.
export function instagramEmbedUrl(post: InstagramPost): string {
  return `https://www.instagram.com/${post.type}/${post.code}/embed`;
}
