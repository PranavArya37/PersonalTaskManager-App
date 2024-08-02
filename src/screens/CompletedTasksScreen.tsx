import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import TaskList from '../components/TaskList';
import { useTask } from '../contexts/TaskContext';

const CompletedTasksScreen = () => {
    const { tasks } = useTask();
    const completedTasks = tasks.filter(task => task.status === 'completed');

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Completed Tasks</Text>
                <TaskList tasks={completedTasks} />
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 47
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default CompletedTasksScreen