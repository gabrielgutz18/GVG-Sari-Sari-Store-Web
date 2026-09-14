Product photos for this category go in this folder.

MAIN PHOTO
Name the file after the product id in src/data/products.js and it is picked
up automatically -- there is no import to add.

    { id: "cream-o", name: "Cream-O", price: 55 }
      ->  src/assets/drinks/cream-o.png

Ids are lowercase with dashes. Accepted: .png .jpg .jpeg .webp .avif
A product with no matching file just keeps the "Photo soon" placeholder.

MORE PHOTOS (the gallery on the product page)
Make a folder named after the product id and drop the extra shots inside.
They become extra slides, in filename order, after the main photo:

    src/assets/drinks/cream-o.png          ->  slide 1, and the tile photo
    src/assets/drinks/cream-o/2-back.png   ->  slide 2
    src/assets/drinks/cream-o/3-open.png   ->  slide 3

FLAVOR PHOTOS
Same folder. Name the file after the flavor's id in the product's `variants`
block and that flavor gets its own packaging shot:

    src/assets/drinks/cream-o/ube.png      ->  { id: 'ube', name: 'Ube' }

Picking the flavor on the page jumps the gallery to its photo. A flavor with
no photo yet falls back to the main one.

Square images (about 600x600) look best. Please export as WEBP where you can
-- a 1000px PNG can be ~900KB, the same picture as WEBP is usually under 80KB.
