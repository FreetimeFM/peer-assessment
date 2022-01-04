import Head from "next/head";

const Meta = ({title}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="A peer review assessment system." />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

Meta.defaultProps = {
  title: "Peer assessment system"
}

export default Meta
