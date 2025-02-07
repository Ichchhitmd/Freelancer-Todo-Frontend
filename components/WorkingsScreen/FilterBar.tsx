import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FilterButton } from './FilterButton';
import { FilterType, SortType } from 'types/WorkingScreenTypes';

interface FilterBarProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  activeSort: SortType;
  setActiveSort: (sort: SortType) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const FilterBar = ({
  activeFilter,
  setActiveFilter,
  activeSort,
  setActiveSort,
  showFilters,
  setShowFilters,
}: FilterBarProps) => (
  <Animated.View 
    className="border-gray-100 border-b bg-white shadow-sm z-10"
    entering={FadeIn.duration(200)}
    exiting={FadeOut.duration(200)}>
    <TouchableOpacity
      onPress={() => setShowFilters(!showFilters)}
      className="bg-gray-50 flex-row items-center justify-between px-4 py-3 active:bg-gray-100">
      <View className="flex-row items-center">
        <MaterialCommunityIcons
          name="filter-variant"
          size={20}
          color="#666666"
          style={{ marginRight: 8 }}
        />
        <Text className="text-gray-600 font-medium">Filters & Sort</Text>
      </View>
      <MaterialCommunityIcons
        name={showFilters ? 'chevron-up' : 'chevron-down'}
        size={20}
        color="#666666"
      />
    </TouchableOpacity>

    {showFilters && (
      <Animated.View 
        className="p-4"
        entering={SlideInDown.duration(200)}
        exiting={SlideOutDown.duration(200)}>
        <View>
          <Text className="text-gray-500 mb-2 font-medium">Filter By</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <FilterButton
              active={activeFilter === 'all'}
              onPress={() => setActiveFilter('all')}
              icon="calendar-month"
              label="All"
            />
            <FilterButton
              active={activeFilter === 'upcoming'}
              onPress={() => setActiveFilter('upcoming')}
              icon="calendar-arrow-right"
              label="Upcoming"
            />
            <FilterButton
              active={activeFilter === 'past'}
              onPress={() => setActiveFilter('past')}
              icon="calendar-arrow-left"
              label="Past"
            />
          </ScrollView>

          <Text className="text-gray-500 mb-2 font-medium">Sort By</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterButton
              active={activeSort === 'date-desc'}
              onPress={() => setActiveSort('date-desc')}
              icon="sort-calendar-descending"
              label="Latest First"
            />
            <FilterButton
              active={activeSort === 'date-asc'}
              onPress={() => setActiveSort('date-asc')}
              icon="sort-calendar-ascending"
              label="Oldest First"
            />
            <FilterButton
              active={activeSort === 'company'}
              onPress={() => setActiveSort('company')}
              icon="sort-alphabetical-ascending"
              label="Company"
            />
          </ScrollView>
        </View>
      </Animated.View>
    )}
  </Animated.View>
);