import { PageTransition } from "@/components/motion/PageTransition";

// Se remonta en cada navegación → habilita la transición de página.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
