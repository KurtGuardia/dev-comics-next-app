import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import fs from 'fs/promises'
import Layout from '../components/Layout'

export default function Home({ latestComics }) {
  return (
    <>
      <Head>
        <title>Xkcd - Comics for developers</title>
        <meta
          name='description'
          content='Comics for developers'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <h2 className='text-3xl font-bold text-center mb-10'>
          Latest Comics
        </h2>
        <section className='grid grid-cols-1 gap-2 max-w-5xl m-auto sm:grid-cols-2 md:grid-cols-3'>
          {latestComics.map((comic) => {
            return (
              <Link
                href={`/comic/${comic.id}`}
                key={comic.id}
              >
                <a className='mb-4 pb-4 m-auto'>
                  <h3 className='font-bold text-sm text-center pb-2'>
                    {comic.title}
                  </h3>
                  <Image
                    src={comic.img}
                    alt={comic.alt}
                    layout='intrinsic'
                    objectFit='contain'
                    width={300}
                    height={300}
                  />
                </a>
              </Link>
            )
          })}
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps = async (context) => {
  const files = await fs.readdir('./comics')
  const latestComicsFiles = files.slice(-8, files.length)

  const promisesReadFiles = latestComicsFiles.map(
    async (file) => {
      const content = await fs.readFile(
        `./comics/${file}`,
        'utf-8',
      )
      return JSON.parse(content)
    },
  )

  const latestComics = await Promise.all(promisesReadFiles)

  return {
    props: {
      latestComics,
    },
  }
}
