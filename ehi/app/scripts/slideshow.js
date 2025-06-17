let slideshowInterval;
let currentImageIndex = 0;
let slideshowImages = [];
let slideshowLayer1;
let slideshowLayer2;
let activeLayer; // Tracks which layer is currently showing
let fadeDuration = 1000; // Default fade duration

export function startSlideshow(
  wrapperId,
  layer1Id,
  layer2Id,
  images,
  interval = 5000,
  duration = 1000
) {
  const slideshowWrapper = document.getElementById(wrapperId);
  slideshowLayer1 = document.getElementById(layer1Id);
  slideshowLayer2 = document.getElementById(layer2Id);

  if (!slideshowWrapper || !slideshowLayer1 || !slideshowLayer2) {
    console.error("One or more slideshow containers not found. Check IDs.");
    return;
  }

  if (!images || images.length === 0) {
    console.warn("No images provided for the slideshow.");
    return;
  }

  slideshowImages = images;
  fadeDuration = duration;

  // Preload images (optional, but good for smooth transitions)
  preloadImages(slideshowImages);

  // Set the initial image on the first layer
  slideshowLayer1.style.backgroundImage = `url('${slideshowImages[currentImageIndex]}')`;
  slideshowLayer1.classList.add("active"); // Make it visible
  activeLayer = slideshowLayer1;

  // Start the slideshow interval
  slideshowInterval = setInterval(() => {
    // Increment index for the next image
    currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
    const nextImageUrl = slideshowImages[currentImageIndex];

    let nextLayer;
    let prevLayer;

    if (activeLayer === slideshowLayer1) {
      nextLayer = slideshowLayer2;
      prevLayer = slideshowLayer1;
    } else {
      nextLayer = slideshowLayer1;
      prevLayer = slideshowLayer2;
    }

    // Set the background image for the next layer
    nextLayer.style.backgroundImage = `url('${nextImageUrl}')`;

    // Start fading in the next layer
    nextLayer.classList.add("active");

    // After a delay (fadeDuration), fade out the previous layer
    setTimeout(() => {
      prevLayer.classList.remove("active");
      // Important: Clear the background of the prevLayer once it's fully faded out
      // This prevents old images from briefly showing if the next one loads slowly
      // or if transitions are interrupted.
      prevLayer.style.backgroundImage = "none";
    }, fadeDuration);

    // Update the active layer
    activeLayer = nextLayer;
  }, interval); // This interval includes the fade duration.
}

function preloadImages(imageUrls) {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

export function stopSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    console.log("Slideshow stopped.");
  }
}
