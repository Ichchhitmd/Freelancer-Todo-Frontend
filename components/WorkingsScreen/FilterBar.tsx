import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'components/rare/SelectDropdown';
import { useGetCompanies } from 'hooks/companies';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { FilterType, SortType } from 'types/WorkingScreenTypes';

import { FilterButton } from './FilterButton';

interface FilterBarProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  activeSort: SortType;
  setActiveSort: (sort: SortType) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeCompany?: string;
  setActiveCompany?: (company: string) => void;
}

export const FilterBar = ({
  activeFilter,
  setActiveFilter,
  activeSort,
  setActiveSort,
  showFilters,
  setShowFilters,
  activeCompany,
  setActiveCompany,
}: FilterBarProps) => {
  const { data: companies } = useGetCompanies();
  const [companyList, setCompanyList] = useState<string[]>([]);

  useEffect(() => {
    if (companies) {
      const companyNames = companies.map((company) => company.name);
      setCompanyList(['All Companies', ...companyNames]);
    }
  }, [companies]);

  const handleCompanySelect = (company: string) => {
    if (setActiveCompany) {
      setActiveCompany(company === 'All Companies' ? '' : company);
    }
  };

  const renderFilterSummary = () => {
    const filterLabels = {
      upcoming: 'Upcoming Events',
      past: 'Past Events',
      all: 'All Events',
    };
    const sortLabels = {
      'date-desc': 'Latest First',
      'date-asc': 'Oldest First',
      company: 'By Company',
    };

    return `${filterLabels[activeFilter]} | ${sortLabels[activeSort]}`;
  };

  return (
    <Animated.View
      className={`border-gray-100 z-10 border-b bg-white shadow-sm ${
        Platform.OS === 'ios' ? 'rounded-b-xl' : ''
      }`}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}>
      <TouchableOpacity
        onPress={() => setShowFilters(!showFilters)}
        className="bg-gray-50/50 active:bg-gray-100/50 flex-row items-center justify-between rounded-b-xl px-4 py-3"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
        <View className="flex-row items-center space-x-3">
          <MaterialCommunityIcons name="filter-variant" size={24} color="#4B5563" />
          <Text className="text-gray-800 text-base font-semibold">Filters & Sorting</Text>
        </View>
        <View className="flex-row items-center space-x-2">
          <Text className="text-gray-600 max-w-[200px] truncate text-sm">
            {renderFilterSummary()}
          </Text>
          <MaterialCommunityIcons
            name={showFilters ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#4B5563"
          />
        </View>
      </TouchableOpacity>

      {showFilters && (
        <Animated.View
          className="bg-white p-4"
          entering={SlideInDown.duration(200)}
          exiting={SlideOutDown.duration(200)}>
          <View className="mb-5">
            <Text className="text-gray-700 mb-3 text-base font-bold">Company</Text>
            <SelectDropdown
              data={companyList}
              onSelect={handleCompanySelect}
              defaultButtonText={activeCompany || 'All Companies'}
              showAddOption={false} // Disable 'Add Company' in filter bar
            />
          </View>

          <View className="mb-5">
            <Text className="text-gray-700 mb-3 text-base font-bold">Event Type</Text>
            <View className="flex-row space-x-2">
              <FilterButton
                label="Upcoming"
                active={activeFilter === 'upcoming'}
                onPress={() => setActiveFilter('upcoming')}
                icon="calendar-arrow-right"
              />
              <FilterButton
                label="Past"
                active={activeFilter === 'past'}
                onPress={() => setActiveFilter('past')}
                icon="calendar-arrow-left"
              />
              <FilterButton
                label="All"
                active={activeFilter === 'all'}
                onPress={() => setActiveFilter('all')}
                icon="calendar-month"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-700 mb-3 text-base font-bold">Sort By</Text>
            <View className="flex-row space-x-2">
              <FilterButton
                label="Latest"
                active={activeSort === 'date-desc'}
                onPress={() => setActiveSort('date-desc')}
                icon="sort-calendar-descending"
              />
              <FilterButton
                label="Oldest"
                active={activeSort === 'date-asc'}
                onPress={() => setActiveSort('date-asc')}
                icon="sort-calendar-ascending"
              />
            </View>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};
