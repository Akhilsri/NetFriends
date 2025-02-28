import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth, AuthProvider } from '../context/AuthContext'; // Import Auth Context
import { Modal } from 'react-native';
import Welcome from '../screens/welcome';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import HomeScreen from '../screens/HomeScreen';
import Notification from '@/screens/Notification';
import Profile from '@/screens/Profile';
import NewPost from '@/screens/NewPost';
import EditProfile from '@/screens/EditProfile';
import PostDetails from '@/screens/PostDetails';


const Stack = createStackNavigator();

// Auth-based navigation
const AppNavigator = () => {
  const { user } = useAuth();

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} >
          {user ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Notification" component={Notification} />
               <Stack.Screen name="NewPost" component={NewPost} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="EditProfile" component={EditProfile} />
              <Stack.Screen name="PostDetails" component={PostDetails} options={{ presentation: 'modal' }}/>
              </>
              
          ) : (
              <>
                  <Stack.Screen name="Welcome" component={Welcome} />
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Signup" component={Signup} />
              </>
          )}
      </Stack.Navigator>
  );
};


// Wrap with AuthProvider
export default function Navigation() {
    return (
        <AuthProvider>
                <AppNavigator />
        </AuthProvider>
    );
}
