
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Loader2 } from 'lucide-react';
import RecipeCard from '@/components/recipe/RecipeCard';

const SavedRecipes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  
  useEffect(() => {
    if (!user) return;
    
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('saved_recipes')
          .select('*, expert:nutrition_experts(*)')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setRecipes(data || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        toast({
          title: "Error",
          description: "Failed to load your saved recipes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [user, toast]);
  
  const handleViewRecipe = (id: string) => {
    navigate(`/recipe/${id}`);
  };
  
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = searchTerm === '' || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCuisine = cuisineFilter === 'all' || 
      recipe.cuisine_type === cuisineFilter;
      
    return matchesSearch && matchesCuisine;
  });
  
  const uniqueCuisines = Array.from(new Set(recipes.map(r => r.cuisine_type).filter(Boolean)));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-nutrition-800 mb-8">My Saved Recipes</h1>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search recipes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <Select 
                value={cuisineFilter} 
                onValueChange={setCuisineFilter}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>
                      {cuisineFilter === 'all' ? 'All Cuisines' : cuisineFilter.charAt(0).toUpperCase() + cuisineFilter.slice(1)}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  {uniqueCuisines.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Recipe Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-nutrition-600" />
            </div>
          ) : filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onView={handleViewRecipe} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium">No recipes found</h3>
              <p className="text-muted-foreground mt-2">
                {recipes.length > 0 
                  ? "Try adjusting your search or filter criteria." 
                  : "You haven't saved any recipes yet."}
              </p>
              {recipes.length === 0 && (
                <Button 
                  onClick={() => navigate('/recipe-generator')} 
                  className="mt-4 bg-nutrition-700 hover:bg-nutrition-800"
                >
                  Generate Your First Recipe
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SavedRecipes;
