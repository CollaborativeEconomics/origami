import { DrawerToggleButton } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        headerRight(props) {
          return <DrawerToggleButton {...props} />;
        },
        headerLeft(props) {
          return null;
        },
        headerTransparent: true,
        headerTitle: '',
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Home' }} />
      <Drawer.Screen name="issue" options={{ title: 'Issue' }} />
      <Drawer.Screen name="redeem" options={{ title: 'Redeem' }} />
      <Drawer.Screen name="verify" options={{ title: 'Verify' }} />
    </Drawer>
  );
}
