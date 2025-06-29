import Masonry from "react-masonry-css";
import GalleryCard from "./GalleryCard";

export default function SortableGallery({ images, onView }) {
  const breakpointCols = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="flex gap-4"
      columnClassName="flex flex-col gap-4">
      {images.map((img) => (
        <GalleryCard key={img.id} image={img} onClick={onView} />
      ))}
    </Masonry>
  );
}
