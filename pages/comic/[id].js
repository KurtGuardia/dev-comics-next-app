import Head from 'next/head'
import Image from 'next/image'
import { readFile, stat, readdir } from 'fs/promises'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { basename } from 'path'
import Layout from '../../components/Layout'

export default ({
  img,
  alt,
  title,
  hasNext,
  hasPrevious,
  nextId,
  prevId,
}) => {
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
      <Layout>
        <section className='max-w-lg m-auto'>
          <h1 className='font-bold text-xl text-center mb-4'>
            {title}
          </h1>
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

          <div className='flex justify-between mt-4 font-bold'>
            {hasPrevious && (
              <Link href={`/comic/${prevId}`}>
                <a className='text-gray-600'>Previous</a>
              </Link>
            )}
            {hasNext && (
              <Link href={`/comic/${nextId}`}>
                <a className='text-gray-600'>Next</a>
              </Link>
            )}
          </div>
        </section>
      </Layout>
    </>
  )
}

export async function getStaticPaths() {
  const files = await readdir('./comics')

  const paths = files.map((file) => {
    const id = basename(file, '.json')
    return { params: { id } }
  })

  return {
    paths,
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

  const [prevResult, nextResult] = await Promise.allSettled(
    [
      stat(`./comics/${prevId}.json`),
      stat(`./comics/${nextId}.json`),
    ],
  )

  const hasNext = nextResult.status === 'fulfilled'
  const hasPrevious = prevResult.status === 'fulfilled'

  return {
    props: {
      ...comic,
      hasNext,
      hasPrevious,
      nextId,
      prevId,
    },
  }
}
