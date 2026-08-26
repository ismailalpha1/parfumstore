import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
import { getCategories } from "@/sanity/queries";
const Home = () => {
  const categories = await getCategories(6);
  return (
    <Container className="bg-shop-light-pink">
      <HomeBanner/>
      <div className="py-10">
          <ProductGrid/>
      </div>
      <HomeCategories categories={categories}/>
    </Container>
  )
}

export default Home