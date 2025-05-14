
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radio, RadioGroup } from '@/components/ui/radio-group';
import { Loader2, ChefHat, Utensils, Clock } from 'lucide-react';
import RecipeCard from '@/components/recipe/RecipeCard';

const generatorSchema = z.object({
  mealType: z.string(),
  complexity: z.string(),
  prepTime: z.string(),
  servings: z.string(),
});

type GeneratorFormValues = z.infer<typeof generatorSchema>;

const RecipeGenerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<any>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [expert, setExpert] = useState<any>(null);
  
  const form = useForm<GeneratorFormValues>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      mealType: 'main',
      complexity: 'medium',
      prepTime: '30',
      servings: '2',
    },
  });

  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching preferences:', error);
        if (error.code === 'PGRST116') {
          toast({
            title: "Preferences not found",
            description: "Please set your dietary preferences first.",
            variant: "destructive",
          });
          navigate('/preferences');
        }
        return;
      }
      
      setPreferences(data);
    };

    fetchPreferences();
  }, [user, navigate, toast]);

  const generateRecipe = async (values: GeneratorFormValues) => {
    if (!user || !preferences) return;
    
    setLoading(true);
    setGeneratedRecipe(null);
    
    try {
      // Fetch a random expert
      const { data: experts, error: expertError } = await supabase
        .from('nutrition_experts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (expertError) throw expertError;
      
      const selectedExpert = experts[Math.floor(Math.random() * experts.length)];
      setExpert(selectedExpert);
      
      // Generate mock recipe based on preferences and form values
      const mockRecipe = generateMockRecipe(preferences, values, selectedExpert);
      
      // Insert the recipe into the database
      const { data, error } = await supabase
        .from('saved_recipes')
        .insert({
          user_id: user.id,
          title: mockRecipe.title,
          description: mockRecipe.description,
          ingredients: mockRecipe.ingredients,
          instructions: mockRecipe.instructions,
          nutrition_info: mockRecipe.nutrition_info,
          cuisine_type: mockRecipe.cuisine_type,
          prep_time: parseInt(values.prepTime),
          cook_time: parseInt(values.prepTime) / 2,
          expert_id: selectedExpert.id,
          youtube_link: mockRecipe.youtube_link,
          image_url: mockRecipe.image_url,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setGeneratedRecipe(data);
      toast({
        title: "Recipe Generated",
        description: `"${data.title}" has been created based on your preferences.`,
      });
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecipe = (preferences: any, formValues: GeneratorFormValues, expert: any) => {
    // This would normally be done by an AI or a more sophisticated algorithm
    // For demo purposes, we're creating mock data based on user preferences
    
    const cuisines = preferences.cuisine_preferences && preferences.cuisine_preferences.length > 0
      ? preferences.cuisine_preferences
      : ['italian', 'mexican', 'asian', 'mediterranean'];
    
    const selectedCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    
    const allergies = preferences.allergies || [];
    const dietaryRestrictions = preferences.dietary_restrictions || [];
    const isVegetarian = dietaryRestrictions.includes('vegetarian');
    const isVegan = dietaryRestrictions.includes('vegan');
    
    // Recipe templates by cuisine
    const recipeTemplates: Record<string, any[]> = {
      italian: [
        {
          title: "Creamy Tomato Pasta",
          description: "A delicious pasta dish with creamy tomato sauce and herbs.",
          ingredients: [
            { name: "Pasta", amount: "200g", emoji: "🍝" },
            { name: "Tomatoes", amount: "4 medium", emoji: "🍅" },
            { name: "Olive Oil", amount: "2 tbsp", emoji: "🫒" },
            { name: "Garlic", amount: "3 cloves", emoji: "🧄" },
            { name: "Basil", amount: "1 handful", emoji: "🌿" },
            { name: isVegan ? "Coconut Cream" : "Heavy Cream", amount: "1/2 cup", emoji: "🥛" },
            { name: isVegan ? "Nutritional Yeast" : "Parmesan Cheese", amount: "1/4 cup", emoji: "🧀" }
          ],
          instructions: [
            { step: 1, description: "Boil water and cook pasta according to package instructions." },
            { step: 2, description: "Heat olive oil in a pan and add minced garlic, sauté until fragrant." },
            { step: 3, description: "Add diced tomatoes and cook until they break down, about 10 minutes." },
            { step: 4, description: `Add ${isVegan ? "coconut cream" : "heavy cream"} and simmer for 5 minutes.` },
            { step: 5, description: "Drain pasta and add to the sauce, toss to combine." },
            { step: 6, description: `Top with fresh basil and ${isVegan ? "nutritional yeast" : "grated parmesan"}.` }
          ],
          nutrition_info: {
            calories: 450,
            protein: 12,
            carbs: 65,
            fat: 18,
            fiber: 4
          },
          youtube_link: "https://www.youtube.com/watch?v=Upqp21Dm5vg",
          image_url: "https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          title: "Mushroom Risotto",
          description: "Creamy Italian risotto with wild mushrooms and herbs.",
          ingredients: [
            { name: "Arborio Rice", amount: "1 cup", emoji: "🍚" },
            { name: "Mushrooms", amount: "200g", emoji: "🍄" },
            { name: "Vegetable Broth", amount: "4 cups", emoji: "🥣" },
            { name: "White Wine", amount: "1/2 cup", emoji: "🍷" },
            { name: "Onion", amount: "1 medium", emoji: "🧅" },
            { name: "Garlic", amount: "2 cloves", emoji: "🧄" },
            { name: isVegan ? "Vegan Butter" : "Butter", amount: "2 tbsp", emoji: "🧈" },
            { name: "Thyme", amount: "1 tsp", emoji: "🌿" },
            { name: isVegan ? "Nutritional Yeast" : "Parmesan Cheese", amount: "1/4 cup", emoji: "🧀" }
          ],
          instructions: [
            { step: 1, description: "Heat vegetable broth in a pot and keep it simmering." },
            { step: 2, description: `In another pot, sauté diced onion in ${isVegan ? "vegan butter" : "butter"} until translucent.` },
            { step: 3, description: "Add minced garlic and sliced mushrooms, cook until mushrooms are browned." },
            { step: 4, description: "Add arborio rice and stir for 1-2 minutes until slightly toasted." },
            { step: 5, description: "Add white wine and cook until absorbed." },
            { step: 6, description: "Add hot broth one ladle at a time, stirring constantly until absorbed before adding more." },
            { step: 7, description: "Continue until rice is creamy and al dente, about 18-20 minutes." },
            { step: 8, description: `Stir in thyme and ${isVegan ? "nutritional yeast" : "parmesan cheese"}.` }
          ],
          nutrition_info: {
            calories: 380,
            protein: 8,
            carbs: 58,
            fat: 12,
            fiber: 3
          },
          youtube_link: "https://www.youtube.com/watch?v=VOBRECKKMUc",
          image_url: "https://images.unsplash.com/photo-1633964913295-ceb43826e7cd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
      ],
      mexican: [
        {
          title: isVegetarian ? "Bean and Veggie Tacos" : "Beef Street Tacos",
          description: `Authentic ${isVegetarian ? "vegetarian" : "beef"} tacos with fresh toppings and homemade salsa.`,
          ingredients: [
            { name: isVegetarian ? "Black Beans" : "Ground Beef", amount: isVegetarian ? "1 can" : "500g", emoji: isVegetarian ? "🫘" : "🥩" },
            { name: "Corn Tortillas", amount: "8 small", emoji: "🌮" },
            { name: "Onion", amount: "1 medium", emoji: "🧅" },
            { name: "Cilantro", amount: "1 bunch", emoji: "🌿" },
            { name: "Lime", amount: "2", emoji: "🍋" },
            { name: "Avocado", amount: "1 large", emoji: "🥑" },
            { name: "Tomatoes", amount: "2 medium", emoji: "🍅" },
            { name: "Jalapeño", amount: "1", emoji: "🌶️" }
          ],
          instructions: [
            { step: 1, description: isVegetarian ? "Drain and rinse black beans, then sauté with spices." : "Brown ground beef with spices and drain excess fat." },
            { step: 2, description: "Dice onion, tomatoes, and jalapeño for salsa." },
            { step: 3, description: "Chop cilantro and slice limes into wedges." },
            { step: 4, description: "Mash avocado with lime juice, salt, and diced onion to make guacamole." },
            { step: 5, description: "Warm tortillas on a dry skillet or directly over flame." },
            { step: 6, description: "Assemble tacos with all ingredients and serve with lime wedges." }
          ],
          nutrition_info: {
            calories: isVegetarian ? 320 : 420,
            protein: isVegetarian ? 12 : 24,
            carbs: 45,
            fat: isVegetarian ? 10 : 20,
            fiber: 8
          },
          youtube_link: isVegetarian ? 
            "https://www.youtube.com/watch?v=LsXkMn7pQmw" : 
            "https://www.youtube.com/watch?v=dYOGH3v3bOw",
          image_url: isVegetarian ?
            "https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" :
            "https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=1092&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
      ],
      indian: [
        {
          title: isVegetarian ? "Vegetable Curry" : "Butter Chicken",
          description: `Rich and aromatic ${isVegetarian ? "vegetable" : "chicken"} curry with warm Indian spices.`,
          ingredients: [
            { name: isVegetarian ? "Mixed Vegetables" : "Chicken Thighs", amount: isVegetarian ? "4 cups" : "800g", emoji: isVegetarian ? "🥕" : "🍗" },
            { name: "Onion", amount: "2 large", emoji: "🧅" },
            { name: "Garlic", amount: "4 cloves", emoji: "🧄" },
            { name: "Ginger", amount: "1 inch piece", emoji: "🥢" },
            { name: "Tomatoes", amount: "3 large", emoji: "🍅" },
            { name: "Coconut Milk", amount: "1 can", emoji: "🥥" },
            { name: "Curry Powder", amount: "2 tbsp", emoji: "🍛" },
            { name: "Garam Masala", amount: "1 tsp", emoji: "🌶️" },
            { name: "Turmeric", amount: "1 tsp", emoji: "💛" },
            { name: "Cilantro", amount: "1 handful", emoji: "🌿" },
            { name: isVegan ? "Rice" : "Basmati Rice", amount: "2 cups", emoji: "🍚" }
          ],
          instructions: [
            { step: 1, description: "Sauté diced onions until golden brown." },
            { step: 2, description: "Add minced garlic and ginger, cook until fragrant." },
            { step: 3, description: "Add spices and stir for 30 seconds until aromatic." },
            { step: 4, description: "Add diced tomatoes and cook until they break down." },
            { step: 5, description: isVegetarian ? 
              "Add mixed vegetables and coconut milk, simmer until vegetables are tender." : 
              "Add chicken pieces and coconut milk, simmer until chicken is fully cooked." },
            { step: 6, description: "Serve over rice and garnish with fresh cilantro." }
          ],
          nutrition_info: {
            calories: isVegetarian ? 380 : 550,
            protein: isVegetarian ? 8 : 35,
            carbs: 45,
            fat: isVegetarian ? 18 : 28,
            fiber: 6
          },
          youtube_link: isVegetarian ? 
            "https://www.youtube.com/watch?v=BHcyuzXRqLs" : 
            "https://www.youtube.com/watch?v=a03U45jFxOI",
          image_url: isVegetarian ?
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" :
            "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
      ],
      mediterranean: [
        {
          title: "Greek Salad",
          description: "Fresh and vibrant Greek salad with homemade dressing.",
          ingredients: [
            { name: "Cucumbers", amount: "2 medium", emoji: "🥒" },
            { name: "Tomatoes", amount: "4 medium", emoji: "🍅" },
            { name: "Red Onion", amount: "1 small", emoji: "🧅" },
            { name: "Bell Pepper", amount: "1 large", emoji: "🫑" },
            { name: "Kalamata Olives", amount: "1/2 cup", emoji: "🫒" },
            { name: isVegan ? "Tofu Feta" : "Feta Cheese", amount: "200g", emoji: "🧀" },
            { name: "Olive Oil", amount: "1/4 cup", emoji: "🫒" },
            { name: "Lemon Juice", amount: "2 tbsp", emoji: "🍋" },
            { name: "Oregano", amount: "1 tsp", emoji: "🌿" }
          ],
          instructions: [
            { step: 1, description: "Dice cucumbers, tomatoes, red onion, and bell pepper." },
            { step: 2, description: "Combine vegetables in a large bowl with olives." },
            { step: 3, description: `Crumble ${isVegan ? "tofu feta" : "feta cheese"} over the top.` },
            { step: 4, description: "In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper." },
            { step: 5, description: "Pour dressing over salad and toss gently to combine." },
            { step: 6, description: "Let sit for 10 minutes before serving to allow flavors to meld." }
          ],
          nutrition_info: {
            calories: 280,
            protein: 8,
            carbs: 12,
            fat: 22,
            fiber: 4
          },
          youtube_link: "https://www.youtube.com/watch?v=9ajF5FLMUAY",
          image_url: "https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=1890&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          title: isVegetarian ? "Falafel Wrap" : "Greek Chicken Wrap",
          description: `Flavorful ${isVegetarian ? "falafel" : "chicken"} wrap with tzatziki and fresh veggies.`,
          ingredients: [
            { name: isVegetarian ? "Falafel" : "Chicken Breast", amount: isVegetarian ? "8 pieces" : "2 pieces", emoji: isVegetarian ? "🧆" : "🍗" },
            { name: "Whole Wheat Pita", amount: "2 large", emoji: "🫓" },
            { name: "Cucumber", amount: "1 medium", emoji: "🥒" },
            { name: "Tomato", amount: "1 large", emoji: "🍅" },
            { name: "Red Onion", amount: "1/2 small", emoji: "🧅" },
            { name: "Lettuce", amount: "2 cups", emoji: "🥬" },
            { name: isVegan ? "Vegan Tzatziki" : "Tzatziki Sauce", amount: "1/2 cup", emoji: "🥣" },
            { name: "Olive Oil", amount: "1 tbsp", emoji: "🫒" },
            { name: "Lemon Juice", amount: "1 tbsp", emoji: "🍋" }
          ],
          instructions: [
            { step: 1, description: isVegetarian ? 
              "Heat falafel according to package instructions or make from scratch." : 
              "Season chicken with Mediterranean spices and grill until cooked through." },
            { step: 2, description: "Slice cucumber, tomato, and red onion thinly." },
            { step: 3, description: "Warm pita bread slightly." },
            { step: 4, description: "Spread tzatziki sauce on pita." },
            { step: 5, description: "Layer with lettuce, vegetables, and protein." },
            { step: 6, description: "Drizzle with olive oil and lemon juice." },
            { step: 7, description: "Roll up tightly and serve." }
          ],
          nutrition_info: {
            calories: isVegetarian ? 450 : 520,
            protein: isVegetarian ? 15 : 35,
            carbs: 60,
            fat: isVegetarian ? 18 : 22,
            fiber: 8
          },
          youtube_link: isVegetarian ? 
            "https://www.youtube.com/watch?v=F3WZdlqh_44" : 
            "https://www.youtube.com/watch?v=OBXnM9S_mFg",
          image_url: isVegetarian ?
            "https://images.unsplash.com/photo-1553531889-e6cf4d692b1b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" :
            "https://images.unsplash.com/photo-1668538937455-e65326980169?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
      ],
      asian: [
        {
          title: isVegetarian ? "Vegetable Stir Fry" : "Teriyaki Chicken Stir Fry",
          description: `Quick and easy ${isVegetarian ? "vegetable" : "chicken"} stir fry with Asian-inspired flavors.`,
          ingredients: [
            { name: isVegetarian ? "Tofu" : "Chicken Breast", amount: isVegetarian ? "400g" : "500g", emoji: isVegetarian ? "🧈" : "🍗" },
            { name: "Broccoli", amount: "1 head", emoji: "🥦" },
            { name: "Carrots", amount: "2 medium", emoji: "🥕" },
            { name: "Bell Peppers", amount: "2 medium", emoji: "🫑" },
            { name: "Snap Peas", amount: "1 cup", emoji: "🥜" },
            { name: "Garlic", amount: "3 cloves", emoji: "🧄" },
            { name: "Ginger", amount: "1 inch piece", emoji: "🥢" },
            { name: "Soy Sauce", amount: "3 tbsp", emoji: "🍶" },
            { name: "Rice Vinegar", amount: "1 tbsp", emoji: "🍶" },
            { name: "Sesame Oil", amount: "1 tbsp", emoji: "🧴" },
            { name: "Brown Rice", amount: "2 cups cooked", emoji: "🍚" }
          ],
          instructions: [
            { step: 1, description: "Cook rice according to package instructions." },
            { step: 2, description: isVegetarian ? 
              "Press and cube tofu, then sauté until golden brown." : 
              "Slice chicken into thin strips and stir-fry until no longer pink." },
            { step: 3, description: "Remove protein and set aside." },
            { step: 4, description: "In the same pan, stir-fry garlic and ginger for 30 seconds." },
            { step: 5, description: "Add vegetables and stir-fry until crisp-tender." },
            { step: 6, description: "Return protein to pan and add soy sauce, rice vinegar, and a bit of water." },
            { step: 7, description: "Cook for 2 more minutes until sauce thickens slightly." },
            { step: 8, description: "Drizzle with sesame oil and serve over rice." }
          ],
          nutrition_info: {
            calories: isVegetarian ? 380 : 450,
            protein: isVegetarian ? 18 : 35,
            carbs: 45,
            fat: isVegetarian ? 12 : 15,
            fiber: 8
          },
          youtube_link: isVegetarian ? 
            "https://www.youtube.com/watch?v=xvPR2Tfw5k0" : 
            "https://www.youtube.com/watch?v=yX4KkIwSAvw",
          image_url: isVegetarian ?
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" :
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
      ],
    };
    
    // Select the cuisine and recipe
    const cuisineRecipes = recipeTemplates[selectedCuisine] || recipeTemplates.italian;
    let recipe = cuisineRecipes[Math.floor(Math.random() * cuisineRecipes.length)];

    // Modify recipe details based on form values
    recipe = {
      ...recipe,
      title: `${expert.name}'s ${recipe.title}`,
      cuisine_type: selectedCuisine
    };
    
    // Filter out ingredients that match allergies
    if (allergies.length > 0) {
      recipe.ingredients = recipe.ingredients.filter((ing: any) => 
        !allergies.some((allergy: string) => 
          ing.name.toLowerCase().includes(allergy.toLowerCase())
        )
      );
    }
    
    return recipe;
  };
  
  const handleSaveFavorite = async () => {
    // Already saved to the database when generated
    toast({
      title: "Recipe Saved",
      description: "This recipe has been saved to your favorites.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-nutrition-800 mb-8">Recipe Generator</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generator Form */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Your Recipe</CardTitle>
                <CardDescription>
                  Customize your recipe preferences to get personalized suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(generateRecipe)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="mealType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meal Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select meal type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="breakfast">Breakfast</SelectItem>
                              <SelectItem value="lunch">Lunch</SelectItem>
                              <SelectItem value="dinner">Dinner</SelectItem>
                              <SelectItem value="main">Main Course</SelectItem>
                              <SelectItem value="side">Side Dish</SelectItem>
                              <SelectItem value="dessert">Dessert</SelectItem>
                              <SelectItem value="snack">Snack</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="complexity"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Recipe Complexity</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-1"
                            >
                              <div className="flex flex-1 items-center space-x-2">
                                <Radio value="easy" id="easy" />
                                <label htmlFor="easy" className="cursor-pointer">Easy</label>
                              </div>
                              <div className="flex flex-1 items-center space-x-2">
                                <Radio value="medium" id="medium" />
                                <label htmlFor="medium" className="cursor-pointer">Medium</label>
                              </div>
                              <div className="flex flex-1 items-center space-x-2">
                                <Radio value="hard" id="hard" />
                                <label htmlFor="hard" className="cursor-pointer">Hard</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="prepTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preparation Time (minutes)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select prep time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="90">1.5 hours</SelectItem>
                              <SelectItem value="120">2+ hours</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="servings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Servings</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select number of servings" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 person</SelectItem>
                              <SelectItem value="2">2 people</SelectItem>
                              <SelectItem value="4">4 people</SelectItem>
                              <SelectItem value="6">6 people</SelectItem>
                              <SelectItem value="8">8+ people</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-nutrition-700 hover:bg-nutrition-800"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Recipe...
                        </>
                      ) : (
                        <>
                          <ChefHat className="mr-2 h-5 w-5" />
                          Generate Recipe
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Generated Recipe */}
            <div>
              {generatedRecipe ? (
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl">{generatedRecipe.title}</CardTitle>
                    <CardDescription>{generatedRecipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {expert && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={expert.image_url} 
                            alt={expert.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{expert.name}</p>
                          <p className="text-xs text-muted-foreground">{expert.title}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                        <Clock className="text-nutrition-700 h-5 w-5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Prep Time</p>
                          <p className="font-medium">{generatedRecipe.prep_time} min</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                        <Utensils className="text-nutrition-700 h-5 w-5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Cuisine</p>
                          <p className="font-medium capitalize">{generatedRecipe.cuisine_type}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Ingredients:</h3>
                        <ul className="text-sm space-y-1">
                          {generatedRecipe.ingredients.map((ing: any, idx: number) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span>{ing.emoji}</span>
                              <span>{ing.name}: {ing.amount}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Instructions:</h3>
                        <ol className="text-sm space-y-2 list-decimal list-inside">
                          {generatedRecipe.instructions.map((inst: any, idx: number) => (
                            <li key={idx} className="pl-1">{inst.description}</li>
                          ))}
                        </ol>
                      </div>
                      
                      {generatedRecipe.youtube_link && (
                        <div>
                          <h3 className="font-medium mb-2">Watch Tutorial:</h3>
                          <a 
                            href={generatedRecipe.youtube_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-nutrition-700 hover:underline flex items-center gap-2 text-sm"
                          >
                            <span>YouTube Tutorial</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSaveFavorite}
                      className="w-full bg-nutrition-700 hover:bg-nutrition-800"
                      variant="default"
                    >
                      Add to Favorites
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center flex-col p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                  <ChefHat className="h-12 w-12 text-nutrition-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Recipe Generated Yet</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm">
                    Fill out the form and click "Generate Recipe" to get a personalized recipe based on your preferences.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeGenerator;
