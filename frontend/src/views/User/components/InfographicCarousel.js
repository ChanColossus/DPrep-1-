import React from 'react';
import Carousel from 'react-elastic-carousel';

export default function InfographicCarousel({ infographics }) {
  const imageUrls = infographics.reduce((acc, infographic) => {
    infographic.gimages.forEach(image => {
      acc.push(image.url);
    });
    return acc;
  }, []);

  const carouselItems = imageUrls.map((imageUrl, index) => (
    <div key={index} style={{ maxWidth: '100%', maxHeight: '100%', width: '400px', height: '400px' }}> {/* Adjust width and height as needed */}
      <img src={imageUrl} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  ));

  return (
    <Carousel>
      {carouselItems}
    </Carousel>
  );
}
