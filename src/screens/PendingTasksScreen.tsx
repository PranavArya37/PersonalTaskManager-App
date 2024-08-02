import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import TaskList from '../components/TaskList';
import { useTask } from '../contexts/TaskContext';

const PendingTasksScreen: React.FC = () => {
    const { tasks } = useTask();
    const pendingTasks = tasks.filter(task => task.status === 'pending');

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Pending Tasks</Text>
                <TaskList tasks={pendingTasks} />
            </View>
        </SafeAreaView>
    );
};

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

export default PendingTasksScreen;