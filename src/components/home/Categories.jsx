import React from 'react';

function Categories() {
  const categories = [
    { id: 1, name: 'Trekking', icon: '⛰️' },
    { id: 2, name: 'Backpacking', icon: '🎒' },
    { id: 3, name: 'All Girls', icon: '👩‍👩‍👩' },
    { id: 4, name: 'Biking', icon: '🏍️' },
    { id: 5, name: 'Weekend', icon: '🏕️' },
    { id: 6, name: 'International', icon: '✈️' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center">
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-gray-800">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
