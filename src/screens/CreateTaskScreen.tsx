import React, { useContext, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TaskForm from '../components/TaskForm';
import FlashMessage from "react-native-flash-message";


const CreateTaskScreen: React.FC = () => {
    const navigation = useNavigation();
    const flashMessageRef = useRef<FlashMessage>(null);

    const handleTaskCreationComplete = () => {
        flashMessageRef.current?.showMessage({
            message: "Task Created",
            description: "Your task has been created successfully!",
            type: 'success',
            icon: 'success',
            duration: 3000
        });

        setTimeout(() => {
            navigation.goBack();
        }, 3000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.createTasksTitle}>Create Tasks</Text>
            <TaskForm onComplete={handleTaskCreationComplete} />
            <FlashMessage ref={flashMessageRef} position="center" />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    createTasksTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 30,
    }
});
export default CreateTaskScreen;
