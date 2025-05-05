import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('/api/recipes');
        setRecipes(res.data);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, []);

  // Filter recipes based on search and category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories
  const categories = ['all', ...new Set(recipes.map(recipe => recipe.category))];

  // Calculate average rating safely
  const calculateAverageRating = () => {
    if (recipes.length === 0) return 0;
    const totalRating = recipes.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return Math.round((totalRating / recipes.length) * 10) / 10;
  };
  const averageRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Discover Culinary Delights
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our collection of mouth-watering recipes from around the world
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search recipes..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-3.5 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category 
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-slate-300 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No recipes found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecipes.map((recipe) => (
              <PostCard 
                key={recipe._id} 
                recipe={recipe}
                className="transform hover:-translate-y-1 transition-all duration-300"
              />
            ))}
          </div>
        )}

        {/* Stats Section */}
        {!loading && recipes.length > 0 && (
          <div className="mt-16 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-amber-600 mb-2">{recipes.length}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Total Recipes</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {Math.round(recipes.reduce((acc, curr) => acc + (curr.cookingTime || 0), 0) / recipes.length)} min
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Avg. Cooking Time</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {new Set(recipes.map(r => r.category)).size}
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Categories</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {averageRating}/5
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Avg. Rating</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;