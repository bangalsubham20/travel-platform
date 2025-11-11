import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Aishwarya M.',
      trip: 'Thailand Customized Tour',
      text: 'Amazing team! Full support throughout the journey. Highly recommended!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Junaid S.',
      trip: 'Winter Spiti Valley',
      text: 'Trip captains were incredible. Felt like traveling with best friends!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Shriti C.',
      trip: 'Leh Ladakh Trip',
      text: 'Professional yet personal touch. The best-organized trip I've been on!',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">What Wravelers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                <div className="text-yellow-500">{'⭐'.repeat(testimonial.rating)}</div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{testimonial.trip}</p>
              <p className="text-gray-700 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
