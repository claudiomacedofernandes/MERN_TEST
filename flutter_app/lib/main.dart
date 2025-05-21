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
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.photo), label: 'Photos'),
          BottomNavigationBarItem(
              icon: Icon(Icons.bar_chart), label: 'Statistics'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'User'),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}
