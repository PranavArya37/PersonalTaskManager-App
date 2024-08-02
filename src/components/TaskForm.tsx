import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTask } from '../contexts/TaskContext';
import { Input, Button } from '@rneui/themed';
import { TextInput } from 'react-native-paper';
import FlashMessage from "react-native-flash-message";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface TaskFormProps {
    onComplete: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onComplete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());


    const { addTask } = useTask();

    const flashMessageRef = useRef<FlashMessage>(null);

    const handleAddTask = () => {
        if (!title) {
            flashMessageRef.current?.showMessage({
                message: "Title cannot be empty",
                type: "danger",
                icon: 'danger',
                duration: 3000,
            });
            return;
        }

        if (!description) {
            flashMessageRef.current?.showMessage({
                message: "Description cannot be empty",
                type: "danger",
                icon: 'danger',
                duration: 3000,
            });
            return;
        }
        addTask({
            title,
            description,
            dueDate,
            status: 'pending',
        });
        setTitle('');
        setDescription('');
        setDueDate(new Date());
        onComplete();
    };

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dueDate;
        setDueDate(currentDate);
    };

    return (
        <KeyboardAwareScrollView >
            <View style={styles.container}>
                <TextInput
                    label="Title"
                    value={title}
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setTitle}
                />
                <TextInput
                    label="Description"
                    value={description}
                    mode="outlined"
                    style={[styles.input, styles.textArea]}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={styles.pickDate}>Due Date</Text>
                <DateTimePicker
                    testID="dateTimePicker"
                    value={dueDate}
                    mode={'date'}
                    is24Hour={true}
                    onChange={onChange}
                    style={styles.dateTimePickerStyle}
                />

                <Button
                    title="Add Task"
                    buttonStyle={{
                        backgroundColor: 'black',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                        height: 55
                    }}
                    containerStyle={{
                        width: 200,
                        alignSelf: 'center',
                        marginVertical: 50,
                    }}
                    onPress={handleAddTask}
                />
            </View>
            <FlashMessage ref={flashMessageRef} position="center" />
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    input: {
        marginBottom: 16,
        borderColor: 'black',
    },
    dateText: {
        marginVertical: 10,
        fontSize: 16,
    },
    textArea: {
        height: 140,
        textAlignVertical: "top",
        paddingHorizontal: 0,
        borderRadius: 4,
    },
    dateTimePickerStyle: {
        alignSelf: 'center',
        marginTop: 20
    },
    pickDate: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 10,
        marginBottom: -10
    }
});

export default TaskForm;