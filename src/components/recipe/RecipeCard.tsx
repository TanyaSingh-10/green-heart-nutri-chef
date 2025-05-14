
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ChefHat, Utensils } from 'lucide-react';

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    description: string;
    prep_time?: number | null;
    cook_time?: number | null;
    cuisine_type?: string | null;
    image_url?: string | null;
    expert_id?: string | null;
    expert?: {
      name: string;
      title: string;
      image_url?: string | null;
    } | null;
  };
  onView: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onView }) => {
  const { id, title, description, prep_time, cook_time, cuisine_type, image_url, expert } = recipe;
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {image_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={image_url} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </div>
          {cuisine_type && (
            <Badge className="bg-nutrition-100 text-nutrition-800 hover:bg-nutrition-200 capitalize">
              {cuisine_type}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <div className="flex flex-wrap gap-3 mb-3">
          {prep_time && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{prep_time + (cook_time || 0)} min</span>
            </div>
          )}
          {expert && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ChefHat className="h-4 w-4" />
              <span>{expert.name}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onView(id)}
          className="w-full bg-nutrition-700 hover:bg-nutrition-800"
        >
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
