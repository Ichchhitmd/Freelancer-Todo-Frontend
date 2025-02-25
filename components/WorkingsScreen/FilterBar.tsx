import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface FilterBarProps {
  activeFilter: 'all' | 'upcoming' | 'past' | 'today' | 'unpaid' | 'paid';
  setActiveFilter: (filter: 'all' | 'upcoming' | 'past' | 'today' | 'unpaid' | 'paid') => void;
  activeSort: 'date-desc' | 'date-asc' | 'company' | 'earnings' | 'due-amount';
  setActiveSort: (sort: 'date-desc' | 'date-asc' | 'company' | 'earnings' | 'due-amount') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeCompany: string;
  setActiveCompany: (company: string) => void;
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'All', icon: 'calendar' },
  { id: 'upcoming', label: 'Upcoming', icon: 'calendar-arrow-right' },
  { id: 'past', label: 'Past', icon: 'calendar-arrow-left' },
  { id: 'today', label: 'Today', icon: 'calendar-today' },
  { id: 'unpaid', label: 'Unpaid', icon: 'cash-remove' },
  { id: 'paid', label: 'Paid', icon: 'cash-check' },
] as const;

const SORT_OPTIONS = [
  { id: 'date-desc', label: 'Newest First', icon: 'sort-calendar-descending' },
  { id: 'date-asc', label: 'Oldest First', icon: 'sort-calendar-ascending' },
  { id: 'company', label: 'Company', icon: 'sort-alphabetical-ascending' },
  { id: 'earnings', label: 'Earnings', icon: 'cash-multiple' },
  { id: 'due-amount', label: 'Due Amount', icon: 'cash-clock' },
] as const;

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  setActiveFilter,
  activeSort,
  setActiveSort,
  showFilters,
  setShowFilters,
}) => {
  return (
    <View className="px-4 pb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6 }}
        className="flex-row">
        {FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => setActiveFilter(filter.id)}
            className={`flex-row items-center rounded-full px-4 py-2 ${
              activeFilter === filter.id ? 'bg-red-500' : 'border border-red-200 bg-white'
            }`}>
            <MaterialCommunityIcons
              name={filter.icon}
              size={18}
              color={activeFilter === filter.id ? '#ffffff' : '#EF4444'}
            />
            <Text
              className={`ml-2 font-medium ${
                activeFilter === filter.id ? 'text-white' : 'text-red-500'
              }`}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="mt-4">
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className="flex-row items-center justify-between">
          <Text className="text-gray-700 font-medium">Sort & Filter</Text>
          <MaterialCommunityIcons
            name={showFilters ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#374151"
          />
        </TouchableOpacity>

        {showFilters && (
          <View className="mt-4 space-y-4">
            <View>
              <Text className="text-gray-600 mb-2 font-medium">Sort By</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row space-x-2">
                {SORT_OPTIONS.map((sort) => (
                  <TouchableOpacity
                    key={sort.id}
                    onPress={() => setActiveSort(sort.id)}
                    className={`flex-row items-center rounded-full px-4 py-2 ${
                      activeSort === sort.id ? 'bg-red-500' : 'border border-red-200 bg-white'
                    }`}>
                    <MaterialCommunityIcons
                      name={sort.icon}
                      size={18}
                      color={activeSort === sort.id ? '#ffffff' : '#EF4444'}
                    />
                    <Text
                      className={`ml-2 font-medium ${
                        activeSort === sort.id ? 'text-white' : 'text-red-500'
                      }`}>
                      {sort.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default FilterBar;
