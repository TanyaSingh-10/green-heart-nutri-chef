
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const preferencesSchema = z.object({
  favorite_foods: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  dietary_restrictions: z.array(z.string()).optional(),
  cuisine_preferences: z.array(z.string()).optional(),
  nutritional_goals: z.array(z.string()).optional(),
  health_conditions: z.array(z.string()).optional(),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const dietaryRestrictionOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
];

const cuisineOptions = [
  { id: 'italian', label: 'Italian' },
  { id: 'mexican', label: 'Mexican' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'indian', label: 'Indian' },
  { id: 'thai', label: 'Thai' },
  { id: 'mediterranean', label: 'Mediterranean' },
  { id: 'japanese', label: 'Japanese' },
  { id: 'french', label: 'French' },
  { id: 'american', label: 'American' },
];

const nutritionalGoalOptions = [
  { id: 'weight-loss', label: 'Weight Loss' },
  { id: 'muscle-gain', label: 'Muscle Gain' },
  { id: 'maintain-weight', label: 'Maintain Weight' },
  { id: 'improve-energy', label: 'Improve Energy' },
  { id: 'heart-health', label: 'Heart Health' },
  { id: 'diabetes-management', label: 'Diabetes Management' },
];

const Preferences = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [activeList, setActiveList] = useState<'favorite_foods' | 'allergies' | 'health_conditions' | null>(null);

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      favorite_foods: [],
      allergies: [],
      dietary_restrictions: [],
      cuisine_preferences: [],
      nutritional_goals: [],
      health_conditions: [],
    },
  });

  useEffect(() => {
    if (!user) return;
    
    const fetchPreferences = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching preferences:', error);
          return;
        }
        
        if (data) {
          form.reset({
            favorite_foods: data.favorite_foods || [],
            allergies: data.allergies || [],
            dietary_restrictions: data.dietary_restrictions || [],
            cuisine_preferences: data.cuisine_preferences || [],
            nutritional_goals: data.nutritional_goals || [],
            health_conditions: data.health_conditions || [],
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreferences();
  }, [user, form]);

  const onSubmit = async (values: PreferencesFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save preferences",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: existingData } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('user_preferences')
          .update({
            ...values,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            ...values,
          });
        
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Preferences saved successfully",
      });
      
      navigate('/recipe-generator');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field: 'favorite_foods' | 'allergies' | 'health_conditions') => {
    if (!newItem.trim()) return;
    
    const currentValues = form.getValues(field) || [];
    if (!currentValues.includes(newItem.trim())) {
      form.setValue(field, [...currentValues, newItem.trim()]);
    }
    
    setNewItem('');
    setActiveList(null);
  };

  const removeItem = (field: 'favorite_foods' | 'allergies' | 'health_conditions' | 'dietary_restrictions' | 'cuisine_preferences' | 'nutritional_goals', item: string) => {
    const currentValues = form.getValues(field) || [];
    form.setValue(
      field,
      currentValues.filter((val) => val !== item)
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-nutrition-800 mb-8">Dietary Preferences</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Food Preferences</CardTitle>
              <CardDescription>
                Tell us about your dietary needs and preferences to get personalized recipe recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Favorite Foods */}
                  <FormField
                    control={form.control}
                    name="favorite_foods"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favorite Foods</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Add a favorite food"
                                value={activeList === 'favorite_foods' ? newItem : ''}
                                onChange={(e) => {
                                  setNewItem(e.target.value);
                                  setActiveList('favorite_foods');
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addItem('favorite_foods');
                                  }
                                }}
                              />
                              <Button 
                                type="button" 
                                onClick={() => addItem('favorite_foods')}
                                disabled={activeList !== 'favorite_foods' || !newItem.trim()}
                              >
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value?.map((item) => (
                                <Badge key={item} className="bg-nutrition-100 text-nutrition-800 hover:bg-nutrition-200">
                                  {item}
                                  <button 
                                    type="button" 
                                    onClick={() => removeItem('favorite_foods', item)}
                                    className="ml-1 hover:text-red-500"
                                  >
                                    <X size={14} />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Add your favorite foods to help us suggest recipes you'll love.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  {/* Allergies */}
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Add an allergy"
                                value={activeList === 'allergies' ? newItem : ''}
                                onChange={(e) => {
                                  setNewItem(e.target.value);
                                  setActiveList('allergies');
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addItem('allergies');
                                  }
                                }}
                              />
                              <Button 
                                type="button" 
                                onClick={() => addItem('allergies')}
                                disabled={activeList !== 'allergies' || !newItem.trim()}
                              >
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value?.map((item) => (
                                <Badge key={item} className="bg-red-100 text-red-800 hover:bg-red-200">
                                  {item}
                                  <button 
                                    type="button" 
                                    onClick={() => removeItem('allergies', item)}
                                    className="ml-1 hover:text-red-500"
                                  >
                                    <X size={14} />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          List any food allergies so we can exclude those ingredients.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  {/* Dietary Restrictions */}
                  <FormField
                    control={form.control}
                    name="dietary_restrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dietary Restrictions</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {dietaryRestrictionOptions.map((option) => (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      form.setValue('dietary_restrictions', [...currentValues, option.id]);
                                    } else {
                                      form.setValue(
                                        'dietary_restrictions',
                                        currentValues.filter((value) => value !== option.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormDescription>
                          Select any dietary restrictions you follow.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  {/* Cuisine Preferences */}
                  <FormField
                    control={form.control}
                    name="cuisine_preferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuisine Preferences</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {cuisineOptions.map((option) => (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      form.setValue('cuisine_preferences', [...currentValues, option.id]);
                                    } else {
                                      form.setValue(
                                        'cuisine_preferences',
                                        currentValues.filter((value) => value !== option.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormDescription>
                          Select cuisines you particularly enjoy.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  {/* Nutritional Goals */}
                  <FormField
                    control={form.control}
                    name="nutritional_goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nutritional Goals</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {nutritionalGoalOptions.map((option) => (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      form.setValue('nutritional_goals', [...currentValues, option.id]);
                                    } else {
                                      form.setValue(
                                        'nutritional_goals',
                                        currentValues.filter((value) => value !== option.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormDescription>
                          Select your current nutritional goals.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  {/* Health Conditions */}
                  <FormField
                    control={form.control}
                    name="health_conditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Conditions</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Add a health condition"
                                value={activeList === 'health_conditions' ? newItem : ''}
                                onChange={(e) => {
                                  setNewItem(e.target.value);
                                  setActiveList('health_conditions');
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addItem('health_conditions');
                                  }
                                }}
                              />
                              <Button 
                                type="button" 
                                onClick={() => addItem('health_conditions')}
                                disabled={activeList !== 'health_conditions' || !newItem.trim()}
                              >
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value?.map((item) => (
                                <Badge key={item} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                  {item}
                                  <button 
                                    type="button" 
                                    onClick={() => removeItem('health_conditions', item)}
                                    className="ml-1 hover:text-red-500"
                                  >
                                    <X size={14} />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          List any health conditions that might affect your diet (e.g., diabetes, hypertension).
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-nutrition-700 hover:bg-nutrition-800"
                    >
                      {loading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Preferences;
