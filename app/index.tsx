import { Button, Text, View } from "react-native";
import App from '../navigation/navigation'
import { AuthProvider } from '../context/AuthContext';


export default function Index() {
  return (
    <AuthProvider>
      <App/>
      </AuthProvider>
  );
}
