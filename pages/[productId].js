import path from 'path';
import fs from 'fs/promises';

const ProductDetailPage = (props) => {
  //If we use useEffect here then the seo will not see the data when the request is sent - we need a different approach
  const { loadedProduct } = props; //This is the data that was returned from getStaticProps

  if (!loadedProduct) {
    //THis a failsafe if the data is not loaded
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </div>
  );
};
export default ProductDetailPage;

export const getStaticProps = async (context) => {
  //We want to know which product we need to display and we find that in the context object where we can access the params
  const { params } = context; //Params is a property of context

  const productId = params.productId; //Before we had access to the url by using the useRouter hook but we want to use this if we want it to happen
  //on the server side
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  const product = data.products.find((product) => product.id === productId);

  return {
    props: {
      loadedProduct: product,
    },
  };
};

export const getStaticPaths = async () => {
  //The goal of this function is to tell Next.js which dynamic pages it should pre-render
  return {
    paths: [
      //This is an array of objects that contain the params that we want to pre-render
      { params: { productId: 'p1' } },
    ],
    fallback: true, //This is a boolean that tells Next.js that if the page is not found then it should try to generate it.
    //THis is good for pages that are rarely visited and we don't want to explicitly pre-render them.

    //***** WE can set fallback to 'blocking' and this will tell Next.js to wait until the page is generated before it is served and we don't need the check
    //I like the loading state so I will leave it as true

    //If the fallback is set to true then we need to add a check in the component to see if the data is loaded because it will be undefined
  };
};
