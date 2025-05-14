// src/pages/RecipeCreatePage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  ingredients: Yup.array()
    .of(Yup.string().required('Ingredient cannot be empty'))
    .min(1, 'At least one ingredient is required'),
  instructions: Yup.array()
    .of(Yup.string().required('Instruction cannot be empty'))
    .min(1, 'At least one instruction is required'),
  imageUrl: Yup.string().url('Must be a valid URL'),
  tags: Yup.array().of(Yup.string()),
});

const RecipeCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post('/recipes', values, {
        headers: { userId: user.id }
      });
      navigate('/my-recipes');
    } catch (error) {
      console.error('Failed to create recipe', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Create New Recipe</Typography>
      
      <Formik
        initialValues={{
          title: '',
          description: '',
          ingredients: [''],
          instructions: [''],
          imageUrl: '',
          tags: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <TextField
              fullWidth
              margin="normal"
              name="title"
              label="Title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.title && !!errors.title}
              helperText={touched.title && errors.title}
            />
            
            <TextField
              fullWidth
              margin="normal"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={values.description}
              onChange={handleChange}
            />
            
            <Typography variant="h6" gutterBottom>Ingredients</Typography>
            <FieldArray name="ingredients">
              {({ push, remove }) => (
                <div>
                  {values.ingredients.map((ingredient, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <TextField
                        fullWidth
                        name={`ingredients.${index}`}
                        value={ingredient}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.ingredients && !!errors.ingredients?.[index]}
                        helperText={touched.ingredients && errors.ingredients?.[index]}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          color="error"
                          style={{ marginLeft: '10px' }}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  ))}
                  <Button
                    type="button"
                    onClick={() => push('')}
                    variant="outlined"
                  >
                    Add Ingredient
                  </Button>
                </div>
              )}
            </FieldArray>
            
            {/* Similar FieldArray for instructions */}
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              style={{ marginTop: '20px' }}
            >
              Create Recipe
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default RecipeCreatePage;