import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import RecipeService from '../api/RecipeService';

const SearchRecipes = ({ token, onSearchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const results = await RecipeService.searchRecipes(query, token);
      onSearchResults(results);
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  };

  return (
    <Form onSubmit={handleSearch} className="mb-4">
      <Row>
        <Col md={9}>
          <Form.Control
            type="text"
            placeholder="Search recipes by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button variant="primary" type="submit" className="w-100">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchRecipes;