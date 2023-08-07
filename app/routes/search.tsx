import { Form, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

type Ingredient = {
  name: string;
};

type Recipe = {
  id: number;
  title: string;
  instructions: string;
  ingredients: Ingredient[];
  category: string;
  region: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || 'pizza';
  const requestURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
  const response = await fetch(requestURL);
  const data = await response.json();

  if (data.meals && data.meals.length > 0) {
    const meal = data.meals[0];
    const ingredients: Ingredient[] = [];
    const ingredientKeys = Object.keys(meal).filter((key) =>
      key.startsWith('strIngredient')
    );
    ingredientKeys.forEach((key) => {
      const ingredient = meal[key];
      if (ingredient) {
        ingredients.push({ name: ingredient });
      }
    });

    const recipe: Recipe = {
      id: parseInt(meal.idMeal),
      title: meal.strMeal,
      instructions: meal.strInstructions,
      ingredients: ingredients,
      category: meal.strCategory,
      region: meal.strArea,
    };


    return json({ ...recipe, ingredients });
  } else {
    return json({ error: 'Recipe not found' }, { status: 404 });
  }
};

export default function Search() {
  const data = useLoaderData<Recipe>();
  console.log('Data: ', data);
  const instructionSteps = data.instructions.replace(/(\d+)/g, '$1.');
  const instructions = instructionSteps.split('\r\n\r\n');

  return (
    <div className='flex flex-col gap-6'>
      <Form>
        <input type='text' name='query' placeholder='Search Recipe' />
        <button type='submit'>Search</button>
      </Form>
      {data ? (
        <div>
          <div className='mb-5'>
            <h2 className='text-5xl mb-5'>{data.title}</h2>
            <h3 className='text-2xl'>Ingredients: </h3>
            <ul>
              {data.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name}</li>
              ))}
            </ul>
            <h3 className='text-2xl'>Instructions: </h3>
            <ol>
              {instructions.map((instruction: string, index: number) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          <h4 className='text-xl'>Category: {data.category}</h4>
          <h4 className='text-xl'>Region: {data.region}</h4>
        </div>
      ) : (
        <p>No recipe found.</p>
      )}
    </div>
  );
}
