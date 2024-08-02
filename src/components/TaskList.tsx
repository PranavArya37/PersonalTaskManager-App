import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Task } from '../contexts/TaskContext';
import TaskItem from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    onTaskStatusChange?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    return (
        <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TaskItem task={item} />}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flexGrow: 1,
        paddingBottom: 0,
    },
});

export default TaskList;