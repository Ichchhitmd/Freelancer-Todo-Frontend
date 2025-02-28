import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import InputField from 'components/common/InputField';
import SelectDropdown from 'components/rare/SelectDropdown';
import AssignerDropdown from 'components/rare/AssignerDropdown';
import { useGetAllAssigners, useProcessAssignerPayment } from 'hooks/assignee';
import { useGetCompanies } from 'hooks/companies';
import { usePostIncome } from 'hooks/income';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

const IncomeForm = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.id;

  const { data: companies, isLoading: companiesLoading } = useGetCompanies();
  const [companyId, setCompanyId] = useState(0);
  const { mutate: postIncome } = usePostIncome();
  const { data: assignees } = useGetAllAssigners(userId!);
  const { mutate: processAssignerPayment } = useProcessAssignerPayment();
  const [isCompany, setIsCompany] = useState(true);
  const [assignerId, setAssignerId] = useState('');

  const [income, setIncome] = useState({
    amount: '',
  });

  const handleSubmit = () => {
    if (!income.amount) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
    }

    if (isCompany && !companyId) {
      Alert.alert('Error', 'Please select a company.');
      return;
    }

    if (!isCompany && !assignerId) {
      Alert.alert('Error', 'Please select an assigner.');
      return;
    }

    if (!user || !user.id) {
      Alert.alert('Error', 'User authentication failed. Please log in again.');
      return;
    }

    if (isCompany) {
      const incomePayload = {
        companyId: companyId,
        userId: user.id,
        amount: parseFloat(income.amount),
      };

      postIncome(incomePayload, {
        onSuccess: (data) => {
          Alert.alert('Success', 'Income request submitted!', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        },
        onError: () => {
          Alert.alert('Error', 'Failed to submit income request. Please try again.');
        },
      });
    } else {
      const assignerPayload = {
        assignerName: assignerId,
        userId: user.id,
        amount: parseFloat(income.amount),
      };

      processAssignerPayment(assignerPayload, {
        onSuccess: (data) => {
          Alert.alert('Success', 'Assigner payment processed!', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        },
        onError: () => {
          Alert.alert('Error', 'Failed to process assigner payment. Please try again.');
        },
      });
    }
  };

  if (companiesLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ backgroundColor: '#FF5A5F', paddingVertical: 55, paddingHorizontal: 24 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-6 top-16 z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
            Income Form
          </Text>
          <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginTop: 8 }}>
            Submit your income for reimbursement
          </Text>
        </View>

        <View
          style={{
            marginTop: -40,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'white',
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: isCompany ? '#FF5A5F' : '#f0f0f0',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                marginRight: 10,
              }}
              onPress={() => setIsCompany(true)}>
              <Text style={{ color: isCompany ? 'white' : '#666' }}>Company</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: !isCompany ? '#FF5A5F' : '#f0f0f0',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
              }}
              onPress={() => setIsCompany(false)}>
              <Text style={{ color: !isCompany ? 'white' : '#666' }}>Individual</Text>
            </TouchableOpacity>
          </View>

          {isCompany ? (
            <SelectDropdown
              data={companies?.map((company) => company.name) || []}
              onSelect={(value) => {
                const selectedCompany = companies?.find((company) => company.name === value);
                setCompanyId(selectedCompany?.id ?? 0);
              }}
              defaultButtonText="Select Company"
            />
          ) : (
            <AssignerDropdown
              data={assignees || []}
              onSelect={(value) => setAssignerId(value)}
              defaultButtonText="Select Individual"
            />
          )}

          <InputField
            placeholder="Enter amount"
            value={income.amount}
            onChangeText={(text) => setIncome({ amount: text })}
            keyboardType="numeric"
            icon="currency-inr"
          />

          <TouchableOpacity
            style={{
              marginTop: 32,
              backgroundColor: '#FF5A5F',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={handleSubmit}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(IncomeForm);
