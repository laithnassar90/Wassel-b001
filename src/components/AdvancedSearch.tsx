import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Filter, 
  SlidersHorizontal, 
  Star, 
  DollarSign,
  Calendar,
  Users,
  X
} from 'lucide-react';
import { TripType } from '../contexts/TripContext';

export interface SearchFilters {
  from: string;
  to: string;
  date: string;
  tripType?: TripType;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  verifiedOnly: boolean;
  availableSeats?: number;
  preferences: {
    noSmoking: boolean;
    petsAllowed: boolean;
    musicAllowed: boolean;
  };
  sortBy: 'price' | 'rating' | 'time' | 'seats';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

export function AdvancedSearch({ onSearch, initialFilters }: AdvancedSearchProps) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<SearchFilters>({
    from: initialFilters?.from || '',
    to: initialFilters?.to || '',
    date: initialFilters?.date || new Date().toISOString().split('T')[0],
    tripType: initialFilters?.tripType,
    minPrice: initialFilters?.minPrice || 0,
    maxPrice: initialFilters?.maxPrice || 1000,
    minRating: initialFilters?.minRating || 0,
    verifiedOnly: initialFilters?.verifiedOnly || false,
    availableSeats: initialFilters?.availableSeats,
    preferences: {
      noSmoking: initialFilters?.preferences?.noSmoking || false,
      petsAllowed: initialFilters?.preferences?.petsAllowed || false,
      musicAllowed: initialFilters?.preferences?.musicAllowed || false,
    },
    sortBy: initialFilters?.sortBy || 'time',
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    
    // Count active filters
    let count = 0;
    if (newFilters.tripType) count++;
    if (newFilters.minPrice && newFilters.minPrice > 0) count++;
    if (newFilters.maxPrice && newFilters.maxPrice < 1000) count++;
    if (newFilters.minRating && newFilters.minRating > 0) count++;
    if (newFilters.verifiedOnly) count++;
    if (newFilters.availableSeats) count++;
    if (newFilters.preferences.noSmoking) count++;
    if (newFilters.preferences.petsAllowed) count++;
    if (newFilters.preferences.musicAllowed) count++;
    setActiveFiltersCount(count);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      from: filters.from,
      to: filters.to,
      date: filters.date,
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
      verifiedOnly: false,
      preferences: {
        noSmoking: false,
        petsAllowed: false,
        musicAllowed: false,
      },
      sortBy: 'time',
    };
    setFilters(defaultFilters);
    setActiveFiltersCount(0);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label>{t('trip.from')}</Label>
              <Input
                value={filters.from}
                onChange={(e) => updateFilters({ from: e.target.value })}
                placeholder="Enter city or location"
              />
            </div>
            <div className="md:col-span-1">
              <Label>{t('trip.to')}</Label>
              <Input
                value={filters.to}
                onChange={(e) => updateFilters({ to: e.target.value })}
                placeholder="Enter destination"
              />
            </div>
            <div className="md:col-span-1">
              <Label>{t('trip.date')}</Label>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) => updateFilters({ date: e.target.value })}
              />
            </div>
            <div className="md:col-span-1 flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
                {t('common.search')}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <SlidersHorizontal className="size-4" />
                    {activeFiltersCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 size-5 flex items-center justify-center p-0 text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="size-5" />
                      {t('common.filter')}
                    </SheetTitle>
                    <SheetDescription>
                      Refine your search with advanced filters
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 mt-6">
                    {/* Trip Type */}
                    <div className="space-y-2">
                      <Label>{t('trip.type')}</Label>
                      <Select
                        value={filters.tripType}
                        onValueChange={(value) => updateFilters({ tripType: value as TripType })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any trip type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wasel">{t('trip.wasel')}</SelectItem>
                          <SelectItem value="raje3">{t('trip.raje3')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="size-4" />
                        Price Range: {filters.minPrice} - {filters.maxPrice} AED
                      </Label>
                      <Slider
                        value={[filters.minPrice || 0, filters.maxPrice || 1000]}
                        onValueChange={([min, max]) => updateFilters({ minPrice: min, maxPrice: max })}
                        min={0}
                        max={1000}
                        step={10}
                        className="py-4"
                      />
                    </div>

                    {/* Minimum Rating */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Star className="size-4" />
                        Minimum Rating: {filters.minRating?.toFixed(1) || '0.0'}
                      </Label>
                      <Slider
                        value={[filters.minRating || 0]}
                        onValueChange={([value]) => updateFilters({ minRating: value })}
                        min={0}
                        max={5}
                        step={0.5}
                        className="py-4"
                      />
                    </div>

                    {/* Available Seats */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Users className="size-4" />
                        Minimum Available Seats
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={filters.availableSeats || ''}
                        onChange={(e) => updateFilters({ availableSeats: parseInt(e.target.value) || undefined })}
                        placeholder="Any"
                      />
                    </div>

                    {/* Verified Drivers Only */}
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Verified Drivers Only</p>
                        <p className="text-sm text-muted-foreground">Show only verified profiles</p>
                      </div>
                      <Switch
                        checked={filters.verifiedOnly}
                        onCheckedChange={(checked) => updateFilters({ verifiedOnly: checked })}
                      />
                    </div>

                    {/* Preferences */}
                    <div className="space-y-3">
                      <Label>Preferences</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">No Smoking</Label>
                          <Switch
                            checked={filters.preferences.noSmoking}
                            onCheckedChange={(checked) =>
                              updateFilters({
                                preferences: { ...filters.preferences, noSmoking: checked },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Pets Allowed</Label>
                          <Switch
                            checked={filters.preferences.petsAllowed}
                            onCheckedChange={(checked) =>
                              updateFilters({
                                preferences: { ...filters.preferences, petsAllowed: checked },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Music Allowed</Label>
                          <Switch
                            checked={filters.preferences.musicAllowed}
                            onCheckedChange={(checked) =>
                              updateFilters({
                                preferences: { ...filters.preferences, musicAllowed: checked },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <Label>{t('common.sort')}</Label>
                      <Select
                        value={filters.sortBy}
                        onValueChange={(value) => updateFilters({ sortBy: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="time">Departure Time</SelectItem>
                          <SelectItem value="price">Price (Low to High)</SelectItem>
                          <SelectItem value="rating">Rating (High to Low)</SelectItem>
                          <SelectItem value="seats">Available Seats</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button onClick={resetFilters} variant="outline" className="flex-1">
                        <X className="size-4 mr-2" />
                        Reset
                      </Button>
                      <Button onClick={handleSearch} className="flex-1">
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.tripType && (
            <Badge variant="secondary">
              {filters.tripType === 'wasel' ? t('trip.wasel') : t('trip.raje3')}
              <X
                className="size-3 ml-1 cursor-pointer"
                onClick={() => updateFilters({ tripType: undefined })}
              />
            </Badge>
          )}
          {filters.verifiedOnly && (
            <Badge variant="secondary">
              Verified Only
              <X
                className="size-3 ml-1 cursor-pointer"
                onClick={() => updateFilters({ verifiedOnly: false })}
              />
            </Badge>
          )}
          {(filters.minPrice || 0) > 0 && (
            <Badge variant="secondary">
              Min {filters.minPrice} AED
              <X
                className="size-3 ml-1 cursor-pointer"
                onClick={() => updateFilters({ minPrice: 0 })}
              />
            </Badge>
          )}
          {(filters.maxPrice || 1000) < 1000 && (
            <Badge variant="secondary">
              Max {filters.maxPrice} AED
              <X
                className="size-3 ml-1 cursor-pointer"
                onClick={() => updateFilters({ maxPrice: 1000 })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
