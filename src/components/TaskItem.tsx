import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, useTask } from '../contexts/TaskContext';
import { Button, Card } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import LottieView from 'lottie-react-native';

interface TaskItemProps {
    task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const { updateTask, deleteTask } = useTask();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [editedDueDate, setEditedDueDate] = useState(new Date(task.dueDate));
    const confettiRef = useRef<LottieView>(null);

    function triggerConfetti() {
        confettiRef.current?.play(0);
    }

    const toggleStatus = () => {
        const updatedTask: Task = {
            ...task,
            status: task.status === 'pending' ? 'completed' : 'pending'
        };
        updateTask(updatedTask);
    };

    const handleUpdate = () => {
        updateTask({
            ...task,
            title: editedTitle,
            description: editedDescription,
            dueDate: editedDueDate,
        });
        setIsEditing(false);
        triggerConfetti();
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => deleteTask(task.id) },
            ],
            { cancelable: false }
        );
    };

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || editedDueDate;
        setEditedDueDate(currentDate);
    };

    if (isEditing) {
        return (
            <Card containerStyle={styles.cardContainer}>
                <TextInput
                    label='Edit Title'
                    style={styles.editingInput}
                    value={editedTitle}
                    mode='outlined'
                    onChangeText={setEditedTitle}
                />
                <TextInput
                    label='Edit Description'
                    style={[styles.editingInput, styles.editingTextArea]}
                    value={editedDescription}
                    onChangeText={setEditedDescription}
                    multiline
                    mode='outlined'
                />
                <View style={styles.datePickerAndItsTitleContainerHorizontal}>
                    <Text style={styles.pickDate}>Edit Due Date</Text>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={editedDueDate}
                        mode={'date'}
                        is24Hour={true}
                        onChange={onChange}
                        style={styles.dateTimePickerStyle}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Update"
                        onPress={handleUpdate}
                        buttonStyle={{
                            backgroundColor: 'green',
                            borderWidth: 2,
                            borderColor: 'white',
                            borderRadius: 30,
                            height: 50,
                            width: 100,
                            marginLeft: 25,
                            marginRight: 35
                        }} />
                    <Button
                        title="Cancel"
                        onPress={() => setIsEditing(false)} buttonStyle={{
                            backgroundColor: 'grey',
                            borderWidth: 2,
                            borderColor: 'white',
                            borderRadius: 30,
                            height: 50,
                            width: 100,
                        }} />
                </View>
            </Card>
        );
    }

    return (
        <>
            <Card containerStyle={styles.cardContainer}>
                <View style={styles.headerContainer}>
                    <Text style={[
                        styles.title,
                        task.status === 'completed' && styles.completedText
                    ]}>
                        {task.title}
                    </Text>
                    <TouchableOpacity onPress={() => {
                        if (task.status === 'pending') {
                            triggerConfetti();
                            toggleStatus();
                        }
                        else {
                            toggleStatus();
                        }
                    }}>
                        <Ionicons
                            name={task.status === 'completed' ? 'checkmark-circle' : 'ellipse-outline'}
                            size={24}
                            color={task.status === 'completed' ? '#4CAF50' : '#FFA000'}
                        />
                    </TouchableOpacity>
                </View>
                <Card.Divider />
                <Text style={[
                    styles.description,
                    task.status === 'completed' && styles.completedText
                ]}>
                    {task.description}
                </Text>
                <View style={styles.footerContainer}>
                    <Text style={styles.dueDate}>Due: {formatDate(new Date(task.dueDate))}</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconButton}>
                            <Ionicons name="create-outline" size={30} color="#2196F3" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                            <Ionicons name="trash-outline" size={30} color="#F44336" />
                        </TouchableOpacity>
                    </View>
                </View>
                <LottieView
                    ref={confettiRef}
                    source={require('../../assets/confetti.json')}
                    autoPlay={false}
                    loop={false}
                    style={styles.lottie}
                    resizeMode='cover'
                />
            </Card>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'black'
    },
    cardContainer: {
        borderRadius: 10,
        marginBottom: 8,
        marginTop: 8,
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    description: {
        marginBottom: 10,
    },
    dueDate: {
        fontStyle: 'italic',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 5,
        marginLeft: 10,
    },
    status: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: 'green',
    },
    cancelButton: {
        backgroundColor: 'gray',
    },
    leftAction: {
        flex: 1,
        backgroundColor: '#388e3c',
        justifyContent: 'center',
    },
    rightActionContainer: {
        width: 120,
        flexDirection: 'row',
    },
    rightAction: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editAction: {
        backgroundColor: '#2196f3',
    },
    deleteAction: {
        backgroundColor: '#f44336',
    },
    actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    editButton: {
        backgroundColor: '#2196F3',
        borderRadius: 20,
        marginRight: 10,
        paddingHorizontal: 15,
    },
    deleteButton: {
        backgroundColor: '#F44336',
        borderRadius: 20,
        paddingHorizontal: 15,
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lottie: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        pointerEvents: 'none',
    },
    editingInput: {
        marginBottom: 16,
        backgroundColor: 'white'
    },
    editingTextArea: {
        height: 70,
        textAlignVertical: 'top',
    },
    dateTimePickerStyle: {
        alignSelf: 'center',
        marginTop: 16,
        marginBottom: 2
    },
    pickDate: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 10,
        marginBottom: -10
    },
    datePickerAndItsTitleContainerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -10,
        marginBottom: 5
    }
});

export default TaskItem;