import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import TaskList from '../components/TaskList';
import { useTask } from '../contexts/TaskContext';
import { Button, Card } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    DashboardScreen: undefined;
    LoginScreen: undefined;
    RegisterScreen: undefined;
    SettingsScreen: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SettingsScreen'>;

const AllTasksScreen = () => {
    const { tasks, filterTasks } = useTask();
    const [filter, setFilter] = useState('all');

    const navigation = useNavigation<SettingsScreenNavigationProp>();

    const filterOptions = [
        { label: 'All', value: 'all' },
        { label: 'Due Today', value: 'today' },
        { label: 'Due in 1 Day', value: 'tomorrow' },
        { label: 'Due in 1 Week', value: 'week' },
        { label: 'Due in 1 Year', value: 'year' },
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
    ];

    const getFilteredTasks = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextYear = new Date(today);
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        switch (filter) {
            case 'today':
                return filterTasks(undefined, today);
            case 'tomorrow':
                return filterTasks(undefined, tomorrow);
            case 'week':
                return tasks.filter(task => {
                    const dueDate = new Date(task.dueDate);
                    return dueDate >= today && dueDate < nextWeek;
                });
            case 'year':
                return tasks.filter(task => {
                    const dueDate = new Date(task.dueDate);
                    return dueDate >= today && dueDate < nextYear;
                });
            case 'pending':
                return filterTasks('pending');
            case 'completed':
                return filterTasks('completed');
            default:
                return tasks;
        }
    };

    const filteredTasks = getFilteredTasks();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={{ flexDirection: 'row', marginRight: 35 }}></View>
                <Text style={styles.tasksTitle}>Tasks</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
                    <Ionicons name='settings-sharp' size={25} style={styles.settingsIconStyle} />
                </TouchableOpacity>

            </View>
            <View style={styles.filterContainerWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {filterOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => setFilter(option.value)}
                            activeOpacity={0.8}
                        >
                            <Card
                                containerStyle={[
                                    styles.filterCard,
                                    filter === option.value && styles.activeFilterCard
                                ]}
                            >
                                <Text style={styles.filterCardText}>{option.label}</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.taskListContainer}>
                {filteredTasks.length > 0 ? (
                    <TaskList tasks={filteredTasks} />
                ) : (
                    <View style={styles.noTasksContainer}>
                        <Ionicons name="information-circle-outline" size={50} color="gray" />
                        <Text style={styles.noTasksText}>No tasks found for this filter</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tasksTitle: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    settingsIconStyle: {
        marginRight: 10
    },
    tasksTitleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainerWrapper: {
        height: 50,
        marginBottom: 5
    },
    filterContainer: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    filterButton: {
        marginHorizontal: 5,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        color: 'white',
        minWidth: 100,
    },
    activeFilterButton: {
        backgroundColor: '#58e9dd',
        borderWidth: 1,
        borderColor: 'black'
    },
    filterButtonText: {
        color: 'black',
        fontSize: 14,
    },
    taskListContainer: {
        flex: 1,
    },
    noTasksContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noTasksText: {
        fontSize: 18,
        color: 'gray',
    },
    filterCard: {
        padding: 10,
        margin: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'lightgray',
        minWidth: 100
    },
    activeFilterCard: {
        backgroundColor: 'lightblue',
        borderColor: 'black',
        borderWidth: 1.5,
    },
    filterCardText: {
        textAlign: 'center',
    },
})

export default AllTasksScreen