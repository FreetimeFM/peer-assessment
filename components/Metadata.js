import Head from "next/head";

/**
 * Metadata tags for the current page.
 * @param {*} props Takes in the page title and children for the meta tag.
 */
const Metadata = ({ children, title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="A peer review assessment system." />
      <link rel="icon" href="/favicon.ico" />
      {children}
    </Head>
  );
};

// The default values for the parameters.
Metadata.defaultProps = {
  title: "Peer assessment system",
};

export default Metadata;
