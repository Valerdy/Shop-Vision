import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface FilterState {
  categories: string[];
  genders: string[];
  brands: string[];
  priceRange: [number, number];
}

interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const ProductFilter = ({ filters, onFilterChange }: ProductFilterProps) => {
  const categories = ['optical', 'sunglasses'];
  const genders = ['men', 'women', 'unisex'];
  const brands = ['LuxVision', 'SkyLine', 'Femme', 'ModernEdge', 'Vintage Soul', 'ActiveVision', 'Diva', 'Essence'];

  const handleCheckboxChange = (type: keyof FilterState, value: string) => {
    const currentValues = filters[type] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange({ ...filters, [type]: newValues });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  return (
    <div className="space-y-6 gradient-card rounded-lg p-6 shadow-card sticky top-24">
      <div>
        <h3 className="font-semibold mb-4">Filters</h3>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Type</Label>
        {categories.map((category) => (
          <div key={category} className="flex items-center gap-2">
            <Checkbox
              id={`category-${category}`}
              checked={filters.categories.includes(category)}
              onCheckedChange={() => handleCheckboxChange('categories', category)}
            />
            <label
              htmlFor={`category-${category}`}
              className="text-sm text-muted-foreground cursor-pointer capitalize"
            >
              {category}
            </label>
          </div>
        ))}
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Gender</Label>
        {genders.map((gender) => (
          <div key={gender} className="flex items-center gap-2">
            <Checkbox
              id={`gender-${gender}`}
              checked={filters.genders.includes(gender)}
              onCheckedChange={() => handleCheckboxChange('genders', gender)}
            />
            <label
              htmlFor={`gender-${gender}`}
              className="text-sm text-muted-foreground cursor-pointer capitalize"
            >
              {gender}
            </label>
          </div>
        ))}
      </div>

      {/* Brand */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Brand</Label>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center gap-2">
            <Checkbox
              id={`brand-${brand}`}
              checked={filters.brands.includes(brand)}
              onCheckedChange={() => handleCheckboxChange('brands', brand)}
            />
            <label
              htmlFor={`brand-${brand}`}
              className="text-sm text-muted-foreground cursor-pointer"
            >
              {brand}
            </label>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">
          Prix: {filters.priceRange[0].toLocaleString('fr-FR')} - {filters.priceRange[1].toLocaleString('fr-FR')} FCFA
        </Label>
        <Slider
          min={50000}
          max={150000}
          step={5000}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ProductFilter;
