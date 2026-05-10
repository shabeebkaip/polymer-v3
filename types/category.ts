export type CategoryData = {
    id: string;
    name: string;
    icon: string;
}

export type CategoryCardProps = {
  name: string;
  icon?: string;
  image?: string;
  selectedCategory?: string;
  id: string;
  index?: number;
}

