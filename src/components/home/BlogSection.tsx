
import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

interface BlogCardProps {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, description, imageUrl, date }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="h-48 overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
    <div className="p-6">
      <div className="text-sm text-nutrition-600 mb-2">{date}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
      <a 
        href="#" 
        className="inline-flex items-center text-nutrition-600 font-medium hover:text-nutrition-700 transition-colors"
      >
        Learn more
        <ArrowRight className="ml-1 h-4 w-4" />
      </a>
    </div>
  </div>
);

const BlogSection: React.FC = () => {
  const blogPosts = [
    {
      title: "The Truth About Superfoods: Separating Facts from Marketing",
      description: "Discover which superfoods actually live up to their reputation and which ones are just clever marketing. We break down the nutritional science and provide practical advice on incorporating truly beneficial foods into your diet.",
      imageUrl: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1932&auto=format&fit=crop",
      date: "May 15, 2023"
    },
    {
      title: "Meal Prep Mastery: Save Time While Eating Healthy",
      description: "Learn efficient meal prepping strategies that can save you hours each week while ensuring you always have nutritious options available. Includes time-saving tips, storage guidelines, and versatile recipes.",
      imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070&auto=format&fit=crop",
      date: "April 28, 2023"
    },
    {
      title: "Understanding Macronutrients: Your Guide to Protein, Carbs, and Fats",
      description: "Demystify the complex world of macronutrients and learn how to balance them for optimal health. This comprehensive guide explains how different macros affect your body and how to find the right balance for your unique needs.",
      imageUrl: "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?q=80&w=2070&auto=format&fit=crop",
      date: "April 10, 2023"
    }
  ];

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          label="Blog" 
          heading="Learn more about nutrition" 
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <BlogCard 
              key={index}
              title={post.title}
              description={post.description}
              imageUrl={post.imageUrl}
              date={post.date}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
