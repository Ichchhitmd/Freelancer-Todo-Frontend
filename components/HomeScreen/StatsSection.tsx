import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { DollarSign, Activity, Camera, TrendingDown } from 'react-native-feather';

const StatsSection: React.FC<{ earnings: any; freelancer: any }> = ({ earnings, freelancer }) => {
  // Calculate remaining earnings
  const remainingEarnings =
    earnings.totalEarnings - freelancer.gadgets.reduce((sum, g) => sum + g.cost, 0);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16, gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {/* Total Earnings Card */}
        <View
          style={{
            width: 240,
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <View
            style={{
              marginBottom: 16,
              backgroundColor: '#f0fdf4',
              padding: 16,
              borderRadius: 100,
              alignSelf: 'flex-start',
            }}>
            <DollarSign stroke="#16a34a" width={20} height={20} />
          </View>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>Total Earnings</Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 }}
            className="flex items-center gap-1">
            <Text style={{ fontSize: 24, color: '#16a34a', fontWeight: '800' }}>रु</Text>
            <Text style={{ fontSize: 23, color: '#16a34a', fontWeight: '800' }}>
              {earnings.totalEarnings}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
            {earnings.eventCount} events
          </Text>
        </View>

        {/* Expenses Card */}
        <View
          style={{
            width: 240,
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <View
            style={{
              marginBottom: 16,
              backgroundColor: '#fef2f2',
              padding: 16,
              borderRadius: 100,
              alignSelf: 'flex-start',
            }}>
            <TrendingDown stroke="#dc2626" width={20} height={20} />
          </View>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>Total Expenses</Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 }}
            className="flex items-center gap-1">
            <Text style={{ fontSize: 24, color: '#dc2626', fontWeight: '800' }}>रु</Text>
            <Text style={{ fontSize: 23, color: '#dc2626', fontWeight: '800' }}>
              {earnings.totalExpenses}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
            {freelancer.gadgets.length} gadgets
          </Text>
        </View>

        {/* Remaining Earnings Card */}
        <View
          style={{
            width: 240,
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <View
            style={{
              marginBottom: 16,
              backgroundColor: '#f0f9ff',
              padding: 16,
              borderRadius: 100,
              alignSelf: 'flex-start',
            }}>
            <Activity stroke="#0284c7" width={20} height={20} />
          </View>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>Remaining Earnings</Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 }}
            className="flex items-center gap-1">
            <Text style={{ fontSize: 24, color: '#16a34a', fontWeight: '800' }}>रु</Text>
            <Text style={{ fontSize: 23, color: '#16a34a', fontWeight: '800' }}>
              {earnings.totalEarnings}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Available balance</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default StatsSection;
