'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import IngredientForm from '@/components/IngredientForm';
import RecipeList from '@/components/RecipeList';
import useLocalStorage from '@/hooks/use-local-storage';
import { Recipe } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Utensils } from 'lucide-react';

export default function Home() {
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorite-recipes', []);

  const handleSuggestion = (recipes: Recipe[]) => {
    setSuggestedRecipes(recipes);
  };

  const toggleFavorite = (recipe: Recipe) => {
    const isFavorite = favorites.some((fav) => fav.name === recipe.name);
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.name !== recipe.name));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4">
            What's in your fridge?
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter the ingredients you have, and your AI Chef will whip up some recipe ideas for you!
          </p>
        </div>
        <IngredientForm onSuggest={handleSuggestion} setIsLoading={setIsLoading} isLoading={isLoading} />
        
        <div className="mt-12">
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
              <TabsTrigger value="suggestions">
                <Utensils className="w-4 h-4 mr-2"/>
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="w-4 h-4 mr-2" />
                Favorites ({favorites.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="suggestions">
              <RecipeList
                recipes={suggestedRecipes}
                isLoading={isLoading}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                emptyStateMessage="Your recipe suggestions will appear here. Let's get cooking!"
              />
            </TabsContent>
            <TabsContent value="favorites">
               <RecipeList
                recipes={favorites}
                isLoading={false}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                emptyStateMessage="You haven't favorited any recipes yet. Find a recipe you like and click the heart to save it!"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="text-center p-6 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} ChefGPT. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
