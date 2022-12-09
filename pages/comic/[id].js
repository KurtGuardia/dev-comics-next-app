import Head from 'next/head'
import Image from 'next/image'
import Header from '../../components/Header'
import { readFile } from 'fs/promises'
import { useEffect, useState } from 'react'
import { stat } from 'fs/promises'

export default ({ img, alt, title }) => {
  const [display, setDisplay] = useState(false)
  useEffect(() => {
    if (img !== undefined) {
      setDisplay(true)
    }
  }, [img])

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

      <Header />

      <main>
        <section className='max-w-lg m-auto'>
          <h1>{title}</h1>
          {display ? (
            <Image
              width={450}
              height={450}
              src={img}
              alt={alt}
            />
          ) : (
            ''
          )}
          <p>{alt}</p>
        </section>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '2500' } }],
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const { id } = params
  const content = await readFile(
    `./comics/${id}.json`,
    'utf-8',
  )
  const comic = JSON.parse(content)

  const idNumber = +id
  const prevId = idNumber - 1
  const nextId = idNumber + 1

  const results = Promise.allSettled([
    stat(`./comics/${prevId}.json`, (error, stats) => {
      if (error) {
        console.log(error)
      } else {
        console.log(stats)

        // Using methods of the Stats object
        console.log('Path is file:', stats.isFile())
        console.log(
          'Path is directory:',
          stats.isDirectory(),
        )
      }
    }),
    stat(`./comics/${nextId}.json`, (error, stats) => {
      if (error) {
        console.log(error)
      } else {
        console.log(stats)

        // Using methods of the Stats object
        console.log('Path is file:', stats.isFile())
        console.log(
          'Path is directory:',
          stats.isDirectory(),
        )
      }
    }),
  ])

  console.log(results)

  return {
    props: {
      ...comic,
    },
  }
}
