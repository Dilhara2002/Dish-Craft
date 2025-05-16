import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RecipeList from './RecipeList';
import RecipeForm from './RecipeForm';
import RecipeDetail from './RecipeDetail';

const RecipeRoutes = ({ token, userId }) => {
  return (
    <Routes>
      <Route path="/" element={<RecipeList token={token} userId={userId} />} />
      <Route path="/new" element={<RecipeForm token={token} userId={userId} onSuccess={() => window.location.reload()} />} />
      <Route path="/edit/:id" element={<RecipeForm token={token} userId={userId} onSuccess={() => window.location.reload()} />} />
      <Route path="/:id" element={<RecipeDetail token={token} userId={userId} />} />
    </Routes>
  );
};

export default RecipeRoutes;