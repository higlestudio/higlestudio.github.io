import sharp from 'sharp';
import { opere, fondoDi } from '../../dati';

export async function getStaticPaths() {
  return (await opere()).map((o) => ({ params: { slug: o.id }, props: { foto: o.data.foto[0].immagine } }));
}

export async function GET({ props }: { props: { foto: string } }) {
  const fondo = await fondoDi(props.foto);
  const dati = await sharp(`public${props.foto}`)
    .resize(1200, 630, { fit: 'contain', background: fondo })
    .flatten({ background: fondo })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(dati), { headers: { 'Content-Type': 'image/jpeg' } });
}
