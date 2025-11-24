import ImageGallery from "~/components/image-gallery";
import { MainImage } from "~/components/main-image";



const sampleImage = {
  id: "1",
  url: "https://picsum.photos/id/10/1200/800",
  title: "Forest Path",
  author: "Paul Jarvis",
  date: "2023-11-01",
  tags: ["nature", "forest", "green"],
}


export default function Gallery() {
  return <>
    <div className="mx-auto py-4 max-w-7xl sm:px-6 lg:px-8" >

      <MainImage image={sampleImage} />
    </div>
    <ImageGallery />
  </>
}