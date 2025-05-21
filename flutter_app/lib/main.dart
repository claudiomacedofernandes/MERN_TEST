import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'config.dart';
import 'models/photo_upload_task.dart';
import 'providers/auth_provider.dart';
import 'screens/photos_screen.dart';
import 'screens/statistics_screen.dart';
import 'screens/user_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  Hive.registerAdapter(PhotoUploadTaskAdapter());
  await Hive.openBox('photoUploadTasks');
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AuthProvider(),
      child: MaterialApp(
        title: 'Global Photo Manager',
        theme: ThemeData(primarySwatch: Colors.blue),
        home: MainScreen(),
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  final List<Widget> _screens = [
    PhotosScreen(),
    StatisticsScreen(),
    UserScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Global Photo Manager'),
            if (SHOW_DEBUG_ITEMS) ...[
              SizedBox(width: 16),
              IconButton(
                icon: Icon(IS_OFFLINE ? Icons.wifi_off : Icons.wifi),
                onPressed: () {
                  setState(() {
                    IS_OFFLINE = !IS_OFFLINE;
                  });
                },
                tooltip: IS_OFFLINE ? 'Resume Connection' : 'Simulate Offline',
              ),
            ],
          ],
        ),
        centerTitle: true,
        actions: [
          Consumer<AuthProvider>(
            builder: (context, auth, _) => Padding(
              padding: EdgeInsets.only(right: 16),
              child: Center(
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedIndex = 2; // Navigate to User page
                    });
                  },
                  child: Text(
                    auth.username ?? 'Guest',
                    style: TextStyle(
                      color: Colors.white,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            color: Theme.of(context).primaryColor,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildNavItem(Icons.photo, 'Photos', 0),
                _buildNavItem(Icons.bar_chart, 'Statistics', 1),
                _buildNavItem(Icons.person, 'User', 2),
              ],
            ),
          ),
          Expanded(child: _screens[_selectedIndex]),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index) {
    return GestureDetector(
      onTap: () => _onItemTapped(index),
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        color: _selectedIndex == index
            ? Theme.of(context).primaryColorDark
            : Colors.transparent,
        child: Row(
          children: [
            Icon(
              icon,
              color: _selectedIndex == index ? Colors.white : Colors.white70,
            ),
            SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: _selectedIndex == index ? Colors.white : Colors.white70,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
