import { MainImage } from "~/components/main-image";
import { sampleImage } from "~/utils/mockData";





export default function ImageIDRoute() {

  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <MainImage image={sampleImage} />
  </div>
}