import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ recipe }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition">
      <Link to={`/recipes/${recipe._id}`}>
        <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
        <p className="text-gray-600 mb-2">{recipe.description?.slice(0, 100)}...</p>
        <div className="text-sm text-gray-500">By {recipe.author?.username}</div>
      </Link>
    </div>
  );
};

export default PostCard;
