import Head from "next/head";

// Used to add and spedify html metadata.
const Meta = ({ children, title, iconLink }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="A peer review assessment system." />
      <link rel="icon" href={iconLink} />
      {children}
    </Head>
  );
};

// The default values for the parameters.
Meta.defaultProps = {
  title: "Peer assessment system",
  iconLink: "/favicon.ico",
};

export default Meta;
