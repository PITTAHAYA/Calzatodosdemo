import Link from "next/link";

export const metadata = { title: "Guía de fotos — Panel Calzatodos" };

export default function PhotoGuidePage() {
  return (
    <article className="max-w-3xl text-neutral-200 space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_a]:text-sky-400 [&_a]:underline [&_code]:bg-neutral-800 [&_code]:px-1 [&_code]:rounded [&_strong]:text-white">
      <div className="flex justify-between items-start not-prose mb-4">
        <h1 className="text-2xl font-bold">Guía de fotos para el catálogo</h1>
        <Link href="/admin" className="text-sm text-neutral-400 hover:text-white">
          ← Volver
        </Link>
      </div>
      <p>
        Estas reglas mantienen el catálogo bonito y evitan que las fotos rompan
        el diseño del sitio. Antes de subir una imagen revisa que cumpla lo
        siguiente.
      </p>

      <h2>1. Formato y tamaño</h2>
      <ul>
        <li>
          <strong>Formato de archivo:</strong> JPG, WEBP, PNG o AVIF. Recomendado
          <em> WEBP</em> por ser el que menos pesa manteniendo la calidad.
        </li>
        <li>
          <strong>Peso máximo:</strong> 4 MB por foto. Si tu foto pesa más,
          redúcela antes de subirla (puedes usar{" "}
          <a href="https://squoosh.app" target="_blank">Squoosh</a> gratis).
        </li>
        <li>
          <strong>Dimensiones ideales:</strong> 1200 × 1200 píxeles, cuadradas
          (proporción <strong>1:1</strong>). El sitio recorta a cuadrado
          automáticamente; si subes una foto muy alargada, el producto puede
          verse cortado.
        </li>
        <li>
          <strong>Mínimo:</strong> 800 × 800 px. Menos que eso se ve pixelado
          en pantallas grandes.
        </li>
      </ul>

      <h2>2. Fondo y encuadre</h2>
      <ul>
        <li>
          <strong>Fondo blanco o gris muy claro</strong> siempre que sea
          posible. Da un catálogo uniforme y hace que el zapato resalte.
        </li>
        <li>
          Deja <strong>10–15% de aire</strong> alrededor del zapato: no lo pegues
          al borde.
        </li>
        <li>
          Ángulo estándar recomendado: <strong>vista lateral</strong> con la
          punta hacia la derecha. Si subes varias fotos, sigue este orden:
          <ol>
            <li>Vista lateral (principal).</li>
            <li>Vista de tres cuartos.</li>
            <li>Suela.</li>
            <li>Detalle (costuras, logo, textura).</li>
          </ol>
        </li>
      </ul>

      <h2>3. Iluminación y color</h2>
      <ul>
        <li>Luz natural difusa o softbox. Evita el flash directo.</li>
        <li>
          Sin filtros exagerados. El color de la foto debe parecerse al del
          producto real (los clientes se quejan si el color engaña).
        </li>
        <li>Sin sombras muy marcadas ni reflejos sobre el zapato.</li>
      </ul>

      <h2>4. Qué NO subir</h2>
      <ul>
        <li>
          Fotos con <strong>marcas de agua</strong>, logos de otras tiendas, o
          precios estampados sobre la imagen.
        </li>
        <li>
          Capturas de pantalla borrosas o fotos descargadas de WhatsApp muy
          comprimidas.
        </li>
        <li>
          Collages con varias vistas en una sola imagen: sube cada vista como
          foto separada.
        </li>
        <li>
          Fotos con personas cuya cara se vea, salvo que tengas permiso escrito.
        </li>
        <li>
          Imágenes con derechos de autor de otras marcas: solo usa fotografía
          propia o autorizada por el proveedor.
        </li>
      </ul>

      <h2>5. Nombres de archivo</h2>
      <p>
        No importa cómo se llame el archivo al subirlo: el sistema le pone un
        nombre seguro automáticamente. Aun así, ayuda que sea descriptivo (por
        ejemplo <code>mario-negro-lateral.jpg</code>), no algo como{" "}
        <code>IMG_3421.jpeg</code>.
      </p>

      <h2>6. Cuántas fotos por producto</h2>
      <ul>
        <li>Mínimo <strong>1</strong> (la principal).</li>
        <li>Ideal <strong>3 a 5</strong>: principal + tres cuartos + suela + detalle.</li>
        <li>Máximo recomendado <strong>8</strong>: más allá, la ficha se vuelve pesada.</li>
      </ul>

      <h2>7. Precio y descripción</h2>
      <ul>
        <li>
          El <strong>precio principal</strong> es obligatorio si quieres
          mostrarlo. Deja el campo vacío solo si el producto se cotiza en tienda.
        </li>
        <li>
          Usa <strong>precio máximo</strong> únicamente cuando el precio
          cambia según la talla (por ejemplo $35 a $39).
        </li>
        <li>
          El <strong>precio anterior</strong> se muestra tachado; úsalo solo si
          la oferta es real.
        </li>
        <li>
          La <strong>descripción</strong> debe tener 2–4 frases. Evita mayúsculas
          gritadas y emojis.
        </li>
      </ul>

      <h2>8. Fuera de stock</h2>
      <p>
        Si un producto ya no está disponible, entra a su ficha y pulsa
        <strong> “Quitar del catálogo”</strong>. Queda oculto del sitio público
        pero se puede restaurar desde la sección{" "}
        <em>Productos ocultos</em> en la lista principal cuando vuelva a haber
        stock.
      </p>

      <h2>9. En caso de duda</h2>
      <p>
        Si una foto no cumple con estos criterios, es mejor no subirla que
        subir una mala: una foto pobre baja la percepción de toda la marca.
      </p>
    </article>
  );
}
