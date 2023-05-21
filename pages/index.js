import path from 'path';
import fs from 'fs/promises';
import Link from 'next/link';

const HomePage = (props) => {
  const { products } = props; //This is the data that was returned from getStaticProps

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
};
export default HomePage;

export const getStaticProps = async (context) => {
  console.log('Re-Generating...');
  //This function is for pre-rendering pages in Next.js
  // ALways returns an object with a props key - the data is up to the developer. The data will be passed to the component as props

  //We can use serverside extentions like fs to read files and this will be seperate from the client side code
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  if (!data) {
    //This is a check to see if the data is null and redirects to whatever page we choose
    return {
      redirect: {
        destination: '/no-data',
      },
    };
  }

  if (data.products.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 10, //This is the number of seconds that Next.js will wait before regenerating the page

    //notFound: true, //This is a boolean that will tell Next.js if the page is not found -
    //This is good if the fetch fails and we want to show a 404 page - We can implement a check as seen above

    //redirect: { //This is an object that will redirect to a different page
  };
};
