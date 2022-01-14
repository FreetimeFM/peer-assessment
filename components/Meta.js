import Head from "next/head";

const Meta = ({children, title, iconLink}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="A peer review assessment system." />
      <link rel="icon" href={iconLink} />
      {children}
    </Head>
  )
}

Meta.defaultProps = {
  title: "Peer assessment system",
  iconLink: "/favicon.ico"
}

export default Meta
