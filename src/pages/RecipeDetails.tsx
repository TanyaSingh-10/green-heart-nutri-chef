import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, ChefHat, ArrowLeft, Youtube } from 'lucide-react';

const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<any>(null);
  const [expert, setExpert] = useState<any>(null);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('saved_recipes')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setRecipe(data);
        
        // Fetch expert data
        if (data.expert_id) {
          const { data: expertData, error: expertError } = await supabase
            .from('nutrition_experts')
            .select('*')
            .eq('id', data.expert_id)
            .single();
          
          if (!expertError) {
            setExpert(expertData);
          }
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast({
          title: "Error",
          description: "Failed to load recipe details.",
          variant: "destructive",
        });
        navigate('/saved-recipes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id, navigate, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-16 px-4 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-nutrition-600" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-16 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Recipe Not Found</h2>
            <Button onClick={() => navigate('/saved-recipes')}>
              Back to Recipes
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/saved-recipes')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Recipes</span>
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-nutrition-800 mb-2">{recipe.title}</h1>
              <p className="text-muted-foreground mb-6">{recipe.description}</p>
              
              {recipe.image_url && (
                <div className="rounded-lg overflow-hidden mb-8 max-h-[400px]">
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mb-6">
                {recipe.cuisine_type && (
                  <Badge className="bg-nutrition-100 text-nutrition-800 hover:bg-nutrition-200 capitalize">
                    {recipe.cuisine_type}
                  </Badge>
                )}
                {recipe.prep_time && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Prep: {recipe.prep_time} min</span>
                  </div>
                )}
                {recipe.cook_time && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Cook: {recipe.cook_time} min</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>{ingredient.emoji}</span>
                        <span>{ingredient.name}: {ingredient.amount}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                  <ol className="space-y-4 list-decimal list-inside">
                    {recipe.instructions.map((instruction: any, idx: number) => (
                      <li key={idx} className="pl-1">
                        <span className="font-medium">Step {instruction.step}:</span> {instruction.description}
                      </li>
                    ))}
                  </ol>
                </section>
                
                {recipe.nutrition_info && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Nutrition Information</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="text-lg font-medium">{recipe.nutrition_info.calories}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="text-lg font-medium">{recipe.nutrition_info.protein}g</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="text-lg font-medium">{recipe.nutrition_info.carbs}g</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Fat</p>
                        <p className="text-lg font-medium">{recipe.nutrition_info.fat}g</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Fiber</p>
                        <p className="text-lg font-medium">{recipe.nutrition_info.fiber}g</p>
                      </div>
                    </div>
                  </section>
                )}
                
                {recipe.youtube_link && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Video Tutorial</h2>
                    <a 
                      href={recipe.youtube_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                      <Youtube className="h-5 w-5" />
                      <span>Watch on YouTube</span>
                    </a>
                  </section>
                )}
              </div>
            </div>
            
            <div>
              {expert && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Expert</CardTitle>
                    <CardDescription>Recipe by</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center text-center">
                      {expert.image_url && (
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                          <img 
                            src={expert.image_url} 
                            alt={expert.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-medium text-lg">{expert.name}</h3>
                      <p className="text-sm text-muted-foreground">{expert.title}</p>
                      <p className="text-sm mt-4">{expert.specialization}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-nutrition-700">•</span>
                      <span>Prepare all ingredients before starting to cook for a smoother process.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-nutrition-700">•</span>
                      <span>Adjust seasonings to your taste preference.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-nutrition-700">•</span>
                      <span>Store leftovers in an airtight container in the refrigerator for up to 3 days.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetails;
