import Container from "@/components/Container";
import {Button} from "@/components/ui/button";
const Home = () => {
  return (
    <Container className="bg-shop-light-pink">
      <h2 className="text-xl font-semibold">home</h2>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae velit atque veniam quidem, dolorem eaque culpa dolorum fugiat! Quos ut dolorum quia esse temporibus dolores voluptatum quae repellendus harum consectetur?</p>
      <Button variant="destructive">Click Me</Button>
    </Container>
  )
}

export default Home