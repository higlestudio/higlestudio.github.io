import sharp from 'sharp';
import { opere } from '../../dati';

export async function getStaticPaths() {
  return (await opere()).map((o) => ({ params: { slug: o.id }, props: { foto: o.data.foto[0].immagine } }));
}

export async function GET({ props }: { props: { foto: string } }) {
  const dati = await sharp(`public${props.foto}`).resize(1200, 900, { fit: 'inside' }).webp({ quality: 82 }).toBuffer();
  return new Response(new Uint8Array(dati), { headers: { 'Content-Type': 'image/webp' } });
}
