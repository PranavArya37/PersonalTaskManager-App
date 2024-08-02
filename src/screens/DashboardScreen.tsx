import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AllTasksScreen from './AllTasksScreen';
import CreateTaskScreen from './CreateTaskScreen';
import PendingTasksScreen from './PendingTasksScreen';
import CompletedTasksScreen from './CompletedTasksScreen';

const Tab = createBottomTabNavigator();

const DashboardScreen: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === "All Tasks") {
                        iconName = "list";
                    }
                    else if (route.name === "Create Task") {
                        iconName = "create";
                    } else if (route.name === "Pending Tasks") {
                        iconName = "time-outline";
                    } else if (route.name === "Completed") {
                        iconName = "checkmark-done-sharp";
                    } else {
                        iconName = "home";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="All Tasks" component={AllTasksScreen} />
            <Tab.Screen name="Create Task" component={CreateTaskScreen} />
            <Tab.Screen name="Pending Tasks" component={PendingTasksScreen} />
            <Tab.Screen name="Completed" component={CompletedTasksScreen} />
        </Tab.Navigator>
    );
};

export default DashboardScreen;